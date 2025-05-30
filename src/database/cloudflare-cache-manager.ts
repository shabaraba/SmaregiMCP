import { D1Database } from '@cloudflare/workers-types';

/**
 * D1を使用した一時キャッシュマネージャー
 */
export class CloudflareCacheManager {
  constructor(private db: D1Database) {}

  /**
   * キャッシュを保存
   */
  async saveCache(sessionId: string, pageNumber: number, data: any): Promise<void> {
    const query = `
      INSERT OR REPLACE INTO transaction_cache (session_id, page_number, data)
      VALUES (?, ?, ?)
    `;
    
    await this.db.prepare(query)
      .bind(sessionId, pageNumber, JSON.stringify(data))
      .run();
  }

  /**
   * 特定のセッションの全キャッシュを取得
   */
  async getCacheBySession(sessionId: string): Promise<any[]> {
    const query = `
      SELECT data FROM transaction_cache
      WHERE session_id = ?
      ORDER BY page_number ASC
    `;
    
    const result = await this.db.prepare(query)
      .bind(sessionId)
      .all();
    
    return result.results.map(row => JSON.parse(row.data as string));
  }

  /**
   * 特定のセッションのキャッシュを削除
   */
  async deleteCacheBySession(sessionId: string): Promise<void> {
    const query = `DELETE FROM transaction_cache WHERE session_id = ?`;
    
    await this.db.prepare(query)
      .bind(sessionId)
      .run();
  }

  /**
   * 古いキャッシュを削除（24時間以上経過）
   */
  async cleanupOldCache(): Promise<void> {
    const query = `
      DELETE FROM transaction_cache
      WHERE created_at < datetime('now', '-24 hours')
    `;
    
    await this.db.prepare(query).run();
  }

  /**
   * データベースの初期化
   */
  async initialize(): Promise<void> {
    // スキーマの作成
    const schema = `
      CREATE TABLE IF NOT EXISTS transaction_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        page_number INTEGER NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, page_number)
      );
      
      CREATE INDEX IF NOT EXISTS idx_transaction_cache_session_id ON transaction_cache(session_id);
      CREATE INDEX IF NOT EXISTS idx_transaction_cache_created_at ON transaction_cache(created_at);
    `;
    
    await this.db.exec(schema);
  }
}