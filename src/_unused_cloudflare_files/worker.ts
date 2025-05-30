import { handleRequest } from './server/cloudflare-server.js';
import { handleSSE } from './server/cloudflare-sse-server.js';

/**
 * Cloudflare Workers向けのMCPエントリポイント
 * 
 * このファイルはCloudflare Workersのエントリポイントとして機能し、
 * fetch()イベントをFetchイベントハンドラとして処理します。
 * ワーカーはHTTPリクエストを処理し、RESTful APIとMCP SDKの両方のエンドポイントを提供します。
 */

// MCPトランスポートの参照（実際にはcloudflare-server.jsで直接処理）
let mcpServerInitialized = false;

/**
 * Cloudflare Workersのメインハンドラー関数
 * これはWorkersがインスタンス化されたときに登録されるエントリポイントです
 */
export default {
  /**
   * fetch()イベントハンドラー
   * すべてのHTTPリクエストの処理入口
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // リクエストURLの解析
    const url = new URL(request.url);
    
    // SSEエンドポイントの処理
    if (url.pathname === '/sse' || url.pathname === '/message') {
      return handleSSE(request, env, ctx);
    }
    
    // MCPリクエストの処理
    if (url.pathname.startsWith('/mcp')) {
      try {
        // MCPリクエストをcloudflare-server.jsでのハンドラに転送
        // cloudflare-server.js内でMCPサーバーが作成され、リクエストを処理
        return handleRequest(request, env, ctx);
      } catch (error) {
        console.error(`[ERROR] MCP request handling error: ${error}`);
        return new Response(JSON.stringify({ error: 'MCP Processing Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // 認証とその他のRESTルートの処理
    // これはcloudflare-server.jsで定義されたhandleRequest関数が処理
    return handleRequest(request, env, ctx);
  },
  
  /**
   * scheduled()イベントハンドラー（オプション）
   * 定期的なタスク実行が必要な場合に使用
   */
  async scheduled(event: any, env: Env, ctx: ExecutionContext): Promise<void> {
    // アクティブなセッションの整理など、定期的なタスクを実行
    console.log('Scheduled task triggered', event.scheduledTime);
    // 例: 一時ファイルのクリーンアップなど
  }
};