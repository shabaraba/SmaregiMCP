/**
 * Cloudflare Workers専用の最小限の実装
 * 取引データ取得機能のみ提供
 */

// 型定義
interface KVNamespace {
  get(key: string, options?: any): Promise<string | null>;
  put(key: string, value: string, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: any): Promise<{ keys: { name: string }[] }>;
}

interface D1Database {
  prepare(query: string): any;
  exec(query: string): Promise<any>;
}

interface Env {
  SESSIONS: KVNamespace;
  TOKENS: KVNamespace;
  DB: D1Database;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
  REDIRECT_URI?: string;
  SMAREGI_AUTH_URL?: string;
  SMAREGI_TOKEN_ENDPOINT?: string;
  SMAREGI_API_URL?: string;
}

// Session管理クラス（最小限）
class MinimalSessionManager {
  constructor(private kvNamespace: KVNamespace) {}

  generateRandomString(length: number): string {
    const array = new Uint8Array(Math.ceil(length * 0.75));
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/[+/]/g, '_')
      .slice(0, length);
  }

  async createCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async createSession(scopes: string[]) {
    const sessionId = this.generateRandomString(32);
    const verifier = this.generateRandomString(64);
    const codeChallenge = await this.createCodeChallenge(verifier);
    const state = this.generateRandomString(32);
    
    const session = {
      id: sessionId,
      state,
      verifier,
      code_challenge: codeChallenge,
      scopes,
      created_at: new Date().toISOString(),
      is_authenticated: false
    };
    
    await this.kvNamespace.put(`session:${sessionId}`, JSON.stringify(session), { expirationTtl: 3600 });
    await this.kvNamespace.put(`session_state:${state}`, sessionId, { expirationTtl: 3600 });
    
    return session;
  }

  async getSessionByState(state: string) {
    const sessionId = await this.kvNamespace.get(`session_state:${state}`);
    if (!sessionId) return null;
    
    const sessionJson = await this.kvNamespace.get(`session:${sessionId}`);
    return sessionJson ? JSON.parse(sessionJson) : null;
  }
}

// Token管理クラス（最小限）
class MinimalTokenManager {
  constructor(private kvNamespace: KVNamespace) {}

  async saveToken(sessionId: string, tokenData: any) {
    const token = {
      session_id: sessionId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
      created_at: new Date().toISOString()
    };
    
    await this.kvNamespace.put(`token:${sessionId}`, JSON.stringify(token), { expirationTtl: tokenData.expires_in });
    return token;
  }

  async getToken(sessionId: string) {
    const tokenJson = await this.kvNamespace.get(`token:${sessionId}`);
    return tokenJson ? JSON.parse(tokenJson) : null;
  }
}

// 認証サービス（最小限）
class MinimalAuthService {
  private sessionManager: MinimalSessionManager;
  private tokenManager: MinimalTokenManager;

  constructor(private env: Env) {
    this.sessionManager = new MinimalSessionManager(env.SESSIONS);
    this.tokenManager = new MinimalTokenManager(env.TOKENS);
  }

  async generateAuthUrl(scopes: string[]) {
    const session = await this.sessionManager.createSession(scopes);
    
    const params = new URLSearchParams({
      client_id: this.env.CLIENT_ID || '',
      redirect_uri: this.env.REDIRECT_URI || '',
      response_type: 'code',
      state: session.state,
      code_challenge: session.code_challenge,
      code_challenge_method: 'S256',
      scope: scopes.join(' ')
    });
    
    const authUrl = `${this.env.SMAREGI_AUTH_URL || 'https://id.smaregi.dev/authorize'}?${params.toString()}`;
    
    return { url: authUrl, sessionId: session.id };
  }

  async handleCallback(code: string, state: string) {
    const session = await this.sessionManager.getSessionByState(state);
    if (!session) throw new Error('Invalid state parameter');
    
    const tokenResponse = await fetch(this.env.SMAREGI_TOKEN_ENDPOINT || 'https://id.smaregi.dev/authorize/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.env.CLIENT_ID || '',
        client_secret: this.env.CLIENT_SECRET || '',
        code,
        code_verifier: session.verifier,
        redirect_uri: this.env.REDIRECT_URI || ''
      }).toString()
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${await tokenResponse.text()}`);
    }
    
    const tokenData = await tokenResponse.json();
    await this.tokenManager.saveToken(session.id, tokenData);
    
    return session.id;
  }

  async getAccessToken(sessionId: string) {
    const token = await this.tokenManager.getToken(sessionId);
    return token ? token.access_token : null;
  }
}

// 取引データ取得ツール（最小限）
class MinimalTransactionTool {
  constructor(private authService: MinimalAuthService, private env: Env) {}

  async getTransactionData(params: any) {
    const { sessionId, startDate, endDate, storeId } = params;
    
    const accessToken = await this.authService.getAccessToken(sessionId);
    if (!accessToken) {
      throw new Error('No valid access token found');
    }

    const queryParams = new URLSearchParams({
      with_details: 'summary',
      fields: 'transactionHeadId,transactionDateTime,total,storeId',
      limit: '100'
    });

    if (startDate) queryParams.append('transaction_date_time_from', startDate + ' 00:00:00');
    if (endDate) queryParams.append('transaction_date_time_to', endDate + ' 23:59:59');
    if (storeId) queryParams.append('store_id', storeId);

    const apiUrl = `${this.env.SMAREGI_API_URL || 'https://api.smaregi.dev'}/pos/transactions?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }
}

// Workers エクスポート
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // ヘルスチェック
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          message: 'Smaregi MCP Service (Minimal)',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const authService = new MinimalAuthService(env);

      // 認証開始
      if (url.pathname === '/auth/start') {
        const scopes = ['openid', 'pos.transactions:read'];
        const result = await authService.generateAuthUrl(scopes);
        
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 認証コールバック
      if (url.pathname === '/auth/callback') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        
        if (!code || !state) {
          throw new Error('Missing code or state parameter');
        }
        
        const sessionId = await authService.handleCallback(code, state);
        
        return new Response(JSON.stringify({ 
          success: true, 
          sessionId 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 取引データ取得
      if (url.pathname === '/api/transactions' && request.method === 'POST') {
        const body = await request.json();
        const transactionTool = new MinimalTransactionTool(authService, env);
        const result = await transactionTool.getTransactionData(body);
        
        return new Response(JSON.stringify({
          success: true,
          data: result
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response('Smaregi MCP Service (Minimal)', {
        headers: { 'Content-Type': 'text/plain' }
      });

    } catch (error) {
      console.error('[ERROR]', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};