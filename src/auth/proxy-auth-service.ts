import { SmaregiProxyOAuthProvider } from './proxy-oauth-provider.js';

/**
 * ProxyOAuthを使用した認証サービス
 * 既存のAuthServiceと同じインターフェースを提供
 */
export class ProxyAuthService {
  private proxyProvider: SmaregiProxyOAuthProvider;
  
  constructor() {
    this.proxyProvider = new SmaregiProxyOAuthProvider();
  }
  
  /**
   * 認証URLを生成
   * @param scopes - 認可スコープ
   * @returns 認証URLとセッションID
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    return this.proxyProvider.getAuthorizationUrl(scopes);
  }
  
  /**
   * コールバック処理
   * @param code - 認可コード
   * @param state - 状態パラメータ
   * @returns セッションID
   */
  async handleCallback(code: string, state: string): Promise<string> {
    return this.proxyProvider.handleCallback(code, state);
  }
  
  /**
   * トークンを更新
   * @param sessionId - セッションID
   */
  async refreshToken(sessionId: string): Promise<any> {
    return this.proxyProvider.refreshToken(sessionId);
  }
  
  /**
   * 認証状態をチェック
   * @param sessionId - セッションID
   */
  async checkAuthStatus(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }> {
    return this.proxyProvider.checkAuthStatus(sessionId);
  }
  
  /**
   * アクセストークンを取得
   * @param sessionId - セッションID
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    return this.proxyProvider.getAccessToken(sessionId);
  }
  
  /**
   * トークンを取り消し
   * @param sessionId - セッションID
   */
  async revokeToken(sessionId: string): Promise<boolean> {
    return this.proxyProvider.revokeTokenBySessionId(sessionId);
  }
  
  /**
   * プロキシプロバイダーインスタンスを取得
   * MCPサーバー設定時に必要
   */
  getProvider(): SmaregiProxyOAuthProvider {
    return this.proxyProvider;
  }
}
