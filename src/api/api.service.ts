import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
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
   * API リクエストを実行
   */
  async executeRequest(params: ApiRequestInterface & { sessionId: string }): Promise<any> {
    const { sessionId, endpoint, method, data } = params;
    
    // 有効なアクセストークンを取得
    const accessToken = await this.authService.getValidAccessToken(sessionId);
    
    // APIエンドポイント
    const contractId = this.configService.get('CONTRACT_ID', '');
    const baseUrl = this.configService.get('SMAREGI_API_URL', 'https://api.smaregi.dev');
    const url = `${baseUrl}/${contractId}${endpoint}`;
    
    // リクエストオプション
    const options = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    
    try {
      let response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await lastValueFrom(this.httpService.get(url, options));
          break;
        case 'POST':
          response = await lastValueFrom(this.httpService.post(url, data, options));
          break;
        case 'PUT':
          response = await lastValueFrom(this.httpService.put(url, data, options));
          break;
        case 'DELETE':
          response = await lastValueFrom(this.httpService.delete(url, options));
          break;
        default:
          throw new Error(`サポートされていないHTTPメソッド: ${method}`);
      }
      
      return response.data;
    } catch (error: unknown) {
      console.error('API実行エラー:', error);
      // エラーオブジェクトの型を適切に処理
      const errorMessage = error instanceof Error 
        ? error.message 
        : '不明なエラー';
      
      // response プロパティへのアクセスを型安全に行う
      const responseError = error as { response?: { data?: { title?: string } } };
      const errorTitle = responseError.response?.data?.title;
      
      throw new Error(
        `APIリクエスト失敗: ${errorTitle || errorMessage}`,
      );
    }
  }
}
