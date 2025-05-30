import { z } from 'zod';
import { AuthService } from '../auth/auth.service.js';

/**
 * 認証ヘルパーツール
 * ユーザーが簡単に認証を開始できるようにする
 */
export class AuthHelperTool {
  name = 'authenticate_smaregi';
  description = 'スマレジのOAuth認証を開始します。ブラウザで認証画面が開きます。';
  
  parameters = [
    {
      name: 'action',
      description: '実行するアクション（start: 認証開始, status: 認証状態確認）',
      required: true,
      type: 'query' as const,
      schema: z.enum(['start', 'status'])
    }
  ];

  constructor(private authService: AuthService) {}

  async execute(args: any): Promise<any> {
    const { action } = args;

    if (action === 'start') {
      try {
        // 認証URLを生成
        const { url, sessionId } = await this.authService.getAuthorizationUrl(['pos.transactions:read']);
        
        // ブラウザで開くための指示を返す
        return {
          content: [{
            type: 'text',
            text: `🔐 **認証を開始します**

以下のURLをブラウザで開いて、スマレジアカウントでログインしてください：

**[認証URL]**
${url}

**手順：**
1. 上記URLをクリックまたはコピーしてブラウザで開く
2. スマレジアカウントでログイン
3. アプリケーションを承認
4. 認証が完了したら、このツールで \`action: status\` を実行して確認

**セッションID:** ${sessionId}

認証は一度だけ必要です。完了後は自動的にAPIアクセスが可能になります。`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `認証URL生成エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }

    if (action === 'status') {
      try {
        // 最新のセッションを取得して認証状態を確認
        const sessions = await this.authService.getAllSessions();
        const latestSession = sessions[0];
        
        if (!latestSession) {
          return {
            content: [{
              type: 'text',
              text: '❌ 認証されていません。`action: start` で認証を開始してください。'
            }]
          };
        }

        const status = await this.authService.checkAuthStatus(latestSession.sessionId);
        
        if (status.isAuthenticated) {
          return {
            content: [{
              type: 'text',
              text: `✅ **認証済み**

セッションID: ${status.sessionId}
有効期限: 約1時間

これでスマレジAPIツールを使用できます！
例: \`transactions_list\` ツールで取引一覧を取得`
            }]
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: '⏳ 認証処理中です。ブラウザで認証を完了してから、もう一度確認してください。'
            }]
          };
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `認証状態確認エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }

    return {
      content: [{
        type: 'text',
        text: '無効なアクションです。"start" または "status" を指定してください。'
      }],
      isError: true
    };
  }
}