import express from 'express';
import { Server } from 'http';
import { setupAuthRoutes } from './auth/auth-routes.js';
import { config } from '../utils/config.js';

/**
 * Express サーバーを作成して設定
 */
export function createExpressServer(): { app: express.Express; server: Server } {
  const app = express();
  
  // 基本設定
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // 認証ルートの設定
  setupAuthRoutes(app);
  
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
