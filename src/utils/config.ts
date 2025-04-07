import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// Load .env file
dotenv.config();

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
