import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { config } from '../utils/config.js';
import * as crypto from 'crypto';
import axios from 'axios';

/**
 * Token set interface
 */
interface TokenSet {
  access_token?: string;
  token_type?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  session_state?: string;
  scope?: string;
}

/**
 * Service for handling OAuth authentication using standard OAuth flow
 * with support for PKCE extension
 */
export class OpenIdAuthService {
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
   * Generate a random string for PKCE and state parameters
   */
  private generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length * 0.75))
      .toString('base64')
      .replace(/[+/]/g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  }
  
  /**
   * Create code challenge from verifier (for PKCE)
   */
  private createCodeChallenge(verifier: string): string {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Authorization scopes
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    // Generate PKCE parameters
    const verifier = this.generateRandomString(64);
    const codeChallenge = this.createCodeChallenge(verifier);
    const state = this.generateRandomString(32);
    
    // Store in session
    const session = await this.sessionManager.createOpenIdSession(
      scopes,
      config.redirectUri,
      verifier,
      codeChallenge,
      state
    );
    
    // Build query parameters
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: session.redirect_uri,
      response_type: 'code',
      scope: scopes.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    // Generate authorization URL
    const url = `${config.smaregiAuthUrl}?${params.toString()}`;
    
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
    // Find session by state
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // Exchange code for token
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: session.redirect_uri,
        client_id: config.clientId,
        code_verifier: session.verifier
      });
      
      // Add client_secret if it exists
      if (config.clientSecret) {
        params.append('client_secret', config.clientSecret);
      }
      
      const response = await axios.post(
        config.smaregiTokenEndpoint,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      const tokenSet: TokenSet = response.data;
      
      // Update session
      await this.sessionManager.updateSessionAuthentication(session.id);
      
      // Save token
      await this.tokenManager.saveToken(session.id, tokenSet, config.contractId);
      
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
    // Get current token
    const currentToken = await this.tokenManager.getToken(sessionId);
    if (!currentToken || !currentToken.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Prepare refresh token request
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: currentToken.refresh_token,
        client_id: config.clientId
      });
      
      // Add client_secret if it exists
      if (config.clientSecret) {
        params.append('client_secret', config.clientSecret);
      }
      
      const response = await axios.post(
        config.smaregiTokenEndpoint,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      const tokenSet: TokenSet = response.data;
      
      // Save refreshed token
      await this.tokenManager.saveToken(sessionId, tokenSet, config.contractId);
      
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
      isAuthenticated: Boolean(session.is_authenticated),
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
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return false;
    }
    
    try {
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