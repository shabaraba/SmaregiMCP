import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Session data interface
interface SessionData {
  id: string;
  scopes: string[];
  createdAt: string;
  redirectUri: string;
  verifier: string;
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * Handles OAuth2 authentication with Smaregi API
 */
export class AuthService {
  private sessions: Map<string, SessionData> = new Map();
  private readonly sessionsFilePath: string;
  
  constructor() {
    // Set the path for sessions file
    this.sessionsFilePath = path.join(os.homedir(), '.smaregi-mcp-sessions.json');
    
    // Load existing sessions
    this.loadSessions();
  }
  
  /**
   * Load sessions from disk
   */
  private loadSessions(): void {
    try {
      if (fs.existsSync(this.sessionsFilePath)) {
        const data = fs.readFileSync(this.sessionsFilePath, 'utf-8');
        const sessions = JSON.parse(data);
        
        for (const [id, session] of Object.entries<SessionData>(sessions)) {
          this.sessions.set(id, session);
        }
        
        console.error(`[INFO] Loaded ${this.sessions.size} sessions from ${this.sessionsFilePath}`);
      }
    } catch (error) {
      console.error(`[ERROR] Failed to load sessions: ${error}`);
    }
  }
  
  /**
   * Save sessions to disk
   */
  private saveSessions(): void {
    try {
      const sessions: Record<string, SessionData> = {};
      this.sessions.forEach((session, id) => {
        sessions[id] = session;
      });
      
      fs.writeFileSync(this.sessionsFilePath, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch (error) {
      console.error(`[ERROR] Failed to save sessions: ${error}`);
    }
  }
  
  /**
   * Generate a random string
   */
  private generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }
  
  /**
   * Generate authorization URL
   */
  async getAuthorizationUrl(scopes: string[]): Promise<{ url: string; sessionId: string }> {
    // Generate session ID
    const sessionId = this.generateRandomString(16);
    
    // Generate PKCE verifier and challenge
    const verifier = this.generateRandomString(64);
    const challenge = crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Store session data
    const session: SessionData = {
      id: sessionId,
      scopes,
      createdAt: new Date().toISOString(),
      redirectUri: 'https://localhost:3000/callback',
      verifier,
      isAuthenticated: false
    };
    
    this.sessions.set(sessionId, session);
    this.saveSessions();
    
    // Mock URL for now
    const authUrl = `https://smaregi.auth.example.com/authorize?client_id=mock_client_id&response_type=code&state=${sessionId}`;
    
    return {
      url: authUrl,
      sessionId
    };
  }
  
  /**
   * Check authentication status
   */
  async checkAuthStatus(sessionId: string): Promise<{ isAuthenticated: boolean; sessionId: string }> {
    const session = this.sessions.get(sessionId);
    
    if (\!session) {
      return {
        isAuthenticated: false,
        sessionId
      };
    }
    
    return {
      isAuthenticated: session.isAuthenticated,
      sessionId
    };
  }
  
  /**
   * Get access token for a session
   */
  async getAccessToken(sessionId: string): Promise<string | null> {
    const session = this.sessions.get(sessionId);
    
    if (\!session || \!session.isAuthenticated) {
      return null;
    }
    
    return session.accessToken || null;
  }
}
