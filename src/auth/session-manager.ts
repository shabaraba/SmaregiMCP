import * as crypto from 'crypto';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { config } from '../utils/config.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Session data interface
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
 * Session manager for handling OAuth sessions
 */
export class SessionManager {
  private db: any;
  private runAsync: (sql: string, params?: any) => Promise<any>;
  private allAsync: (sql: string, params?: any) => Promise<any[]>;
  private getAsync: (sql: string, params?: any) => Promise<any>;
  private isInitialized: boolean = false;

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
      // Drop existing sessions table if it exists to ensure clean schema
      await this.runAsync(`DROP TABLE IF EXISTS sessions`);
      
      // Create new sessions table with the optimized schema
      await this.runAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          state TEXT NOT NULL,
          verifier TEXT NOT NULL,
          code_challenge TEXT NOT NULL, 
          code_challenge_method TEXT NOT NULL DEFAULT 'S256',
          scopes TEXT NOT NULL,
          redirect_uri TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
          updated_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
          expires_at TIMESTAMP NOT NULL DEFAULT (datetime('now', '+1 hour')),
          is_authenticated INTEGER NOT NULL DEFAULT 0,
          metadata TEXT
        )
      `);
      
      // Create indices for improved performance
      await this.runAsync(`CREATE INDEX IF NOT EXISTS idx_sessions_state ON sessions(state)`);
      await this.runAsync(`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`);
      
      console.error('[INFO] Sessions table initialized with optimized schema');
      this.isInitialized = true;
    } catch (error) {
      console.error(`[ERROR] Failed to initialize sessions schema: ${error}`);
      throw error;
    }
  }

  /**
   * Ensure the database schema is initialized before performing operations
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeSchema();
    }
  }

  /**
   * Generate a random string for verifier and state
   */
  generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length * 0.75))
      .toString('base64')
      .replace(/[+/]/g, '_')
      .slice(0, length);
  }

  /**
   * Create code challenge from verifier (for PKCE)
   */
  createCodeChallenge(verifier: string): string {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Create a new session
   * @param scopes - Authorization scopes
   */
  async createSession(scopes: string[]): Promise<SessionData> {
    try {
      await this.ensureInitialized();
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 3600000); // 1 hour from now
      
      const sessionId = this.generateRandomString(32);
      const verifier = this.generateRandomString(64);
      const codeChallenge = this.createCodeChallenge(verifier);
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
      
      await this.runAsync(`
        INSERT INTO sessions
        (id, state, verifier, code_challenge, code_challenge_method, scopes, redirect_uri, created_at, updated_at, expires_at, is_authenticated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        session.id,
        session.state,
        session.verifier,
        session.code_challenge,
        session.code_challenge_method,
        JSON.stringify(session.scopes),
        session.redirect_uri,
        session.created_at.toISOString(),
        session.updated_at.toISOString(),
        session.expires_at.toISOString(),
        session.is_authenticated ? 1 : 0
      ]);
      
      console.error(`[INFO] Session created: ${sessionId}`);
      return session;
    } catch (error) {
      console.error(`[ERROR] Failed to create session: ${error}`);
      throw error;
    }
  }

  /**
   * Create a new session with custom parameters
   * @param scopes - Authorization scopes
   * @param redirectUri - Redirect URI
   * @param verifier - PKCE verifier
   * @param codeChallenge - PKCE code challenge
   * @param state - State parameter
   * @param metadata - Optional metadata
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
      await this.ensureInitialized();
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 3600000); // 1 hour from now
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
        metadata: metadata ? JSON.stringify(metadata) : null
      };
      
      const params = [
        session.id,
        session.state,
        session.verifier,
        session.code_challenge,
        session.code_challenge_method,
        JSON.stringify(session.scopes),
        session.redirect_uri,
        session.created_at.toISOString(),
        session.updated_at.toISOString(),
        session.expires_at.toISOString(),
        session.is_authenticated ? 1 : 0,
        session.metadata
      ];
      
      await this.runAsync(`
        INSERT INTO sessions
        (id, state, verifier, code_challenge, code_challenge_method, scopes, redirect_uri, created_at, updated_at, expires_at, is_authenticated, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, params);
      
      console.error(`[INFO] OpenID session created: ${sessionId}`);
      return session;
    } catch (error) {
      console.error(`[ERROR] Failed to create OpenID session: ${error}`);
      throw error;
    }
  }

  /**
   * Get session by ID
   * @param id - Session ID
   */
  async getSession(id: string): Promise<SessionData | null> {
    try {
      await this.ensureInitialized();
      
      const session = await this.getAsync(`
        SELECT * FROM sessions WHERE id = ?
      `, [id]);
      
      if (!session) {
        return null;
      }
      
      return this.mapSessionFromDb(session);
    } catch (error) {
      console.error(`[ERROR] Failed to get session: ${error}`);
      return null;
    }
  }

  /**
   * Get session by state
   * @param state - Session state
   */
  async getSessionByState(state: string): Promise<SessionData | null> {
    try {
      await this.ensureInitialized();
      
      const session = await this.getAsync(`
        SELECT * FROM sessions WHERE state = ?
      `, [state]);
      
      if (!session) {
        return null;
      }
      
      return this.mapSessionFromDb(session);
    } catch (error) {
      console.error(`[ERROR] Failed to get session by state: ${error}`);
      return null;
    }
  }

  /**
   * Map database session row to SessionData object
   * @param session - Database session row
   */
  private mapSessionFromDb(session: any): SessionData {
    return {
      ...session,
      scopes: JSON.parse(session.scopes),
      created_at: new Date(session.created_at),
      updated_at: new Date(session.updated_at),
      expires_at: new Date(session.expires_at),
      is_authenticated: session.is_authenticated === 1,
      metadata: session.metadata ? JSON.parse(session.metadata) : undefined
    };
  }

  /**
   * Update session authentication status
   * @param id - Session ID
   * @param isAuthenticated - Authentication status
   */
  async updateSessionAuthStatus(id: string, isAuthenticated: boolean): Promise<void> {
    try {
      await this.ensureInitialized();
      
      const now = new Date();
      
      await this.runAsync(`
        UPDATE sessions
        SET is_authenticated = ?, updated_at = ?
        WHERE id = ?
      `, [
        isAuthenticated ? 1 : 0,
        now.toISOString(),
        id
      ]);
      
      console.error(`[INFO] Session authentication status updated: ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to update session authentication status: ${error}`);
      throw error;
    }
  }

  /**
   * Update session authentication status to authenticated
   * @param id - Session ID
   */
  async updateSessionAuthentication(id: string): Promise<void> {
    return this.updateSessionAuthStatus(id, true);
  }

  /**
   * Update session metadata
   * @param id - Session ID
   * @param metadata - Metadata object
   */
  async updateSessionMetadata(id: string, metadata: any): Promise<void> {
    try {
      await this.ensureInitialized();
      
      const now = new Date();
      
      await this.runAsync(`
        UPDATE sessions
        SET metadata = ?, updated_at = ?
        WHERE id = ?
      `, [
        JSON.stringify(metadata),
        now.toISOString(),
        id
      ]);
      
      console.error(`[INFO] Session metadata updated: ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to update session metadata: ${error}`);
      throw error;
    }
  }

  /**
   * Delete session
   * @param id - Session ID
   */
  async deleteSession(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      
      await this.runAsync(`
        DELETE FROM sessions WHERE id = ?
      `, [id]);
      
      console.error(`[INFO] Session deleted: ${id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to delete session: ${error}`);
      throw error;
    }
  }

  /**
   * Clean up expired sessions
   * @param maxAgeHours - Optional: override default expiration time
   */
  async cleanupExpiredSessions(maxAgeHours?: number): Promise<number> {
    try {
      await this.ensureInitialized();
      
      const now = new Date();
      let query = `DELETE FROM sessions WHERE expires_at < ?`;
      let params = [now.toISOString()];
      
      // If maxAgeHours is provided, use it instead of the expires_at field
      if (maxAgeHours !== undefined) {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() - maxAgeHours);
        query = `DELETE FROM sessions WHERE created_at < ?`;
        params = [expirationDate.toISOString()];
      }
      
      // SQLite特有の処理: runsyncをラップして変更件数を取得
      // better-sqlite3やnode-sqlite3の挙動の違いに対応
      return new Promise((resolve, reject) => {
        this.db.run(query, params, function(err: Error | null) {
          if (err) {
            console.error(`[ERROR] Failed to clean up expired sessions: ${err}`);
            reject(err);
          } else {
            // this.changesはコールバック内でのみ利用可能
            const count = this.changes || 0;
            console.error(`[INFO] Cleaned up ${count} expired sessions`);
            resolve(count);
          }
        });
      });
    } catch (error) {
      console.error(`[ERROR] Failed to clean up expired sessions: ${error}`);
      return 0;
    }
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
