import { OpenIdAuthService } from './openid-auth.service.js';

/**
 * Adapter class for AuthService to maintain backward compatibility
 * while using OpenID Client for the implementation
 */
export class AuthService {
  private openIdAuthService: OpenIdAuthService;
  
  constructor() {
    this.openIdAuthService = new OpenIdAuthService();
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
}