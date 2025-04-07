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
  scopes: string[];
  created_at: Date;
  updated_at: Date;
  redirect_uri: string;
  verifier: string;
  code_challenge: string;
  state: string;
  is_authenticated: boolean;
}

/**
 * Session manager for handling OAuth sessions
 */
export class SessionManager {
  private db: any;
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
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          scopes TEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          redirect_uri TEXT NOT NULL,
          verifier TEXT NOT NULL,
          code_challenge TEXT NOT NULL,
          state TEXT NOT NULL,
          is_authenticated INTEGER NOT NULL DEFAULT 0
        )
      `);
      console.error('[INFO] Sessions table initialized');
    } catch (error) {
      console.error(`[ERROR] Failed to initialize sessions schema: ${error}`);
      throw error;
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
      const now = new Date();
      const sessionId = this.generateRandomString(32);
      const verifier = this.generateRandomString(64);
      const codeChallenge = this.createCodeChallenge(verifier);
      const state = this.generateRandomString(32);
      
      const session: SessionData = {
        id: sessionId,
        scopes,
        created_at: now,
        updated_at: now,
        redirect_uri: config.redirectUri,
        verifier,
        code_challenge: codeChallenge,
        state,
        is_authenticated: false
      };
      
      await this.runAsync(`
        INSERT INTO sessions
        (id, scopes, created_at, updated_at, redirect_uri, verifier, code_challenge, state, is_authenticated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        session.id,
        JSON.stringify(session.scopes),
        session.created_at.toISOString(),
        session.updated_at.toISOString(),
        session.redirect_uri,
        session.verifier,
        session.code_challenge,
        session.state,
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
   * Get session by ID
   * @param id - Session ID
   */
  async getSession(id: string): Promise<SessionData | null> {
    try {
      const session = await this.getAsync(`
        SELECT * FROM sessions WHERE id = ?
      `, [id]);
      
      if (!session) {
        return null;
      }
      
      return {
        ...session,
        scopes: JSON.parse(session.scopes),
        created_at: new Date(session.created_at),
        updated_at: new Date(session.updated_at),
        is_authenticated: session.is_authenticated === 1
      };
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
      const session = await this.getAsync(`
        SELECT * FROM sessions WHERE state = ?
      `, [state]);
      
      if (!session) {
        return null;
      }
      
      return {
        ...session,
        scopes: JSON.parse(session.scopes),
        created_at: new Date(session.created_at),
        updated_at: new Date(session.updated_at),
        is_authenticated: session.is_authenticated === 1
      };
    } catch (error) {
      console.error(`[ERROR] Failed to get session by state: ${error}`);
      return null;
    }
  }

  /**
   * Update session authentication status
   * @param id - Session ID
   * @param isAuthenticated - Authentication status
   */
  async updateSessionAuthStatus(id: string, isAuthenticated: boolean): Promise<void> {
    try {
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
   * Delete session
   * @param id - Session ID
   */
  async deleteSession(id: string): Promise<void> {
    try {
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
   * @param maxAgeHours - Maximum age in hours
   */
  async cleanupExpiredSessions(maxAgeHours: number = 24): Promise<number> {
    try {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() - maxAgeHours);
      
      const result = await this.runAsync(`
        DELETE FROM sessions WHERE created_at < ?
      `, [expirationDate.toISOString()]);
      
      const count = (result as any).changes || 0;
      console.error(`[INFO] Cleaned up ${count} expired sessions`);
      return count;
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
