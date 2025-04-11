import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { config } from '../utils/config.js';
import * as openidClient from 'openid-client';

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
 * Service for handling OAuth authentication using OpenID Client library
 */
export class OpenIdAuthService {
  private tokenManager: TokenManager;
  private sessionManager: SessionManager;
  private client: any = null;
  private issuer: any = null;
  
  constructor() {
    this.tokenManager = new TokenManager();
    this.sessionManager = new SessionManager();
    
    // Periodically clean up expired sessions
    setInterval(() => {
      this.sessionManager.cleanupExpiredSessions(24).catch(err => {
        console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
      });
    }, 3600000); // Run every hour
    
    // Initialize OpenID Client
    this.initializeOidcClient();
  }
  
  /**
   * Initialize OpenID Client with issuer and client information
   */
  private async initializeOidcClient(): Promise<void> {
    try {
      // Create configuration for OAuth provider
      this.issuer = {
        issuer: 'https://id.smaregi.dev',
        authorization_endpoint: config.smaregiAuthUrl,
        token_endpoint: config.smaregiTokenEndpoint,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri
      };
      
      // Create client - クライアントを作成
      this.client = {
        authorizationUrl: (params: any) => {
          // オーソリゼーションURLの生成
          const urlObj = new URL(this.issuer.authorization_endpoint);
          urlObj.searchParams.append('client_id', this.issuer.client_id);
          urlObj.searchParams.append('redirect_uri', params.redirect_uri || this.issuer.redirect_uri);
          urlObj.searchParams.append('response_type', 'code');
          urlObj.searchParams.append('scope', params.scope);
          urlObj.searchParams.append('state', params.state);
          
          if (params.code_challenge) {
            urlObj.searchParams.append('code_challenge', params.code_challenge);
            urlObj.searchParams.append('code_challenge_method', params.code_challenge_method || 'S256');
          }
          
          return urlObj.toString();
        },
        
        callback: async (redirectUri: string, params: any, checks: any) => {
          // トークンエンドポイントへリクエスト
          const formData = new URLSearchParams();
          formData.append('grant_type', 'authorization_code');
          formData.append('code', params.code);
          formData.append('redirect_uri', redirectUri);
          formData.append('client_id', this.issuer.client_id);
          
          if (checks.code_verifier) {
            formData.append('code_verifier', checks.code_verifier);
          }
          
          if (this.issuer.client_secret) {
            formData.append('client_secret', this.issuer.client_secret);
          }
          
          const response = await fetch(this.issuer.token_endpoint, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
          }
          
          const tokenData = await response.json();
          
          // expiresAtを計算
          if (tokenData.expires_in) {
            tokenData.expires_at = Math.floor(Date.now() / 1000) + tokenData.expires_in;
          }
          
          return tokenData;
        },
        
        refresh: async (refreshToken: string) => {
          // リフレッシュトークンエンドポイントへリクエスト
          const formData = new URLSearchParams();
          formData.append('grant_type', 'refresh_token');
          formData.append('refresh_token', refreshToken);
          formData.append('client_id', this.issuer.client_id);
          
          if (this.issuer.client_secret) {
            formData.append('client_secret', this.issuer.client_secret);
          }
          
          const response = await fetch(this.issuer.token_endpoint, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
          }
          
          const tokenData = await response.json();
          
          // expiresAtを計算
          if (tokenData.expires_in) {
            tokenData.expires_at = Math.floor(Date.now() / 1000) + tokenData.expires_in;
          }
          
          return tokenData;
        }
      };
      
      console.error('[INFO] OpenID Client initialized successfully');
    } catch (error) {
      console.error(`[ERROR] Failed to initialize OpenID Client: ${error}`);
      throw error;
    }
  }
  
  /**
   * Ensure OpenID Client is initialized
   */
  private async ensureClient(): Promise<any> {
    if (!this.client) {
      await this.initializeOidcClient();
      if (!this.client) {
        throw new Error('Failed to initialize OpenID Client');
      }
    }
    return this.client;
  }
  
  /**
   * Generate a random string for PKCE and state
   */
  private generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => String.fromCharCode(b % 26 + 97)).join('');
  }
  
  /**
   * Create code challenge from verifier (for PKCE)
   */
  private async createCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  
  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Authorization scopes
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    const client = await this.ensureClient();
    
    // Generate PKCE parameters
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.createCodeChallenge(codeVerifier);
    const state = this.generateRandomString(32);
    
    // Store in session
    const session = await this.sessionManager.createOpenIdSession(
      scopes,
      config.redirectUri,
      codeVerifier,
      codeChallenge,
      state
    );
    
    // Generate authorization URL
    const url = client.authorizationUrl({
      scope: scopes.join(' '),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state,
      redirect_uri: config.redirectUri
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
    const client = await this.ensureClient();
    
    // Find session by state
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // Exchange code for token
      const tokenSet = await client.callback(
        session.redirect_uri,
        { code, state },
        { 
          code_verifier: session.verifier,
          state: session.state
        }
      );
      
      // Update session
      await this.sessionManager.updateSessionAuthentication(session.id);
      
      // Save token
      await this.tokenManager.saveToken(session.id, tokenSet, config.contractId);
      
      return session.id;
    } catch (error) {
      console.error(`[ERROR] Token exchange failed: ${error}`);
      console.error(`[ERROR] stack trace: ${error.trace}`);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Refresh access token
   * @param sessionId - Session ID
   */
  async refreshToken(sessionId: string): Promise<TokenSet> {
    const client = await this.ensureClient();
    
    // Get current token
    const currentToken = await this.tokenManager.getToken(sessionId);
    if (!currentToken || !currentToken.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Refresh token
      const tokenSet = await client.refresh(currentToken.refresh_token);
      
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
