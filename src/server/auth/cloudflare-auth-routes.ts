import { CloudflareAuthService } from '../../auth/cloudflare-auth-service.js';

/**
 * Cloudflare用の認証ルート設定
 * @param env Cloudflare環境変数
 */
export function setupCloudflareAuthRoutes(env: Env): CloudflareAuthService {
  // 認証サービスを作成
  const authService = new CloudflareAuthService(env);
  
  console.error('[INFO] Cloudflare auth routes setup completed');
  
  return authService;
}

/**
 * HTML読み込みユーティリティ
 * Cloudflare Workersでは事前にHTML文字列をハードコードするか、
 * ビルド時に埋め込む必要があります。
 */
export const AUTH_HTML_TEMPLATES = {
  // 認証成功ページ
  success: `<!DOCTYPE html>
<html>
<head>
  <title>Authentication Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 40px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    h1 {
      color: #4CAF50;
      margin-bottom: 20px;
    }
    p {
      font-size: 18px;
      line-height: 1.5;
      color: #333;
      margin-bottom: 30px;
    }
    .close {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .close:hover {
      background-color: #3e8e41;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>認証成功</h1>
    <p>スマレジAPIへの認証が完了しました。このウィンドウは閉じて構いません。</p>
    <a href="#" class="close" onclick="window.close()">ウィンドウを閉じる</a>
  </div>
  <script>
    setTimeout(function() {
      window.close();
    }, 3000);
  </script>
</body>
</html>`,

  // 認証エラーページ
  error: `<!DOCTYPE html>
<html>
<head>
  <title>Authentication Error</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 40px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    h1 {
      color: #f44336;
      margin-bottom: 20px;
    }
    p {
      font-size: 18px;
      line-height: 1.5;
      color: #333;
      margin-bottom: 30px;
    }
    .error-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: left;
      overflow-wrap: break-word;
    }
    .close {
      display: inline-block;
      background-color: #f44336;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .close:hover {
      background-color: #d32f2f;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>認証エラー</h1>
    <p>スマレジAPIへの認証中にエラーが発生しました。</p>
    <div class="error-details">
      <strong>エラー詳細:</strong><br>
      <span id="error-message">エラーが発生しました。もう一度やり直してください。</span>
    </div>
    <a href="#" class="close" onclick="window.close()">ウィンドウを閉じる</a>
  </div>
  <script>
    // URLからエラーメッセージを取得
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage) {
      document.getElementById('error-message').textContent = errorMessage;
    }
    
    setTimeout(function() {
      window.close();
    }, 10000);
  </script>
</body>
</html>`,

  // コールバックページ (認証コード取得用)
  callback: `<!DOCTYPE html>
<html>
<head>
  <title>Processing Authentication</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 40px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    h1 {
      color: #2196F3;
      margin-bottom: 20px;
    }
    p {
      font-size: 18px;
      line-height: 1.5;
      color: #333;
      margin-bottom: 30px;
    }
    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #2196F3;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>認証処理中</h1>
    <p>認証情報を処理しています。このウィンドウは自動的に閉じられます。</p>
    <div class="loader"></div>
  </div>
  <script>
    // URLからパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      // サーバーにコードとステートを送信
      fetch('/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state })
      })
      .then(response => {
        if (response.ok) {
          // 認証成功画面にリダイレクト
          window.location.href = '/auth/success';
        } else {
          // エラー情報を取得して失敗画面にリダイレクト
          return response.text().then(errorText => {
            window.location.href = \`/auth/error?error=\${encodeURIComponent(errorText)}\`;
          });
        }
      })
      .catch(error => {
        window.location.href = \`/auth/error?error=\${encodeURIComponent(error.message)}\`;
      });
    } else {
      window.location.href = '/auth/error?error=認証コードまたはステートパラメータが見つかりません';
    }
  </script>
</body>
</html>`,

  // 自動認証フローのためのページ（APIポーリング付き）
  auto_auth: `<!DOCTYPE html>
<html>
<head>
  <title>Smaregi API Authentication</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 40px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 100%;
    }
    h1 {
      color: #2196F3;
      margin-bottom: 20px;
    }
    p {
      font-size: 18px;
      line-height: 1.5;
      color: #333;
      margin-bottom: 30px;
    }
    .status {
      margin: 20px 0;
      padding: 15px;
      border-radius: 5px;
      background-color: #f0f0f0;
      text-align: left;
    }
    .status-pending {
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
    }
    .status-completed {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }
    .status-failed {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #2196F3;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      margin: 10px;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s;
    }
    .btn-primary {
      background-color: #2196F3;
      color: white;
    }
    .btn-primary:hover {
      background-color: #0b7dda;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    .auth-window {
      display: none;
      border: 1px solid #ddd;
      border-radius: 5px;
      width: 100%;
      height: 200px;
      margin-top: 20px;
    }
    .token-display {
      word-break: break-all;
      font-family: monospace;
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      text-align: left;
      white-space: pre-wrap;
      display: none;
    }
    .hidden {
      display: none;
    }
    .visible {
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>スマレジ API 認証</h1>
    
    <div id="auth-process" class="visible">
      <p>スマレジAPIへの認証を自動処理しています。新しいウィンドウが開いたら、スマレジIDでログインしてください。</p>
      
      <div id="status-container" class="status status-pending">
        <div class="loader" id="status-loader"></div>
        <span id="status-message">認証ページを開いています...</span>
      </div>
      
      <div>
        <button id="auth-button" class="btn btn-primary">認証開始</button>
        <button id="check-status-button" class="btn btn-secondary" disabled>認証状態を確認</button>
        <button id="copy-token-button" class="btn btn-secondary hidden">トークンをコピー</button>
      </div>
      
      <div id="token-display" class="token-display"></div>
    </div>
  </div>

  <script>
    // グローバル変数
    let authWindow = null;
    let requestId = null;
    let authUrl = null;
    let pollInterval = null;
    let retryCount = 0;
    const MAX_RETRY = 60; // 最大リトライ回数（5秒間隔で5分）
    
    // DOM要素
    const authButton = document.getElementById('auth-button');
    const checkStatusButton = document.getElementById('check-status-button');
    const copyTokenButton = document.getElementById('copy-token-button');
    const statusContainer = document.getElementById('status-container');
    const statusLoader = document.getElementById('status-loader');
    const statusMessage = document.getElementById('status-message');
    const tokenDisplay = document.getElementById('token-display');
    
    // 認証の開始
    authButton.addEventListener('click', async () => {
      try {
        // ボタンを無効化
        authButton.disabled = true;
        statusMessage.textContent = '認証URLを取得中...';
        
        // 認証URLを取得
        const response = await fetch('/auth/authorize?format=json&scopes=pos.products:read');
        if (!response.ok) {
          throw new Error('認証URLの取得に失敗しました');
        }
        
        const data = await response.json();
        requestId = data.request_id;
        authUrl = data.auth_url;
        
        // 認証ウィンドウを開く
        authWindow = window.open(authUrl, 'auth_window', 'width=800,height=600');
        
        if (!authWindow) {
          throw new Error('ポップアップウィンドウが開けませんでした。ポップアップブロックを無効にしてください。');
        }
        
        // ステータスを更新
        statusMessage.textContent = '認証ウィンドウが開きました。スマレジIDでログインしてください。';
        checkStatusButton.disabled = false;
        
        // ポーリングを開始
        startPolling();
      } catch (error) {
        statusContainer.className = 'status status-failed';
        statusLoader.style.display = 'none';
        statusMessage.textContent = \`エラー: \${error.message}\`;
        authButton.disabled = false;
      }
    });
    
    // ステータス確認ボタン
    checkStatusButton.addEventListener('click', async () => {
      checkStatus();
    });
    
    // トークンコピーボタン
    copyTokenButton.addEventListener('click', () => {
      const token = tokenDisplay.getAttribute('data-token');
      if (token) {
        navigator.clipboard.writeText(token)
          .then(() => {
            copyTokenButton.textContent = 'コピーしました！';
            setTimeout(() => {
              copyTokenButton.textContent = 'トークンをコピー';
            }, 2000);
          })
          .catch(err => {
            console.error('コピーに失敗しました:', err);
          });
      }
    });
    
    // ポーリングを開始
    function startPolling() {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      
      retryCount = 0;
      pollInterval = setInterval(checkStatus, 5000); // 5秒ごとにステータスをチェック
    }
    
    // ポーリングを停止
    function stopPolling() {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    }
    
    // 認証ステータスを確認
    async function checkStatus() {
      if (!requestId) {
        return;
      }
      
      try {
        retryCount++;
        
        // 最大リトライ回数に達した場合
        if (retryCount > MAX_RETRY) {
          stopPolling();
          statusContainer.className = 'status status-failed';
          statusLoader.style.display = 'none';
          statusMessage.textContent = '認証がタイムアウトしました。もう一度お試しください。';
          authButton.disabled = false;
          return;
        }
        
        const response = await fetch(\`/auth/status/\${requestId}\`);
        if (!response.ok) {
          throw new Error('ステータスの取得に失敗しました');
        }
        
        const data = await response.json();
        
        if (data.status === 'completed') {
          // 認証成功
          stopPolling();
          statusContainer.className = 'status status-completed';
          statusLoader.style.display = 'none';
          statusMessage.textContent = '認証が完了しました！';
          
          // トークンと契約IDを表示
          const token = data.auth_data?.access_token;
          const contractId = data.auth_data?.contract_id;
          if (token) {
            tokenDisplay.textContent = \`Access Token: \${token.substring(0, 20)}...\n\nContract ID: \${contractId || 'Not available'}\`;
            tokenDisplay.setAttribute('data-token', token);
            tokenDisplay.classList.remove('hidden');
            tokenDisplay.classList.add('visible');
            
            copyTokenButton.classList.remove('hidden');
            copyTokenButton.classList.add('visible');
          }
          
          // 認証ウィンドウを閉じる
          if (authWindow && !authWindow.closed) {
            authWindow.close();
          }
          
        } else if (data.status === 'failed') {
          // 認証失敗
          stopPolling();
          statusContainer.className = 'status status-failed';
          statusLoader.style.display = 'none';
          statusMessage.textContent = \`認証に失敗しました: \${data.error || '不明なエラー'}\`;
          authButton.disabled = false;
          
        } else if (data.status === 'not_found') {
          // リクエストが見つからない
          statusMessage.textContent = '認証情報が見つかりません。認証を開始してください。';
          authButton.disabled = false;
          
        } else {
          // ペンディング状態
          statusMessage.textContent = \`認証処理中です... (\${retryCount}秒経過)\`;
        }
      } catch (error) {
        console.error('ステータスチェックエラー:', error);
        statusMessage.textContent = \`ステータスの確認中にエラーが発生しました: \${error.message}\`;
      }
    }
    
    // ページロード時に認証ボタンにフォーカス
    window.addEventListener('DOMContentLoaded', () => {
      authButton.focus();
    });
  </script>
</body>
</html>`
};
};