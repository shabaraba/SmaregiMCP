import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerService } from '@nestjs/common';
import * as os from 'node:os';
import * as path from 'path';
import * as fs from 'node:fs';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import * as net from 'net';
import { McpService } from './mcp/mcp.service.js';

const execAsync = promisify(execCallback);

/**
 * 指定されたポートが使用中かどうかをチェックする
 * @param port チェックするポート番号
 * @returns ポートが使用中の場合はtrue、そうでなければfalse
 */
async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        // ポートは既に使用中
        resolve(true);
      } else {
        // その他のエラー
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      // ポートは利用可能
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

/**
 * MCPと互換性のあるカスタムロガー
 * 
 * NestJSのログ出力とMCPのJSON通信が競合するのを防ぐため、
 * 標準エラー出力にログを出力し、カラー出力も無効化します
 */
class McpCompatibleLogger implements LoggerService {
  private readonly logger = new Logger();
  private readonly context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  log(message: string, context?: string): void {
    const ctx = context || this.context;
    // 標準エラー出力に出力
    process.stderr.write(`[INFO] ${ctx ? `[${ctx}] ` : ''}${message}\n`);
  }

  error(message: string, trace?: string, context?: string): void {
    const ctx = context || this.context;
    process.stderr.write(`[ERROR] ${ctx ? `[${ctx}] ` : ''}${message}\n`);
    if (trace) {
      process.stderr.write(`${trace}\n`);
    }
  }

  warn(message: string, context?: string): void {
    const ctx = context || this.context;
    process.stderr.write(`[WARN] ${ctx ? `[${ctx}] ` : ''}${message}\n`);
  }

  debug(message: string, context?: string): void {
    const ctx = context || this.context;
    process.stderr.write(`[DEBUG] ${ctx ? `[${ctx}] ` : ''}${message}\n`);
  }

  verbose(message: string, context?: string): void {
    const ctx = context || this.context;
    process.stderr.write(`[VERBOSE] ${ctx ? `[${ctx}] ` : ''}${message}\n`);
  }
}

async function bootstrap(): Promise<any> {
  const defaultPort = 3000;
  
  // アプリケーション作成前にポートをチェック
  const configPort = process.env.PORT ? parseInt(process.env.PORT, 10) : defaultPort;
  const portInUse = await isPortInUse(configPort);
  
  if (portInUse) {
    // ポートが既に使用中の場合は、HTTPサーバーをスキップし、
    // MCPサーバーの初期化は続行する（McpServiceのonModuleInitで行われる）
    process.stderr.write(`[INFO] ポート${configPort}は既に使用中です。別のプロセスが実行中と思われます。\n`);
    process.stderr.write(`[INFO] HTTPサーバーの起動をスキップします。MCPサーバーのみ初期化します。\n`);
    
    // HTTPサーバーのみスキップし、アプリケーションの初期化は行う
    // そのまま実行を続けてMcpServiceのonModuleInitでMCPサーバーを初期化させる
    const app = await NestFactory.create(AppModule, {
      logger: new McpCompatibleLogger('NestApplication'),
      cors: true,
    });
    
    process.stderr.write(`[INFO] MCPサーバーを初期化しています。HTTPサーバーは起動しません。\n`);
    return app; // アプリケーションインスタンスを返す（app.listen()はスキップ）
  }
  
  // MCP互換のカスタムロガーを使用
  const app = await NestFactory.create(AppModule, {
    logger: new McpCompatibleLogger('NestApplication'),
    // NestJSのカラーログを無効化
    cors: true,
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', defaultPort);
  
  await app.listen(port);
  // 標準エラー出力にログを出力
  process.stderr.write(`[INFO] Application running on: http://localhost:${port}\n`);
  
  return app; // アプリケーションインスタンスを返す
}

// Claude Desktopの設定にMCPを追加するinitコマンド
async function init() {
  // init関数では標準出力に出力しても問題ないのでconsole.logのまま
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
  
  // JavaScriptへのパスを探す
  const nodePath = process.execPath;
  console.log(`Found Node.js at: ${nodePath}`);
  
  // 実行ファイルの絶対パスを取得
  const projectRoot = process.cwd();
  const distPath = path.join(projectRoot, 'dist', 'main.js');
  
  // 設定オブジェクト
  const config = {
    command: nodePath,
    args: [distPath, 'run'],
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

// Commandラインパラメータの処理
const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'init') {
  init()
    .then(() => {
      console.log('Initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during initialization:', error);
      process.exit(1);
    });
} else if (cmd === 'run') {
  process.stderr.write('[INFO] Claude Desktopからの実行モードで起動します\n');
  process.stderr.write('[INFO] MCPサーバーが初期化されます\n');
  process.stderr.write('[INFO] ポートが既に使用中の場合は、HTTPサーバーの起動をスキップしてMCPサーバーのみ初期化します\n');
  
  // 親プロセスの終了を検知するハンドラー
  let app: any = null;
  let mcpService: McpService | null = null;

  // 各種終了シグナルのハンドラーを設定
  const setupSignalHandlers = (nestApp: any) => {
    process.stderr.write('[INFO] 終了シグナルハンドラーを設定しています\n');
    
    // MCPサービスの取得
    try {
      mcpService = nestApp.get(McpService);
    } catch (e) {
      process.stderr.write(`[WARN] MCPサービスの取得に失敗しました: ${e}\n`);
    }
    
    // 正常終了時のクリーンアップ処理
    const cleanup = async (signal: string) => {
      process.stderr.write(`[INFO] シグナル${signal}を受信しました。適切に終了します...\n`);
      
      try {
        // MCPサービスのクリーンアップ
        if (mcpService) {
          await mcpService.cleanup();
        }
        
        // NestJSアプリケーションの終了
        if (app && typeof app.close === 'function') {
          await app.close();
        }
        
        process.stderr.write('[INFO] クリーンアップが完了しました。アプリケーションを終了します。\n');
        process.exit(0);
      } catch (error) {
        process.stderr.write(`[ERROR] 終了処理中にエラーが発生しました: ${error}\n`);
        process.exit(1);
      }
    };
    
    // シグナルハンドラーを登録
    process.on('SIGINT', () => cleanup('SIGINT'));
    process.on('SIGTERM', () => cleanup('SIGTERM'));
    process.on('SIGHUP', () => cleanup('SIGHUP'));
    
    // 親プロセスの終了検知（stdin/stdoutのクローズ）
    process.stdin.on('end', () => {
      process.stderr.write('[INFO] 標準入力が閉じられました。親プロセスが終了した可能性があります。\n');
      cleanup('STDIN_CLOSE');
    });
    
    process.stderr.write('[INFO] 終了シグナルハンドラーの設定が完了しました\n');
  };
  
  bootstrap()
    .then((nestApp) => {
      if (nestApp) {
        app = nestApp;
        setupSignalHandlers(app);
      } else {
        // app.listenをスキップした場合（ポートが使用中の場合）
        process.stderr.write('[INFO] HTTPサーバーなしでMCPサーバーが初期化されました\n');
        
        // NestJSのアプリケーションコンテキストを取得
        NestFactory.createApplicationContext(AppModule, {
          logger: new McpCompatibleLogger('NestApplication'),
        }).then((appContext) => {
          setupSignalHandlers(appContext);
        });
      }
    })
    .catch((error) => {
      // EADDRINUSEエラーは特別に処理
      if (error.code === 'EADDRINUSE') {
        process.stderr.write(`[INFO] ポートが既に使用中です。MCPサーバーのみ初期化します。\n`);
        
        // NestJSのアプリケーションコンテキストを取得
        NestFactory.createApplicationContext(AppModule, {
          logger: new McpCompatibleLogger('NestApplication'),
        }).then((appContext) => {
          setupSignalHandlers(appContext);
        });
        
        return;
      } else {
        console.error('Error starting server:', error);
        process.exit(1);
      }
    });
} else {
  // コマンドが指定されていない場合はヘルプを表示
  console.log('Usage: node dist/main.js <command>');
  console.log('Available commands:');
  console.log('  init - Configure the MCP server in Claude Desktop');
  console.log('  run  - Run the MCP server');
  process.exit(0);
}
