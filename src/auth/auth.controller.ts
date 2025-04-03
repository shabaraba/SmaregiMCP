import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const sessionId = await this.authService.handleCallback(code, state);
      
      // 認証成功ページを表示
      res.send(`
        <html>
          <head>
            <title>認証成功</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #4CAF50; }
              .box { border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 4px; }
              code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
            </style>
          </head>
          <body>
            <h1>認証が完了しました</h1>
            <p>Claudeに戻って会話を続けてください。</p>
            <div class="box">
              <p>セッションID: <code>${sessionId}</code></p>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('認証エラー:', error);
      res.status(500).send(`
        <html>
          <head>
            <title>認証エラー</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #f44336; }
            </style>
          </head>
          <body>
            <h1>認証エラー</h1>
            <p>${error.message || '認証処理中にエラーが発生しました'}</p>
          </body>
        </html>
      `);
    }
  }
}
