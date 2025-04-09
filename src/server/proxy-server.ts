import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SchemaConverter } from '../conversion/schema-converter.js';
import { ApiToolGenerator } from '../conversion/tool-generator.js';
import { ApiService } from '../api/api.service.js';
import { packageInfo } from '../utils/package-info.js';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';
import { registerPrompts } from './prompts.js';
import { createProxyExpressServer } from './proxy-express-server.js';
import { ProxyAuthService } from '../auth/proxy-auth-service.js';

/**
 * ProxyOAuthProviderを使用したMCPサーバー作成関数
 * ProxyOAuthProviderを使用して認証を処理します
 */
export async function createProxyServer() {
  console.error('[INFO] Creating MCP server with Proxy OAuth Provider...');
  
  // Expressサーバーと認証サービスを作成
  const { server: expressServer, authService } = createProxyExpressServer();
  
  // プロバイダーの取得
  const proxyProvider = authService.getProvider();
  
  // Create MCP Server instance with the provider
  const mcpServer = new McpServer(
    {
      name: 'smaregi',
      version: packageInfo.version,
      provider: proxyProvider
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
  const apiService = new ApiService(authService as any); // ProxyAuthServiceはAuthServiceと同じインターフェースを提供
  
  // Set default request handlers
  setupDefaultHandlers(mcpServer.server);
  
  // Register resources, tools, and prompts
  await registerResources(mcpServer, apiService, schemaConverter, apiToolGenerator);
  await registerTools(mcpServer, authService as any, apiService, apiToolGenerator);
  await registerPrompts(mcpServer);
  
  console.error('[INFO] MCP server with Proxy OAuth Provider created and configured successfully');
  
  return { 
    server: mcpServer.server,
    mcpServer,
    expressServer
  };
}

/**
 * Setup default request handlers for resources and prompts listing
 * @param server - The MCP server instance
 */
function setupDefaultHandlers(server: any) {
  // リソースとプロンプトのデフォルトハンドラは、既存の実装に委任
  // resources.ts, prompts.tsで設定されるため、ここでは重複して設定しない
  console.error('[INFO] Default handlers will be set by resources.ts and prompts.ts');
}
