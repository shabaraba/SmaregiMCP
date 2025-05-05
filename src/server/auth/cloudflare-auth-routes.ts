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
</html>`
};