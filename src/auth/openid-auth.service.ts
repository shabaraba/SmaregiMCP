import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { config } from '../utils/config.js';

/**
 * Service for handling OAuth authentication using openid-client library
 */
export class OpenIdAuthService {
  private tokenManager: TokenManager;
  private sessionManager: SessionManager;
  private client: any = null;
  private openid: any = null;
  
  constructor() {
    this.tokenManager = new TokenManager();
    this.sessionManager = new SessionManager();
    
    // Periodically clean up expired sessions
    setInterval(() => {
      this.sessionManager.cleanupExpiredSessions(24).catch(err => {
        console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
      });
    }, 3600000); // Run every hour
    
    // Initialize OpenID client library
    this.initializeOpenIdLibrary();
  }
  
  /**
   * Initialize OpenID client library
   */
  private async initializeOpenIdLibrary(): Promise<void> {
    try {
      // Dynamic import to handle ESM/CommonJS compatibility
      this.openid = await import('openid-client');
      
      console.error('[INFO] OpenID client library initialized');
      
      // Initialize client
      this.initializeClient();
    } catch (error) {
      console.error(`[ERROR] Failed to initialize OpenID client library: ${error}`);
    }
  }
  
  /**
   * Initialize OpenID client
   */
  private async initializeClient(): Promise<void> {
    try {
      if (!this.openid) {
        await this.initializeOpenIdLibrary();
        if (!this.openid) {
          throw new Error('OpenID client library not initialized');
        }
      }
      
      if (!config.clientId || !config.clientSecret || !config.smaregiAuthUrl || !config.smaregiTokenEndpoint) {
        throw new Error('Missing required OAuth configuration');
      }
      
      // Create issuer using discovery function
      const issuer = await this.openid.discovery(config.smaregiAuthUrl);
      
      // Create client
      this.client = new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [config.redirectUri],
        response_types: ['code'],
      });
      
      console.error('[INFO] OpenID client initialized successfully');
    } catch (error) {
      console.error(`[ERROR] Failed to initialize OpenID client: ${error}`);
      throw error;
    }
  }
  
  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Authorization scopes
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    if (!this.client) {
      await this.initializeClient();
      if (!this.client) {
        throw new Error('Failed to initialize OpenID client');
      }
    }
    
    if (!this.openid) {
      throw new Error('OpenID client library not initialized');
    }
    
    // Create new session with PKCE
    const verifier = this.openid.randomPKCECodeVerifier();
    const challenge = await this.openid.calculatePKCECodeChallenge(verifier);
    const state = this.openid.randomState();
    
    // Store in session
    const session = await this.sessionManager.createOpenIdSession(
      scopes,
      config.redirectUri,
      verifier,
      challenge,
      state
    );
    
    // Generate authorization URL using buildAuthorizationUrl
    const authParams = {
      client_id: config.clientId,
      redirect_uri: session.redirect_uri,
      response_type: 'code',
      scope: scopes.join(' '),
      state: state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    };
    
    const url = this.openid.buildAuthorizationUrl(
      {
        authorization_endpoint: config.smaregiAuthUrl
      },
      authParams
    );
    
    return {
      url: url.href,
      sessionId: session.id,
    };
  }
  
  /**
   * Handle callback from OAuth provider
   * @param code - Authorization code
   * @param state - State parameter
   */
  async handleCallback(code: string, state: string): Promise<string> {
    if (!this.openid) {
      await this.initializeOpenIdLibrary();
      if (!this.openid) {
        throw new Error('OpenID client library not initialized');
      }
    }
    
    // Find session by state
    const session = await this.sessionManager.getSessionByState(state);
    
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // Exchange code for token using authorizationCodeGrant
      const tokenSet = await this.openid.authorizationCodeGrant(
        {
          token_endpoint: config.smaregiTokenEndpoint,
          client_id: config.clientId,
          client_secret: config.clientSecret
        },
        {
          code,
          redirect_uri: session.redirect_uri,
          code_verifier: session.verifier
        }
      );
      
      // Convert TokenSet to our DTO format
      const tokenResponse: TokenResponseDto = {
        access_token: tokenSet.access_token,
        token_type: tokenSet.token_type,
        expires_in: Math.floor((new Date(tokenSet.expires_at).getTime() - Date.now()) / 1000),
        refresh_token: tokenSet.refresh_token,
        scope: tokenSet.scope,
        id_token: tokenSet.id_token,
      };
      
      // Save token
      await this.tokenManager.saveToken(session.id, tokenResponse, config.contractId);
      
      // Update session
      await this.sessionManager.updateSessionAuthStatus(session.id, true);
      
      console.error(`[INFO] Authentication successful for session ${session.id}`);
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
  async refreshToken(sessionId: string): Promise<TokenResponseDto | null> {
    if (!this.openid) {
      await this.initializeOpenIdLibrary();
      if (!this.openid) {
        throw new Error('OpenID client library not initialized');
      }
    }
    
    const token = await this.tokenManager.getToken(sessionId);
    
    if (!token || !token.refresh_token) {
      console.error(`[ERROR] No refresh token available for session ${sessionId}`);
      return null;
    }
    
    try {
      console.error(`[INFO] Refreshing token for session ${sessionId}`);
      
      // Use refreshTokenGrant
      const tokenSet = await this.openid.refreshTokenGrant(
        {
          token_endpoint: config.smaregiTokenEndpoint,
          client_id: config.clientId,
          client_secret: config.clientSecret
        },
        {
          refresh_token: token.refresh_token
        }
      );
      
      // Convert TokenSet to our DTO format
      const tokenResponse: TokenResponseDto = {
        access_token: tokenSet.access_token,
        token_type: tokenSet.token_type,
        expires_in: Math.floor((new Date(tokenSet.expires_at).getTime() - Date.now()) / 1000),
        refresh_token: tokenSet.refresh_token || token.refresh_token, // Keep old refresh token if not returned
        scope: tokenSet.scope,
        id_token: tokenSet.id_token,
      };
      
      // Save the new token
      await this.tokenManager.saveToken(sessionId, tokenResponse, token.contract_id);
      
      console.error(`[INFO] Token refreshed successfully for session ${sessionId}`);
      return tokenResponse;
    } catch (error) {
      let errorMessage = 'Unknown error during token refresh';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error(`[ERROR] Token refresh failed: ${errorMessage}`);
      return null;
    }
  }
  
  /**
   * Check authentication status
   * @param sessionId - Session ID
   */
  async checkAuthStatus(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }> {
    try {
      const session = await this.sessionManager.getSession(sessionId);
      
      if (!session) {
        return { isAuthenticated: false, sessionId };
      }
      
      // If session is authenticated, check if there's a valid token
      if (session.is_authenticated) {
        const token = await this.tokenManager.getToken(sessionId);
        
        if (!token) {
          return { isAuthenticated: false, sessionId };
        }
        
        // Check if token is expired or will expire soon
        if (this.tokenManager.isTokenNearExpiry(token)) {
          // Try to refresh the token
          if (token.refresh_token) {
            const refreshed = await this.refreshToken(sessionId);
            
            if (!refreshed) {
              return { isAuthenticated: false, sessionId };
            }
          } else {
            // No refresh token, can't refresh
            return { isAuthenticated: false, sessionId };
          }
        }
        
        return { isAuthenticated: true, sessionId };
      }
      
      return { isAuthenticated: false, sessionId };
    } catch (error) {
      console.error(`[ERROR] Failed to check auth status: ${error}`);
      return { isAuthenticated: false, sessionId };
    }
  }
  
  /**
   * Get access token
   * @param sessionId - Session ID
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    try {
      const token = await this.tokenManager.getToken(sessionId);
      
      if (!token) {
        console.error(`[ERROR] No token found for session ${sessionId}`);
        return null;
      }
      
      // Check if token is expired or will expire soon
      if (this.tokenManager.isTokenNearExpiry(token)) {
        // Try to refresh the token
        if (token.refresh_token) {
          const refreshed = await this.refreshToken(sessionId);
          
          if (!refreshed) {
            console.error(`[ERROR] Token refresh failed for session ${sessionId}`);
            return null;
          }
          
          // Get the new token
          const newToken = await this.tokenManager.getToken(sessionId);
          return newToken?.access_token || null;
        } else {
          // No refresh token, can't refresh
          console.error(`[ERROR] Token expired and no refresh token available for session ${sessionId}`);
          return null;
        }
      }
      
      return token.access_token;
    } catch (error) {
      console.error(`[ERROR] Failed to get access token: ${error}`);
      return null;
    }
  }
  
  /**
   * Revoke token
   * @param sessionId - Session ID
   */
  async revokeToken(sessionId: string): Promise<boolean> {
    try {
      // Delete token from database
      await this.tokenManager.deleteToken(sessionId);
      
      // Delete session from database
      await this.sessionManager.deleteSession(sessionId);
      
      console.error(`[INFO] Token and session revoked for session ${sessionId}`);
      return true;
    } catch (error) {
      console.error(`[ERROR] Failed to revoke token: ${error}`);
      return false;
    }
  }
}