import { AuthService } from '../auth/auth.service.js';

/**
 * Interface for request parameters
 */
interface ApiRequestParams {
  sessionId: string;
  endpoint: string;
  method: string;
  data?: any;
  query?: Record<string, any>;
  path?: Record<string, any>;
}

/**
 * Handles API requests to Smaregi API
 */
export class ApiService {
  private readonly baseUrl = 'https://api.smaregi.jp';
  
  constructor(private readonly authService: AuthService) {}
  
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
    
    // For Phase 1, we're just returning mock responses
    console.error(`[INFO] Would execute API request: ${method} ${endpoint}`);
    
    // Return mock response based on endpoint pattern
    if (endpoint.includes('products')) {
      return this.getMockProducts();
    } else if (endpoint.includes('transactions')) {
      return this.getMockTransactions();
    } else if (endpoint.includes('stores')) {
      return this.getMockStores();
    } else {
      return {
        message: `Mock response for ${method} ${endpoint}`,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Get API overview information
   */
  getApiOverview(category?: string): string {
    if (category) {
      switch (category.toLowerCase()) {
        case 'pos':
          return 'スマレジPOS APIは、POSシステムのデータにアクセスするためのAPIです。商品管理、在庫管理、取引管理などの機能があります。';
        case 'common':
          return 'スマレジ共通APIは、複数のサービスで共通して使用される機能を提供します。店舗管理、スタッフ管理などの機能があります。';
        default:
          return `${category}カテゴリに関する情報はありません。`;
      }
    }
    
    return 'スマレジAPIは、POSシステムおよび周辺サービスのデータにアクセスするためのAPIです。主なカテゴリとして、POS API（商品管理、在庫管理、取引管理）と共通API（店舗管理、スタッフ管理）があります。';
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
