import { handleRequest } from './server/cloudflare-server.js';
import { HttpServerTransport } from '@modelcontextprotocol/sdk/server/http.js';

/**
 * Cloudflare Workers向けのMCPエントリポイント
 * 
 * このファイルはCloudflare Workersのエントリポイントとして機能し、
 * fetch()イベントをFetchイベントハンドラとして処理します。
 * ワーカーはHTTPリクエストを処理し、RESTful APIとMCP SDKの両方のエンドポイントを提供します。
 */

// MCP SDKのHTTPトランスポートの設定
let mcpTransport: HttpServerTransport | null = null;

/**
 * MCP SDKのHTTPトランスポートを作成
 * @param env Cloudflare環境変数
 */
function getMcpTransport(env: Env): HttpServerTransport {
  if (mcpTransport === null) {
    mcpTransport = new HttpServerTransport({
      path: '/mcp',
      httpServer: null, // Cloudflareではnullを設定（HTTPサーバーは使わない）
    });
  }
  return mcpTransport;
}

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
    
    // MCPリクエストの処理
    if (url.pathname.startsWith('/mcp')) {
      try {
        // MCPトランスポートの取得
        const transport = getMcpTransport(env);
        
        // MCPリクエストを処理
        // 注意: MCPサーバーの初期化は実際のリクエスト時に内部で行われるように設計
        const response = await transport.handleRequest(request);
        return response;
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