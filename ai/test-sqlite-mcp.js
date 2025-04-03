/**
 * SQLiteのログがMCPプロトコルに与える影響をテストするスクリプト
 */
const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// MCPメッセージの模擬
const mcpMessages = [
  JSON.stringify({ jsonrpc: '2.0', method: 'hello', params: { message: 'Hello from Client' }, id: 1 }),
  JSON.stringify({ jsonrpc: '2.0', method: 'query', params: { sql: 'SELECT * FROM test' }, id: 2 }),
  JSON.stringify({ jsonrpc: '2.0', method: 'goodbye', params: {}, id: 3 }),
];

// テスト用の応答処理
function processStdout(data) {
  const lines = data.toString().split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    try {
      // 行がJSONかどうかを確認
      const json = JSON.parse(line);
      console.error('Received valid JSON:', json);
    } catch (error) {
      console.error('Received non-JSON output:', line);
    }
  });
}

// アプリケーションをテストモードで起動
console.error('Starting application in test mode...');
const appProcess = spawn('node', ['--unhandled-rejections=strict', './dist/main.js'], {
  env: {
    ...process.env,
    NODE_ENV: 'development',
    DEBUG: 'true',
  },
  cwd: path.resolve(__dirname, '..'),
  stdio: ['pipe', 'pipe', process.stderr],
});

// 標準出力を処理
appProcess.stdout.on('data', processStdout);

// アプリケーション起動待ち
setTimeout(() => {
  console.error('Sending MCP test messages...');
  
  // MCPメッセージを送信
  mcpMessages.forEach(message => {
    appProcess.stdin.write(message + '\n');
    console.error('Sent:', message);
  });
  
  // 終了のタイミングを待つ
  setTimeout(() => {
    console.error('Test completed, terminating...');
    appProcess.kill();
  }, 3000);
}, 2000);

// エラーハンドリング
appProcess.on('error', (error) => {
  console.error('Error spawning process:', error);
});

appProcess.on('close', (code) => {
  console.error(`Process exited with code ${code}`);
});
