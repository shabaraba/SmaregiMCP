/**
 * AuthServiceInterface - 認証サービスの共通インターフェース
 * NodeとCloudflare両方の実装で共通の型を定義
 */
export interface AuthServiceInterface {
  /**
   * トークンをリフレッシュ
   * @param sessionId セッションID
   */
  refreshToken(sessionId: string): Promise<any>;
  
  /**
   * アクセストークンを取得
   * @param sessionId セッションID
   */
  getAccessToken(sessionId: string): Promise<string | null>;
  
  /**
   * 認証URLを生成
   * @param scopes 認証スコープ
   */
  getAuthorizationUrl?(scopes: string[]): Promise<{ url: string; sessionId: string }>;
  
  /**
   * 認証コールバックを処理
   * @param code 認証コード
   * @param state 状態パラメータ
   */
  handleCallback?(code: string, state: string): Promise<string>;
  
  /**
   * 認証状態の確認
   * @param sessionId セッションID
   */
  checkAuthStatus?(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }>;
  
  /**
   * トークンの無効化
   * @param sessionId セッションID
   */
  revokeToken?(sessionId: string): Promise<boolean>;
  
  /**
   * 全セッション情報を取得
   */
  getAllSessions?(): Promise<Array<{ sessionId: string; createdAt: Date }>>;
  
  /**
   * アクセストークンからcontractIdを取得
   * @param token アクセストークン
   */
  getContractIdFromToken?(token: string): string | null;
}