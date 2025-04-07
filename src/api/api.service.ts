import createFetch from 'openapi-fetch';
import { AuthService } from '../auth/auth.service.js';
import { ApiRequestInterface, ApiServiceInterface } from './interfaces/api-request.interface.js';
import { config } from '../utils/config.js';
import axios from 'axios';

/**
 * Interface for request parameters
 */
interface ApiRequestParams extends ApiRequestInterface {
  sessionId: string;
}

/**
 * Handles API requests to Smaregi API
 */
export class ApiService implements ApiServiceInterface {
  
  constructor(private readonly authService: AuthService) {}
  
  /**
   * Create API client for TypeScript typed requests
   * @param sessionId - Session ID
   */
  private async createApiClient(sessionId: string) {
    const accessToken = await this.authService.getAccessToken(sessionId);
    if (!accessToken) {
      throw new Error('Not authenticated. Please complete authentication first.');
    }
    
    return createFetch({
      baseUrl: config.smaregiApiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  /**
   * Process path parameters in URL
   * @param url - URL with path parameters
   * @param pathParams - Path parameters
   */
  private processPathParams(url: string, pathParams?: Record<string, any>): string {
    if (!pathParams) return url;
    
    let processedUrl = url;
    for (const [key, value] of Object.entries(pathParams)) {
      const placeholder = `{${key}}`;
      processedUrl = processedUrl.replace(placeholder, encodeURIComponent(String(value)));
    }
    
    return processedUrl;
  }
  
  /**
   * Execute API request
   */
  async executeRequest(params: ApiRequestParams): Promise<any> {
    const { sessionId, endpoint, method, data, query, path } = params;
    
    // Get access token
    const accessToken = await this.authService.getAccessToken(sessionId);
    if (!accessToken) {
      throw new Error('Not authenticated. Please complete authentication first.');
    }
    
    try {
      // Process path parameters if any
      const url = this.processPathParams(`${config.smaregiApiUrl}${endpoint}`, path);
      
      console.error(`[INFO] Executing API request: ${method} ${url}`);
      
      // Prepare API request
      const requestConfig = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: query
      };
      
      let response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axios.get(url, requestConfig);
          break;
        case 'POST':
          response = await axios.post(url, data, requestConfig);
          break;
        case 'PUT':
          response = await axios.put(url, data, requestConfig);
          break;
        case 'DELETE':
          response = await axios.delete(url, requestConfig);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
      console.error(`[INFO] API request successful: ${method} ${endpoint}`);
      return response.data;
    } catch (error: unknown) {
      // Handle different types of errors
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        
        // Handle unauthorized error (token may be expired)
        if (statusCode === 401) {
          console.error('[ERROR] Unauthorized API request. Token may be expired.');
          throw new Error('Authentication expired. Please re-authenticate.');
        }
        
        console.error(`[ERROR] API request failed with status ${statusCode}: ${JSON.stringify(error.response.data)}`);
        throw new Error(`API error (${statusCode}): ${JSON.stringify(error.response.data)}`);
      } else if (error instanceof Error) {
        console.error(`[ERROR] API request failed: ${error.message}`);
        throw error;
      } else {
        console.error('[ERROR] Unknown API request error');
        throw new Error('Unknown API request error');
      }
    }
  }
  
  /**
   * Get API overview information
   */
  getApiOverview(category?: string): string {
    if (category) {
      return this.getApiCategoryOverview(category);
    }
    
    return 'スマレジAPIは、POSシステムおよび周辺サービスのデータにアクセスするためのAPIです。主なカテゴリとして、POS API（商品管理、在庫管理、取引管理）と共通API（店舗管理、スタッフ管理）があります。';
  }
  
  /**
   * Get API category overview information
   */
  getApiCategoryOverview(category: string): string {
    switch (category.toLowerCase()) {
      case 'pos':
        return 'スマレジPOS APIは、POSシステムのデータにアクセスするためのAPIです。商品管理、在庫管理、取引管理などの機能があります。';
      case 'auth':
        return 'スマレジ認証APIは、OAuth2.0に基づく認証機能を提供します。認証URLの生成、アクセストークン取得、トークン更新、トークン無効化などの機能があります。';
      case 'system':
        return 'スマレジシステム管理APIは、アカウント情報、契約情報、マスタデータなどシステム設定やメタデータ関連の機能を提供します。';
      case 'common':
        return 'スマレジ共通APIは、複数のサービスで共通して使用される機能を提供します。店舗管理、スタッフ管理などの機能があります。';
      default:
        return `${category}カテゴリに関する情報はありません。`;
    }
  }
  
  /**
   * Get API paths for a category
   */
  getApiPaths(category: string): Array<{ name: string; description: string; method: string; path: string }> {
    switch (category.toLowerCase()) {
      case 'pos':
        return [
          { name: 'products', description: '商品情報API', method: 'GET', path: '/pos/products' },
          { name: 'transactions', description: '取引API', method: 'GET', path: '/pos/transactions' },
          { name: 'stocks', description: '在庫API', method: 'GET', path: '/pos/stocks' },
          { name: 'stores', description: '店舗API', method: 'GET', path: '/pos/stores' },
          { name: 'customers', description: '顧客API', method: 'GET', path: '/pos/customers' }
        ];
      case 'auth':
        return [
          { name: 'token', description: 'トークン取得API', method: 'POST', path: '/auth/token' },
          { name: 'revoke', description: 'トークン無効化API', method: 'POST', path: '/auth/revoke' }
        ];
      case 'system':
        return [
          { name: 'account', description: 'アカウント情報API', method: 'GET', path: '/system/account' },
          { name: 'contracts', description: '契約情報API', method: 'GET', path: '/system/contracts' },
          { name: 'masters', description: 'マスタデータAPI', method: 'GET', path: '/system/masters' }
        ];
      default:
        return [];
    }
  }
  
  /**
   * Get API path details
   */
  getApiPathDetails(category: string, path: string): any {
    const paths = this.getApiPaths(category);
    const pathDetail = paths.find(p => p.name === path);
    
    if (!pathDetail) {
      return null;
    }
    
    // Return basic details with parameters and responses
    const details = {
      ...pathDetail,
      parameters: [],
      responses: {
        '200': {
          description: '成功レスポンス',
          example: {}
        },
        '400': {
          description: 'リクエストエラー',
          example: { error: 'Bad Request', message: 'Invalid parameters' }
        },
        '401': {
          description: '認証エラー',
          example: { error: 'Unauthorized', message: 'Authentication required' }
        }
      }
    };
    
    // Add parameters based on the path type
    switch (path) {
      case 'products':
        details.parameters = [
          { name: 'limit', in: 'query', description: '取得する件数', required: false },
          { name: 'offset', in: 'query', description: '開始位置', required: false },
          { name: 'product_id', in: 'query', description: '商品ID', required: false }
        ];
        details.responses['200'].example = this.getMockProducts();
        break;
      case 'transactions':
        details.parameters = [
          { name: 'limit', in: 'query', description: '取得する件数', required: false },
          { name: 'offset', in: 'query', description: '開始位置', required: false },
          { name: 'start_date', in: 'query', description: '開始日時', required: false },
          { name: 'end_date', in: 'query', description: '終了日時', required: false }
        ];
        details.responses['200'].example = this.getMockTransactions();
        break;
      case 'stores':
        details.parameters = [
          { name: 'limit', in: 'query', description: '取得する件数', required: false },
          { name: 'offset', in: 'query', description: '開始位置', required: false },
          { name: 'store_id', in: 'query', description: '店舗ID', required: false }
        ];
        details.responses['200'].example = this.getMockStores();
        break;
    }
    
    return details;
  }

  /**
   * Mock products data
   */
  private getMockProducts(): any {
    return {
      products: [
        {
          product_id: '1001',
          product_code: 'ITEM001',
          product_name: 'Tシャツ 白 Mサイズ',
          price: 2000,
          tax_rate: 10,
          stock: 50
        },
        {
          product_id: '1002',
          product_code: 'ITEM002',
          product_name: 'Tシャツ 黒 Mサイズ',
          price: 2000,
          tax_rate: 10,
          stock: 30
        },
        {
          product_id: '1003',
          product_code: 'ITEM003',
          product_name: 'ジーンズ 青 Mサイズ',
          price: 5000,
          tax_rate: 10,
          stock: 20
        }
      ],
      total: 3,
      limit: 100,
      offset: 0
    };
  }
  
  /**
   * Mock transactions data
   */
  private getMockTransactions(): any {
    return {
      transactions: [
        {
          transaction_id: '20001',
          store_id: '1',
          transaction_date: '2025-04-05T09:30:00+09:00',
          total_amount: 3300,
          payment_method: 'cash'
        },
        {
          transaction_id: '20002',
          store_id: '1',
          transaction_date: '2025-04-05T10:15:00+09:00',
          total_amount: 5500,
          payment_method: 'credit'
        },
        {
          transaction_id: '20003',
          store_id: '2',
          transaction_date: '2025-04-05T11:00:00+09:00',
          total_amount: 7700,
          payment_method: 'credit'
        }
      ],
      total: 3,
      limit: 100,
      offset: 0
    };
  }
  
  /**
   * Mock stores data
   */
  private getMockStores(): any {
    return {
      stores: [
        {
          store_id: '1',
          store_code: 'STORE001',
          store_name: '東京本店',
          tel: '03-1234-5678',
          address: '東京都渋谷区'
        },
        {
          store_id: '2',
          store_code: 'STORE002',
          store_name: '大阪支店',
          tel: '06-1234-5678',
          address: '大阪府大阪市'
        }
      ],
      total: 2,
      limit: 100,
      offset: 0
    };
  }
}
