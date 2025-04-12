import express from 'express';
import { Server } from 'http';
import { setupProxyAuthRoutes } from './auth/proxy-auth-routes.js';
import { config } from '../utils/config.js';
import { ProxyAuthService } from '../auth/proxy-auth-service.js';

/**
 * Proxy OAuthを使用したExpressサーバーを作成して設定
 */
export function createProxyExpressServer(): { app: express.Express; server: Server; authService: ProxyAuthService } {
  const app = express();
  
  // 基本設定
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // ヘルスチェック用のルート
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // 認証ルートの設定
  const authService = setupProxyAuthRoutes(app);
  
  // 基本のルート
  app.get('/', (req, res) => {
    res.send('Smaregi MCP Server is running with Proxy OAuth Provider');
  });
  
  // サーバーを作成
  const server = app.listen(config.port, () => {
    console.error(`[INFO] Proxy Express server is running on port ${config.port}`);
  });
  
  return { app, server, authService };
}
