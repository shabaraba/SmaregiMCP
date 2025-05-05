/**
 * Cloudflare Workers向けの設定管理
 * 環境変数はCloudflare Workersの環境変数から取得します。
 */

// デフォルト設定
const DEFAULT_VALUES = {
  debug: false,
  serverName: 'smaregi',
  serverVersion: '1.0.0',
  redirectUri: 'https://mcp.example.com/auth/callback',
  smaregiAuthUrl: 'https://id.smaregi.dev/authorize',
  smaregiTokenEndpoint: 'https://id.smaregi.dev/authorize/token',
  smaregiApiUrl: 'https://api.smaregi.dev',
  nodeEnv: 'production'
};

// 設定インターフェース
export interface CloudflareConfig {
  debug: boolean;
  serverName: string;
  serverVersion: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  smaregiAuthUrl: string;
  smaregiTokenEndpoint: string;
  smaregiApiUrl: string;
  nodeEnv: string;
}

/**
 * Cloudflare環境変数から設定を生成する
 * @param env Cloudflare環境変数
 */
export function createCloudflareConfig(env: Env): CloudflareConfig {
  // 環境変数から設定を取得してデフォルト値と結合
  const config: CloudflareConfig = {
    debug: env.DEBUG === 'true' || DEFAULT_VALUES.debug,
    serverName: env.SERVER_NAME || DEFAULT_VALUES.serverName,
    serverVersion: env.SERVER_VERSION || DEFAULT_VALUES.serverVersion,
    clientId: env.CLIENT_ID || '',
    clientSecret: env.CLIENT_SECRET || '',
    redirectUri: env.REDIRECT_URI || DEFAULT_VALUES.redirectUri,
    smaregiAuthUrl: env.SMAREGI_AUTH_URL || DEFAULT_VALUES.smaregiAuthUrl,
    smaregiTokenEndpoint: env.SMAREGI_TOKEN_ENDPOINT || DEFAULT_VALUES.smaregiTokenEndpoint,
    smaregiApiUrl: env.SMAREGI_API_URL || DEFAULT_VALUES.smaregiApiUrl,
    nodeEnv: env.NODE_ENV || DEFAULT_VALUES.nodeEnv
  };

  // 設定のログ出力
  console.error('[INFO] Cloudflare Worker Configuration loaded:');
  console.error(`  - Debug mode: ${config.debug}`);
  console.error(`  - Environment: ${config.nodeEnv}`);
  console.error(`  - Client ID: ${config.clientId ? `${config.clientId.substring(0, 4)}...` : 'NOT SET'}`);
  console.error(`  - Redirect URI: ${config.redirectUri}`);
  console.error(`  - Smaregi Auth URL: ${config.smaregiAuthUrl}`);

  // CLIENT_IDの重要なチェック
  if (!config.clientId) {
    console.error('[ERROR] CLIENT_ID environment variable is not set. Authentication will fail.');
  }

  return config;
}