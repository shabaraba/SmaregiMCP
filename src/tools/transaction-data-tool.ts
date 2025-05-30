import { CloudflareAuthService } from '../auth/cloudflare-auth-service.js';
import { CloudflareCacheManager } from '../database/cloudflare-cache-manager.js';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 取引データ取得ツールのインターフェース
 */
export interface TransactionDataToolParams {
  startDate?: string; // YYYY-MM-DD形式
  endDate?: string;   // YYYY-MM-DD形式
  storeId?: string;
  sessionId?: string;
}

/**
 * 取引データ取得のレスポンス
 */
export interface TransactionDataResponse {
  success: boolean;
  data?: any[];
  totalRecords?: number;
  message?: string;
  error?: string;
  sessionId?: string;
}

/**
 * エラーの種類
 */
export enum ErrorType {
  AUTHENTICATION_REQUIRED = 'authentication_required',
  API_LIMIT_REACHED = 'api_limit_reached',
  NETWORK_ERROR = 'network_error',
  INVALID_PARAMETERS = 'invalid_parameters',
  UNKNOWN_ERROR = 'unknown_error'
}

/**
 * リトライ可能なエラーかどうかを判定
 */
function isRetryableError(error: any): boolean {
  // ネットワークエラー、一時的なサーバーエラーなどはリトライ可能
  return error?.status >= 500 || error?.code === 'NETWORK_ERROR';
}

/**
 * 取引データ取得ツール
 */
export class TransactionDataTool {
  private authService: CloudflareAuthService;
  private cacheManager: CloudflareCacheManager;
  private env: Env;

  constructor(authService: CloudflareAuthService, db: D1Database, env: Env) {
    this.authService = authService;
    this.cacheManager = new CloudflareCacheManager(db);
    this.env = env;
  }

  /**
   * 取引データを取得（メインメソッド）
   */
  async getTransactionAnalysisData(params: TransactionDataToolParams): Promise<TransactionDataResponse> {
    try {
      // パラメータのバリデーション
      const validatedParams = this.validateParams(params);
      
      // 認証トークンを取得（自動認証）
      const authResult = await this.getAuthenticationToken(params.sessionId);
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error,
          message: 'Authentication required. Please authenticate first using the auth tools.'
        };
      }

      // データベースの初期化
      await this.cacheManager.initialize();

      // 古いキャッシュをクリーンアップ
      await this.cacheManager.cleanupOldCache();

      // 取引データを取得（ページネーション対応）
      const transactionData = await this.fetchAllTransactionData(
        authResult.token,
        validatedParams
      );

      return {
        success: true,
        data: transactionData.data,
        totalRecords: transactionData.totalRecords,
        sessionId: authResult.sessionId,
        message: `Successfully retrieved ${transactionData.totalRecords} transaction records`
      };

    } catch (error) {
      console.error('[ERROR] TransactionDataTool failed:', error);
      
      return {
        success: false,
        error: this.categorizeError(error),
        message: `Failed to retrieve transaction data: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * パラメータの検証と正規化
   */
  private validateParams(params: TransactionDataToolParams): Required<Omit<TransactionDataToolParams, 'sessionId'>> & { sessionId?: string } {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // デフォルト値の設定
    const startDate = params.startDate || oneMonthAgo.toISOString().split('T')[0];
    const endDate = params.endDate || now.toISOString().split('T')[0];

    // 日付形式の検証
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }

    // 期間の検証（最大1ヶ月）
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 31) {
      throw new Error('Date range cannot exceed 31 days.');
    }

    if (start > end) {
      throw new Error('Start date must be before end date.');
    }

    return {
      startDate,
      endDate,
      storeId: params.storeId || '',
      sessionId: params.sessionId
    };
  }

  /**
   * 日付形式の検証
   */
  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * 認証トークンを取得（自動認証機能付き）
   */
  private async getAuthenticationToken(sessionId?: string): Promise<{ success: boolean; token?: string; sessionId?: string; error?: string }> {
    try {
      const result = await this.authService.getAccessTokenWithAutoAuth(sessionId);
      return {
        success: true,
        token: result.token,
        sessionId: result.sessionId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 全ての取引データを取得（ページネーション対応）
   */
  private async fetchAllTransactionData(
    accessToken: string,
    params: Required<Omit<TransactionDataToolParams, 'sessionId'>>
  ): Promise<{ data: any[]; totalRecords: number }> {
    const sessionId = uuidv4(); // キャッシュ用のセッションID
    let allData: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    let totalRecords = 0;

    try {
      while (hasMorePages) {
        const pageData = await this.fetchTransactionPage(
          accessToken,
          params,
          currentPage,
          sessionId
        );

        // キャッシュに保存
        await this.cacheManager.saveCache(sessionId, currentPage, pageData);

        // 次のページがあるかチェック
        hasMorePages = this.hasNextPage(pageData);
        currentPage++;

        // API制限を考慮して少し待機
        await this.sleep(100);
      }

      // 全てのキャッシュされたデータを取得
      const cachedPages = await this.cacheManager.getCacheBySession(sessionId);
      
      // データを結合
      for (const pageData of cachedPages) {
        if (pageData && pageData.data) {
          allData = allData.concat(pageData.data);
        }
      }

      totalRecords = allData.length;

      // キャッシュをクリーンアップ
      await this.cacheManager.deleteCacheBySession(sessionId);

      return { data: allData, totalRecords };

    } catch (error) {
      // エラー時もキャッシュをクリーンアップ
      await this.cacheManager.deleteCacheBySession(sessionId);
      throw error;
    }
  }

  /**
   * 1ページ分の取引データを取得（リトライ機能付き）
   */
  private async fetchTransactionPage(
    accessToken: string,
    params: Required<Omit<TransactionDataToolParams, 'sessionId'>>,
    page: number,
    sessionId: string
  ): Promise<any> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.makeSingleTransactionRequest(accessToken, params, page);
      } catch (error) {
        lastError = error;
        
        // リトライ可能なエラーでない場合は即座に失敗
        if (!isRetryableError(error)) {
          throw error;
        }

        // 最後の試行の場合は失敗
        if (attempt === maxRetries) {
          break;
        }

        // 指数バックオフで待機
        const delay = Math.pow(2, attempt - 1) * 1000;
        await this.sleep(delay);
        
        console.error(`[WARN] Retry ${attempt}/${maxRetries} for page ${page} after error:`, error);
      }
    }

    throw new Error(`Failed to fetch page ${page} after ${maxRetries} retries: ${lastError?.message || lastError}`);
  }

  /**
   * 単一のAPIリクエストを実行
   */
  private async makeSingleTransactionRequest(
    accessToken: string,
    params: Required<Omit<TransactionDataToolParams, 'sessionId'>>,
    page: number
  ): Promise<any> {
    // 必要最小限のフィールドを指定
    const fields = [
      'transactionHeadId',
      'transactionDateTime', 
      'transactionHeadDivision',
      'cancelDivision',
      'total',
      'costTotal',
      'storeId',
      'customerId',
      'customerRank',
      'customerGroupId',
      'customerGroupId2',
      'customerGroupId3',
      'customerGroupId4',
      'customerGroupId5',
      'staffId',
      'guestNumbers',
      'guestNumbersMale',
      'guestNumbersFemale',
      'guestNumbersUnknown',
      'tags'
    ].join(',');

    // クエリパラメータを構築
    const queryParams = new URLSearchParams({
      with_details: 'summary',
      fields: fields,
      limit: '100',
      page: page.toString()
    });

    // 日付フィルターを追加
    if (params.startDate) {
      queryParams.append('transaction_date_time_from', params.startDate + ' 00:00:00');
    }
    if (params.endDate) {
      queryParams.append('transaction_date_time_to', params.endDate + ' 23:59:59');
    }

    // 店舗IDフィルターを追加
    if (params.storeId) {
      queryParams.append('store_id', params.storeId);
    }

    const apiUrl = `${this.env.SMAREGI_API_URL || 'https://api.smaregi.dev'}/pos/transactions?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // API制限エラーの場合
      if (response.status === 429) {
        throw { status: 429, type: ErrorType.API_LIMIT_REACHED, message: 'API rate limit exceeded' };
      }

      // 認証エラーの場合  
      if (response.status === 401) {
        throw { status: 401, type: ErrorType.AUTHENTICATION_REQUIRED, message: 'Authentication required' };
      }

      throw { 
        status: response.status, 
        type: response.status >= 500 ? ErrorType.NETWORK_ERROR : ErrorType.UNKNOWN_ERROR,
        message: `API request failed: ${response.status} ${errorText}`
      };
    }

    return await response.json();
  }

  /**
   * 次のページがあるかどうかを判定
   */
  private hasNextPage(pageData: any): boolean {
    // レスポンス構造に応じて調整が必要
    // 一般的なパターン：
    if (pageData.pagination && pageData.pagination.hasNext !== undefined) {
      return pageData.pagination.hasNext;
    }
    
    if (pageData.meta && pageData.meta.next_page_url) {
      return true;
    }

    if (pageData.data && Array.isArray(pageData.data)) {
      // データが100件未満の場合は最後のページ
      return pageData.data.length >= 100;
    }

    return false;
  }

  /**
   * 指定時間待機
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * エラーを分類
   */
  private categorizeError(error: any): string {
    if (error?.type) {
      return error.type;
    }

    if (error?.status === 401) {
      return ErrorType.AUTHENTICATION_REQUIRED;
    }

    if (error?.status === 429) {
      return ErrorType.API_LIMIT_REACHED;
    }

    if (error?.status >= 500) {
      return ErrorType.NETWORK_ERROR;
    }

    if (error?.message?.includes('Invalid date') || error?.message?.includes('Date range')) {
      return ErrorType.INVALID_PARAMETERS;
    }

    return ErrorType.UNKNOWN_ERROR;
  }
}