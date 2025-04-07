import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { config } from '../utils/config.js';
import { Issuer, generators, TokenSet } from 'openid-client';

/**
 * Service for handling OAuth authentication using OpenID Connect Client library
 */
export class OpenIdAuthService {
  private tokenManager: TokenManager;
  private sessionManager: SessionManager;
  private client: any; // Will be initialized in setupClient
  
  constructor() {
    this.tokenManager = new TokenManager();
    this.sessionManager = new SessionManager();
    
    // Initialize OpenID Client
    this.setupClient().catch(err => {
      console.error(`[ERROR] Failed to setup OpenID client: ${err}`);
    });
    
    // Periodically clean up expired sessions
    setInterval(() => {
      this.sessionManager.cleanupExpiredSessions(24).catch(err => {
        console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
      });
    }, 3600000); // Run every hour
  }
  
  /**
   * Setup OpenID Connect client
   */
  private async setupClient(): Promise<void> {
    try {
      // Discover OIDC provider configuration
      const issuer = await Issuer.discover(config.authDiscoveryUrl || config.authUrl);
      
      // Create client
      this.client = new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [config.redirectUri],
        response_types: ['code'],
      });
    } catch (error) {
      console.error(`[ERROR] Failed to discover OIDC configuration: ${error}`);
      // Fallback to manual configuration if discovery fails
      const issuer = new Issuer({
        issuer: config.authUrl,
        authorization_endpoint: `${config.authUrl}/oauth/authorize`,
        token_endpoint: `${config.authUrl}/oauth/token`,
        revocation_endpoint: `${config.authUrl}/oauth/revoke`,
      });
      
      this.client = new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [config.redirectUri],
        response_types: ['code'],
      });
    }
  }
  
  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Authorization scopes
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    // Ensure client is initialized
    if (!this.client) {
      await this.setupClient();
    }
    
    // Generate PKCE parameters
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    const state = generators.state();
    
    // Store in session
    const session = await this.sessionManager.createOpenIdSession(
      scopes,
      config.redirectUri,
      codeVerifier,
      codeChallenge,
      state
    );
    
    // Generate authorization URL using OpenID Client
    const url = this.client.authorizationUrl({
      scope: scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state,
      redirect_uri: config.redirectUri,
    });
    
    return {
      url,
      sessionId: session.id,
    };
  }
  
  /**
   * Handle callback from OAuth provider
   * @param code - Authorization code
   * @param state - State parameter
   */
  async handleCallback(code: string, state: string): Promise<string> {
    // Ensure client is initialized
    if (!this.client) {
      await this.setupClient();
    }
    
    // Find session by state
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // Use OpenID Client to exchange code for token
      const tokenSet = await this.client.callback(
        session.redirect_uri,
        { code, state },
        { 
          code_verifier: session.verifier,
          state: state
        }
      );
      
      // Update session
      await this.sessionManager.updateSessionAuthentication(session.id);
      
      // Save token
      await this.tokenManager.saveToken(session.id, tokenSet);
      
      return session.id;
    } catch (error) {
      console.error(`[ERROR] Token exchange failed: ${error}`);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Refresh access token
   * @param sessionId - Session ID
   */
  async refreshToken(sessionId: string): Promise<TokenSet> {
    // Ensure client is initialized
    if (!this.client) {
      await this.setupClient();
    }
    
    // Get current token
    const currentToken = await this.tokenManager.getToken(sessionId);
    if (!currentToken || !currentToken.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Use OpenID Client to refresh token
      const tokenSet = await this.client.refresh(currentToken.refresh_token);
      
      // Save refreshed token
      await this.tokenManager.saveToken(sessionId, tokenSet);
      
      return tokenSet;
    } catch (error) {
      console.error(`[ERROR] Token refresh failed: ${error}`);
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Check authentication status
   * @param sessionId - Session ID
   */
  async checkAuthStatus(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }> {
    const session = await this.sessionManager.getSession(sessionId);
    if (!session) {
      return {
        isAuthenticated: false,
        sessionId,
      };
    }
    
    return {
      isAuthenticated: session.is_authenticated === 1,
      sessionId,
    };
  }
  
  /**
   * Get access token
   * @param sessionId - Session ID
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return null;
    }
    
    // Check if token is near expiry and refresh if needed
    if (this.tokenManager.isTokenNearExpiry(token)) {
      try {
        const refreshedToken = await this.refreshToken(sessionId);
        return refreshedToken.access_token || null;
      } catch (error) {
        console.error(`[ERROR] Failed to refresh token: ${error}`);
        return null;
      }
    }
    
    return token.access_token || null;
  }
  
  /**
   * Revoke token
   * @param sessionId - Session ID
   */
  async revokeToken(sessionId: string): Promise<boolean> {
    // Ensure client is initialized
    if (!this.client) {
      await this.setupClient();
    }
    
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return false;
    }
    
    try {
      // Use OpenID Client to revoke token if endpoint available
      if (this.client.issuer.revocation_endpoint && token.refresh_token) {
        await this.client.revoke(token.refresh_token);
      }
      
      // Delete token and session data
      await this.tokenManager.deleteToken(sessionId);
      await this.sessionManager.deleteSession(sessionId);
      
      return true;
    } catch (error) {
      console.error(`[ERROR] Token revocation failed: ${error}`);
      return false;
    }
  }
}
