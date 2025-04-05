import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ToolHandlerService } from '../tool-handler/tool-handler.service.js';

@Injectable()
export class McpService implements OnModuleInit, OnModuleDestroy {
  private mcpServer: McpServer;
  private transport: StdioServerTransport;

  constructor(
    private readonly configService: ConfigService,
    private readonly toolHandlerService: ToolHandlerService,
  ) {}

  // ログ出力用ユーティリティ関数
  private log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    console.error(`[${level}] ${message}`);
  }

  /**
   * OpenAPI定義からAPIツールを動的に登録
   */
  private registerApiTools(usePregenerated = true): number {
    // ここでAPIツールを登録する実装
    // 実際の実装はIssue #34に従って追加
    return 0; // 登録したツール数
  }

  /**
   * リソース生成関数
   */
  private generateResourcesFromOpenApi() {
    // 実際の実装はIssue #34に従って追加
    return {
      resourceTemplates: [],
      resources: []
    };
  }

  /**
   * プロンプト生成関数
   */
  private generatePromptsFromOpenApi() {
    try {
      // プロンプト定義
      return [
        {
          name: 'search-products',
          description: '商品を検索',
          is_user_prompt_template: true,
          sample_user_prompts: ['商品を検索して', '在庫のある商品を教えて'],
          parameters: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '検索キーワード'
              },
              category: {
                type: 'string',
                description: '商品カテゴリ'
              }
            }
          }
        },
        {
          name: 'analyze-sales',
          description: '売上データを分析',
          is_user_prompt_template: true,
          sample_user_prompts: ['売上分析をして', '今週の売上を見せて'],
          parameters: {
            type: 'object',
            properties: {
              period: {
                type: 'string',
                description: '分析期間（例: 今週、先月、過去3ヶ月）'
              },
              storeId: {
                type: 'string',
                description: '店舗ID'
              }
            }
          }
        },
        {
          name: 'inventory-status',
          description: '在庫状況を確認',
          is_user_prompt_template: true,
          sample_user_prompts: ['在庫状況を教えて', '商品の在庫を確認して'],
          parameters: {
            type: 'object',
            properties: {
              productId: {
                type: 'string',
                description: '商品ID'
              },
              storeId: {
                type: 'string',
                description: '店舗ID'
              }
            }
          }
        }
      ];
    } catch (error) {
      this.log('ERROR', `プロンプト生成エラー: ${error}`);
      return [];
    }
  }

  /**
   * モジュール初期化時にMCPサーバーを起動
   */
  async onModuleInit() {
    try {
      this.log('INFO', 'MCPサーバーを初期化しています...');
      
      // リソースとプロンプトの機能を提供
      this.mcpServer = new McpServer(
        {
          name: 'smaregi', 
          version: this.configService.get('npm_package_version', '1.0.0'),
        }
      );

      // resource: 商品情報リソース
      this.mcpServer.resource(
        'products',
        'smaregi://api/products',
        async () => {
          return {
            content: '# 商品情報\n\nスマレジAPIで取得可能な商品情報のサンプルです。'
          };
        }
      );

      // resource: 店舗情報リソース
      this.mcpServer.resource(
        'stores',
        'smaregi://api/stores',
        async () => {
          return {
            content: '# 店舗情報\n\nスマレジAPIで取得可能な店舗情報のサンプルです。'
          };
        }
      );

      // prompt: 商品検索プロンプト
      this.mcpServer.prompt(
        'search-products',
        '商品を検索',
        {
          keyword: z.string().optional().describe('検索キーワード'),
          category: z.string().optional().describe('商品カテゴリ')
        },
        async ({ keyword, category }) => {
          this.log('INFO', `商品検索プロンプト実行: キーワード=${keyword}, カテゴリ=${category}`);
          
          return {
            description: '商品検索',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `スマレジに登録されている商品を検索してください。\n\n検索キーワード: ${keyword || '指定なし'}\nカテゴリ: ${category || '指定なし'}`
                }
              }
            ]
          };
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
          query: z.record(z.any()).optional().describe('クエリパラメータ（例：{ limit: 10, offset: 0 }）'),
          path: z.record(z.any()).optional().describe('パスパラメータ（例：{ product_id: "123" }）'),
        },
        async ({ sessionId, endpoint, method, data, query, path }) => {
          return await this.toolHandlerService.handleExecuteApiRequest({
            sessionId,
            endpoint,
            method,
            data,
            query,
            path,
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
      
      // 動的ツールの登録
      // 環境変数で事前生成/動的生成を切り替え可能に
      const usePregeneratedTools = process.env.USE_PREGENERATED_TOOLS !== 'false';
      const registeredTools = this.registerApiTools(usePregeneratedTools);
      this.log('INFO', `動的ツール登録完了: ${registeredTools}個のツールが登録されました`);
      
      // MCPトランスポート接続
      this.transport = new StdioServerTransport();
      await this.mcpServer.connect(this.transport);
      this.log('INFO', 'MCPサーバーが接続され、実行中です');
    } catch (error) {
      this.log('ERROR', `MCPサーバー初期化エラー: ${error}`);
      throw error;
    }
  }

  /**
   * モジュール破棄時にMCPサーバーを適切に終了
   */
  async onModuleDestroy() {
    try {
      if (this.mcpServer) {
        this.log('INFO', 'MCPサーバーを終了しています...');
        
        // まずMCPサーバーを終了
        try {
          await this.mcpServer.close();
          this.log('INFO', 'MCPサーバー接続を閉じました');
        } catch (e) {
          this.log('WARN', `MCPサーバー終了中にエラーが発生しました: ${e}`);
        }
        
        // その後トランスポートの切断
        if (this.transport) {
          try {
            await this.transport.close();
            this.log('INFO', 'トランスポート接続を閉じました');
          } catch (e) {
            this.log('WARN', `トランスポート切断中にエラーが発生しました: ${e}`);
          }
        }
        
        this.log('INFO', 'MCPサーバーが正常に終了しました');
      }
    } catch (error) {
      this.log('ERROR', `MCPサーバー終了エラー: ${error}`);
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
