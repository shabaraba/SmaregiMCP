import { TokenEntity } from './entities/token.entity.js';

/**
 * CloudflareTokenManager - Cloudflare KVを使ったトークン管理クラス
 * Cloudflare Workers環境でのみ利用可能
 */
export class CloudflareTokenManager {
  private kvNamespace: KVNamespace;

  /**
   * コンストラクタ
   * @param kvNamespace KVNamespace (Cloudflare KV)
   */
  constructor(kvNamespace: KVNamespace) {
    this.kvNamespace = kvNamespace;
  }

  /**
   * トークンを保存
   * @param id セッションID
   * @param tokenSet openid-clientまたはTokenResponseDtoからのトークンデータ
   * @param contractId コントラクトID (オプション、デフォルトは "default")
   */
  async saveToken(id: string, tokenSet: any, contractId: string = "default"): Promise<void> {
    try {
      const now = new Date();
      
      // expires_atまたはexpires_inからexpires_atを決定
      let expiresAt: Date;
      if (tokenSet.expires_at) {
        // expires_atが数値（秒単位のタイムスタンプ）の場合、Dateに変換
        // それ以外の場合は、既にDateと仮定
        expiresAt = typeof tokenSet.expires_at === 'number'
          ? new Date(tokenSet.expires_at * 1000)
          : tokenSet.expires_at;
      } else if (tokenSet.expires_in) {
        // expires_inのみが利用可能な場合、expires_atを計算
        expiresAt = new Date(now.getTime() + tokenSet.expires_in * 1000);
      } else {
        // デフォルトの有効期限：1時間
        expiresAt = new Date(now.getTime() + 3600 * 1000);
      }
      
      const tokenEntity: TokenEntity = {
        id,
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token || null,
        token_type: tokenSet.token_type || 'Bearer',
        expires_at: expiresAt,
        scope: tokenSet.scope || '',
        id_token: tokenSet.id_token || null,
        contract_id: contractId,
        created_at: now,
        updated_at: now
      };
      
      // 有効期限までの秒数を計算
      const ttlSeconds = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
      
      // KVに保存 (JSONにシリアライズ)
      await this.kvNamespace.put(
        `token:${id}`, 
        JSON.stringify(tokenEntity),
        { expirationTtl: ttlSeconds + 60 } // 有効期限 + 60秒のマージン
      );
      
      console.error(`[INFO] Token saved for session ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to save token: ${error}`);
      throw error;
    }
  }

  /**
   * トークンを取得
   * @param id セッションID
   */
  async getToken(id: string): Promise<TokenEntity | null> {
    try {
      const tokenJson = await this.kvNamespace.get(`token:${id}`);
      
      if (!tokenJson) {
        return null;
      }
      
      const parsed = JSON.parse(tokenJson);
      return {
        ...parsed,
        expires_at: new Date(parsed.expires_at),
        created_at: new Date(parsed.created_at),
        updated_at: new Date(parsed.updated_at)
      };
    } catch (error) {
      console.error(`[ERROR] Failed to get token: ${error}`);
      return null;
    }
  }

  /**
   * トークンを削除
   * @param id セッションID
   */
  async deleteToken(id: string): Promise<void> {
    try {
      await this.kvNamespace.delete(`token:${id}`);
      console.error(`[INFO] Token deleted for session ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to delete token: ${error}`);
      throw error;
    }
  }

  /**
   * トークンが失効しているかチェック
   * @param token トークンエンティティ
   */
  isTokenExpired(token: TokenEntity): boolean {
    const now = new Date();
    return token.expires_at <= now;
  }

  /**
   * トークンが更新の必要があるかチェック
   * @param token トークンエンティティ
   * @param refreshThresholdSeconds 更新を開始するタイミング（有効期限までの秒数）
   */
  isTokenNearExpiry(token: TokenEntity, refreshThresholdSeconds = 300): boolean {
    const now = new Date();
    const refreshThreshold = new Date(now.getTime() + refreshThresholdSeconds * 1000);
    return token.expires_at <= refreshThreshold;
  }
}