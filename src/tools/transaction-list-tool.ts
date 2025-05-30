import { z } from 'zod';
import { ApiService } from '../api/api.service.js';
import { AuthServiceInterface } from '../auth/interfaces/auth-service.interface.js';

/**
 * 取引一覧取得ツール（日付必須、ISO 8601形式、日本タイムゾーン対応）
 */
export class TransactionListTool {
  name = 'transactions_list';
  description = '取引一覧を取得します。日付範囲の指定が必須です。ISO 8601形式（YYYY-MM-DDTHH:MM:SS+09:00）で指定してください。';
  
  parameters = [
    {
      name: 'transaction_date_time-from',
      description: '取引日時の開始（ISO 8601形式、必須、例: 2024-01-01T00:00:00+09:00）',
      required: true,
      type: 'query' as const,
      schema: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/, 'ISO 8601形式でタイムゾーン付きで入力してください（例: 2024-01-01T00:00:00+09:00）')
    },
    {
      name: 'transaction_date_time-to',
      description: '取引日時の終了（ISO 8601形式、必須、例: 2024-01-01T23:59:59+09:00）',
      required: true,
      type: 'query' as const,
      schema: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/, 'ISO 8601形式でタイムゾーン付きで入力してください（例: 2024-01-01T23:59:59+09:00）')
    }
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthServiceInterface
  ) {}

  /**
   * 日付パラメータをバリデート
   */
  private validateDateParameters(args: Record<string, any>): { isValid: boolean; error?: string } {
    const fromDate = args['transaction_date_time-from'];
    const toDate = args['transaction_date_time-to'];

    // 必須チェック（Zodスキーマでもチェックされているが念のため）
    if (!fromDate || !toDate) {
      return {
        isValid: false,
        error: `transaction_date_time-from と transaction_date_time-to の両方が必須です。

**使用例:**
\`\`\`
{
  "transaction_date_time-from": "2024-01-01T00:00:00+09:00",
  "transaction_date_time-to": "2024-01-01T23:59:59+09:00"
}
\`\`\``
      };
    }

    // 開始日時 <= 終了日時のチェック
    const fromDateTime = new Date(fromDate);
    const toDateTime = new Date(toDate);
    
    if (fromDateTime > toDateTime) {
      return {
        isValid: false,
        error: `開始日時（transaction_date_time-from）は終了日時（transaction_date_time-to）以前を指定してください。

**現在の指定:**
- 開始: ${fromDate}
- 終了: ${toDate}`
      };
    }

    return { isValid: true };
  }


  async execute(args: any): Promise<any> {
    try {
      // 日付パラメータの検証
      const validation = this.validateDateParameters(args);
      if (!validation.isValid) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "VALIDATION_ERROR",
              message: validation.error
            })
          }],
          isError: true
        };
      }

      // 認証済みセッションを取得
      const sessions = await this.authService.getAllSessions?.() || [];
      
      if (sessions.length === 0) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "AUTHENTICATION_REQUIRED",
              message: "認証が必要です。authenticate_smaregi ツールで action: start を実行してください。"
            })
          }],
          isError: true
        };
      }

      // 最新のセッションを使用
      const latestSession = sessions[0];
      const authStatus = await this.authService.checkAuthStatus?.(latestSession.sessionId);
      
      if (!authStatus?.isAuthenticated) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "AUTHENTICATION_IN_PROGRESS",
              message: "認証が完了していません。authenticate_smaregi ツールで action: status を実行して認証状態を確認してください。"
            })
          }],
          isError: true
        };
      }

      // 認証済みの場合、実際のAPIリクエストを実行
      const accessToken = await this.authService.getAccessToken?.(latestSession.sessionId);
      if (!accessToken) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "NO_ACCESS_TOKEN",
              message: "アクセストークンが取得できませんでした。authenticate_smaregi ツールで action: start を実行してください。"
            })
          }],
          isError: true
        };
      }

      // contractIdを取得
      const contractId = this.authService.getContractIdFromToken?.(accessToken) || 'sb_skc130x6';

      // 全ページのデータを取得（ページネーション処理）
      const allTransactions = await this.fetchAllPages(accessToken, contractId, args);

      // JSON形式で全データを返す
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              total: allTransactions.length,
              transactions: allTransactions
            }),
          },
        ],
      };

    } catch (error) {
      console.error(`[ERROR] TransactionListTool execution error:`, error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "API_ERROR",
              message: error instanceof Error ? error.message : String(error)
            }),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 全ページのデータを取得（ページネーション処理）
   */
  private async fetchAllPages(accessToken: string, contractId: string, args: Record<string, any>): Promise<any[]> {
    const allTransactions: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    console.error(`[INFO] Starting paginated fetch for transactions`);

    while (hasMorePages) {
      console.error(`[INFO] Fetching page ${currentPage}...`);

      // クエリパラメータを構築
      const queryParams: Record<string, any> = {
        // 固定パラメータ
        limit: 100,
        page: currentPage,
        with_details: 'summary',
        fields: [
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
        ].join(',')
      };
      
      // 日付パラメータを追加
      queryParams['transaction_date_time-from'] = args['transaction_date_time-from'];
      queryParams['transaction_date_time-to'] = args['transaction_date_time-to'];

      try {
        // APIリクエストを実行
        const response = await this.apiService.executeRequestWithToken({
          accessToken,
          contractId,
          endpoint: '/transactions',
          method: 'GET',
          query: queryParams
        });

        // レスポンスの処理
        let pageData: any[] = [];
        
        if (Array.isArray(response)) {
          pageData = response;
        } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
          pageData = response.data;
        } else if (response && typeof response === 'object') {
          // レスポンス構造が予期しない場合のフォールバック
          console.error(`[WARN] Unexpected response structure on page ${currentPage}:`, typeof response);
          pageData = [];
        }

        console.error(`[INFO] Page ${currentPage}: received ${pageData.length} transactions`);

        // データを追加
        allTransactions.push(...pageData);

        // 次のページがあるかチェック（100件未満なら最後のページ）
        hasMorePages = pageData.length >= 100;
        
        if (hasMorePages) {
          currentPage++;
          
          // API制限を考慮して少し待機
          await new Promise(resolve => setTimeout(resolve, 10));
        }

      } catch (error) {
        console.error(`[ERROR] Failed to fetch page ${currentPage}:`, error);
        
        // エラーの場合は現在までのデータを返す
        if (allTransactions.length > 0) {
          console.error(`[WARN] Returning ${allTransactions.length} transactions from successful pages`);
          break;
        } else {
          throw error;
        }
      }
    }

    console.error(`[INFO] Completed paginated fetch: ${allTransactions.length} total transactions from ${currentPage - 1} pages`);
    
    return allTransactions;
  }
}
