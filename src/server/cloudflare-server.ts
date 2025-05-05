import { McpServer } from '@modelcontextprotocol/sdk/dist/esm/server/mcp.js';
import { SchemaConverter } from '../conversion/schema-converter.js';
import { ApiToolGenerator } from '../conversion/tool-generator.js';
import { ApiService } from '../api/api.service.js';
import { packageInfo } from '../utils/package-info.js';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';
import { registerPrompts } from './prompts.js';
import { z } from 'zod';
import { setupCloudflareAuthRoutes } from './auth/cloudflare-auth-routes.js';

// MCP SDK関連のスキーマ
const ListResourcesRequestSchema = z.object({
  method: z.literal('resources/list'),
  params: z.object({}),
});

const ListPromptsRequestSchema = z.object({
  method: z.literal('prompts/list'),
  params: z.object({}),
});

const GetPromptRequestSchema = z.object({
  method: z.literal('prompts/get'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.any()).optional(),
  }),
});

/**
 * Cloudflare Workers用のMCPサーバー作成
 * @param env Cloudflare Workers環境変数
 */
export async function createCloudflareServer(env: Env) {
  console.error('[INFO] Creating Cloudflare MCP server...');
  
  // MCPサーバーインスタンスを作成
  const mcpServer = new McpServer(
    {
      name: 'smaregi',
      version: packageInfo.version,
    },
    {
      capabilities: {
        resources: {},
        prompts: {},
      },
    }
  );
  
  // サービスを初期化
  const schemaConverter = new SchemaConverter();
  const apiToolGenerator = new ApiToolGenerator(schemaConverter);
  
  // Cloudflare認証ルーターとサービスを設定
  const authService = setupCloudflareAuthRoutes(env);
  const apiService = new ApiService(authService);
  
  // デフォルトリクエストハンドラを設定
  setupDefaultHandlers(mcpServer.server);
  
  // リソース、ツール、プロンプトを登録
  await registerResources(mcpServer, apiService, schemaConverter, apiToolGenerator);
  await registerTools(mcpServer, authService, apiService, apiToolGenerator);
  await registerPrompts(mcpServer);
  
  console.error('[INFO] Cloudflare MCP server created and configured successfully');
  
  return { 
    server: mcpServer.server,
    mcpServer,
    authService
  };
}

/**
 * デフォルトリクエストハンドラを設定
 * @param server MCPサーバーインスタンス
 */
function setupDefaultHandlers(server: any) {
  // リソース一覧ハンドラはresources.tsで登録
  
  // プロンプト一覧ハンドラはprompts.tsで登録
  
  // プロンプト取得ハンドラはprompts.tsで登録
}

/**
 * Fetchリクエストハンドラー
 * @param request クライアントリクエスト
 * @param env Cloudflare環境変数
 * @param ctx 実行コンテキスト
 */
export async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  
  // ヘルスチェックルート
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // ルートパス
  if (url.pathname === '/' || url.pathname === '') {
    return new Response('Smaregi MCP Server is running on Cloudflare Workers', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // 認証関連のルートは認証ハンドラで処理
  if (url.pathname.startsWith('/auth/')) {
    try {
      const { authService } = await createCloudflareServer(env);
      return authService.handleAuthRequest(request, env, ctx);
    } catch (error) {
      console.error(`[ERROR] Auth route error: ${error}`);
      return new Response(`Authentication error: ${error}`, { status: 500 });
    }
  }
  
  // MCPルート - SDKで処理されるべきリクエスト
  if (url.pathname.startsWith('/mcp/')) {
    try {
      // ここで完全なMCPサーバーを作成
      const { mcpServer } = await createCloudflareServer(env);
      
      // MCPサーバーにリクエストを転送
      // 実際のMCP SDKのFetchイベント連携は実装に応じて調整が必要
      // このサンプルコードは概念的なものです
      const body = await request.json();
      
      // MCPメッセージングプロトコルに対応するレスポンスの処理
      // ここでは直接レスポンスを構築
      // 注意: 完全な実装では、SDK内部の処理と同等の実装が必要
      
      // SDKのメソッドを使ってリクエストハンドリングを行う 
      // シンプルなPingリクエストのレスポンスをサンプル実装
      let result: any;
      
      if (body.method === 'ping') {
        result = { jsonrpc: "2.0", id: body.id, result: {} };
      } else if (body.method === 'resources/list') {
        result = { 
          jsonrpc: "2.0", 
          id: body.id, 
          result: { 
            resources: [] // 空のリソースリスト 
          } 
        };
      } else {
        // その他のメソッドは未実装としてエラーを返す
        result = { 
          jsonrpc: "2.0", 
          id: body.id, 
          error: { 
            code: -32601, 
            message: "Method not implemented" 
          } 
        };
      }
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error(`[ERROR] MCP route error: ${error}`);
      return new Response(`MCP processing error: ${error}`, { status: 500 });
    }
  }
  
  // 404: その他のパスは見つかりません
  return new Response('Not Found', { status: 404 });
}