// Cloudflare Workers環境ではWeb Crypto APIを使用
import { config } from '../utils/config.js';

/**
 * SessionData interface
 */
interface SessionData {
  id: string;
  state: string;
  verifier: string;
  code_challenge: string;
  code_challenge_method: string;
  scopes: string[];
  redirect_uri: string;
  created_at: Date;
  updated_at: Date;
  expires_at: Date;
  is_authenticated: boolean;
  metadata?: any;
}

/**
 * CloudflareSessionManager - KVを使ったセッション管理クラス
 * Cloudflare Workers環境でのみ利用可能
 */
export class CloudflareSessionManager {
  private kvNamespace: KVNamespace;
  private isInitialized: boolean = false;

  /**
   * コンストラクタ
   * @param kvNamespace KVNamespace (Cloudflare KV)
   */
  constructor(kvNamespace: KVNamespace) {
    this.kvNamespace = kvNamespace;
    this.isInitialized = true;
  }

  /**
   * ランダム文字列を生成 (verifierやstate用)
   */
  generateRandomString(length: number): string {
    const array = new Uint8Array(Math.ceil(length * 0.75));
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/[+/]/g, '_')
      .slice(0, length);
  }

  /**
   * verifierからcode challengeを作成 (PKCE)
   */
  async createCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * 新しいセッションを作成
   * @param scopes 認可スコープ
   */
  async createSession(scopes: string[]): Promise<SessionData> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 3600000); // 1時間後
      
      const sessionId = this.generateRandomString(32);
      const verifier = this.generateRandomString(64);
      const codeChallenge = await this.createCodeChallenge(verifier);
      const state = this.generateRandomString(32);
      
      const session: SessionData = {
        id: sessionId,
        state,
        verifier,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scopes,
        redirect_uri: config.redirectUri,
        created_at: now,
        updated_at: now,
        expires_at: expiresAt,
        is_authenticated: false
      };
      
      // KVに保存 (JSONにシリアライズ)
      await this.kvNamespace.put(
        `session:${sessionId}`, 
        JSON.stringify(session),
        { expirationTtl: 3600 } // 1時間後に自動削除
      );
      
      // stateからセッションIDを検索できるようにインデックスを保存
      await this.kvNamespace.put(
        `session_state:${state}`, 
        sessionId,
        { expirationTtl: 3600 } // 1時間後に自動削除
      );
      
      console.error(`[INFO] Session created: ${sessionId}`);
      return session;
    } catch (error) {
      console.error(`[ERROR] Failed to create session: ${error}`);
      throw error;
    }
  }

  /**
   * カスタムパラメータを使って新しいセッションを作成
   * @param scopes 認可スコープ
   * @param redirectUri リダイレクトURI
   * @param verifier PKCEのverifier
   * @param codeChallenge PKCEのcode challenge
   * @param state stateパラメータ
   * @param metadata オプションのメタデータ
   */
  async createOpenIdSession(
    scopes: string[],
    redirectUri: string,
    verifier: string,
    codeChallenge: string,
    state: string,
    metadata?: any
  ): Promise<SessionData> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 3600000); // 1時間後
      const sessionId = this.generateRandomString(32);
      
      const session: SessionData = {
        id: sessionId,
        state,
        verifier,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scopes,
        redirect_uri: redirectUri,
        created_at: now,
        updated_at: now,
        expires_at: expiresAt,
        is_authenticated: false,
        metadata
      };
      
      // KVに保存 (JSONにシリアライズ)
      await this.kvNamespace.put(
        `session:${sessionId}`, 
        JSON.stringify(session),
        { expirationTtl: 3600 } // 1時間後に自動削除
      );
      
      // stateからセッションIDを検索できるようにインデックスを保存
      await this.kvNamespace.put(
        `session_state:${state}`, 
        sessionId,
        { expirationTtl: 3600 } // 1時間後に自動削除
      );
      
      console.error(`[INFO] OpenID session created: ${sessionId}`);
      return session;
    } catch (error) {
      console.error(`[ERROR] Failed to create OpenID session: ${error}`);
      throw error;
    }
  }

  /**
   * IDでセッションを取得
   * @param id セッションID
   */
  async getSession(id: string): Promise<SessionData | null> {
    try {
      const sessionJson = await this.kvNamespace.get(`session:${id}`);
      
      if (!sessionJson) {
        return null;
      }
      
      return this.mapSessionFromJson(sessionJson);
    } catch (error) {
      console.error(`[ERROR] Failed to get session: ${error}`);
      return null;
    }
  }

  /**
   * stateでセッションを取得
   * @param state セッションのstate
   */
  async getSessionByState(state: string): Promise<SessionData | null> {
    try {
      const sessionId = await this.kvNamespace.get(`session_state:${state}`);
      
      if (!sessionId) {
        return null;
      }
      
      return this.getSession(sessionId);
    } catch (error) {
      console.error(`[ERROR] Failed to get session by state: ${error}`);
      return null;
    }
  }

  /**
   * JSON文字列からSessionDataオブジェクトに変換
   * @param sessionJson JSONシリアライズされたセッション
   */
  private mapSessionFromJson(sessionJson: string): SessionData {
    const parsed = JSON.parse(sessionJson);
    return {
      ...parsed,
      created_at: new Date(parsed.created_at),
      updated_at: new Date(parsed.updated_at),
      expires_at: new Date(parsed.expires_at)
    };
  }

  /**
   * セッションの認証状態を更新
   * @param id セッションID
   * @param isAuthenticated 認証状態
   */
  async updateSessionAuthStatus(id: string, isAuthenticated: boolean): Promise<void> {
    try {
      const session = await this.getSession(id);
      
      if (!session) {
        throw new Error(`Session not found: ${id}`);
      }
      
      session.is_authenticated = isAuthenticated;
      session.updated_at = new Date();
      
      await this.kvNamespace.put(
        `session:${id}`, 
        JSON.stringify(session),
        { expirationTtl: 3600 } // 1時間後に自動削除
      );
      
      console.error(`[INFO] Session authentication status updated: ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to update session authentication status: ${error}`);
      throw error;
    }
  }

  /**
   * セッションの認証状態を認証済みに更新
   * @param id セッションID
   */
  async updateSessionAuthentication(id: string): Promise<void> {
    return this.updateSessionAuthStatus(id, true);
  }

  /**
   * セッションのメタデータを更新
   * @param id セッションID
   * @param metadata メタデータオブジェクト
   */
  async updateSessionMetadata(id: string, metadata: any): Promise<void> {
    try {
      const session = await this.getSession(id);
      
      if (!session) {
        throw new Error(`Session not found: ${id}`);
      }
      
      session.metadata = metadata;
      session.updated_at = new Date();
      
      await this.kvNamespace.put(
        `session:${id}`, 
        JSON.stringify(session),
        { expirationTtl: 3600 } // 1時間後に自動削除
      );
      
      console.error(`[INFO] Session metadata updated: ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to update session metadata: ${error}`);
      throw error;
    }
  }

  /**
   * セッションを削除
   * @param id セッションID
   */
  async deleteSession(id: string): Promise<void> {
    try {
      const session = await this.getSession(id);
      
      if (session) {
        // セッションを削除
        await this.kvNamespace.delete(`session:${id}`);
        
        // stateインデックスも削除
        await this.kvNamespace.delete(`session_state:${session.state}`);
      }
      
      console.error(`[INFO] Session deleted: ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to delete session: ${error}`);
      throw error;
    }
  }

  /**
   * 全ての有効なセッションを取得
   */
  async getAllActiveSessions(): Promise<SessionData[]> {
    try {
      const sessionKeys = await this.kvNamespace.list({ prefix: 'session:' });
      const sessions: SessionData[] = [];
      
      for (const key of sessionKeys.keys) {
        const sessionJson = await this.kvNamespace.get(key.name);
        if (sessionJson) {
          const session = this.mapSessionFromJson(sessionJson);
          // 有効期限をチェック
          if (session.expires_at > new Date()) {
            sessions.push(session);
          }
        }
      }
      
      return sessions;
    } catch (error) {
      console.error(`[ERROR] Failed to get all active sessions: ${error}`);
      return [];
    }
  }

  /**
   * Cloudflare KVは自動的に有効期限切れのキーを削除するため、
   * このメソッドは互換性のために残していますが何もしません
   */
  async cleanupExpiredSessions(): Promise<number> {
    console.error('[INFO] Cleanup not needed with Cloudflare KV - expiration is automatic');
    return 0;
  }
}