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
      this.mcpServer = new MCPClient(
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
