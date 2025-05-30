/**
 * Cloudflareバージョンのエントリーポイント
 * 
 * This is a simplified version of the worker that doesn't rely on node-specific modules
 */

// Cloudflare KV環境のために必要な型
interface KVNamespace {
  get(key: string, options?: any): Promise<string | null>;
  put(key: string, value: string, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: any): Promise<{ keys: { name: string }[] }>;
}

// Env interface for Cloudflare Workers
interface Env {
  // KV namespaces
  SESSIONS: KVNamespace;
  TOKENS: KVNamespace;
  
  // Environment variables
  DEBUG?: string;
  SERVER_NAME?: string;
  SERVER_VERSION?: string;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
  REDIRECT_URI?: string;
  SMAREGI_AUTH_URL?: string;
  SMAREGI_TOKEN_ENDPOINT?: string;
  SMAREGI_API_URL?: string;
  NODE_ENV?: string;
}

// Welcome message
console.log('Starting Smaregi MCP service in Cloudflare Workers environment');

// Export default Worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Simple health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'Smaregi MCP Service is running on Cloudflare Workers',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // MCP compatibility endpoint for testing
    if (url.pathname === '/mcp') {
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        result: {
          version: env.SERVER_VERSION || '1.0.0',
          name: env.SERVER_NAME || 'smaregi',
          capabilities: {
            resources: {},
            prompts: {}
          }
        }
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Default response for all other routes
    return new Response('Smaregi MCP Service - Cloudflare Worker implementation', {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};