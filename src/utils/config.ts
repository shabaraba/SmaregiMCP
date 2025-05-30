
// Cloudflare Workers環境用のポリフィル
const fs = {
  readFileSync: (filePath, options) => {
    console.error(`[WARN] fs.readFileSync called in Cloudflare environment: ${filePath}`);
    return '';
  },
  existsSync: (filePath) => {
    console.error(`[WARN] fs.existsSync called in Cloudflare environment: ${filePath}`);
    return false;
  },
  writeFileSync: (filePath, data, options) => {
    console.error(`[WARN] fs.writeFileSync called in Cloudflare environment: ${filePath}`);
    return;
  },
  mkdirSync: (dirPath, options) => {
    console.error(`[WARN] fs.mkdirSync called in Cloudflare environment: ${dirPath}`);
    return;
  }
};

const path = {
  resolve: (...paths) => {
    return '/' + paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  join: (...paths) => {
    return paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  dirname: (filePath) => {
    return filePath.split('/').slice(0, -1).join('/') || '/';
  },
  basename: (filePath, ext) => {
    const base = filePath.split('/').pop() || '';
    if (ext && base.endsWith(ext)) {
      return base.slice(0, -ext.length);
    }
    return base;
  }
};

// Cloudflare Workers環境用のprocess.cwdポリフィル
const process = {
  cwd: () => '/',
  env: { 
    NODE_ENV: 'production',
    DEBUG: 'false',
    SERVER_NAME: 'smaregi',
    SERVER_VERSION: '1.0.0',
    DATABASE_PATH: '/tmp/smaregi-mcp.sqlite',
    JWT_SECRET: 'default_jwt_secret',
    JWT_EXPIRES_IN: '1d',
    CONTRACT_ID: '',
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URI: 'http://127.0.0.1:3000/auth/callback',
    SMAREGI_AUTH_URL: 'https://id.smaregi.dev/authorize',
    SMAREGI_TOKEN_ENDPOINT: 'https://id.smaregi.dev/authorize/token',
    SMAREGI_API_URL: 'https://api.smaregi.dev',
    PORT: '3000'
  },
  argv: ['node', 'index.js']
};
import dotenv from 'dotenv';
// import * as path from 'path';
// import * as fs from 'fs';
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

let envFound = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.error(`[DEBUG] Found .env at: ${envPath}`);
    dotenv.config({ path: envPath });
    envFound = true;
    break;
  }
}

if (!envFound) {
  console.error('[WARN] No .env file found. Using default or environment variables only.');
  // 明示的にカレントディレクトリを指定してみる（最後の手段）
  dotenv.config();
}

// Default values
const DEFAULT_DATABASE_PATH = path.join(os.homedir(), '.smaregi-mcp', 'database.sqlite');

// Config interface
interface Config {
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

// Check if database path specified in .env is valid
function validateDatabasePath(path: string | undefined): string {
  if (!path) return DEFAULT_DATABASE_PATH;
  
  // If path is relative, make it absolute
  if (!path.startsWith('/') && !path.match(/^[A-Z]:\\/)) {
    console.error('[WARN] Using relative database path is not recommended. Please use absolute path.');
    return DEFAULT_DATABASE_PATH;
  }
  
  // Log the actual path being used
  console.error(`[DEBUG] Database path from .env: ${path}`);
  
  // Ensure directory exists
  const dirPath = path.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(dirPath)) {
    console.error(`[WARN] Database directory does not exist: ${dirPath}`);
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.error(`[INFO] Created database directory: ${dirPath}`);
    } catch (error) {
      console.error(`[ERROR] Failed to create database directory: ${error}`);
      return DEFAULT_DATABASE_PATH;
    }
  }
  
  return path;
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
