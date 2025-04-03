import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ToolHandlerService } from './tools/tool-handler.service.js';
import { z } from 'zod';

@Injectable()
export class McpService implements OnModuleInit, OnModuleDestroy {
  private mcpServer: McpServer;
  private transport: StdioServerTransport | null = null;

  constructor(
    private configService: ConfigService,
    private toolHandlerService: ToolHandlerService,
  ) {}

  /**
   * モジュール初期化時にMCPサーバーを起動
   * 常にMCPサーバーを初期化し、Claude Desktopとの通信を可能にする
   */
  async onModuleInit() {
    try {
      // 標準エラー出力にログを出力
      process.stderr.write('[INFO] [McpService] MCPサーバーを初期化中...\n');
      
      // MCPサーバー作成（高レベルAPIを使用）
      this.mcpServer = new McpServer(
        { 
          name: 'smaregi', 
          version: this.configService.get('npm_package_version', '1.0.0'),
        }
      );

      // 認証URLを取得するツール
      this.mcpServer.tool(
        'getAuthorizationUrl',
        'スマレジAPIにアクセスするための認証URLを生成します。ユーザーはこのURLでブラウザにアクセスして認証を完了する必要があります。',
        {
          scopes: z.array(z.string()).describe('要求するスコープのリスト（例：["pos.products:read", "pos.transactions:read"]）'),
        },
        async ({ scopes }) => {
          return await this.toolHandlerService.handleGetAuthorizationUrl({ scopes });
        }
      );
      
      // 認証状態を確認するツール
      this.mcpServer.tool(
        'checkAuthStatus',
        '認証状態を確認します。ユーザーが認証URLで認証を完了したかどうかを確認できます。',
        {
          sessionId: z.string().describe('getAuthorizationUrlで取得したセッションID'),
        },
        async ({ sessionId }) => {
          return await this.toolHandlerService.handleCheckAuthStatus({ sessionId });
        }
      );
      
      // APIリクエストを実行するツール
      this.mcpServer.tool(
        'executeApiRequest',
        'スマレジAPIにリクエストを送信します。認証済みのセッションが必要です。',
        {
          sessionId: z.string().describe('認証済みのセッションID'),
          endpoint: z.string().describe('APIエンドポイント（例："/pos/products"）'),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTPメソッド'),
          data: z.object({}).passthrough().optional().describe('リクエストボディ（POSTまたはPUTリクエスト用）'),
        },
        async ({ sessionId, endpoint, method, data }) => {
          return await this.toolHandlerService.handleExecuteApiRequest({
            sessionId,
            endpoint,
            method,
            data,
          });
        }
      );
      
      // APIの概要情報を取得するツール
      this.mcpServer.tool(
        'getSmaregiApiOverview',
        'スマレジAPIの概要情報を取得します。',
        {
          category: z.string().optional().describe('情報を取得したいカテゴリ'),
        },
        async (args) => {
          return this.toolHandlerService.handleGetSmaregiApiOverview(args);
        }
      );
      
      // API操作の詳細を取得するツール
      this.mcpServer.tool(
        'getSmaregiApiOperation',
        'スマレジAPIの特定のエンドポイントに関する詳細情報を取得します。',
        {
          path: z.string().describe('APIエンドポイントのパス'),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTPメソッド'),
        },
        async ({ path, method }) => {
          return this.toolHandlerService.handleGetSmaregiApiOperation({ path, method });
        }
      );
      
      // API一覧を取得するツール
      this.mcpServer.tool(
        'listSmaregiApiEndpoints',
        'スマレジAPIで利用可能なエンドポイントの一覧を取得します。',
        {
          category: z.string().optional().describe('エンドポイントのカテゴリ'),
        },
        async (args) => {
          return this.toolHandlerService.handleListSmaregiApiEndpoints(args);
        }
      );
      
      // MCPトランスポート接続
      this.transport = new StdioServerTransport();
      await this.mcpServer.connect(this.transport);
      process.stderr.write('[INFO] [McpService] MCPサーバーが接続され、実行中です\n');
    } catch (error) {
      process.stderr.write(`[ERROR] [McpService] MCPサーバー初期化エラー: ${error}\n`);
      throw error;
    }
  }

  /**
   * モジュール破棄時にMCPサーバーを適切に終了
   */
  async onModuleDestroy() {
    try {
      if (this.mcpServer) {
        process.stderr.write('[INFO] [McpService] MCPサーバーを終了しています...\n');
        // トランスポートの切断
        if (this.transport) {
          try {
            await this.transport.close();
          } catch (e) {
            process.stderr.write(`[WARN] [McpService] トランスポート切断中にエラーが発生しました: ${e}\n`);
          }
        }
        process.stderr.write('[INFO] [McpService] MCPサーバーが正常に終了しました\n');
      }
    } catch (error) {
      process.stderr.write(`[ERROR] [McpService] MCPサーバー終了エラー: ${error}\n`);
    }
  }

  /**
   * アプリケーション終了時の後処理を行う
   * シグナルハンドラーなどから呼び出される
   */
  async cleanup() {
    await this.onModuleDestroy();
  }
}
