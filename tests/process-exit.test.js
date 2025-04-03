/**
 * MCPサーバーが親プロセスの終了を検知して適切に終了するかテストする
 */
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { setTimeout } from 'timers/promises';

// ESモジュールで __dirname を取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// テスト用のログファイル
const logFile = path.join(projectRoot, 'tests', 'mcp-exit-test.log');

// ログ出力関数
function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `${timestamp} ${message}\n`);
}

/**
 * MCPサーバーの起動と終了をテスト
 */
async function testMcpServerExit() {
  // ログファイルをクリア
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
  
  log('テスト開始: MCPサーバー終了テスト');
  
  try {
    // 親プロセスとして子プロセスを起動
    log('子プロセスを起動...');
    const nodePath = process.execPath;
    const scriptPath = path.join(projectRoot, 'dist', 'main.js');
    
    // MCPサーバーを起動
    const childProcess = spawn(nodePath, [scriptPath, 'run'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false, // 親プロセスにアタッチされたままにする
    });
    
    // プロセスIDを記録
    log(`子プロセスが起動されました。PID: ${childProcess.pid}`);
    
    // 標準出力と標準エラー出力をログに記録
    childProcess.stdout.on('data', (data) => {
      log(`子プロセス stdout: ${data.toString().trim()}`);
    });
    
    childProcess.stderr.on('data', (data) => {
      log(`子プロセス stderr: ${data.toString().trim()}`);
    });
    
    // 子プロセスの終了を監視
    childProcess.on('exit', (code, signal) => {
      log(`子プロセスが終了しました。終了コード: ${code}, シグナル: ${signal}`);
    });
    
    // 子プロセスが初期化されるまで少し待機
    log('子プロセスが初期化されるまで2秒待機...');
    await setTimeout(2000);
    
    // 親プロセスの終了をシミュレート（SIGTERM送信）
    log('親プロセスの終了をシミュレート: SIGTERMを送信');
    childProcess.kill('SIGTERM');
    
    // 子プロセスが終了するのを待機
    log('子プロセスが終了するのを3秒待機...');
    await setTimeout(3000);
    
    // 子プロセスがまだ実行中かチェック
    let isRunning = false;
    try {
      // kill(0)は実際に終了させず、プロセスが存在するかをチェックするだけ
      process.kill(childProcess.pid, 0);
      isRunning = true;
      log('子プロセスはまだ実行中です');
    } catch (e) {
      // プロセスが存在しない場合はエラーになる
      log('子プロセスは終了しています');
    }
    
    if (isRunning) {
      // 強制終了
      log('子プロセスを強制終了します');
      childProcess.kill('SIGKILL');
      log('テスト失敗: 子プロセスが親プロセスの終了シグナルで終了しませんでした');
      process.exit(1);
    } else {
      log('テスト成功: 子プロセスは親プロセスの終了シグナルで適切に終了しました');
    }
  } catch (error) {
    log(`テスト中にエラーが発生しました: ${error.message}`);
    console.error('テストエラー:', error);
    process.exit(1);
  }
}

// テスト実行
testMcpServerExit();
