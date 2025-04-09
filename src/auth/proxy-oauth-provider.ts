import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyProvider.js';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { config } from '../utils/config.js';
import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { createHash } from 'crypto';

/**
 * MCP用のOAuthプロバイダークラス
 * ProxyOAuthServerProviderを使用してスマレジOAuth認証と連携
 */
export class SmaregiProxyOAuthProvider extends ProxyOAuthServerProvider {
  private tokenManager: TokenManager;
  private sessionManager: SessionManager;
  private tokenStore: Map<string, any> = new Map();
  
  constructor() {
    // セッション管理とトークン管理のインスタンスを作成
    const tokenManager = new TokenManager();
    const sessionManager = new SessionManager();
    
    // verifyAccessTokenとgetClientの実装
    const verifyAccessToken = async (token: string) => {
      console.error(`[INFO] Verifying access token: ${token.substring(0, 8)}...`);
      // 単純なトークンの検証
      // 完全な実装では、JWTの検証やOAuth2 introspectionエンドポイントを使用することが望ましい
      return {
        token: token,
        clientId: config.clientId,
        scopes: ['read', 'write'],
        expiresAt: Math.floor(Date.now() / 1000) + 3600 // 1時間後を有効期限として設定
      } as AuthInfo;
    };
    
    const getClient = async (clientId: string) => {
      console.error(`[INFO] Getting client info for: ${clientId}`);
      if (clientId === config.clientId) {
        return {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uris: [config.redirectUri],
          token_endpoint_auth_method: 'client_secret_post'
        };
      }
      return undefined;
    };
    
    // ProxyOAuthServerProviderの初期化
    super({
      endpoints: {
        authorizationUrl: config.smaregiAuthUrl,
        tokenUrl: config.smaregiTokenEndpoint,
        // revocationUrlが設定されている場合はここに追加
      },
      verifyAccessToken,
      getClient
    });
    
    this.tokenManager = tokenManager;
    this.sessionManager = sessionManager;
    
    // 定期的に期限切れセッションのクリーンアップを実行
    setInterval(() => {
      this.sessionManager.cleanupExpiredSessions(24).catch(err => {
        console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
      });
    }, 3600000); // 1時間ごとに実行
  }
  
  /**
   * 認可コードをトークンと交換し、データベースに保存
   * @param code - 認可コード
   * @param state - 状態パラメータ
   * @returns セッションID
   */
  async handleCallback(code: string, state: string): Promise<string> {
    console.error(`[INFO] Handling callback with code: ${code.substring(0, 8)}...`);
    
    // stateパラメータからセッションを取得
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // clientIdを使用してクライアント情報を取得
      const client = await this.clientsStore.getClient(config.clientId);
      if (!client) {
        throw new Error(`Client not found: ${config.clientId}`);
      }
      
      // 認可コードをトークンと交換
      const tokenSet = await this.exchangeAuthorizationCode(
        client,
        code,
        session.verifier
      );
      
      // セッションの認証状態を更新
      await this.sessionManager.updateSessionAuthentication(session.id);
      
      // トークンを保存
      await this.tokenManager.saveToken(session.id, tokenSet, config.contractId);
      
      // 内部のトークンストアにも保存
      this.tokenStore.set(session.id, tokenSet);
      
      return session.id;
    } catch (error) {
      console.error(`[ERROR] Token exchange failed: ${error}`);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * 認証URLを生成
   * @param scopes - 認可スコープ
   * @returns 認証URLとセッションID
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    console.error(`[INFO] Generating authorization URL with scopes: ${scopes.join(', ')}`);
    
    // PKCEパラメータを生成
    const codeVerifier = this.sessionManager.generateRandomString(64);
    const codeChallenge = this.sessionManager.createCodeChallenge(codeVerifier);
    const state = this.sessionManager.generateRandomString(32);
    
    // セッションを作成
    const session = await this.sessionManager.createOpenIdSession(
      scopes,
      config.redirectUri,
      codeVerifier,
      codeChallenge,
      state
    );
    
    // クライアント情報を取得
    const client = await this.clientsStore.getClient(config.clientId);
    if (!client) {
      throw new Error(`Client not found: ${config.clientId}`);
    }
    
    // URL生成用のパラメータ
    const params = {
      redirectUri: config.redirectUri,
      state: state,
      codeChallenge: codeChallenge,
      codeChallengeMethod: 'S256',
      scopes: scopes
    };
    
    // ダミーのレスポンスオブジェクト
    const dummyRes = {
      redirectUrl: '',
      redirect: function(url: string) {
        this.redirectUrl = url;
        return this;
      }
    };
    
    // 認証URLを生成
    await this.authorize(client, params, dummyRes as any);
    
    return {
      url: dummyRes.redirectUrl,
      sessionId: session.id
    };
  }
  
  /**
   * アクセストークンを取得
   * @param sessionId - セッションID
   * @returns アクセストークン
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    console.error(`[INFO] Getting access token for session: ${sessionId}`);
    
    // データベースからトークンを取得
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return null;
    }
    
    // トークンが期限切れかどうかをチェック
    if (this.tokenManager.isTokenNearExpiry(token)) {
      try {
        // クライアント情報を取得
        const client = await this.clientsStore.getClient(config.clientId);
        if (!client) {
          throw new Error(`Client not found: ${config.clientId}`);
        }
        
        // リフレッシュトークンを使用して新しいトークンを取得
        if (!token.refresh_token) {
          throw new Error('No refresh token available');
        }
        
        const tokenSet = await this.exchangeRefreshToken(
          client,
          token.refresh_token,
          token.scope ? token.scope.split(' ') : undefined
        );
        
        // 新しいトークンを保存
        await this.tokenManager.saveToken(sessionId, tokenSet, config.contractId);
        
        // 内部のトークンストアも更新
        this.tokenStore.set(sessionId, tokenSet);
        
        return tokenSet.access_token || null;
      } catch (error) {
        console.error(`[ERROR] Failed to refresh token: ${error}`);
        return null;
      }
    }
    
    return token.access_token || null;
  }
  
  /**
   * トークンを取り消し
   * @param sessionId - セッションID
   * @returns 成功したかどうか
   */
  async revokeTokenBySessionId(sessionId: string): Promise<boolean> {
    console.error(`[INFO] Revoking token for session: ${sessionId}`);
    
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return false;
    }
    
    try {
      // トークンとセッションデータを削除
      await this.tokenManager.deleteToken(sessionId);
      await this.sessionManager.deleteSession(sessionId);
      
      // 内部のトークンストアからも削除
      this.tokenStore.delete(sessionId);
      
      return true;
    } catch (error) {
      console.error(`[ERROR] Token revocation failed: ${error}`);
      return false;
    }
  }
  
  /**
   * 認証状態をチェック
   * @param sessionId - セッションID
   * @returns 認証状態
   */
  async checkAuthStatus(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }> {
    console.error(`[INFO] Checking auth status for session: ${sessionId}`);
    
    const session = await this.sessionManager.getSession(sessionId);
    if (!session) {
      return {
        isAuthenticated: false,
        sessionId,
      };
    }
    
    return {
      isAuthenticated: Boolean(session.is_authenticated),
      sessionId,
    };
  }
  
  /**
   * アクセストークンを更新
   * @param sessionId - セッションID
   * @returns 新しいトークンセット
   */
  async refreshToken(sessionId: string): Promise<any> {
    console.error(`[INFO] Refreshing token for session: ${sessionId}`);
    
    // 現在のトークンを取得
    const currentToken = await this.tokenManager.getToken(sessionId);
    if (!currentToken || !currentToken.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    try {
      // クライアント情報を取得
      const client = await this.clientsStore.getClient(config.clientId);
      if (!client) {
        throw new Error(`Client not found: ${config.clientId}`);
      }
      
      // リフレッシュトークンを使用して新しいトークンを取得
      const tokenSet = await this.exchangeRefreshToken(
        client,
        currentToken.refresh_token,
        currentToken.scope ? currentToken.scope.split(' ') : undefined
      );
      
      // 新しいトークンを保存
      await this.tokenManager.saveToken(sessionId, tokenSet, config.contractId);
      
      // 内部のトークンストアも更新
      this.tokenStore.set(sessionId, tokenSet);
      
      return tokenSet;
    } catch (error) {
      console.error(`[ERROR] Token refresh failed: ${error}`);
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
