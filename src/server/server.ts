import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { SchemaConverter } from '../conversion/schema-converter.js';
import { ApiToolGenerator } from '../conversion/tool-generator.js';
import { AuthService } from '../auth/auth.service.js';
import { ApiService } from '../api/api.service.js';
import { packageInfo } from '../utils/package-info.js';

// Schema for resource listing
const ListResourcesRequestSchema = z.object({
  method: z.literal('resources/list'),
  params: z.object({}),
});

// Schema for prompts listing
const ListPromptsRequestSchema = z.object({
  method: z.literal('prompts/list'),
  params: z.object({}),
});

// Schema for prompt retrieval
const GetPromptRequestSchema = z.object({
  method: z.literal('prompts/get'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.any()).optional(),
  }),
});

/**
 * MCP Server creation function
 * Creates and configures an MCP server instance
 */
export async function createServer() {
  console.error('[INFO] Creating MCP server...');
  
  // Create MCP Server instance
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
  
  // Initialize services
  const schemaConverter = new SchemaConverter();
  const apiToolGenerator = new ApiToolGenerator(schemaConverter);
  const authService = new AuthService();
  const apiService = new ApiService(authService);
  
  // Set resource listing handler
  mcpServer.server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => {
      // Generate API resource templates and resources
      const resourceTemplates = [
        { template: 'smaregi://api/{category}/{path}', description: 'スマレジAPIリソース' }
      ];
      
      const resources = [
        { id: 'smaregi://api/pos/products', description: '商品情報へのアクセス' },
        { id: 'smaregi://api/pos/transactions', description: '取引データへのアクセス' },
        { id: 'smaregi://api/pos/stocks', description: '在庫データへのアクセス' },
        { id: 'smaregi://api/pos/stores', description: '店舗情報へのアクセス' },
        { id: 'smaregi://api/pos/customers', description: '顧客情報へのアクセス' }
      ];
      
      console.error(`[INFO] resources/list response: ${resourceTemplates.length} templates, ${resources.length} resources`);
      
      return {
        resourceTemplates,
        resources
      };
    }
  );
  
  // Set prompts listing handler
  mcpServer.server.setRequestHandler(
    ListPromptsRequestSchema,
    async () => {
      // Generate API prompts
      const prompts = [
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
        }
      ];
      
      console.error(`[INFO] prompts/list response: ${prompts.length} prompts`);
      
      return {
        prompts
      };
    }
  );
  
  // Set prompt retrieval handler
  mcpServer.server.setRequestHandler(
    GetPromptRequestSchema,
    async (request) => {
      const { name, arguments: promptArgs } = request.params;
      
      console.error(`[INFO] prompts/get request: ${name}`);
      
      // Find prompt by name
      const allPrompts = [
        {
          name: 'search-products',
          description: '商品を検索',
          is_user_prompt_template: true,
          sample_user_prompts: ['商品を検索して', '在庫のある商品を教えて']
        },
        {
          name: 'analyze-sales',
          description: '売上データを分析',
          is_user_prompt_template: true,
          sample_user_prompts: ['売上分析をして', '今週の売上を見せて']
        }
      ];
      
      const promptDef = allPrompts.find(p => p.name === name);
      
      if (!promptDef) {
        throw new Error(`プロンプト "${name}" が見つかりません`);
      }
      
      // Generate message based on prompt template
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
  
  // Authentication tool - Get Authorization URL
  mcpServer.tool(
    'getAuthorizationUrl',
    'スマレジAPIにアクセスするための認証URLを生成します。ユーザーはこのURLでブラウザにアクセスして認証を完了する必要があります。',
    {
      scopes: z.array(z.string()).describe('要求するスコープのリスト（例：["pos.products:read", "pos.transactions:read"]）'),
    },
    async ({ scopes }) => {
      // Get authorization URL from auth service
      const result = await authService.getAuthorizationUrl(scopes);
      return {
        content: [
          {
            type: 'text',
            text: result.url,
          }
        ]
      };
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
      // Check auth status from auth service
      const result = await authService.checkAuthStatus(sessionId);
      return {
        content: [
          {
            type: 'text',
            text: result.isAuthenticated 
              ? '認証が完了しています。APIリクエストを実行できます。' 
              : '認証が完了していません。ユーザーはまだ認証URLでの認証を完了していません。',
          }
        ]
      };
    }
  );
  
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
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            }
          ]
        };
      } catch (error) {
        console.error(`[ERROR] API request failed: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `API request failed: ${error}`,
            }
          ],
          isError: true
        };
      }
    }
  );
  
  // API Info tool - Get Smaregi API Overview
  mcpServer.tool(
    'getSmaregiApiOverview',
    'スマレジAPIの概要情報を取得します。',
    {
      category: z.string().optional().describe('情報を取得したいカテゴリ'),
    },
    async ({ category }) => {
      // Get API overview from API service
      const overview = apiService.getApiOverview(category);
      return {
        content: [
          {
            type: 'text',
            text: overview,
          }
        ]
      };
    }
  );
  
  // Register API tools dynamically
  await registerApiTools(mcpServer, apiToolGenerator, apiService);
  
  console.error('[INFO] MCP server created and configured successfully');
  
  return { 
    server: mcpServer.server,
    mcpServer 
  };
}

/**
 * Register API tools dynamically
 */
async function registerApiTools(
  mcpServer: McpServer, 
  apiToolGenerator: ApiToolGenerator,
  apiService: ApiService
): Promise<number> {
  try {
    console.error('[INFO] Registering API tools...');
    
    // Generate API tools
    const tools = apiToolGenerator.generateTools();
    
    // Register each tool
    for (const tool of tools) {
      console.error(`[DEBUG] Registering tool: ${tool.name}`);
      
      // Convert parameters to Zod schema
      const paramsSchema: Record<string, z.ZodTypeAny> = {};
      
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
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response, null, 2),
                }
              ]
            };
          } catch (error) {
            console.error(`[ERROR] Tool execution error (${tool.name}): ${error}`);
            return {
              content: [
                {
                  type: 'text',
                  text: `Error executing ${tool.name}: ${error}`,
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
