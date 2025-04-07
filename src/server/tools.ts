import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { AuthService } from '../auth/auth.service.js';
import { ApiService } from '../api/api.service.js';
import { ApiToolGenerator } from '../conversion/tool-generator.js';

/**
 * Register all tools to the MCP server
 * @param mcpServer - The MCP server instance
 * @param authService - The authentication service
 * @param apiService - The API service
 * @param apiToolGenerator - The API tool generator
 */
export async function registerTools(
  mcpServer: McpServer,
  authService: AuthService,
  apiService: ApiService,
  apiToolGenerator: ApiToolGenerator
): Promise<void> {
  console.error('[INFO] Registering tools...');
  
  // Register authentication tools
  registerAuthTools(mcpServer, authService);
  
  // Register API request tools
  registerApiRequestTools(mcpServer, apiService);
  
  // Register API info tools
  registerApiInfoTools(mcpServer, apiService);
  
  // Register generated API tools
  await registerGeneratedApiTools(mcpServer, apiToolGenerator, apiService);
  
  console.error('[INFO] Tools registered successfully');
}

/**
 * Register authentication tools
 * @param mcpServer - The MCP server instance
 * @param authService - The authentication service
 */
function registerAuthTools(
  mcpServer: McpServer,
  authService: AuthService
): void {
  console.error('[INFO] Registering authentication tools');
  
  // Authentication tool - Get Authorization URL
  mcpServer.tool(
    'getAuthorizationUrl',
    'スマレジAPIにアクセスするための認証URLを生成します。ユーザーはこのURLでブラウザにアクセスして認証を完了する必要があります。',
    {
      scopes: z.array(z.string()).default(['pos.products:read', 'pos.transactions:read', 'pos.stores:read']).describe('要求するスコープのリスト（例：["pos.products:read", "pos.transactions:read"]）'),
    },
    async ({ scopes }) => {
      try {
        // Get authorization URL from auth service
        const result = await authService.getAuthorizationUrl(scopes);
        
        return {
          content: [
            {
              type: 'text',
              text: `# 認証URL\n\n以下のURLをブラウザで開き、スマレジアカウントでログインしてください：\n\n${result.url}\n\n認証が完了したら、\`checkAuthStatus\`ツールを使用して認証状態を確認できます。セッションID: \`${result.sessionId}\``
            }
          ]
        };
      } catch (error) {
        console.error(`[ERROR] getAuthorizationUrl failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `認証URL生成エラー: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
  
  // Authentication tool - Check Authorization Status
  mcpServer.tool(
    'checkAuthStatus',
    '認証状態を確認します。ユーザーが認証URLで認証を完了したかどうかを確認できます。',
    {
      sessionId: z.string().describe('getAuthorizationUrlで取得したセッションID'),
    },
    async ({ sessionId }) => {
      try {
        // Check auth status from auth service
        const result = await authService.checkAuthStatus(sessionId);
        
        if (result.isAuthenticated) {
          return {
            content: [
              {
                type: 'text',
                text: `# 認証状態: 成功 ✅\n\n認証が完了しています。このセッションIDを使用してAPIリクエストを実行できます：\`${sessionId}\`\n\n以下のようにAPIリクエストを実行できます：\n\n\`\`\`json\n{\n  "sessionId": "${sessionId}",\n  "endpoint": "/pos/products",\n  "method": "GET",\n  "query": { "limit": 10 }\n}\n\`\`\``
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `# 認証状態: 待機中 ⏳\n\n認証がまだ完了していません。ユーザーはブラウザで認証プロセスを完了する必要があります。\n\n認証URLが期限切れの場合は、\`getAuthorizationUrl\`ツールで新しいURLを生成してください。`
              }
            ]
          };
        }
      } catch (error) {
        console.error(`[ERROR] checkAuthStatus failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `認証状態確認エラー: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
  
  // Authentication tool - Revoke token
  mcpServer.tool(
    'revokeToken',
    '認証トークンを無効化し、セッションを終了します。',
    {
      sessionId: z.string().describe('無効化するセッションID'),
    },
    async ({ sessionId }) => {
      try {
        // Revoke token
        const result = await authService.revokeToken(sessionId);
        
        if (result) {
          return {
            content: [
              {
                type: 'text',
                text: `# トークン無効化: 成功 ✅\n\nセッション \`${sessionId}\` のトークンが正常に無効化されました。\n\n新しい認証を開始するには、\`getAuthorizationUrl\`ツールを使用してください。`
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `# トークン無効化: 失敗 ❌\n\nセッション \`${sessionId}\` のトークン無効化に失敗しました。詳細はサーバーログを確認してください。`
              }
            ]
          };
        }
      } catch (error) {
        console.error(`[ERROR] revokeToken failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `トークン無効化エラー: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
}

/**
 * Register API request tools
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiRequestTools(
  mcpServer: McpServer,
  apiService: ApiService
): void {
  console.error('[INFO] Registering API request tools');
  
  // API tool - Execute API Request
  mcpServer.tool(
    'executeApiRequest',
    'スマレジAPIにリクエストを送信します。認証済みのセッションが必要です。',
    {
      sessionId: z.string().describe('認証済みのセッションID'),
      endpoint: z.string().describe('APIエンドポイント（例："/pos/products"）'),
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTPメソッド'),
      data: z.object({}).passthrough().optional().describe('リクエストボディ（POSTまたはPUTリクエスト用）'),
      path: z.record(z.any()).optional().describe('パスパラメータ（例：{ product_id: "123" }）'),
      query: z.record(z.any()).optional().describe('クエリパラメータ（例：{ limit: 10, offset: 0 }）'),
    },
    async ({ sessionId, endpoint, method, data, path, query }) => {
      console.error(`[INFO] executeApiRequest: ${method} ${endpoint}`);
      
      // Execute API request through API service
      try {
        const response = await apiService.executeRequest({
          sessionId,
          endpoint,
          method,
          data,
          path,
          query
        });
        
        // Format the response
        let responseText = `# API ${method} ${endpoint} レスポンス\n\n`;
        
        // Add info about the request
        responseText += `## リクエスト情報\n`;
        responseText += `- エンドポイント: \`${endpoint}\`\n`;
        responseText += `- メソッド: \`${method}\`\n`;
        
        if (path && Object.keys(path).length > 0) {
          responseText += `- パスパラメータ: \`${JSON.stringify(path)}\`\n`;
        }
        
        if (query && Object.keys(query).length > 0) {
          responseText += `- クエリパラメータ: \`${JSON.stringify(query)}\`\n`;
        }
        
        if (data && Object.keys(data).length > 0) {
          responseText += `- リクエストボディ: \`${JSON.stringify(data)}\`\n`;
        }
        
        responseText += `\n## レスポンスデータ\n\n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\`\n`;
        
        return {
          content: [
            {
              type: 'text',
              text: responseText
            }
          ]
        };
      } catch (error) {
        console.error(`[ERROR] API request failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `API リクエスト失敗: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
}

/**
 * Register API info tools
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiInfoTools(
  mcpServer: McpServer,
  apiService: ApiService
): void {
  console.error('[INFO] Registering API info tools');
  
  // API Info tool - Get Smaregi API Overview
  mcpServer.tool(
    'getSmaregiApiOverview',
    'スマレジAPIの概要情報を取得します。',
    {
      category: z.string().optional().describe('情報を取得したいカテゴリ'),
    },
    async ({ category }) => {
      try {
        // Get API overview from API service
        const overview = apiService.getApiCategoryOverview(category);
        
        if (!overview) {
          return {
            content: [
              {
                type: 'text',
                text: `API情報が見つかりません: ${category || 'すべてのカテゴリ'}`
              }
            ],
            isError: true
          };
        }
        
        // Format the overview
        let title = '# スマレジAPI 概要';
        if (category) {
          title = `# スマレジAPI ${category.toUpperCase()} 概要`;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `${title}\n\n${overview}`
            }
          ]
        };
      } catch (error) {
        console.error(`[ERROR] API overview retrieval failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `API情報取得エラー: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
  
  // API Info tool - List API Endpoints
  mcpServer.tool(
    'listApiEndpoints',
    'スマレジAPIのエンドポイント一覧を取得します。',
    {
      category: z.string().describe('APIカテゴリ（例："pos", "auth", "system"）'),
    },
    async ({ category }) => {
      try {
        // Get API paths from API service
        const paths = apiService.getApiPaths(category);
        
        if (!paths || paths.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `カテゴリ「${category}」のエンドポイントが見つかりません。`
              }
            ],
            isError: true
          };
        }
        
        // Format the paths
        let content = `# ${category.toUpperCase()} APIエンドポイント一覧\n\n`;
        
        paths.forEach(path => {
          content += `## ${path.name}\n`;
          if (path.description) {
            content += `${path.description}\n\n`;
          }
          content += `- エンドポイント: \`${path.method} ${path.path}\`\n`;
          content += `- リソースURI: \`smaregi://api/${category}/${path.name}\`\n\n`;
        });
        
        return {
          content: [
            {
              type: 'text',
              text: content
            }
          ]
        };
      } catch (error) {
        console.error(`[ERROR] List API endpoints failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `APIエンドポイント一覧取得エラー: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
}

/**
 * Register generated API tools
 * @param mcpServer - The MCP server instance
 * @param apiToolGenerator - The API tool generator
 * @param apiService - The API service
 * @returns Number of registered tools
 */
async function registerGeneratedApiTools(
  mcpServer: McpServer,
  apiToolGenerator: ApiToolGenerator,
  apiService: ApiService
): Promise<number> {
  try {
    console.error('[INFO] Registering generated API tools...');
    
    // Generate API tools
    const tools = apiToolGenerator.generateTools();
    
    // Register each tool
    for (const tool of tools) {
      console.error(`[DEBUG] Registering tool: ${tool.name}`);
      
      // Convert parameters to Zod schema
      const paramsSchema: Record<string, z.ZodTypeAny> = {};
      
      // Always add sessionId parameter
      paramsSchema['sessionId'] = z.string().describe('認証済みのセッションID');
      
      tool.parameters.forEach(param => {
        // Use default z.string() if schema is not set
        const schema = param.schema || z.string();
        
        if (param.required) {
          paramsSchema[param.name] = schema.describe(param.description);
        } else {
          paramsSchema[param.name] = schema.optional().describe(param.description);
        }
      });
      
      // Register tool
      mcpServer.tool(
        tool.name,
        tool.description,
        paramsSchema,
        async (params) => {
          try {
            // Classify parameters as path, query, or body
            const pathParams: Record<string, any> = {};
            const queryParams: Record<string, any> = {};
            let bodyParams: Record<string, any> | undefined = undefined;
            
            // Distribute parameters to appropriate categories
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
            
            console.error(`[DEBUG] API call: ${tool.method} ${tool.path}`);
            console.error(`[DEBUG] Path params: ${JSON.stringify(pathParams)}`);
            console.error(`[DEBUG] Query params: ${JSON.stringify(queryParams)}`);
            if (bodyParams) {
              console.error(`[DEBUG] Body params: ${JSON.stringify(bodyParams)}`);
            }
            
            // Execute API request via API service
            const response = await apiService.executeRequest({
              sessionId: params.sessionId,
              endpoint: tool.path,
              method: tool.method,
              data: bodyParams,
              path: pathParams,
              query: queryParams
            });
            
            // Format response with markdown
            let content = `# ${tool.name} レスポンス\n\n`;
            content += `## リクエスト情報\n`;
            content += `- エンドポイント: \`${tool.path}\`\n`;
            content += `- メソッド: \`${tool.method}\`\n\n`;
            content += `## レスポンスデータ\n\n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\`\n`;
            
            return {
              content: [
                {
                  type: 'text',
                  text: content
                }
              ]
            };
          } catch (error) {
            console.error(`[ERROR] Tool execution error (${tool.name}): ${error}`);
            return {
              content: [
                {
                  type: 'text',
                  text: `Error executing ${tool.name}: ${error instanceof Error ? error.message : String(error)}`
                }
              ],
              isError: true
            };
          }
        }
      );
    }
    
    console.error(`[INFO] Registered ${tools.length} API tools`);
    return tools.length;
  } catch (error) {
    console.error(`[ERROR] Failed to register API tools: ${error}`);
    return 0;
  }
}
