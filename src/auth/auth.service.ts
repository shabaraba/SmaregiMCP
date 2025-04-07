import axios from 'axios';
import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { config } from '../utils/config.js';

/**
 * Service for handling OAuth authentication
 */
export class AuthService {
  private tokenManager: TokenManager;
  private sessionManager: SessionManager;
  
  constructor() {
    this.tokenManager = new TokenManager();
    this.sessionManager = new SessionManager();
    
    // Periodically clean up expired sessions
    setInterval(() => {
      this.sessionManager.cleanupExpiredSessions(24).catch(err => {
        console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
      });
    }, 3600000); // Run every hour
  }
  
  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Authorization scopes
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    if (!config.clientId || !config.smaregiAuthUrl) {
      throw new Error('Missing client ID or authorization URL in configuration');
    }
    
    // Create new session
    const session = await this.sessionManager.createSession(scopes);
    
    // Build authorization URL with PKCE
    const authUrlParams = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: session.redirect_uri,
      scope: scopes.join(' '),
      state: session.state,
      code_challenge: session.code_challenge,
      code_challenge_method: 'S256'
    });
    
    const authUrl = `${config.smaregiAuthUrl}?${authUrlParams.toString()}`;
    
    return {
      url: authUrl,
      sessionId: session.id
    };
  }
  
  /**
   * Handle callback from OAuth provider
   * @param code - Authorization code
   * @param state - State parameter
   */
  async handleCallback(code: string, state: string): Promise<string> {
    // Find session by state
    const session = await this.sessionManager.getSessionByState(state);
    
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // Exchange code for token
      const tokenResponse = await this.exchangeCodeForToken(code, session.verifier, session.redirect_uri);
      
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
   * Exchange authorization code for access token
   * @param code - Authorization code
   * @param codeVerifier - PKCE code verifier
   * @param redirectUri - Redirect URI
   */
  private async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
    redirectUri: string
  ): Promise<TokenResponseDto> {
    if (!config.clientId || !config.clientSecret || !config.smaregiTokenEndpoint) {
      throw new Error('Missing client credentials or token endpoint in configuration');
    }
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code_verifier: codeVerifier
    });
    
    try {
      console.error(`[INFO] Exchanging code for token at ${config.smaregiTokenEndpoint}`);
      const response = await axios.post(config.smaregiTokenEndpoint, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.error('[INFO] Token exchange successful');
      return response.data as TokenResponseDto;
    } catch (error: unknown) {
      let errorMessage = 'Unknown error during token exchange';
      
      if (axios.isAxiosError(error) && error.response) {
        console.error(`[ERROR] Token exchange failed: ${JSON.stringify(error.response.data)}`);
        errorMessage = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      throw new Error(`Token exchange failed: ${errorMessage}`);
    }
  }
  
  /**
   * Refresh access token
   * @param sessionId - Session ID
   */
  async refreshToken(sessionId: string): Promise<TokenResponseDto | null> {
    const token = await this.tokenManager.getToken(sessionId);
    
    if (!token || !token.refresh_token) {
      console.error(`[ERROR] No refresh token available for session ${sessionId}`);
      return null;
    }
    
    if (!config.clientId || !config.clientSecret || !config.smaregiTokenEndpoint) {
      throw new Error('Missing client credentials or token endpoint in configuration');
    }
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });
    
    try {
      console.error(`[INFO] Refreshing token for session ${sessionId}`);
      const response = await axios.post(config.smaregiTokenEndpoint, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const tokenResponse = response.data as TokenResponseDto;
      
      // Save the new token
      await this.tokenManager.saveToken(sessionId, tokenResponse, token.contract_id);
      
      console.error(`[INFO] Token refreshed successfully for session ${sessionId}`);
      return tokenResponse;
    } catch (error: unknown) {
      let errorMessage = 'Unknown error during token refresh';
      
      if (axios.isAxiosError(error) && error.response) {
        console.error(`[ERROR] Token refresh failed: ${JSON.stringify(error.response.data)}`);
        errorMessage = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      } else if (error instanceof Error) {
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
