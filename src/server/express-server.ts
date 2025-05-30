import express from 'express';
import { Server } from 'http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { setupAuthRoutes } from './auth/auth-routes.js';
import { setupMcpOAuthRoutes } from './auth/mcp-oauth-routes.js';
import { setupMcpMetadataEndpoints } from './auth/mcp-metadata-handler.js';
import { setupSSEEndpoints } from './sse-server.js';
import { config } from '../utils/node-config.js';

/**
 * Express サーバーを作成して設定
 */
export function createExpressServer(mcpServer?: McpServer): { app: express.Express; server: Server } {
  const app = express();
  
  // 基本設定
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // MCP メタデータエンドポイント（最優先）
  setupMcpMetadataEndpoints(app);
  
  // 認証ルートの設定
  setupAuthRoutes(app);
  
  // MCP OAuth 2.1 ルートの設定
  setupMcpOAuthRoutes(app);
  
  // SSE エンドポイントの設定（MCPサーバーが提供されている場合）
  if (mcpServer) {
    setupSSEEndpoints(app, mcpServer);
  }
  
  // 基本のルート
  app.get('/', (req, res) => {
    res.send('Smaregi MCP Server is running');
  });
  
  // サーバーを作成
  const server = app.listen(config.port, () => {
    console.error(`[INFO] Express server is running on port ${config.port}`);
  });
  
  return { app, server };
}
