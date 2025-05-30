import { McpServer } from '@modelcontextprotocol/sdk/dist/esm/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/dist/esm/server/sse.js';
import { createCloudflareServer } from './cloudflare-server.js';

/**
 * Cloudflare Workers用SSEハンドラー
 */
export async function handleSSE(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  
  // SSEエンドポイント - /sse
  if (url.pathname === '/sse' && request.method === 'GET') {
    // ReadableStreamを使用してSSE接続を作成
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // MCPサーバーを作成
        const { mcpServer } = await createCloudflareServer(env);
        
        // SSEトランスポートを作成
        const transport = new SSEServerTransport('/message', (response) => {
          // レスポンスをSSE形式で送信
          const data = `data: ${JSON.stringify(response)}\n\n`;
          controller.enqueue(encoder.encode(data));
        });
        
        // MCPサーバーをトランスポートに接続
        await mcpServer.connect(transport);
        
        // 初期メッセージを送信
        controller.enqueue(encoder.encode('event: open\ndata: {"type":"connected"}\n\n'));
        
        // Keep-aliveのためのpingを定期的に送信
        const pingInterval = setInterval(() => {
          controller.enqueue(encoder.encode(':ping\n\n'));
        }, 30000);
        
        // クリーンアップ処理
        ctx.waitUntil(
          new Promise<void>((resolve) => {
            request.signal.addEventListener('abort', () => {
              clearInterval(pingInterval);
              transport.close();
              controller.close();
              resolve();
            });
          })
        );
      }
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  // SSEメッセージエンドポイント - /message
  if (url.pathname === '/message' && request.method === 'POST') {
    try {
      const { mcpServer } = await createCloudflareServer(env);
      const message = await request.json();
      
      // メッセージを処理
      const response = await processMessage(mcpServer, message);
      
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('[ERROR] Message processing error:', error);
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error',
          data: error instanceof Error ? error.message : String(error),
        },
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
  
  // OPTIONS対応（CORS）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  return new Response('Not Found', { status: 404 });
}

/**
 * MCPメッセージを処理
 */
async function processMessage(mcpServer: McpServer, message: any): Promise<any> {
  // MCPサーバーのハンドラーを直接呼び出す
  // 注: 実際の実装では、MCPサーバーの内部APIを使用する必要があります
  
  switch (message.method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            resources: { listChanged: true },
            prompts: { listChanged: true },
            tools: { listChanged: true },
          },
          serverInfo: {
            name: 'smaregi',
            version: '1.0.0',
          },
        },
      };
      
    case 'resources/list':
      // リソース一覧を返す
      return {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          resources: [],
        },
      };
      
    case 'tools/list':
      // ツール一覧を返す
      return {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: [
            {
              name: 'authenticate_smaregi',
              description: 'Smaregi APIの認証を管理します',
              inputSchema: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['start', 'check', 'status'],
                    description: 'start: 認証を開始, check: コールバック処理, status: 認証状態確認',
                  },
                  code: {
                    type: 'string',
                    description: '認証コード（checkアクション時のみ必要）',
                  },
                },
                required: ['action'],
              },
            },
            {
              name: 'transactions_list',
              description: '取引一覧を取得します',
              inputSchema: {
                type: 'object',
                properties: {
                  'transaction_date_time-from': {
                    type: 'string',
                    description: '取引日時の開始（ISO 8601形式）',
                  },
                  'transaction_date_time-to': {
                    type: 'string',
                    description: '取引日時の終了（ISO 8601形式）',
                  },
                },
                required: ['transaction_date_time-from', 'transaction_date_time-to'],
              },
            },
          ],
        },
      };
      
    case 'tools/call':
      // ツールを実行
      // 実際の実装では、ツールの実行ロジックを呼び出す
      return {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          content: [
            {
              type: 'text',
              text: 'Tool execution result',
            },
          ],
        },
      };
      
    default:
      return {
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32601,
          message: 'Method not found',
        },
      };
  }
}