import { CloudflareSessionManager } from './cloudflare-session-manager.js';
import { CloudflareTokenManager } from './cloudflare-token-manager.js';
import { AUTH_HTML_TEMPLATES } from '../server/auth/cloudflare-auth-routes.js';
import { TokenEntity } from './entities/token.entity.js';

/**
 * Cloudflare Workers用の認証サービス
 */
export class CloudflareAuthService {
  private sessionManager: CloudflareSessionManager;
  private tokenManager: CloudflareTokenManager;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.sessionManager = new CloudflareSessionManager(env.SESSIONS);
    this.tokenManager = new CloudflareTokenManager(env.TOKENS);
  }

  /**
   * 認証URLを生成
   * @param scopes アクセス権限のスコープ
   */
  async generateAuthUrl(scopes: string[]): Promise<string> {
    const session = await this.sessionManager.createSession(scopes);
    
    const params = new URLSearchParams({
      client_id: this.env.CLIENT_ID || '',
      redirect_uri: this.env.REDIRECT_URI || 'https://mcp.example.com/auth/callback',
      response_type: 'code',
      state: session.state,
      code_challenge: session.code_challenge,
      code_challenge_method: session.code_challenge_method,
      scope: scopes.join(' ')
    });
    
    return `${this.env.SMAREGI_AUTH_URL || 'https://id.smaregi.dev/authorize'}?${params.toString()}`;
  }

  /**
   * 認証コードを使ってトークンを取得
   * @param code 認証コード
   * @param state stateパラメータ
   */
  async getTokenFromCode(code: string, state: string): Promise<TokenEntity> {
    // stateからセッションを検索
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) {
      throw new Error('Invalid state parameter');
    }
    
    // 認証エンドポイントにリクエスト
    const tokenResponse = await fetch(this.env.SMAREGI_TOKEN_ENDPOINT || 'https://id.smaregi.dev/authorize/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.env.CLIENT_ID || '',
        client_secret: this.env.CLIENT_SECRET || '',
        code,
        code_verifier: session.verifier,
        redirect_uri: session.redirect_uri
      }).toString()
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token request failed: ${errorText}`);
    }
    
    // トークンレスポンスをパース
    const tokenData = await tokenResponse.json();
    
    // セッションを認証済みに更新
    await this.sessionManager.updateSessionAuthentication(session.id);
    
    // トークンを保存
    await this.tokenManager.saveToken(session.id, tokenData);
    
    // トークンを取得
    const token = await this.tokenManager.getToken(session.id);
    if (!token) {
      throw new Error('Failed to retrieve saved token');
    }
    
    return token;
  }

  /**
   * リフレッシュトークンを使ってアクセストークンを更新
   * @param sessionId セッションID
   */
  async refreshToken(sessionId: string): Promise<TokenEntity> {
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      throw new Error('Token not found');
    }
    
    if (!token.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    // トークン更新リクエスト
    const response = await fetch(this.env.SMAREGI_TOKEN_ENDPOINT || 'https://id.smaregi.dev/authorize/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.env.CLIENT_ID || '',
        client_secret: this.env.CLIENT_SECRET || '',
        refresh_token: token.refresh_token
      }).toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${errorText}`);
    }
    
    // 新しいトークンデータをパース
    const tokenData = await response.json();
    
    // refresh_tokenがレスポンスに含まれていない場合は、既存のものを使用
    if (!tokenData.refresh_token && token.refresh_token) {
      tokenData.refresh_token = token.refresh_token;
    }
    
    // 新しいトークンを保存
    await this.tokenManager.saveToken(sessionId, tokenData);
    
    // 更新されたトークンを取得
    const updatedToken = await this.tokenManager.getToken(sessionId);
    if (!updatedToken) {
      throw new Error('Failed to retrieve refreshed token');
    }
    
    return updatedToken;
  }

  /**
   * 有効なアクセストークンを取得（必要に応じて更新）
   * @param sessionId セッションID
   */
  async getValidToken(sessionId: string): Promise<TokenEntity> {
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      throw new Error('No token found for session');
    }
    
    // トークンが有効期限切れに近づいていて、リフレッシュトークンがある場合は更新
    if (this.tokenManager.isTokenNearExpiry(token) && token.refresh_token) {
      return this.refreshToken(sessionId);
    }
    
    // トークンがまだ有効な場合はそのまま返す
    return token;
  }

  /**
   * セッションIDを生成
   * @param scopes アクセス権限のスコープ
   */
  async createSession(scopes: string[]): Promise<string> {
    const session = await this.sessionManager.createSession(scopes);
    return session.id;
  }

  /**
   * 認証状態を確認
   * @param sessionId セッションID
   */
  async isAuthenticated(sessionId: string): Promise<boolean> {
    const session = await this.sessionManager.getSession(sessionId);
    return session ? session.is_authenticated : false;
  }

  /**
   * 認証リクエストハンドラー
   * Cloudflare Workersのイベントハンドラーから呼び出される
   * @param request リクエスト
   * @param env 環境変数
   * @param ctx 実行コンテキスト
   */
  async handleAuthRequest(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 認証開始エンドポイント
    if (path === '/auth/authorize') {
      try {
        const params = url.searchParams;
        const scopesParam = params.get('scopes') || 'pos.products:read';
        const scopes = scopesParam.split(' ');
        
        const authUrl = await this.generateAuthUrl(scopes);
        
        return Response.redirect(authUrl, 302);
      } catch (error) {
        console.error(`[ERROR] Authorization error: ${error}`);
        return new Response(`Authorization error: ${error}`, { status: 500 });
      }
    }
    
    // コールバックエンドポイント
    else if (path === '/auth/callback') {
      return new Response(AUTH_HTML_TEMPLATES.callback, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // トークン取得エンドポイント
    else if (path === '/auth/token' && request.method === 'POST') {
      try {
        const { code, state } = await request.json();
        
        if (!code || !state) {
          return new Response('Missing code or state parameter', { status: 400 });
        }
        
        await this.getTokenFromCode(code, state);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error(`[ERROR] Token retrieval error: ${error}`);
        return new Response(`Token retrieval error: ${error}`, { status: 500 });
      }
    }
    
    // 認証成功ページ
    else if (path === '/auth/success') {
      return new Response(AUTH_HTML_TEMPLATES.success, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // 認証エラーページ
    else if (path === '/auth/error') {
      return new Response(AUTH_HTML_TEMPLATES.error, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // 不明なエンドポイント
    return new Response('Not Found', { status: 404 });
  }
}