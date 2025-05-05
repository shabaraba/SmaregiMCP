import { CloudflareSessionManager } from './cloudflare-session-manager.js';
import { CloudflareTokenManager } from './cloudflare-token-manager.js';
import { AUTH_HTML_TEMPLATES } from '../server/auth/cloudflare-auth-routes.js';
import { TokenEntity } from './entities/token.entity.js';
import { AuthStatus, CloudflareAuthStore } from './auth-store.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Cloudflare Workers用の認証サービス
 */
export class CloudflareAuthService {
  private sessionManager: CloudflareSessionManager;
  private tokenManager: CloudflareTokenManager;
  private authStore: CloudflareAuthStore;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.sessionManager = new CloudflareSessionManager(env.SESSIONS);
    this.tokenManager = new CloudflareTokenManager(env.TOKENS);
    this.authStore = new CloudflareAuthStore(env.SESSIONS); // 同じKVを使用
  }

  /**
   * 認証URLを生成
   * @param scopes アクセス権限のスコープ
   * @param requestId 認証リクエストの一意のID（指定がなければ生成）
   */
  async generateAuthUrl(scopes: string[], requestId?: string): Promise<{ url: string, requestId: string }> {
    // リクエストIDが指定されていなければ生成
    const authRequestId = requestId || uuidv4();
    
    // セッションを作成
    const session = await this.sessionManager.createSession(scopes);
    
    // セッションIDとリクエストIDの関連付けを保存
    await this.authStore.setAuthStatus(authRequestId, AuthStatus.PENDING, {
      sessionId: session.id,
      state: session.state
    });
    
    // 認証URLを生成
    const params = new URLSearchParams({
      client_id: this.env.CLIENT_ID || '',
      redirect_uri: this.env.REDIRECT_URI || 'https://mcp.example.com/auth/callback',
      response_type: 'code',
      state: session.state,
      code_challenge: session.code_challenge,
      code_challenge_method: session.code_challenge_method,
      scope: scopes.join(' ')
    });
    
    const authUrl = `${this.env.SMAREGI_AUTH_URL || 'https://id.smaregi.dev/authorize'}?${params.toString()}`;
    
    return {
      url: authUrl,
      requestId: authRequestId
    };
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
      // stateに関連付けられた認証リクエストIDがあれば、ステータスを失敗に更新
      await this.updateAuthStatusByState(state, AuthStatus.FAILED, { error: errorText });
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
      // stateに関連付けられた認証リクエストIDがあれば、ステータスを失敗に更新
      await this.updateAuthStatusByState(state, AuthStatus.FAILED, { error: 'Failed to retrieve saved token' });
      throw new Error('Failed to retrieve saved token');
    }
    
    // stateに関連付けられた認証リクエストIDがあれば、ステータスを完了に更新
    await this.updateAuthStatusByState(state, AuthStatus.COMPLETED, { 
      sessionId: session.id,
      token: {
        access_token: token.access_token,
        token_type: token.token_type,
        expires_at: token.expires_at.toISOString(),
        scope: token.scope
      }
    });
    
    return token;
  }

  /**
   * stateパラメータに関連する認証リクエストのステータスを更新
   * @param state stateパラメータ
   * @param status 新しいステータス
   * @param data 関連データ
   */
  private async updateAuthStatusByState(state: string, status: AuthStatus, data?: any): Promise<void> {
    try {
      // KVから全ての認証ステータスを取得して、対応するものを更新
      // 注意: これは非効率だが、KVには特定の値で検索する機能がないため、
      // 実際の実装ではセカンダリインデックスやフラグメントインデックスを構築すべき
      const allAuthStatus = await this.env.SESSIONS.list({ prefix: 'auth_status:' });
      
      for (const key of allAuthStatus.keys) {
        const requestId = key.name.replace('auth_status:', '');
        const statusData = await this.authStore.getAuthStatus(requestId);
        if (statusData?.data?.state === state) {
          await this.authStore.setAuthStatus(statusData.requestId, status, {
            ...statusData.data,
            ...data
          });
          return;
        }
      }
      
      console.error(`[WARN] No auth request found for state: ${state}`);
    } catch (error) {
      console.error(`[ERROR] Failed to update auth status by state: ${error}`);
    }
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
   * 認証リクエストの状態を確認
   * @param requestId 認証リクエストID
   */
  async getAuthRequestStatus(requestId: string): Promise<any> {
    const statusData = await this.authStore.getAuthStatus(requestId);
    
    if (!statusData) {
      return {
        status: 'not_found',
        message: '認証リクエストが見つかりません'
      };
    }
    
    // 成功した場合、最小限の情報のみ返す
    if (statusData.status === AuthStatus.COMPLETED) {
      return {
        status: 'completed',
        auth_data: {
          access_token: statusData.data?.token?.access_token,
          token_type: statusData.data?.token?.token_type,
          expires_at: statusData.data?.token?.expires_at,
          scope: statusData.data?.token?.scope
        }
      };
    }
    
    // 失敗した場合はエラー情報を返す
    if (statusData.status === AuthStatus.FAILED) {
      return {
        status: 'failed',
        error: statusData.data?.error || '認証に失敗しました'
      };
    }
    
    // 処理中の場合
    return {
      status: 'pending',
      message: '認証処理中です'
    };
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
        
        // 新しい認証フローを使用
        const { url: authUrl, requestId } = await this.generateAuthUrl(scopes);
        
        // JSON形式で返すか、リダイレクトするかをクエリパラメータで判断
        const format = params.get('format') || 'redirect';
        
        if (format === 'json') {
          return new Response(JSON.stringify({
            request_id: requestId,
            auth_url: authUrl
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return Response.redirect(authUrl, 302);
        }
      } catch (error) {
        console.error(`[ERROR] Authorization error: ${error}`);
        return new Response(`Authorization error: ${error}`, { status: 500 });
      }
    }
    
    // 認証ステータス確認エンドポイント
    else if (path.match(/^\/auth\/status\/[a-zA-Z0-9-]+$/)) {
      try {
        const requestId = path.split('/').pop() || '';
        const status = await this.getAuthRequestStatus(requestId);
        
        return new Response(JSON.stringify(status), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error(`[ERROR] Status check error: ${error}`);
        return new Response(JSON.stringify({
          status: 'error',
          message: `${error}`
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
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
    
    // 自動認証ページ
    else if (path === '/auth/auto') {
      return new Response(AUTH_HTML_TEMPLATES.auto_auth, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // 不明なエンドポイント
    return new Response('Not Found', { status: 404 });
  }
}