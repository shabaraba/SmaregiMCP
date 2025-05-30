import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as fs from 'fs';
import * as path from 'path';
import { ApiService } from '../api/api.service.js';
import { SchemaConverter } from '../conversion/schema-converter.js';
import { ApiToolGenerator } from '../conversion/tool-generator.js';

/**
 * Register all resources to the MCP server
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 * @param schemaConverter - The schema converter
 * @param apiToolGenerator - The API tool generator
 */
export async function registerResources(
  mcpServer: McpServer,
  apiService: ApiService,
  schemaConverter: SchemaConverter,
  apiToolGenerator: ApiToolGenerator
): Promise<void> {
  console.error('[INFO] Registering resources...');
  
  // Register API category resource template
  registerApiCategoryResource(mcpServer, apiService);
  
  // Register API path resource template
  registerApiPathResource(mcpServer, apiService);
  
  // Register document resources
  registerDocumentResources(mcpServer);
  
  await registerDynamicApiResources(mcpServer, apiService);
  
  console.error('[INFO] Resources registered successfully');
}

/**
 * Register API category resource template
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiCategoryResource(
  mcpServer: McpServer,
  apiService: ApiService
): void {
  console.error('[INFO] Registering API category resource template');
  
  mcpServer.resource(
    'api-category',
    new ResourceTemplate('smaregi://api/{category}', {
      list: async () => ({
        resources: [
          { uri: 'smaregi://api/pos', description: 'POSシステムAPI' },
          { uri: 'smaregi://api/auth', description: '認証API' },
          { uri: 'smaregi://api/system', description: 'システム管理API' },
        ]
      })
    }),
    async (uri, variables) => {
      const { category } = variables;
      
      try {
        // カテゴリが文字列配列の場合は最初の要素を使用
        const categoryStr = Array.isArray(category) ? category[0] : category;
        const overview = apiService.getApiCategoryOverview(categoryStr);
        
        if (!overview) {
          return {
            isError: true,
            error: {
              message: `Unknown API category: ${categoryStr}`
            }
          };
        }
        
        return {
          content: `# ${categoryStr.toUpperCase()} API\n\n${overview}`
        };
      } catch (error) {
        console.error(`[ERROR] Error retrieving category resource: ${error}`);
        return {
          isError: true,
          error: {
            message: `Error retrieving API category: ${error}`
          }
        };
      }
    }
  );
}

/**
 * Register API path resource template
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiPathResource(
  mcpServer: McpServer,
  apiService: ApiService
): void {
  console.error('[INFO] Registering API path resource template');
  
  mcpServer.resource(
    'api-path',
    new ResourceTemplate('smaregi://api/{category}/{path}', {
      list: async () => {
        // 固定のリソースリストを返す
        // 実際のクエリ時にはgetメソッドで動的にリソースを返す
        return {
          resources: [
            { uri: 'smaregi://api/pos/products', description: '商品API' },
            { uri: 'smaregi://api/pos/transactions', description: '取引API' },
            { uri: 'smaregi://api/pos/stocks', description: '在庫API' },
            { uri: 'smaregi://api/pos/stores', description: '店舗API' },
            { uri: 'smaregi://api/pos/customers', description: '顧客API' }
          ]
        };
      }
    }),
    async (uri, variables) => {
      const { category, path } = variables;
      // カテゴリとパスが文字列配列の場合は最初の要素を使用
      const categoryStr = Array.isArray(category) ? category[0] : category;
      const pathStr = Array.isArray(path) ? path[0] : path;
      
      try {
        const pathDetails = apiService.getApiPathDetails(categoryStr, pathStr);
        
        if (!pathDetails) {
          return {
            isError: true,
            error: {
              message: `Unknown API path: ${categoryStr}/${pathStr}`
            }
          };
        }
        
        // Format the path details into markdown
        const content = formatPathDetails(pathDetails);
        
        return { content };
      } catch (error) {
        console.error(`[ERROR] Error retrieving path resource: ${error}`);
        return {
          isError: true,
          error: {
            message: `Error retrieving API path ${categoryStr}/${pathStr}: ${error}`
          }
        };
      }
    }
  );
}

/**
 * Register document resources
 * @param mcpServer - The MCP server instance
 */
function registerDocumentResources(mcpServer: McpServer): void {
  console.error('[INFO] Registering document resources');
  
  // Register README document
  mcpServer.resource(
    'readme',
    'smaregi://docs/readme',
    async () => {
      return {
        content: `# スマレジAPI MCP

## 概要
このMCPサーバーはスマレジのPOS API仕様をClaudeに提供し、以下の機能を可能にします：

- スマレジAPI仕様の検索・参照
- リソースベースでのAPIアクセス
- OAuth認証プロセスの支援
- APIリクエストの実行

## 認証
スマレジAPIを使用するには、OAuth 2.0による認証が必要です。
以下のツールで認証プロセスを実行できます：

1. \`getAuthorizationUrl\` - 認証URLを生成
2. \`checkAuthStatus\` - 認証状態を確認

## APIアクセス
認証後、以下のようにAPIアクセスが可能です：

- リソースベース: \`smaregi://api/{category}/{path}\`
- ツールベース: \`executeApiRequest\` またはAPI固有ツール

## プロンプト
定義済みプロンプトを使用して一般的なタスクを実行できます：

- \`search-products\` - 商品検索
- \`analyze-sales\` - 売上分析

詳細は各リソースやツールのドキュメントを参照してください。`
      };
    }
  );
  
  // Register API overview document
  mcpServer.resource(
    'api-overview',
    'smaregi://docs/api-overview',
    async () => {
      return {
        content: `# スマレジAPI概要

スマレジAPIはREST APIであり、以下のカテゴリに分かれています：

## POSシステムAPI (pos)
スマレジのPOSシステムに関するAPIで、主に以下の機能を提供します：

- 商品管理 (products)
- 在庫管理 (stocks)
- 取引管理 (transactions)
- 顧客管理 (customers)
- 店舗管理 (stores)
- スタッフ管理 (staffs)

## 認証API (auth)
OAuth 2.0に基づく認証機能を提供します：

- 認証URLの生成
- アクセストークン取得
- トークン更新
- トークン無効化

## システム管理API (system)
システム設定やメタデータ関連のAPIです：

- アカウント情報
- 契約情報
- マスタデータ

各カテゴリの詳細は \`smaregi://api/{category}\` リソースで確認できます。`
      };
    }
  );
  
  // Register Authentication document
  mcpServer.resource(
    'auth-guide',
    'smaregi://docs/authentication',
    async () => {
      return {
        content: `# スマレジAPI認証ガイド

スマレジAPIはOAuth 2.0を使用して認証を行います。認証フローは以下の通りです：

## 1. 認証URLの取得
\`getAuthorizationUrl\` ツールを使用して認証URLを取得します：

\`\`\`
{
  "scopes": ["pos.products:read", "pos.transactions:read"]
}
\`\`\`

このURLをブラウザで開き、スマレジアカウントでログインします。

## 2. 認証状態の確認
\`checkAuthStatus\` ツールを使用して認証が完了したか確認します：

\`\`\`
{
  "sessionId": "前のステップで取得したsessionId"
}
\`\`\`

## 3. API呼び出し
認証が完了したら、\`executeApiRequest\` ツールを使用してAPIを呼び出せます：

\`\`\`
{
  "sessionId": "認証済みのsessionId",
  "endpoint": "/pos/products",
  "method": "GET",
  "query": { "limit": 10 }
}
\`\`\`

## 認証情報の保存
認証情報はローカルのSQLiteデータベースに暗号化して保存されます。セッションの有効期限は24時間です。`
      };
    }
  );
}

/**
 * Format API path details into markdown
 * @param pathDetails - The path details object
 * @returns Formatted markdown content
 */
function formatPathDetails(pathDetails: any): string {
  if (!pathDetails) return '';
  
  let content = `# ${pathDetails.name}\n\n`;
  
  if (pathDetails.description) {
    content += `${pathDetails.description}\n\n`;
  }
  
  content += `## エンドポイント\n\`${pathDetails.method} ${pathDetails.path}\`\n\n`;
  
  if (pathDetails.parameters && pathDetails.parameters.length > 0) {
    content += '## パラメータ\n\n';
    
    // Group parameters by type
    const pathParams = pathDetails.parameters.filter((p: any) => p.in === 'path');
    const queryParams = pathDetails.parameters.filter((p: any) => p.in === 'query');
    const bodyParams = pathDetails.parameters.filter((p: any) => p.in === 'body');
    
    if (pathParams.length > 0) {
      content += '### パスパラメータ\n\n';
      pathParams.forEach((param: any) => {
        content += `- \`${param.name}\`: ${param.description || '説明なし'} ${param.required ? '(必須)' : '(任意)'}\n`;
      });
      content += '\n';
    }
    
    if (queryParams.length > 0) {
      content += '### クエリパラメータ\n\n';
      queryParams.forEach((param: any) => {
        content += `- \`${param.name}\`: ${param.description || '説明なし'} ${param.required ? '(必須)' : '(任意)'}\n`;
      });
      content += '\n';
    }
    
    if (bodyParams.length > 0) {
      content += '### ボディパラメータ\n\n';
      bodyParams.forEach((param: any) => {
        content += `- \`${param.name}\`: ${param.description || '説明なし'} ${param.required ? '(必須)' : '(任意)'}\n`;
      });
      content += '\n';
    }
  }
  
  if (pathDetails.responses) {
    content += '## レスポンス\n\n';
    
    Object.entries(pathDetails.responses).forEach(([code, response]: [string, any]) => {
      content += `### ${code} ${response.description || ''}\n\n`;
      
      if (response.example) {
        content += '```json\n';
        content += JSON.stringify(response.example, null, 2);
        content += '\n```\n\n';
      }
    });
  }
  
  return content;
}

/**
 * APIエンドポイント情報インターフェース
 */
interface ApiEndpoint {
  path: string;
  method: string;
  operationId: string;
  description: string;
  tag: string;
  parameters: ApiEndpointParameter[];
  requestBody: boolean;
  responseType?: string;
}

/**
 * APIエンドポイントパラメータインターフェース
 */
interface ApiEndpointParameter {
  name: string;
  in: string;
  required: boolean;
  description: string;
  schema: any;
}

/**
 * OpenAPI定義から動的にAPIリソースを登録
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
async function registerDynamicApiResources(
  mcpServer: McpServer,
  apiService: ApiService
): Promise<void> {
  try {
    console.error('[INFO] Registering dynamic API resources...');
    
    const endpointsJsonPath = path.resolve(process.cwd(), 'src', 'tools', 'generated', 'api-endpoints.json');
    
    if (!fs.existsSync(endpointsJsonPath)) {
      console.error(`[ERROR] API endpoints JSON file not found: ${endpointsJsonPath}`);
      console.error('[INFO] Skipping dynamic API resource registration');
      return;
    }
    
    try {
      const endpointsJson = fs.readFileSync(endpointsJsonPath, 'utf8');
      const endpoints = JSON.parse(endpointsJson) as ApiEndpoint[];
      
      console.error(`[INFO] Loaded ${endpoints.length} API endpoints from JSON file`);
      
      const endpointsByCategory = new Map<string, ApiEndpoint[]>();
      
      for (const endpoint of endpoints) {
        const category = endpoint.tag || 'default';
        
        if (!endpointsByCategory.has(category)) {
          endpointsByCategory.set(category, []);
        }
        
        endpointsByCategory.get(category)!.push(endpoint);
      }
      
      for (const [category, categoryEndpoints] of endpointsByCategory.entries()) {
        console.error(`[INFO] Registering resources for category: ${category}`);
        
        mcpServer.resource(
          `api-${category}`,
          `smaregi://api/${category}`,
          async (uri, extra) => {
            try {
              const overview = apiService.getApiCategoryOverview(category);
              
              const endpointList = categoryEndpoints.map(endpoint => ({
                name: endpoint.operationId,
                path: endpoint.path,
                method: endpoint.method,
                description: endpoint.description,
              }));
              
              return {
                content: {
                  overview,
                  endpoints: endpointList,
                },
              };
            } catch (error) {
              console.error(`[ERROR] Error reading category resource ${category}:`, error);
              return {
                content: {
                  error: `Failed to read ${category} resource: ${error}`,
                },
                isError: true,
              };
            }
          }
        );
        
        for (const endpoint of categoryEndpoints) {
          mcpServer.resource(
            `api-${category}-${endpoint.operationId}`,
            `smaregi://api/${category}/${endpoint.operationId}`,
            async (uri, extra) => {
              try {
                const pathParams = endpoint.parameters.filter(p => p.in === 'path');
                const queryParams = endpoint.parameters.filter(p => p.in === 'query');
                const bodyParams = endpoint.parameters.filter(p => p.in === 'body');
                
                return {
                  content: {
                    endpoint: endpoint.path,
                    method: endpoint.method,
                    description: endpoint.description,
                    operationId: endpoint.operationId,
                    pathParameters: pathParams,
                    queryParameters: queryParams,
                    bodyParameters: bodyParams,
                    toolName: endpoint.operationId,
                  },
                };
              } catch (error) {
                console.error(`[ERROR] Error reading endpoint resource ${endpoint.operationId}:`, error);
                return {
                  content: {
                    error: `Failed to read ${endpoint.operationId} resource: ${error}`,
                  },
                  isError: true,
                };
              }
            }
          );
        }
      }
      
      console.error(`[INFO] Registered resources for ${endpointsByCategory.size} categories`);
    } catch (error) {
      console.error(`[ERROR] Failed to parse API endpoints JSON: ${error}`);
      console.error('[INFO] Skipping dynamic API resource registration');
    }
  } catch (error) {
    console.error('[ERROR] Failed to register dynamic API resources:', error);
  }
}
