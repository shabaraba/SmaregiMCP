import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyProvider.js';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { config } from '../utils/config.js';
import { TokenManager } from './token-manager.js';
import { SessionManager } from './session-manager.js';
import { createHash } from 'crypto';

/**
 * MCP(nOAuth��Ф����
 * ProxyOAuthServerProvider�(Wf���OAuth�<h#:
 */
export class SmaregiProxyOAuthProvider extends ProxyOAuthServerProvider {
  private tokenManager: TokenManager;
  private sessionManager: SessionManager;
  private tokenStore: Map<string, any> = new Map();
  
  constructor() {
    // �÷��h����n���\
    const tokenManager = new TokenManager();
    const sessionManager = new SessionManager();
    
    // verifyAccessTokenhgetClientn��
    const verifyAccessToken = async (token: string) => {
      console.error(`[INFO] Verifying access token: ${token.substring(0, 8)}...`);
      // Xj����n<
      // �hj��goJWTn<�OAuth2 introspection���ݤ�Ȓ(Y�ShL~WD
      return {
        token: token,
        clientId: config.clientId,
        scopes: ['read', 'write'],
        expiresAt: Math.floor(Date.now() / 1000) + 3600 // 1B���	�PhWf-�
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
    
    // ProxyOAuthServerProvidern
    super({
      endpoints: {
        authorizationUrl: config.smaregiAuthUrl,
        tokenUrl: config.smaregiTokenEndpoint,
        // revocationUrlL-�U�fD�4oSSk��
      },
      verifyAccessToken,
      getClient
    });
    
    this.tokenManager = tokenManager;
    this.sessionManager = sessionManager;
    
    // ��kP��÷��n�����ג�L
    setInterval(() => {
      this.sessionManager.cleanupExpiredSessions(24).catch(err => {
        console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
      });
    }, 3600000); // 1B�Thk�L
  }

  /**
   * ���ɒ��������h��Y�
   * ���n��ɒ������Wfredirect_uri�+��
   * @param client - �餢���1
   * @param code - ����
   * @param codeVerifier - PKCEncode_verifier
   * @param redirectUri - �����URI (�׷����LjD4oconfigK�֗)
   */
  async exchangeAuthorizationCode(client: any, code: string, codeVerifier: string, redirectUri?: string): Promise<any> {
    console.error(`[INFO] Exchanging auth code with redirect_uri: ${redirectUri || config.redirectUri}`);
    
    // ProxyOAuthServerProviderのconfigプロパティにアクセス（protected）
    // @ts-ignore
    const tokenUrl = this.config?.endpoints?.tokenUrl || config.smaregiTokenEndpoint;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri || config.redirectUri);
    params.append('client_id', client.client_id);
    
    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
    }
    
    if (client.client_secret) {
      params.append('client_secret', client.client_secret);
    }
    
    // ꯨ�ȅ����ð��_��1o �޹�	
    console.error(`[DEBUG] Token request: ${params.toString().replace(/client_secret=[^&]+/, 'client_secret=***')}`);
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      
      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Failed to read error response';
        }
        
        console.error(`[ERROR] Token request failed: ${response.status} ${response.statusText}`);
        console.error(`[ERROR] Response: ${errorText}`);
        
        throw new Error(`Token request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const tokenSet = await response.json();
      console.error('[INFO] Token exchange successful');
      
      if (tokenSet.expires_in) {
        tokenSet.expires_at = Math.floor(Date.now() / 1000) + tokenSet.expires_in;
      }
      
      return tokenSet;
    } catch (error) {
      console.error(`[ERROR] Token exchange failed: ${error}`);
      throw error;
    }
  }
  
  /**
   * ���ɒ����h��W������k�X
   * @param code - ����
   * @param state - �K�����
   * @returns �÷��ID
   */
  async handleCallback(code: string, state: string): Promise<string> {
    console.error(`[INFO] Handling callback with code: ${code.substring(0, 8)}...`);
    
    // state�����K��÷��֗
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) {
      throw new Error('Invalid state parameter. Session not found.');
    }
    
    try {
      // clientId�(Wf�餢���1�֗
      const client = await this.clientsStore.getClient(config.clientId);
      if (!client) {
        throw new Error(`Client not found: ${config.clientId}`);
      }
      
      // ���ɒ����h�� - �����URI�:�k!Y
      const tokenSet = await this.exchangeAuthorizationCode(
        client,
        code,
        session.verifier,
        session.redirect_uri // �÷��K�֗W_�����URI�(
      );
      
      // �÷��n�<�K���
      await this.sessionManager.updateSessionAuthentication(session.id);
      
      // �����X
      await this.tokenManager.saveToken(session.id, tokenSet, config.contractId);
      
      // ��n����Ȣk��X
      this.tokenStore.set(session.id, tokenSet);
      
      return session.id;
    } catch (error) {
      console.error(`[ERROR] Token exchange failed: ${error}`);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * �<URL�
   * @param scopes - �ﹳ��
   * @returns �<URLh�÷��ID
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    console.error(`[INFO] Generating authorization URL with scopes: ${scopes.join(', ')}`);
    
    // PKCE������
    const codeVerifier = this.sessionManager.generateRandomString(64);
    const codeChallenge = this.sessionManager.createCodeChallenge(codeVerifier);
    const state = this.sessionManager.generateRandomString(32);
    
    // �÷��\
    const session = await this.sessionManager.createOpenIdSession(
      scopes,
      config.redirectUri,
      codeVerifier,
      codeChallenge,
      state
    );
    
    // �餢���1�֗
    const client = await this.clientsStore.getClient(config.clientId);
    if (!client) {
      throw new Error(`Client not found: ${config.clientId}`);
    }
    
    // URL(n�����
    const params = {
      redirectUri: config.redirectUri,
      state: state,
      codeChallenge: codeChallenge,
      codeChallengeMethod: 'S256',
      scopes: scopes
    };
    
    // ���n���ָ���
    const dummyRes = {
      redirectUrl: '',
      redirect: function(url: string) {
        this.redirectUrl = url;
        return this;
      }
    };
    
    // �<URL�
    await this.authorize(client, params, dummyRes as any);
    
    return {
      url: dummyRes.redirectUrl,
      sessionId: session.id
    };
  }
  
  /**
   * ��������֗
   * @param sessionId - �÷��ID
   * @returns ��������
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    console.error(`[INFO] Getting access token for session: ${sessionId}`);
    
    // ������K�����֗
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return null;
    }
    
    // ����LP�KiFK���ï
    if (this.tokenManager.isTokenNearExpiry(token)) {
      try {
        // �餢���1�֗
        const client = await this.clientsStore.getClient(config.clientId);
        if (!client) {
          throw new Error(`Client not found: ${config.clientId}`);
        }
        
        // ���÷�����(Wf�WD����֗
        if (!token.refresh_token) {
          throw new Error('No refresh token available');
        }
        
        const tokenSet = await this.exchangeRefreshToken(
          client,
          token.refresh_token,
          token.scope ? token.scope.split(' ') : undefined
        );
        
        // �WD�����X
        await this.tokenManager.saveToken(sessionId, tokenSet, config.contractId);
        
        // ��n����Ȣ���
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
   * ����֊�W
   * @param sessionId - �÷��ID
   * @returns �W_KiFK
   */
  async revokeTokenBySessionId(sessionId: string): Promise<boolean> {
    console.error(`[INFO] Revoking token for session: ${sessionId}`);
    
    const token = await this.tokenManager.getToken(sessionId);
    if (!token) {
      return false;
    }
    
    try {
      // ����h�÷������Jd
      await this.tokenManager.deleteToken(sessionId);
      await this.sessionManager.deleteSession(sessionId);
      
      // ��n����ȢK��Jd
      this.tokenStore.delete(sessionId);
      
      return true;
    } catch (error) {
      console.error(`[ERROR] Token revocation failed: ${error}`);
      return false;
    }
  }
  
  /**
   * �<�K���ï
   * @param sessionId - �÷��ID
   * @returns �<�K
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
   * ����������
   * @param sessionId - �÷��ID
   * @returns �WD������
   */
  async refreshToken(sessionId: string): Promise<any> {
    console.error(`[INFO] Refreshing token for session: ${sessionId}`);
    
    // �(n����֗
    const currentToken = await this.tokenManager.getToken(sessionId);
    if (!currentToken || !currentToken.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    try {
      // �餢���1�֗
      const client = await this.clientsStore.getClient(config.clientId);
      if (!client) {
        throw new Error(`Client not found: ${config.clientId}`);
      }
      
      // ���÷�����(Wf�WD����֗
      const tokenSet = await this.exchangeRefreshToken(
        client,
        currentToken.refresh_token,
        currentToken.scope ? currentToken.scope.split(' ') : undefined
      );
      
      // �WD�����X
      await this.tokenManager.saveToken(sessionId, tokenSet, config.contractId);
      
      // ��n����Ȣ���
      this.tokenStore.set(sessionId, tokenSet);
      
      return tokenSet;
    } catch (error) {
      console.error(`[ERROR] Token refresh failed: ${error}`);
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}