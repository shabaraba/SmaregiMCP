import * as sqlite3 from 'sqlite3';
import { TokenEntity } from './entities/token.entity.js';
import { promisify } from 'util';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { config } from '../utils/config.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Token manager for handling token storage and retrieval
 */
export class TokenManager {
  private db: sqlite3.Database;
  private runAsync: (sql: string, params?: any) => Promise<any>;
  private allAsync: (sql: string, params?: any) => Promise<any[]>;
  private getAsync: (sql: string, params?: any) => Promise<any>;

  constructor() {
    const dbPath = config.databasePath;
    
    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Initialize database
    this.db = new sqlite3.Database(dbPath);
    
    // Promisify database methods
    this.runAsync = promisify(this.db.run.bind(this.db));
    this.allAsync = promisify(this.db.all.bind(this.db));
    this.getAsync = promisify(this.db.get.bind(this.db));
    
    // Initialize database schema
    this.initializeSchema();
  }

  /**
   * Initialize database schema
   */
  private async initializeSchema(): Promise<void> {
    try {
      await this.runAsync(`
        CREATE TABLE IF NOT EXISTS tokens (
          id TEXT PRIMARY KEY,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          token_type TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          scope TEXT NOT NULL,
          id_token TEXT,
          contract_id TEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )
      `);
      console.error('[INFO] Token table initialized');
    } catch (error) {
      console.error(`[ERROR] Failed to initialize schema: ${error}`);
      throw error;
    }
  }

  /**
   * Save token to database
   * @param id - Session ID
   * @param tokenSet - Token data from openid-client or TokenResponseDto
   * @param contractId - Contract ID (optional, defaults to "default")
   */
  async saveToken(id: string, tokenSet: any, contractId: string = "default"): Promise<void> {
    try {
      const now = new Date();
      
      // Determine expires_at from either expires_at or expires_in
      let expiresAt: Date;
      if (tokenSet.expires_at) {
        // If expires_at is a number (timestamp in seconds), convert to Date
        // Otherwise, assume it's already a Date
        expiresAt = typeof tokenSet.expires_at === 'number'
          ? new Date(tokenSet.expires_at * 1000)
          : tokenSet.expires_at;
      } else if (tokenSet.expires_in) {
        // If only expires_in is available, calculate expires_at
        expiresAt = new Date(now.getTime() + tokenSet.expires_in * 1000);
      } else {
        // Default expiration: 1 hour
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
      
      // Check if token already exists
      const existingToken = await this.getToken(id);
      
      if (existingToken) {
        // Update existing token
        await this.runAsync(`
          UPDATE tokens
          SET access_token = ?, refresh_token = ?, token_type = ?,
              expires_at = ?, scope = ?, id_token = ?,
              contract_id = ?, updated_at = ?
          WHERE id = ?
        `, [
          tokenEntity.access_token,
          tokenEntity.refresh_token,
          tokenEntity.token_type,
          tokenEntity.expires_at.toISOString(),
          tokenEntity.scope,
          tokenEntity.id_token,
          tokenEntity.contract_id,
          tokenEntity.updated_at.toISOString(),
          tokenEntity.id
        ]);
      } else {
        // Insert new token
        await this.runAsync(`
          INSERT INTO tokens
          (id, access_token, refresh_token, token_type, expires_at, scope,
           id_token, contract_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          tokenEntity.id,
          tokenEntity.access_token,
          tokenEntity.refresh_token,
          tokenEntity.token_type,
          tokenEntity.expires_at.toISOString(),
          tokenEntity.scope,
          tokenEntity.id_token,
          tokenEntity.contract_id,
          tokenEntity.created_at.toISOString(),
          tokenEntity.updated_at.toISOString()
        ]);
      }
      
      console.error(`[INFO] Token saved for session ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to save token: ${error}`);
      throw error;
    }
  }

  /**
   * Get token from database
   * @param id - Session ID
   */
  async getToken(id: string): Promise<TokenEntity | null> {
    try {
      const token = await this.getAsync(`
        SELECT * FROM tokens WHERE id = ?
      `, [id]);
      
      if (!token) {
        return null;
      }
      
      return {
        ...token,
        expires_at: new Date(token.expires_at),
        created_at: new Date(token.created_at),
        updated_at: new Date(token.updated_at)
      };
    } catch (error) {
      console.error(`[ERROR] Failed to get token: ${error}`);
      return null;
    }
  }

  /**
   * Delete token from database
   * @param id - Session ID
   */
  async deleteToken(id: string): Promise<void> {
    try {
      await this.runAsync(`
        DELETE FROM tokens WHERE id = ?
      `, [id]);
      console.error(`[INFO] Token deleted for session ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to delete token: ${error}`);
      throw error;
    }
  }

  /**
   * Check if token is expired
   * @param token - Token entity
   */
  isTokenExpired(token: TokenEntity): boolean {
    const now = new Date();
    return token.expires_at <= now;
  }

  /**
   * Check if token needs refresh
   * @param token - Token entity
   * @param refreshThresholdSeconds - Threshold in seconds before expiration to trigger refresh
   */
  isTokenNearExpiry(token: TokenEntity, refreshThresholdSeconds = 300): boolean {
    const now = new Date();
    const refreshThreshold = new Date(now.getTime() + refreshThresholdSeconds * 1000);
    return token.expires_at <= refreshThreshold;
  }

  /**
   * Close database connection
   */
  async closeConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error(`[ERROR] Failed to close database connection: ${err}`);
          reject(err);
        } else {
          console.error('[INFO] Database connection closed');
          resolve();
        }
      });
    });
  }
}
