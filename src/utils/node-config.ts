import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ESモジュール対応のパス解決
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

// 複数の可能性のある場所から.envを探す
const possibleEnvPaths = [
  path.join(projectRoot, '.env'),               // プロジェクトルート
  path.resolve(process.cwd(), '.env'),          // カレントディレクトリ
  path.join(os.homedir(), '.smaregi-mcp', '.env') // ホームディレクトリの設定フォルダ
];

// .envファイルをロード
let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.error(`[INFO] Loading .env from: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('[WARN] No .env file found. Using default or environment variables only.');
}

/**
 * Configuration interface
 */
export interface Config {
  debug: boolean;
  serverName: string;
  serverVersion: string;
  databasePath: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  contractId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  smaregiAuthUrl: string;
  smaregiTokenEndpoint: string;
  smaregiApiUrl: string;
  port: number;
  nodeEnv: string;
}

/**
 * Validate and ensure database path is accessible
 * If path does not exist, try to create parent directories
 */
function validateDatabasePath(dbPath?: string): string {
  if (!dbPath) {
    return path.join(projectRoot, 'smaregi-mcp.sqlite');
  }
  
  // Handle absolute path
  const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(projectRoot, dbPath);
  const dbDir = path.dirname(absolutePath);
  
  // Check if directory exists
  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true });
      console.error(`[INFO] Created database directory: ${dbDir}`);
    } catch (error) {
      console.error(`[ERROR] Failed to create database directory: ${dbDir}`, error);
      // Fallback to project root
      return path.join(projectRoot, 'smaregi-mcp.sqlite');
    }
  }
  
  return absolutePath;
}

// Create config object
export const config: Config = {
  debug: process.env.DEBUG === 'true',
  serverName: process.env.SERVER_NAME || 'smaregi',
  serverVersion: process.env.SERVER_VERSION || '1.0.0',
  databasePath: validateDatabasePath(process.env.DATABASE_PATH),
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  contractId: process.env.CONTRACT_ID || '',
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  redirectUri: process.env.REDIRECT_URI || 'http://127.0.0.1:3000/auth/callback',
  smaregiAuthUrl: process.env.SMAREGI_AUTH_URL || 'https://id.smaregi.dev/authorize',
  smaregiTokenEndpoint: process.env.SMAREGI_TOKEN_ENDPOINT || 'https://id.smaregi.dev/authorize/token',
  smaregiApiUrl: process.env.SMAREGI_API_URL || 'https://api.smaregi.dev',
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Log configuration
console.error('[INFO] Configuration loaded:');
console.error(`  - Debug mode: ${config.debug}`);
console.error(`  - Database path: ${config.databasePath}`);
console.error(`  - Environment: ${config.nodeEnv}`);
console.error(`  - Client ID: ${config.clientId ? `${config.clientId.substring(0, 4)}...` : 'NOT SET'}`);
console.error(`  - Redirect URI: ${config.redirectUri}`);
console.error(`  - Smaregi Auth URL: ${config.smaregiAuthUrl}`);

if (!config.clientId) {
  console.error('[ERROR] CLIENT_ID environment variable is not set. Authentication will fail.');
  // 環境変数のロード元を確認する情報を出力
  console.error(`[DEBUG] Current working directory: ${process.cwd()}`);
  console.error(`[DEBUG] Process argv: ${process.argv.join(' ')}`);
  console.error(`[DEBUG] ENV variables: ${Object.keys(process.env).filter(key => !key.includes('SECRET')).join(', ')}`);
}