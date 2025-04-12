import express from 'express';
import { ProxyAuthService } from '../../auth/proxy-auth-service.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESモジュール対応のパス解決
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTMLテンプレートの読み込み
const successTemplate = fs.readFileSync(path.join(__dirname, 'auth-success.html'), 'utf8');
const errorTemplate = fs.readFileSync(path.join(__dirname, 'auth-error.html'), 'utf8');

/**
 * ProxyAuthServiceを使用した認証ルートの設定
 */
export function setupProxyAuthRoutes(app: express.Express): ProxyAuthService {
  const authService = new ProxyAuthService();
  
  // コールバック処理用のルート
  app.get('/auth/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;
    
    console.error(`[INFO] Received auth callback. Code: ${code ? 'present' : 'missing'}, State: ${state ? 'present' : 'missing'}`);
    
    // エラーがある場合
    if (error) {
      console.error(`[ERROR] Auth callback error: ${error} - ${error_description}`);
      const errorHtml = errorTemplate.replace(
        '{{ERROR_MESSAGE}}', 
        `${error}${error_description ? `: ${error_description}` : ''}`
      );
      return res.status(400).send(errorHtml);
    }
    
    // コードまたはステートがない場合
    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      console.error('[ERROR] Auth callback missing code or state');
      const errorHtml = errorTemplate.replace(
        '{{ERROR_MESSAGE}}', 
        '認証コードまたは状態パラメータが不足しています'
      );
      return res.status(400).send(errorHtml);
    }
    
    try {
      // 認証コードを処理
      await authService.handleCallback(code, state);
      
      console.error('[INFO] Auth callback processed successfully');
      
      // 成功ページを返す
      res.status(200).send(successTemplate);
    } catch (error) {
      console.error(`[ERROR] Auth callback processing error: ${error}`);
      const errorHtml = errorTemplate.replace(
        '{{ERROR_MESSAGE}}', 
        `${error instanceof Error ? error.message : String(error)}`
      );
      res.status(500).send(errorHtml);
    }
  });
  
  return authService;
}
