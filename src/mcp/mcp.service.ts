import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ToolHandlerService } from './tools/tool-handler.service.js';
import { z } from 'zod';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import { ListResourcesRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js';

@Injectable()
export class McpService implements OnModuleInit, OnModuleDestroy {
  private mcpServer: McpServer;
  private transport: StdioServerTransport | null = null;
  private openApiSpec: any;

  constructor(
    private configService: ConfigService,
    private toolHandlerService: ToolHandlerService,
  ) {
    // OpenAPI仕様を読み込み
    this.loadOpenApiSpec();
  }

  /**
   * OpenAPI仕様を読み込む
   */
  private loadOpenApiSpec() {
    try {
      const projectRoot = process.cwd();
      const possiblePaths = [
        path.resolve(projectRoot, 'openapi-simple.yaml'),
        path.resolve(projectRoot, 'openapi.yaml'),
        path.resolve(projectRoot, 'openapi', 'pos', 'openapi.yaml'),
      ];

      for (const specPath of possiblePaths) {
        if (fs.existsSync(specPath)) {
          const content = fs.readFileSync(specPath, 'utf8');
          this.openApiSpec = yaml.load(content);
          process.stderr.write(`[INFO] [McpService] OpenAPI仕様を読み込みました: ${specPath}\n`);
          break;
        }
      }

      // 仕様が見つからない場合は簡易版を用意
      if (!this.openApiSpec) {
        this.openApiSpec = {
          info: {
            title: "スマレジAPI (Fallback)",
            description: "スマレジAPIの簡易モード",
            version: "1.0.0"
          },
          paths: {},
          tags: [
            { name: "商品", description: "商品に関する操作" },
            { name: "取引", description: "取引に関する操作" },
            { name: "在庫", description: "在庫に関する操作" }
          ]
        };
        process.stderr.write(`[WARN] [McpService] OpenAPI仕様が見つからないため、デフォルト定義を使用します\n`);
      }
    } catch (error) {
      process.stderr.write(`[ERROR] [McpService] OpenAPI仕様の読み込みに失敗しました: ${error}\n`);
      this.openApiSpec = {
        info: {
          title: "スマレジAPI (Error)",
          description: "スマレジAPIの定義読み込みに失敗しました",
          version: "1.0.0"
        },
        paths: {},
        tags: []
      };
    }
  }

  /**
   * OpenAPI定義からリソースを生成
   */
  private generateResourcesFromOpenApi() {
    try {
      // リソーステンプレートのリスト（カテゴリごと）
      const resourceTemplates = [];
      
      // タグ（カテゴリ）を処理
      const tags = this.openApiSpec.tags || [];
      for (const tag of tags) {
        resourceTemplates.push({
          uriTemplate: `smaregi://api/${tag.name}/{path}`,
          name: `スマレジ ${tag.name}`,
          description: tag.description || `スマレジの${tag.name}に関するリソース`
        });
      }
      
      // 具体的なリソースのリスト
      const resources = [];
      
      // 特定のよく使われるエンドポイントを固定リソースとして追加
      if (this.openApiSpec.paths) {
        const paths = Object.keys(this.openApiSpec.paths);
        
        // 例: /products エンドポイントがあれば商品一覧リソースとして追加
        if (paths.includes('/products')) {
          resources.push({
            uri: 'smaregi://api/products/list',
            name: '商品一覧',
            description: '登録されている商品の一覧',
            mimeType: 'application/json'
          });
        }
        
        // 例: /transactions エンドポイントがあれば取引履歴リソースとして追加
        if (paths.includes('/transactions')) {
          resources.push({
            uri: 'smaregi://api/transactions/list',
            name: '取引履歴',
            description: '記録されている取引の履歴',
            mimeType: 'application/json'
          });
        }
      }
      
      return { resourceTemplates, resources };
    } catch (error) {
      process.stderr.write(`[ERROR] [McpService] リソース生成中にエラーが発生しました: ${error}\n`);
      return { resourceTemplates: [], resources: [] };
    }
  }

  /**
   * プロンプトの定義を生成
   */
  private generatePromptsFromOpenApi() {
    try {
      const prompts = [];
      
      // タグ（カテゴリ）を処理してプロンプトを生成
      const tags = this.openApiSpec.tags || [];
      
      // 商品検索プロンプト
      if (tags.some(tag => tag.name === '商品')) {
        prompts.push({
          name: 'search-products',
          description: '商品を検索',
          arguments: [
            {
              name: 'keyword',
              description: '検索キーワード',
              required: true
            },
            {
              name: 'category',
              description: 'カテゴリ',
              required: false
            }
          ]
        });
      }
      
      // 売上分析プロンプト
      if (tags.some(tag => tag.name === '取引')) {
        prompts.push({
          name: 'analyze-sales',
          description: '売上データを分析',
          arguments: [
            {
              name: 'period',
              description: '分析期間（例：last7days, thisMonth, lastMonth）',
              required: true
            },
            {
              name: 'storeId',
              description: '店舗ID（指定しない場合は全店舗）',
              required: false
            }
          ]
        });
      }
      
      // 在庫確認プロンプト
      if (tags.some(tag => tag.name === '在庫')) {
        prompts.push({
          name: 'inventory-status',
          description: '在庫状況を確認',
          arguments: [
            {
              name: 'productId',
              description: '商品ID',
              required: false
            },
            {
              name: 'storeId',
              description: '店舗ID',
              required: false
            }
          ]
        });
      }
      
      return prompts;
    } catch (error) {
      process.stderr.write(`[ERROR] [McpService] プロンプト生成中にエラーが発生しました: ${error}\n`);
      return [];
    }
  }

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
        },
        {
          capabilities: {
            resources: {},  // リソース機能を有効化
            prompts: {}     // プロンプト機能を有効化
          }
        }
      );

      // リソースリストのハンドラーを設定
      this.mcpServer.server.setRequestHandler(
        ListResourcesRequestSchema,
        async () => {
          // OpenAPI定義からリソースを生成
          const { resourceTemplates, resources } = this.generateResourcesFromOpenApi();
          
          process.stderr.write(`[INFO] [McpService] resources/list レスポンス: ${resourceTemplates.length}テンプレート, ${resources.length}リソース\n`);
          
          return {
            resourceTemplates,
            resources
          };
        }
      );

      // プロンプトリストのハンドラーを設定
      this.mcpServer.server.setRequestHandler(
        ListPromptsRequestSchema,
        async () => {
          // OpenAPI定義からプロンプトを生成
          const prompts = this.generatePromptsFromOpenApi();
          
          process.stderr.write(`[INFO] [McpService] prompts/list レスポンス: ${prompts.length}プロンプト\n`);
          
          return {
            prompts
          };
        }
      );
      
      // プロンプト取得のハンドラーを設定
      this.mcpServer.server.setRequestHandler(
        GetPromptRequestSchema,
        async (request) => {
          const { name, arguments: promptArgs } = request.params;
          
          process.stderr.write(`[INFO] [McpService] prompts/get リクエスト: ${name}\n`);
          
          // OpenAPI定義からプロンプトを生成（一覧から名前で検索）
          const allPrompts = this.generatePromptsFromOpenApi();
          const promptDef = allPrompts.find(p => p.name === name);
          
          if (!promptDef) {
            throw new Error(`プロンプト "${name}" が見つかりません`);
          }
          
          // プロンプトテンプレートに応じてメッセージを生成
          let messages = [];
          
          switch (name) {
            case 'search-products':
              messages = [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `スマレジに登録されている商品を検索してください。\n\n検索キーワード: ${promptArgs?.keyword || '指定なし'}\nカテゴリ: ${promptArgs?.category || '指定なし'}`
                  }
                }
              ];
              break;
            
            case 'analyze-sales':
              messages = [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `以下の条件で売上データを分析してください。\n\n期間: ${promptArgs?.period || '先週'}\n店舗ID: ${promptArgs?.storeId || '全店舗'}`
                  }
                }
              ];
              break;
              
            case 'inventory-status':
              messages = [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `在庫状況を確認してください。\n\n商品ID: ${promptArgs?.productId || '全商品'}\n店舗ID: ${promptArgs?.storeId || '全店舗'}`
                  }
                }
              ];
              break;
              
            default:
              messages = [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `${promptDef.description || 'リクエストされたプロンプト'}についての情報を表示します。`
                  }
                }
              ];
          }
          
          return {
            description: promptDef.description,
            messages
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
        
        // まずMCPサーバーを終了
        try {
          await this.mcpServer.close();
          process.stderr.write('[INFO] [McpService] MCPサーバー接続を閉じました\n');
        } catch (e) {
          process.stderr.write(`[WARN] [McpService] MCPサーバー終了中にエラーが発生しました: ${e}\n`);
        }
        
        // その後トランスポートの切断
        if (this.transport) {
          try {
            await this.transport.close();
            process.stderr.write('[INFO] [McpService] トランスポート接続を閉じました\n');
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