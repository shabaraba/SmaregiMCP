import createFetch, {
  ClientPathsWithMethod,
  MaybeOptionalInit,
} from "openapi-fetch";
import type { PathsWithMethod } from "openapi-typescript-helpers";
import {
  ApiRequestInterface,
  ApiServiceInterface,
} from "./interfaces/api-request.interface.js";
import { AuthServiceInterface } from "../auth/interfaces/auth-service.interface.js";
import { config } from "../utils/node-config.js";
import axios from "axios";
import createClient from "openapi-fetch/dist/index.js";
import type { paths } from "../schema/pos.d.ts";

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
  constructor(private readonly authService: AuthServiceInterface) {}

  /**
   * Create API client for TypeScript typed requests
   * @param sessionId - Session ID
   */
  private async createApiClient(sessionId: string) {
    const accessToken = await this.authService.getAccessToken(sessionId);
    if (!accessToken) {
      throw new Error(
        "Not authenticated. Please complete authentication first.",
      );
    }

    return createFetch({
      baseUrl: config.smaregiApiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Process path parameters in URL
   * @param url - URL with path parameters
   * @param pathParams - Path parameters
   */
  private processPathParams(
    url: string,
    pathParams?: Record<string, any>,
  ): string {
    if (!pathParams) return url;

    let processedUrl = url;
    for (const [key, value] of Object.entries(pathParams)) {
      const placeholder = `{${key}}`;
      processedUrl = processedUrl.replace(
        placeholder,
        encodeURIComponent(String(value)),
      );
    }

    return processedUrl;
  }

  /**
   * Execute API request
   */
  async executeRequest(params: ApiRequestParams): Promise<any> {
    const { sessionId, endpoint, method, body, query, path } = params;

    // Get access token
    const accessToken = await this.authService.getAccessToken(sessionId);
    if (!accessToken) {
      throw new Error(
        "Not authenticated. Please complete authentication first.",
      );
    }

    const client = createClient<paths>({
      baseUrl: `${config.smaregiApiUrl}/${config.contractId}/pos`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // ドット記法を保持するカスタムシリアライザー
      querySerializer: (obj: Record<string, any>) => {
        const params = new URLSearchParams();
        
        // ドット記法をそのまま保持するカスタムシリアライズ関数
        for (const key in obj) {
          if (obj[key] !== undefined && obj[key] !== null) {
            // 配列の場合は特別な処理
            if (Array.isArray(obj[key])) {
              obj[key].forEach((value: any) => {
                params.append(key, String(value));
              });
            } else {
              params.append(key, String(obj[key]));
            }
          }
        }
        
        return params.toString();
      }
    });
    switch (method) {
      case "GET": {
        const { data, error } = await client.GET(endpoint as any, {
          params: {
            path: path as any,
            query: query as any,
          },
        });
        if (error) {
          const errorStr = `
          [ERROR] get api failed: ${JSON.stringify(error, null, 2)}
          [ERRPR] endpoint: ${method} ${config.smaregiApiUrl}/${config.contractId}/pos${endpoint}
          [ERRPR] header: Authorization: Bearer ${accessToken}
          [ERRPR] path: ${JSON.stringify(path, null, 2)}
          [ERRPR] query: ${JSON.stringify(query, null, 2)}
          `;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      case "POST": {
        const { data, error } = await client.POST(endpoint as any, {
          params: {
            path: path as any,
          },
          body: body as any,
        });
        if (error) {
          const errorStr = `[ERROR] get api failed: ${JSON.stringify(error, null, 2)}`;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      case "PUT": {
        const { data, error } = await client.PUT(endpoint as any, {
          params: {
            path: path as any,
          },
          body: body as any,
        });
        if (error) {
          const errorStr = `[ERROR] get api failed: ${JSON.stringify(error, null, 2)}`;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      case "DELETE": {
        const { data, error } = await client.DELETE(endpoint as any, {
          params: {
            path: path as any,
          },
          body: body as any,
        });
        if (error) {
          const errorStr = `[ERROR] get api failed: ${JSON.stringify(error, null, 2)}`;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
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

    return "スマレジAPIは、POSシステムおよび周辺サービスのデータにアクセスするためのAPIです。主なカテゴリとして、POS API（商品管理、在庫管理、取引管理）と共通API（店舗管理、スタッフ管理）があります。";
  }

  /**
   * Get API category overview information
   */
  getApiCategoryOverview(category: string): string {
    switch (category.toLowerCase()) {
      case "pos":
        return "スマレジPOS APIは、POSシステムのデータにアクセスするためのAPIです。商品管理、在庫管理、取引管理などの機能があります。";
      case "auth":
        return "スマレジ認証APIは、OAuth2.0に基づく認証機能を提供します。認証URLの生成、アクセストークン取得、トークン更新、トークン無効化などの機能があります。";
      case "system":
        return "スマレジシステム管理APIは、アカウント情報、契約情報、マスタデータなどシステム設定やメタデータ関連の機能を提供します。";
      case "common":
        return "スマレジ共通APIは、複数のサービスで共通して使用される機能を提供します。店舗管理、スタッフ管理などの機能があります。";
      default:
        return `${category}カテゴリに関する情報はありません。`;
    }
  }

  /**
   * Get API paths for a category
   */
  getApiPaths(category: string): Array<{
    name: string;
    description: string;
    method: string;
    path: string;
  }> {
    switch (category.toLowerCase()) {
      case "pos":
        return [
          {
            name: "products",
            description: "商品情報API",
            method: "GET",
            path: "/pos/products",
          },
          {
            name: "transactions",
            description: "取引API",
            method: "GET",
            path: "/pos/transactions",
          },
          {
            name: "stocks",
            description: "在庫API",
            method: "GET",
            path: "/pos/stocks",
          },
          {
            name: "stores",
            description: "店舗API",
            method: "GET",
            path: "/pos/stores",
          },
          {
            name: "customers",
            description: "顧客API",
            method: "GET",
            path: "/pos/customers",
          },
        ];
      case "auth":
        return [
          {
            name: "token",
            description: "トークン取得API",
            method: "POST",
            path: "/auth/token",
          },
          {
            name: "revoke",
            description: "トークン無効化API",
            method: "POST",
            path: "/auth/revoke",
          },
        ];
      case "system":
        return [
          {
            name: "account",
            description: "アカウント情報API",
            method: "GET",
            path: "/system/account",
          },
          {
            name: "contracts",
            description: "契約情報API",
            method: "GET",
            path: "/system/contracts",
          },
          {
            name: "masters",
            description: "マスタデータAPI",
            method: "GET",
            path: "/system/masters",
          },
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
    const pathDetail = paths.find((p) => p.name === path);

    if (!pathDetail) {
      return null;
    }

    // Return basic details with parameters and responses
    const details = {
      ...pathDetail,
      parameters: [],
      responses: {
        "200": {
          description: "成功レスポンス",
          example: {},
        },
        "400": {
          description: "リクエストエラー",
          example: { error: "Bad Request", message: "Invalid parameters" },
        },
        "401": {
          description: "認証エラー",
          example: {
            error: "Unauthorized",
            message: "Authentication required",
          },
        },
      },
    };

    // Add parameters based on the path type
    switch (path) {
      case "products":
        details.parameters = [
          {
            name: "limit",
            in: "query",
            description: "取得する件数",
            required: false,
          },
          {
            name: "offset",
            in: "query",
            description: "開始位置",
            required: false,
          },
          {
            name: "product_id",
            in: "query",
            description: "商品ID",
            required: false,
          },
        ];
        details.responses["200"].example = this.getMockProducts();
        break;
      case "transactions":
        details.parameters = [
          {
            name: "limit",
            in: "query",
            description: "取得する件数",
            required: false,
          },
          {
            name: "offset",
            in: "query",
            description: "開始位置",
            required: false,
          },
          {
            name: "start_date",
            in: "query",
            description: "開始日時",
            required: false,
          },
          {
            name: "end_date",
            in: "query",
            description: "終了日時",
            required: false,
          },
        ];
        details.responses["200"].example = this.getMockTransactions();
        break;
      case "stores":
        details.parameters = [
          {
            name: "limit",
            in: "query",
            description: "取得する件数",
            required: false,
          },
          {
            name: "offset",
            in: "query",
            description: "開始位置",
            required: false,
          },
          {
            name: "store_id",
            in: "query",
            description: "店舗ID",
            required: false,
          },
        ];
        details.responses["200"].example = this.getMockStores();
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
          product_id: "1001",
          product_code: "ITEM001",
          product_name: "Tシャツ 白 Mサイズ",
          price: 2000,
          tax_rate: 10,
          stock: 50,
        },
        {
          product_id: "1002",
          product_code: "ITEM002",
          product_name: "Tシャツ 黒 Mサイズ",
          price: 2000,
          tax_rate: 10,
          stock: 30,
        },
        {
          product_id: "1003",
          product_code: "ITEM003",
          product_name: "ジーンズ 青 Mサイズ",
          price: 5000,
          tax_rate: 10,
          stock: 20,
        },
      ],
      total: 3,
      limit: 100,
      offset: 0,
    };
  }

  /**
   * Mock transactions data
   */
  private getMockTransactions(): any {
    return {
      transactions: [
        {
          transaction_id: "20001",
          store_id: "1",
          transaction_date: "2025-04-05T09:30:00+09:00",
          total_amount: 3300,
          payment_method: "cash",
        },
        {
          transaction_id: "20002",
          store_id: "1",
          transaction_date: "2025-04-05T10:15:00+09:00",
          total_amount: 5500,
          payment_method: "credit",
        },
        {
          transaction_id: "20003",
          store_id: "2",
          transaction_date: "2025-04-05T11:00:00+09:00",
          total_amount: 7700,
          payment_method: "credit",
        },
      ],
      total: 3,
      limit: 100,
      offset: 0,
    };
  }

  /**
   * Mock stores data
   */
  private getMockStores(): any {
    return {
      stores: [
        {
          store_id: "1",
          store_code: "STORE001",
          store_name: "東京本店",
          tel: "03-1234-5678",
          address: "東京都渋谷区",
        },
        {
          store_id: "2",
          store_code: "STORE002",
          store_name: "大阪支店",
          tel: "06-1234-5678",
          address: "大阪府大阪市",
        },
      ],
      total: 2,
      limit: 100,
      offset: 0,
    };
  }

  /**
   * Execute API request with access token (for MCP OAuth)
   */
  async executeRequestWithToken(params: {
    accessToken: string;
    contractId?: string;
    endpoint: string;
    method: string;
    body?: any;
    query?: Record<string, any>;
    path?: Record<string, any>;
  }): Promise<any> {
    const { accessToken, contractId, endpoint, method, body, query, path } = params;

    // contractIdを検証
    const finalContractId = contractId || config.contractId;
    if (!finalContractId) {
      throw new Error('Contract ID is required but not provided. Please ensure authentication is complete.');
    }

    const client = createClient<paths>({
      baseUrl: `${config.smaregiApiUrl}/${finalContractId}/pos`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // ドット記法を保持するカスタムシリアライザー
      querySerializer: (obj: Record<string, any>) => {
        const params = new URLSearchParams();
        
        // ドット記法をそのまま保持するカスタムシリアライズ関数
        for (const key in obj) {
          if (obj[key] !== undefined && obj[key] !== null) {
            // 配列の場合は特別な処理
            if (Array.isArray(obj[key])) {
              obj[key].forEach((value: any) => {
                params.append(key, String(value));
              });
            } else {
              params.append(key, String(obj[key]));
            }
          }
        }
        
        return params.toString();
      }
    });

    switch (method) {
      case "GET": {
        const { data, error } = await client.GET(endpoint as any, {
          params: {
            path: path as any,
            query: query as any,
          },
        });
        if (error) {
          const errorStr = `
          [ERROR] get api failed: ${JSON.stringify(error, null, 2)}
          [ERRPR] endpoint: ${method} ${config.smaregiApiUrl}/${config.contractId}/pos${endpoint}
          [ERRPR] header: Authorization: Bearer ${accessToken}
          [ERRPR] path: ${JSON.stringify(path, null, 2)}
          [ERRPR] query: ${JSON.stringify(query, null, 2)}
          `;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      case "POST": {
        const { data, error } = await client.POST(endpoint as any, {
          params: {
            path: path as any,
          },
          body: body as any,
        });
        if (error) {
          const errorStr = `[ERROR] post api failed: ${JSON.stringify(error, null, 2)}`;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      case "PUT": {
        const { data, error } = await client.PUT(endpoint as any, {
          params: {
            path: path as any,
          },
          body: body as any,
        });
        if (error) {
          const errorStr = `[ERROR] put api failed: ${JSON.stringify(error, null, 2)}`;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      case "DELETE": {
        const { data, error } = await client.DELETE(endpoint as any, {
          params: {
            path: path as any,
          },
          body: body as any,
        });
        if (error) {
          const errorStr = `[ERROR] delete api failed: ${JSON.stringify(error, null, 2)}`;
          console.error(errorStr);
          throw new Error(errorStr);
        }
        console.error(`[INFO] API request successful: ${method} ${endpoint}`);
        return data;
      }
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
