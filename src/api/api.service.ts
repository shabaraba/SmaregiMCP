import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import createClient from 'openapi-fetch';
import { AuthService } from '../auth/auth.service.js';
import { ApiRequestInterface } from './interfaces/api-request.interface.js';

@Injectable()
export class ApiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}
  
  /**
   * openapi-fetchクライアントを作成
   */
  private createApiClient(baseUrl: string, accessToken: string) {
    return createClient({
      baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
  
  /**
   * パスパラメータを処理してエンドポイントを生成
   */
  private processPathParams(endpoint: string, params: Record<string, any>): string {
    let processedEndpoint = endpoint;
    
    // パスパラメータを置換 (例: /users/{userId} -> /users/123)
    Object.entries(params).forEach(([key, value]) => {
      processedEndpoint = processedEndpoint.replace(`{${key}}`, encodeURIComponent(String(value)));
    });
    
    return processedEndpoint;
  }

  /**
   * API リクエストを実行
   */
  async executeRequest(params: ApiRequestInterface & { sessionId: string }): Promise<any> {
    const { sessionId, endpoint, method, data, query, path } = params;
    
    // 有効なアクセストークンを取得
    const accessToken = await this.authService.getValidAccessToken(sessionId);
    
    // APIエンドポイント
    const contractId = this.configService.get('CONTRACT_ID', '');
    const baseUrl = this.configService.get('SMAREGI_API_URL', 'https://api.smaregi.dev');
    
    // パスパラメータの処理
    let processedEndpoint = endpoint;
    if (path) {
      processedEndpoint = this.processPathParams(endpoint, path);
    }
    
    // APIクライアントの作成
    const client = this.createApiClient(`${baseUrl}/${contractId}`, accessToken);
    
    try {
      let response;
      
      // typescriptの型検査を回避するために、any型で実行する
      const typedClient: any = client;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await typedClient.GET(processedEndpoint, { params: { query } });
          break;
        case 'POST':
          response = await typedClient.POST(processedEndpoint, { params: { query }, body: data });
          break;
        case 'PUT':
          response = await typedClient.PUT(processedEndpoint, { params: { query }, body: data });
          break;
        case 'DELETE':
          response = await typedClient.DELETE(processedEndpoint, { params: { query } });
          break;
        default:
          throw new Error(`サポートされていないHTTPメソッド: ${method}`);
      }
      
      if (response.error) {
        throw new Error(response.error.message || 'APIリクエストでエラーが発生しました');
      }
      
      return response.data;
    } catch (error: unknown) {
      console.error('API実行エラー:', error);
      
      // エラーオブジェクトの型を適切に処理
      const errorMessage = error instanceof Error 
        ? error.message 
        : '不明なエラー';
      
      throw new Error(`APIリクエスト失敗: ${errorMessage}`);
    }
  }
}
