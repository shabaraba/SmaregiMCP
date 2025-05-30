import { OpenIdAuthService } from './openid-auth.service.js';
import { AuthServiceInterface } from './interfaces/auth-service.interface.js';
import { TokenStorage, UserAuthInfo, AuthSessionInfo } from './token-storage.js';
import crypto from 'crypto';

/**
 * Adapter class for AuthService to maintain backward compatibility
 * while using OpenID Client for the implementation
 */
export class AuthService implements AuthServiceInterface {
  private openIdAuthService: OpenIdAuthService;
  private tokenStorage: TokenStorage;
  
  constructor() {
    this.openIdAuthService = new OpenIdAuthService();
    this.tokenStorage = new TokenStorage();
  }
  
  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Authorization scopes
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    return this.openIdAuthService.getAuthorizationUrl(scopes);
  }
  
  /**
   * Handle callback from OAuth provider
   * @param code - Authorization code
   * @param state - State parameter
   */
  async handleCallback(code: string, state: string): Promise<string> {
    return this.openIdAuthService.handleCallback(code, state);
  }
  
  /**
   * Refresh access token
   * @param sessionId - Session ID
   */
  async refreshToken(sessionId: string): Promise<any> {
    return this.openIdAuthService.refreshToken(sessionId);
  }
  
  /**
   * Check authentication status
   * @param sessionId - Session ID
   */
  async checkAuthStatus(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }> {
    return this.openIdAuthService.checkAuthStatus(sessionId);
  }
  
  /**
   * Get access token
   * @param sessionId - Session ID
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    return this.openIdAuthService.getAccessToken(sessionId);
  }
  
  /**
   * Revoke token
   * @param sessionId - Session ID
   */
  async revokeToken(sessionId: string): Promise<boolean> {
    return this.openIdAuthService.revokeToken(sessionId);
  }

  // ===== MCP OAuth 2.1 対応メソッド =====

  /**
   * MCP OAuth用の認証URL生成
   * @param redirectUri - リダイレクトURI
   * @param state - State parameter
   * @param codeChallenge - PKCE code challenge
   */
  async generateAuthUrl(redirectUri: string, state: string, codeChallenge: string): Promise<string> {
    // スマレジの認証URLを生成
    const authUrl = await this.openIdAuthService.getAuthorizationUrl(['pos.transactions:read']);
    
    // PKCE情報を保存（stateをキーとして使用）
    const codeVerifier = this.generateCodeVerifier();
    const sessionInfo: AuthSessionInfo = {
      codeVerifier,
      redirectUri,
      timestamp: Date.now()
    };
    
    this.tokenStorage.storeAuthSession(state, sessionInfo);

    return authUrl.url;
  }

  /**
   * 認証コードをトークンに交換
   * @param code - Authorization code
   * @param redirectUri - Redirect URI
   * @param codeVerifier - PKCE code verifier
   */
  async exchangeCodeForToken(code: string, redirectUri: string, codeVerifier: string): Promise<{
    accessToken: string;
    expiresIn: number;
    scope?: string;
  }> {
    try {
      // OpenID Auth Serviceで認証コードを処理
      const sessionId = await this.openIdAuthService.handleCallback(code, '');
      const accessToken = await this.openIdAuthService.getAccessToken(sessionId);
      
      if (!accessToken) {
        throw new Error('Failed to obtain access token');
      }

      // ユーザー情報を取得してcontractIdを抽出
      const userInfo = await this.fetchUserInfo(accessToken);
      const contractId = userInfo?.contract_id || '';

      if (!contractId) {
        console.error('[ERROR] Contract ID not found in user info');
        throw new Error('contract_id_missing');
      }

      // 拡張トークン情報を保存
      const expiresIn = 3600; // 1時間
      const authInfo: UserAuthInfo = {
        accessToken,
        contractId,
        expiresAt: Date.now() + (expiresIn * 1000),
        scope: 'pos.transactions:read',
        userInfo
      };

      this.tokenStorage.storeToken(accessToken, authInfo);

      return {
        accessToken,
        expiresIn,
        scope: 'pos.transactions:read'
      };
    } catch (error) {
      console.error('[ERROR] Token exchange failed:', error);
      
      if (error instanceof Error && error.message === 'contract_id_missing') {
        throw new Error('contract_id_missing');
      }
      
      throw new Error('invalid_code');
    }
  }

  /**
   * アクセストークンの検証
   * @param token - Access token
   */
  async validateAccessToken(token: string): Promise<boolean> {
    try {
      return this.tokenStorage.validateToken(token);
    } catch (error) {
      console.error('[ERROR] Token validation failed:', error);
      return false;
    }
  }

  /**
   * アクセストークンからcontractIdを取得
   * @param token - Access token
   */
  public getContractIdFromToken(token: string): string | null {
    try {
      const tokenInfo = this.tokenStorage.getToken(token);
      return tokenInfo?.contractId || null;
    } catch (error) {
      console.error('[ERROR] Failed to get contract ID from token:', error);
      return null;
    }
  }

  /**
   * contractIdの存在を確認
   * @param token - Access token
   */
  public hasValidContractId(token: string): boolean {
    return this.tokenStorage.hasValidContractId(token);
  }

  /**
   * PKCE code verifier生成
   */
  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * PKCE code challenge生成
   */
  private generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
  }

  /**
   * スマレジAPIからユーザー情報を取得
   * @param accessToken - Access token
   */
  private async fetchUserInfo(accessToken: string): Promise<any> {
    try {
      // スマレジのuserinfoエンドポイントを呼び出し
      const response = await fetch('https://id.smaregi.dev/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const userInfo = await response.json();
      console.error('[DEBUG] User info fetched:', JSON.stringify(userInfo, null, 2));
      
      return userInfo;
    } catch (error) {
      console.error('[ERROR] Failed to fetch user info:', error);
      return null;
    }
  }

  /**
   * 期限切れのコードとトークンをクリーンアップ
   */
  private cleanupExpiredData(): void {
    this.tokenStorage.cleanup();
  }

  /**
   * トークンストレージの統計情報を取得（デバッグ用）
   */
  public getStorageStats(): {
    tokenCount: number;
    sessionCount: number;
    contractIds: string[];
  } {
    return this.tokenStorage.getStats();
  }

  /**
   * 全セッション情報を取得
   */
  public async getAllSessions(): Promise<Array<{ sessionId: string; createdAt: Date }>> {
    // OpenIdAuthServiceのSessionManagerから実際のセッション一覧を取得
    return this.openIdAuthService.getAllSessions();
  }
}