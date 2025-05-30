/**
 * トークンと関連する認証情報を管理するストレージクラス
 */
export interface UserAuthInfo {
  accessToken: string;
  contractId: string;
  expiresAt: number;
  scope?: string;
  userId?: string;
  userInfo?: {
    user_id?: string;
    contract_id?: string;
    email?: string;
    name?: string;
  };
}

export interface AuthSessionInfo {
  codeVerifier: string;
  redirectUri: string;
  timestamp: number;
  contractId?: string; // 認証フロー中で取得される可能性
}

/**
 * トークンストレージクラス
 * アクセストークンとcontractIdを関連付けて管理
 */
export class TokenStorage {
  private tokenStorage = new Map<string, UserAuthInfo>();
  private codeStorage = new Map<string, AuthSessionInfo>();
  private contractIdIndex = new Map<string, string>(); // contractId -> accessToken のマッピング

  /**
   * トークン情報を保存
   */
  public storeToken(accessToken: string, authInfo: UserAuthInfo): void {
    this.tokenStorage.set(accessToken, authInfo);
    
    // contractIdインデックスも更新
    if (authInfo.contractId) {
      this.contractIdIndex.set(authInfo.contractId, accessToken);
    }
  }

  /**
   * トークン情報を取得
   */
  public getToken(accessToken: string): UserAuthInfo | undefined {
    const tokenInfo = this.tokenStorage.get(accessToken);
    
    if (!tokenInfo) {
      return undefined;
    }

    // 有効期限をチェック
    if (Date.now() > tokenInfo.expiresAt) {
      this.removeToken(accessToken);
      return undefined;
    }

    return tokenInfo;
  }

  /**
   * contractIdでトークンを検索
   */
  public getTokenByContractId(contractId: string): UserAuthInfo | undefined {
    const accessToken = this.contractIdIndex.get(contractId);
    
    if (!accessToken) {
      return undefined;
    }

    return this.getToken(accessToken);
  }

  /**
   * トークンの有効性を検証
   */
  public validateToken(accessToken: string): boolean {
    const tokenInfo = this.getToken(accessToken);
    return tokenInfo !== undefined;
  }

  /**
   * contractIdの存在を確認
   */
  public hasValidContractId(accessToken: string): boolean {
    const tokenInfo = this.getToken(accessToken);
    return tokenInfo !== undefined && !!tokenInfo.contractId;
  }

  /**
   * トークンを削除
   */
  public removeToken(accessToken: string): boolean {
    const tokenInfo = this.tokenStorage.get(accessToken);
    
    if (tokenInfo && tokenInfo.contractId) {
      this.contractIdIndex.delete(tokenInfo.contractId);
    }
    
    return this.tokenStorage.delete(accessToken);
  }

  /**
   * 認証コード情報を保存
   */
  public storeAuthSession(state: string, sessionInfo: AuthSessionInfo): void {
    this.codeStorage.set(state, sessionInfo);
  }

  /**
   * 認証コード情報を取得
   */
  public getAuthSession(state: string): AuthSessionInfo | undefined {
    const sessionInfo = this.codeStorage.get(state);
    
    if (!sessionInfo) {
      return undefined;
    }

    // 10分の有効期限をチェック
    const expirationTime = 10 * 60 * 1000;
    if (Date.now() - sessionInfo.timestamp > expirationTime) {
      this.codeStorage.delete(state);
      return undefined;
    }

    return sessionInfo;
  }

  /**
   * 認証コード情報を削除
   */
  public removeAuthSession(state: string): boolean {
    return this.codeStorage.delete(state);
  }

  /**
   * 期限切れのデータをクリーンアップ
   */
  public cleanup(): void {
    const now = Date.now();
    const codeExpirationTime = 10 * 60 * 1000; // 10分

    // 期限切れの認証コード削除
    for (const [key, value] of this.codeStorage.entries()) {
      if (now - value.timestamp > codeExpirationTime) {
        this.codeStorage.delete(key);
      }
    }

    // 期限切れのトークン削除
    for (const [key, value] of this.tokenStorage.entries()) {
      if (now > value.expiresAt) {
        this.removeToken(key);
      }
    }
  }

  /**
   * 全トークンを取得（デバッグ用）
   */
  public getAllTokens(): Map<string, UserAuthInfo> {
    this.cleanup(); // 期限切れを除去してから返す
    return new Map(this.tokenStorage);
  }

  /**
   * ストレージの統計情報を取得
   */
  public getStats(): {
    tokenCount: number;
    sessionCount: number;
    contractIds: string[];
  } {
    this.cleanup();
    
    return {
      tokenCount: this.tokenStorage.size,
      sessionCount: this.codeStorage.size,
      contractIds: Array.from(this.contractIdIndex.keys())
    };
  }
}