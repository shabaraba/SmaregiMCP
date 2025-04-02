import { Injectable } from '@nestjs/common';

@Injectable()
export class ToolsService {
  /**
   * 利用可能なツール一覧を取得
   */
  getTools() {
    return [
      // 認証ツール
      {
        name: 'getAuthorizationUrl',
        description: 'スマレジAPIにアクセスするための認証URLを生成します。ユーザーはこのURLでブラウザにアクセスして認証を完了する必要があります。',
        inputSchema: {
          type: 'object',
          properties: {
            scopes: {
              type: 'array',
              items: { type: 'string' },
              description: '要求するスコープのリスト（例：["pos.products:read", "pos.transactions:read"]）',
            },
          },
          required: ['scopes'],
        },
      },
      
      {
        name: 'checkAuthStatus',
        description: '認証状態を確認します。ユーザーが認証URLで認証を完了したかどうかを確認できます。',
        inputSchema: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: 'getAuthorizationUrlで取得したセッションID',
            },
          },
          required: ['sessionId'],
        },
      },
      
      {
        name: 'executeApiRequest',
        description: 'スマレジAPIにリクエストを送信します。認証済みのセッションが必要です。',
        inputSchema: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: '認証済みのセッションID',
            },
            endpoint: {
              type: 'string',
              description: 'APIエンドポイント（例："/pos/products"）',
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE'],
              description: 'HTTPメソッド',
            },
            data: {
              type: 'object',
              description: 'リクエストボディ（POSTまたはPUTリクエスト用）',
            },
          },
          required: ['sessionId', 'endpoint', 'method'],
        },
      },
      
      // スマレジAPI情報ツール
      {
        name: 'getSmaregiApiOverview',
        description: 'スマレジAPIの概要情報を取得します。',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: '情報を取得したいカテゴリ',
            },
          },
          required: [],
        },
      },
      
      // 他のAPIツール
      {
        name: 'getSmaregiApiOperation',
        description: 'スマレジAPIの特定のエンドポイントに関する詳細情報を取得します。',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'APIエンドポイントのパス',
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE'],
              description: 'HTTPメソッド',
            },
          },
          required: ['path', 'method'],
        },
      },
      
      {
        name: 'listSmaregiApiEndpoints',
        description: 'スマレジAPIで利用可能なエンドポイントの一覧を取得します。',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'エンドポイントのカテゴリ',
            },
          },
          required: [],
        },
      },
    ];
  }
}
