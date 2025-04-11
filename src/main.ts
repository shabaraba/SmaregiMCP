// SDK importは.jsを含める
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// 標準モジュール
import * as path from 'path';
import * as fs from 'node:fs';
import * as os from 'node:os';

// 内部モジュール
import { createServer } from './server/server.js';
import { createProxyServer } from './server/proxy-server.js';

/**
 * ロックファイルパス (重複起動防止用)
 */
const LOCK_FILE_PATH = path.join(os.tmpdir(), 'smaregi-mcp-server.lock');

/**
 * 環境変数名: ProxyOAuthProviderを使用するかどうか
 */
const USE_PROXY_PROVIDER_ENV = 'USE_PROXY_OAUTH_PROVIDER';

/**
 * プロセスが実行中かどうかを確認
 */
function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * サーバーが既に実行中かどうか確認
 */
function checkIfServerAlreadyRunning(): boolean {
  try {
    if (fs.existsSync(LOCK_FILE_PATH)) {
      const pidStr = fs.readFileSync(LOCK_FILE_PATH, 'utf8');
      const pid = parseInt(pidStr, 10);
      
      if (pid && isProcessRunning(pid)) {
        console.error(`[INFO] サーバーはすでにPID ${pid}で実行中です`);
        return true;
      } else {
        fs.unlinkSync(LOCK_FILE_PATH);
      }
    }
    
    fs.writeFileSync(LOCK_FILE_PATH, process.pid.toString(), 'utf8');
    
    process.on('exit', () => {
      if (fs.existsSync(LOCK_FILE_PATH)) {
        try {
          fs.unlinkSync(LOCK_FILE_PATH);
        } catch (err) {
          // 終了時のエラーは無視
        }
      }
    });
    
    process.on('uncaughtException', (err) => {
      console.error(`[ERROR] 未処理の例外: ${err}`);
      if (fs.existsSync(LOCK_FILE_PATH)) {
        try {
          fs.unlinkSync(LOCK_FILE_PATH);
        } catch (err) {
          // 終了時のエラーは無視
        }
      }
      process.exit(1);
    });
    
    return false;
  } catch (err) {
    console.error(`[ERROR] ロックファイル操作中のエラー: ${err}`);
    return false;
  }
}

/**
 * Claude Desktopの設定にMCPを追加
 */
async function init() {
  console.log('👋 Welcome to Smaregi MCP Server!');
  console.log('💁‍♀️ This initialization process will install the Smaregi MCP Server into Claude Desktop');
  console.log('   enabling Claude to interact with the Smaregi API.');
  console.log('🧡 Let\'s get started.');
  
  console.log('Step 1: Checking for Claude Desktop...');
  
  const claudeConfigPath = path.join(
    os.homedir(),
    'Library',
    'Application Support',
    'Claude',
    'claude_desktop_config.json'
  );
  
  const nodePath = process.execPath;
  console.log(`Found Node.js at: ${nodePath}`);
  
  const projectRoot = process.cwd();
  const distPath = path.join(projectRoot, 'dist', 'main');
  
  const config = {
    command: nodePath,
    args: [distPath, 'run-proxy'],
  };
  
  console.log(`Looking for existing config in: ${path.dirname(claudeConfigPath)}`);
  const configDirExists = fs.existsSync(path.dirname(claudeConfigPath));
  
  if (configDirExists) {
    const existingConfig = fs.existsSync(claudeConfigPath)
      ? JSON.parse(fs.readFileSync(claudeConfigPath, 'utf8'))
      : { mcpServers: {} };
      
    if ('smaregi' in (existingConfig?.mcpServers || {})) {
      console.log(
        `Note: Replacing existing Smaregi MCP config:\n${JSON.stringify(
          existingConfig.mcpServers.smaregi
        )}`
      );
    }
    
    const newConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        smaregi: config,
      },
    };
    
    fs.writeFileSync(claudeConfigPath, JSON.stringify(newConfig, null, 2));
    
    console.log('Smaregi MCP Server configured & added to Claude Desktop!');
    console.log(`Wrote config to ${claudeConfigPath}`);
    console.log('Important: This command only configured the MCP server. The server will be');
    console.log('          automatically started by Claude Desktop when needed.');
    console.log('          You do NOT need to run "npm run mcp:run" manually.');
    console.log('Try asking Claude about the Smaregi API to get started!');
  } else {
    const fullConfig = { mcpServers: { smaregi: config } };
    console.log(
      `Couldn't detect Claude Desktop config at ${claudeConfigPath}.\nTo add the Smaregi MCP server manually, add the following config to your MCP config file:\n\n${JSON.stringify(
        fullConfig,
        null,
        2
      )}`
    );
  }
}

/**
 * MCPサーバーを実行
 */
async function run() {
  console.error('[INFO] Claude Desktopからの実行モードで起動します');
  
  if (checkIfServerAlreadyRunning()) {
    console.error('[INFO] 別のSmaregiMCPサーバープロセスが既に実行中です。このインスタンスは終了します。');
    process.exit(0);
    throw new Error('プロセスは終了しました');
  }
  
  console.error('[INFO] MCPサーバーを初期化します');
  
  // シグナルハンドラーの設定
  const setupSignalHandlers = (server: Server) => {
    console.error('[INFO] 終了シグナルハンドラーを設定しています');
    
    const cleanup = async (signal: string) => {
      console.error(`[INFO] シグナル${signal}を受信しました。適切に終了します...`);
      
      try {
        // MCPサーバーを終了
        await server.close();
        
        // Expressサーバーを終了（グローバル変数から取得）
        if (global.expressServer) {
          global.expressServer.close(() => {
            console.error('[INFO] Express server has been closed');
          });
        }
        
        // ロックファイルを削除
        if (fs.existsSync(LOCK_FILE_PATH)) {
          fs.unlinkSync(LOCK_FILE_PATH);
        }
        
        console.error('[INFO] クリーンアップが完了しました。アプリケーションを終了します。');
        process.exit(0);
      } catch (error) {
        console.error(`[ERROR] 終了処理中にエラーが発生しました: ${error}`);
        
        if (fs.existsSync(LOCK_FILE_PATH)) {
          try {
            fs.unlinkSync(LOCK_FILE_PATH);
          } catch (_) {
            // エラーは無視
          }
        }
        process.exit(1);
      }
    };
    
    // シグナルハンドラーを登録
    process.on('SIGINT', () => cleanup('SIGINT'));
    process.on('SIGTERM', () => cleanup('SIGTERM'));
    process.on('SIGHUP', () => cleanup('SIGHUP'));
    
    // 親プロセスの終了検知
    process.stdin.on('end', () => {
      console.error('[INFO] 標準入力が閉じられました。親プロセスが終了した可能性があります。');
      cleanup('STDIN_CLOSE');
    });
    
    console.error('[INFO] 終了シグナルハンドラーの設定が完了しました');
  };

  try {
    // ProxyOAuthProviderを使用するかどうかを環境変数で判断
    const useProxyProvider = process.env[USE_PROXY_PROVIDER_ENV] === 'true';
    
    let server, mcpServer, expressServer;
    
    if (useProxyProvider) {
      console.error('[INFO] ProxyOAuthProviderを使用してMCPサーバーを起動します');
      ({ server, mcpServer, expressServer } = await createProxyServer());
    } else {
      console.error('[INFO] 通常のAuthServiceを使用してMCPサーバーを起動します');
      ({ server, mcpServer, expressServer } = await createServer());
    }
    
    setupSignalHandlers(server);
    
    // Expressサーバーをグローバルビジブルにしてシャットダウンできるようにする
    global.expressServer = expressServer;
    
    // StdioServerTransport経由で接続
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    
    console.error('[INFO] MCPサーバーが起動しました');
  } catch (error) {
    console.error(`[ERROR] サーバー起動中にエラーが発生しました: ${error}`);
    
    if (fs.existsSync(LOCK_FILE_PATH)) {
      try {
        fs.unlinkSync(LOCK_FILE_PATH);
      } catch (_) {
        // エラーは無視
      }
    }
    process.exit(1);
  }
}

/**
 * ProxyOAuthProviderを使用したMCPサーバー実行
 */
async function runWithProxy() {
  // 環境変数を設定
  process.env[USE_PROXY_PROVIDER_ENV] = 'true';
  
  // 通常の実行関数を呼び出し
  await run();
}

// コマンドライン引数のパース
const [cmd, ...args] = process.argv.slice(2);

// コマンドに応じて処理を実行
switch (cmd) {
  case 'init':
    init()
      .then(() => {
        console.log('Initialization complete!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error during initialization:', error);
        process.exit(1);
      });
    break;
  
  case 'run':
    run()
      .catch((error) => {
        console.error(`Unhandled error: ${error}`);
        process.exit(1);
      });
    break;
    
  case 'run-proxy':
    runWithProxy()
      .catch((error) => {
        console.error(`Unhandled error: ${error}`);
        process.exit(1);
      });
    break;
  
  default:
    // ヘルプ表示
    console.log('Usage: node dist/main.js <command>');
    console.log('Available commands:');
    console.log('  init      - Configure the MCP server in Claude Desktop');
    console.log('  run       - Run the MCP server with the standard AuthService');
    console.log('  run-proxy - Run the MCP server with the ProxyOAuthProvider');
    process.exit(0);
}

// グローバル型宣言を追加
declare global {
  var expressServer: any;
}
