/**
 * 認証状態を保存・取得するためのインタフェース
 */
export interface AuthStore {
  /**
   * 認証処理が完了したときにフラグを設定
   * @param requestId リクエストID
   * @param status 認証状態
   * @param data 関連データ (トークン情報など)
   */
  setAuthStatus(requestId: string, status: AuthStatus, data?: any): Promise<void>;
  
  /**
   * 認証状態を取得
   * @param requestId リクエストID
   */
  getAuthStatus(requestId: string): Promise<AuthStatusData | null>;
  
  /**
   * 認証状態を削除
   * @param requestId リクエストID
   */
  deleteAuthStatus(requestId: string): Promise<void>;
}

/**
 * 認証状態
 */
export enum AuthStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * 認証状態データ
 */
export interface AuthStatusData {
  requestId: string;
  status: AuthStatus;
  createdAt: Date;
  updatedAt: Date;
  data?: any;
}

/**
 * Cloudflare KVを使った認証状態ストア実装
 */
export class CloudflareAuthStore implements AuthStore {
  private kvNamespace: KVNamespace;
  
  constructor(kvNamespace: KVNamespace) {
    this.kvNamespace = kvNamespace;
  }
  
  /**
   * KVのキーを生成
   */
  private getKey(requestId: string): string {
    return `auth_status:${requestId}`;
  }
  
  /**
   * 認証状態を設定
   */
  async setAuthStatus(requestId: string, status: AuthStatus, data?: any): Promise<void> {
    const now = new Date();
    
    // 既存のデータを取得
    const existingData = await this.getAuthStatus(requestId);
    
    const statusData: AuthStatusData = {
      requestId,
      status,
      createdAt: existingData?.createdAt || now,
      updatedAt: now,
      data
    };
    
    // KVに保存 (JSONにシリアライズ)
    await this.kvNamespace.put(
      this.getKey(requestId), 
      JSON.stringify(statusData),
      { expirationTtl: 3600 } // 1時間後に自動削除
    );
    
    console.error(`[INFO] Auth status updated for ${requestId}: ${status}`);
  }
  
  /**
   * 認証状態を取得
   */
  async getAuthStatus(requestId: string): Promise<AuthStatusData | null> {
    const statusJson = await this.kvNamespace.get(this.getKey(requestId));
    
    if (!statusJson) {
      return null;
    }
    
    try {
      const parsed = JSON.parse(statusJson);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt)
      };
    } catch (error) {
      console.error(`[ERROR] Failed to parse auth status data: ${error}`);
      return null;
    }
  }
  
  /**
   * 認証状態を削除
   */
  async deleteAuthStatus(requestId: string): Promise<void> {
    await this.kvNamespace.delete(this.getKey(requestId));
    console.error(`[INFO] Auth status deleted for ${requestId}`);
  }
}