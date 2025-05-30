/**
 * Cloudflare Workers用のMCPエントリーポイント
 */

import { handleRequest } from './server/cloudflare-server.js';

// Welcome message
console.log('Starting Smaregi MCP service in Cloudflare Workers environment');

// Export default Worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await handleRequest(request, env, ctx);
    } catch (error) {
      console.error('[ERROR] Worker request handler failed:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : String(error)
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
};