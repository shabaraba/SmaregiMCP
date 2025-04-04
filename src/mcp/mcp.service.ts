import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from './transports/stdio-transport.js';
import { ToolHandlerService } from '../tool-handler/tool-handler.service.js';
import { z } from 'zod';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ApiToolsGenerator } from '../tools/api-tools-generator.js';
import { ApiTool } from '../tools/interfaces/api-tool.interface.js';
import { 
  ListResourcesRequestSchema, 
  ListPromptsRequestSchema, 
  GetPromptRequestSchema 
} from './mcp.schema.js';

/**
 * MCPサービスクラス
 * Model Context Protocolを使用してClaudeとのやり取りを行う
 */
@Injectable()
export class McpService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(McpService.name);
  private mcpServer: McpServer;
  private transport: any = null; // MCPトランスポート
  private readonly debugMode: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly toolHandlerService: ToolHandlerService,
    private readonly apiToolsGenerator: ApiToolsGenerator
  ) {
    // デバッグモードを環境変数から取得
    this.debugMode = process.env.DEBUG === 'true';
  }

  /**
   * ログ出力関数
   * @param level ログレベル
   * @param message ログメッセージ
   */
  private log(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string): void {
    // DEBUGレベルのログはデバッグモードの場合のみ出力
    if (level === 'DEBUG' && !this.debugMode) {
      return;
    }
    
    // 標準エラー出力に書き込む（標準出力はMCPプロトコル通信用）
    const timestamp = new Date().toISOString();
    process.stderr.write(`[smaregi] [${level.toLowerCase()}] [${timestamp}] ${message}\n`);
  }

  /**
   * APIツールを登録する
   * @param usePregeneratedTools 事前生成されたツールを使用するかどうか
   * @returns 登録されたツールの数
   */
  registerApiTools(usePregeneratedTools: boolean = true): number {
    let tools: ApiTool[] = [];
    
    try {
      // 事前生成されたツールJSONを使用する場合
      if (usePregeneratedTools) {
        try {
          const toolsJsonPath = path.resolve(process.cwd(), 'src', 'tools', 'generated', 'tools.json');
          
          if (fs.existsSync(toolsJsonPath)) {
            this.log('INFO', `事前生成されたツールJSONを読み込みます: ${toolsJsonPath}`);
            const toolsJson = fs.readFileSync(toolsJsonPath, 'utf8');
            tools = JSON.parse(toolsJson);
            this.log('DEBUG', `ツールJSONから読み込んだツール: ${tools.length}件`);
          } else {
            this.log('WARN', `事前生成されたツールJSONが見つかりません: ${toolsJsonPath}`);
            // 見つからない場合は動的に生成
            tools = this.apiToolsGenerator.generateTools();
            this.log('INFO', `ツールを動的に生成しました: ${tools.length}件`);
          }
        } catch (error) {
          this.log('ERROR', `事前生成ツール読み込み中にエラーが発生しました: ${error}`);
          // エラー時は動的に生成
          tools = this.apiToolsGenerator.generateTools();
          this.log('INFO', `エラーのため、ツールを動的に生成しました: ${tools.length}件`);
        }
      } else {
        // 明示的に動的生成を指定された場合
        this.log('INFO', '動的ツール生成モードが選択されました');
        tools = this.apiToolsGenerator.generateTools();
        this.log('INFO', `ツールを動的に生成しました: ${tools.length}件`);
      }
      
      // 生成されたツールをMCPサーバーに登録
      for (const tool of tools) {
        this.log('DEBUG', `ツール登録: ${tool.name}`);
        
        // パラメータをZodスキーマに変換
        const paramsSchema: Record<string, z.ZodTypeAny> = {};
        
        tool.parameters.forEach(param => {
          // schemaが設定されていない場合はデフォルトのz.string()を使用
          const schema = param.schema || z.string();
          
          if (param.required) {
            paramsSchema[param.name] = schema.describe(param.description);
          } else {
            paramsSchema[param.name] = schema.optional().describe(param.description);
          }
        });
        
        // ツールを登録
        this.mcpServer.tool(
          tool.name,
          tool.description,
          paramsSchema,
          async (params) => {
            try {
              // パラメータをpath/query/bodyに分類
              const pathParams: Record<string, any> = {};
              const queryParams: Record<string, any> = {};
              let bodyParams: Record<string, any> | undefined = undefined;
              
              // パラメータを適切なカテゴリに振り分け
              tool.parameters.forEach(param => {
                if (params[param.name] === undefined) return;
                
                switch (param.type) {
                  case 'path':
                    pathParams[param.name] = params[param.name];
                    break;
                  case 'query':
                    queryParams[param.name] = params[param.name];
                    break;
                  case 'body':
                    if (!bodyParams) bodyParams = {};
                    bodyParams[param.name] = params[param.name];
                    break;
                }
              });
              
              this.log('DEBUG', `API呼び出し: ${tool.method} ${tool.path}`);
              this.log('DEBUG', `パス: ${JSON.stringify(pathParams)}`);
              this.log('DEBUG', `クエリ: ${JSON.stringify(queryParams)}`);
              if (bodyParams) {
                this.log('DEBUG', `ボディ: ${JSON.stringify(bodyParams)}`);
              }
              
              // ToolHandlerServiceを介してAPIリクエストを実行
              return await this.toolHandlerService.handleExecuteApiRequest({
                sessionId: params.sessionId,
                endpoint: tool.path,
                method: tool.method,
                data: bodyParams,
                path: pathParams,
                query: queryParams
              });
            } catch (error) {
              this.log('ERROR', `ツール実行エラー (${tool.name}): ${error}`);
              throw error;
            }
          }
        );
      }
      
      return tools.length;
    } catch (error) {
      this.log('ERROR', `APIツール登録中にエラーが発生しました: ${error}`);
      return 0;
    }
  }

  /**
   * OpenAPI定義からリソースを生成
   */
  private generateResourcesFromOpenApi() {
    try {
      // リソーステンプレート
      const resourceTemplates = [
        { template: 'smaregi://api/{category}/{path}', description: 'スマレジAPIリソース' }
      ];
      
      // 定義済みリソース
      const resources = [
        { id: 'smaregi://api/pos/products', description: '商品情報へのアクセス' },
        { id: 'smaregi://api/pos/transactions', description: '取引データへのアクセス' },
        { id: 'smaregi://api/pos/stocks', description: '在庫データへのアクセス' },
        { id: 'smaregi://api/pos/stores', description: '店舗情報へのアクセス' },
        { id: 'smaregi://api/pos/customers', description: '顧客情報へのアクセス' }
      ];
      
      return { resourceTemplates, resources };
    } catch (error) {
      this.log('ERROR', `リソース生成エラー: ${error}`);
      // 最低限のリソース定義を返す
      return { 
        resourceTemplates: [
          { template: 'smaregi://api/{category}/{path}', description: 'スマレジAPIリソース' }
        ], 
        resources: [] 
      };
    }
  }

  /**
   * OpenAPI定義からプロンプトを生成
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
      
      // MCPクライアントを作成
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
          
          this.log('INFO', `resources/list レスポンス: ${resourceTemplates.length}テンプレート, ${resources.length}リソース`);
          
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
          
          this.log('INFO', `prompts/list レスポンス: ${prompts.length}プロンプト`);
          
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
          
          this.log('INFO', `prompts/get リクエスト: ${name}`);
          
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
