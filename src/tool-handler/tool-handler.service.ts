import { Injectable, Logger } from '@nestjs/common';
import { ApiService } from '../api/api.service.js';
import { AuthService } from '../auth/auth.service.js';

/**
 * MCPツールから呼び出されるリクエストを処理するサービス
 */
@Injectable()
export class ToolHandlerService {
  private readonly logger = new Logger(ToolHandlerService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {}

  /**
   * エラーメッセージを安全に取得する
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message);
    } else {
      return String(error);
    }
  }

  /**
   * 認証URLを取得する
   */
  async handleGetAuthorizationUrl(params: { scopes: string[] }): Promise<any> {
    try {
      const { scopes } = params;
      return await this.authService.generateAuthUrl(scopes);
    } catch (error: unknown) {
      this.logger.error(`認証URL生成エラー: ${error}`);
      throw new Error(`認証URLの生成に失敗しました: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * 認証状態を確認する
   */
  async handleCheckAuthStatus(params: { sessionId: string }): Promise<any> {
    try {
      const { sessionId } = params;
      return await this.authService.checkAuthStatus(sessionId);
    } catch (error: unknown) {
      this.logger.error(`認証状態確認エラー: ${error}`);
      throw new Error(`認証状態の確認に失敗しました: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * APIリクエストを実行する
   */
  async handleExecuteApiRequest(params: {
    sessionId: string;
    endpoint: string;
    method: string;
    data?: any;
    query?: Record<string, any>;
    path?: Record<string, any>;
  }): Promise<any> {
    try {
      const { sessionId, endpoint, method, data, query, path } = params;
      
      // セッションIDからアクセストークンを取得
      const token = await this.authService.getValidAccessToken(sessionId);
      
      if (!token) {
        throw new Error('有効なアクセストークンが見つかりません。再認証が必要です。');
      }
      
      // エンドポイントからパスパラメータを処理
      let processedEndpoint = endpoint;
      
      // パスパラメータの置換
      if (path && Object.keys(path).length > 0) {
        for (const [key, value] of Object.entries(path)) {
          processedEndpoint = processedEndpoint.replace(`{${key}}`, encodeURIComponent(String(value)));
        }
      }
      
      // APIリクエストを実行
      return await this.apiService.executeRequest({
        sessionId,
        endpoint: processedEndpoint,
        method,
        data,
        query,
        path
      });
    } catch (error: unknown) {
      this.logger.error(`APIリクエスト実行エラー: ${error}`);
      throw new Error(`APIリクエストの実行に失敗しました: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * スマレジAPIの概要情報を取得する
   */
  async handleGetSmaregiApiOverview(params: { category?: string }): Promise<any> {
    try {
      // 概要情報はモックデータを返す（実際のデータはOpenAPI定義から生成する）
      return {
        name: 'Smaregi Platform API',
        description: 'スマレジプラットフォームAPIの概要情報',
        version: '1.0.0',
        categories: [
          {
            name: 'pos',
            description: 'POS APIエンドポイント',
            endpoints: 25
          },
          {
            name: 'account',
            description: 'アカウント関連APIエンドポイント',
            endpoints: 8
          }
        ],
        ...params.category ? {
          selectedCategory: params.category,
          categoryInfo: {
            name: params.category,
            description: `${params.category} カテゴリの情報`,
            endpoints: params.category === 'pos' ? 25 : 8
          }
        } : {}
      };
    } catch (error: unknown) {
      this.logger.error(`API概要情報取得エラー: ${error}`);
      throw new Error(`API概要情報の取得に失敗しました: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * スマレジAPIのエンドポイント一覧を取得する
   */
  async handleListSmaregiApiEndpoints(params: { category?: string }): Promise<any> {
    try {
      // エンドポイント一覧はモックデータを返す（実際のデータはOpenAPI定義から生成する）
      const posEndpoints = [
        { path: '/pos/products', methods: ['GET', 'POST'], description: '商品情報API' },
        { path: '/pos/products/{productId}', methods: ['GET', 'PUT', 'DELETE'], description: '商品詳細API' },
        { path: '/pos/transactions', methods: ['GET'], description: '取引履歴API' }
      ];
      
      const accountEndpoints = [
        { path: '/account/users', methods: ['GET'], description: 'ユーザー一覧API' },
        { path: '/account/contracts', methods: ['GET'], description: '契約情報API' }
      ];
      
      if (params.category) {
        return {
          category: params.category,
          endpoints: params.category === 'pos' ? posEndpoints : accountEndpoints
        };
      }
      
      return {
        categories: ['pos', 'account'],
        endpoints: {
          pos: posEndpoints,
          account: accountEndpoints
        }
      };
    } catch (error: unknown) {
      this.logger.error(`APIエンドポイント一覧取得エラー: ${error}`);
      throw new Error(`APIエンドポイント一覧の取得に失敗しました: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * スマレジAPIの操作詳細を取得する
   */
  async handleGetSmaregiApiOperation(params: { path: string; method: string }): Promise<any> {
    try {
      const { path, method } = params;
      
      // エンドポイント詳細はモックデータを返す（実際のデータはOpenAPI定義から生成する）
      const operations = {
        '/pos/products': {
          'GET': {
            summary: '商品一覧を取得',
            description: '登録されている商品情報の一覧を取得します。',
            parameters: [
              { name: 'limit', in: 'query', description: '取得する件数', type: 'integer' },
              { name: 'offset', in: 'query', description: '取得開始位置', type: 'integer' },
              { name: 'fields', in: 'query', description: '取得するフィールド', type: 'string' }
            ],
            responses: {
              '200': { description: '商品一覧取得成功' }
            }
          },
          'POST': {
            summary: '商品を登録',
            description: '新しい商品情報を登録します。',
            requestBody: {
              description: '商品情報',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      productName: { type: 'string', description: '商品名' },
                      price: { type: 'integer', description: '価格' }
                    },
                    required: ['productName']
                  }
                }
              }
            },
            responses: {
              '201': { description: '商品登録成功' }
            }
          }
        },
        '/pos/products/{productId}': {
          'GET': {
            summary: '商品詳細を取得',
            description: '特定の商品の詳細情報を取得します。',
            parameters: [
              { name: 'productId', in: 'path', description: '商品ID', required: true, type: 'string' }
            ],
            responses: {
              '200': { description: '商品詳細取得成功' },
              '404': { description: '商品が見つかりません' }
            }
          }
        }
      };
      
      // 指定されたパスとメソッドの操作を取得
      const operation = operations[path]?.[method.toUpperCase()];
      
      if (!operation) {
        return {
          error: '指定されたパスとメソッドの操作が見つかりません',
          availablePaths: Object.keys(operations),
          availableMethods: path in operations ? Object.keys(operations[path]) : []
        };
      }
      
      return {
        path,
        method: method.toUpperCase(),
        ...operation
      };
    } catch (error: unknown) {
      this.logger.error(`API操作詳細取得エラー: ${error}`);
      throw new Error(`API操作詳細の取得に失敗しました: ${this.getErrorMessage(error)}`);
    }
  }
}
