# Cloudflare Workers デプロイメントガイド

このガイドでは、Smaregi MCPサーバーをCloudflare Workersにデプロイして、リモートMCPとして使用する方法を説明します。

## 前提条件

- Cloudflareアカウント
- Wrangler CLI がインストール済み（`npm install -g wrangler`）
- スマレジのOAuthアプリケーション（Client ID/Secret）

## デプロイ手順

### 1. Cloudflareへのログイン

```bash
wrangler login
```

### 2. KVネームスペースの作成

セッションとトークンを保存するためのKVネームスペースを作成します：

```bash
# セッション用KVネームスペース
wrangler kv:namespace create "SESSIONS"

# トークン用KVネームスペース  
wrangler kv:namespace create "TOKENS"
```

作成後に表示されるIDをメモしておき、`wrangler.toml`の該当箇所を更新してください。

### 3. D1データベースの作成（オプション）

より高度なデータ管理が必要な場合：

```bash
wrangler d1 create smaregi-mcp-cache
```

### 4. 環境変数の設定

#### シークレットの設定

```bash
# OAuthクライアントID
wrangler secret put CLIENT_ID

# OAuthクライアントシークレット
wrangler secret put CLIENT_SECRET
```

#### wrangler.tomlの更新

以下の値を実際の環境に合わせて更新してください：

```toml
[vars]
# あなたのWorkers URLに置き換えてください
REDIRECT_URI = "https://smaregi-mcp.your-subdomain.workers.dev/auth/callback"
MCP_BASE_URL = "https://smaregi-mcp.your-subdomain.workers.dev"

# スマレジのエンドポイント（必要に応じて変更）
SMAREGI_AUTH_URL = "https://id.smaregi.dev/authorize"
SMAREGI_TOKEN_ENDPOINT = "https://id.smaregi.dev/authorize/token"
SMAREGI_USERINFO_ENDPOINT = "https://id.smaregi.dev/userinfo"
SMAREGI_API_URL = "https://api.smaregi.dev"
```

### 5. ビルドとデプロイ

```bash
# プロジェクトをビルド
npm run build:cloudflare

# Workersにデプロイ
wrangler deploy
```

### 6. スマレジOAuthアプリの設定

スマレジの開発者ポータルで、リダイレクトURIを以下のように設定してください：

```
https://smaregi-mcp.your-subdomain.workers.dev/auth/callback
```

## Claude Desktopでの設定

Claude Desktopの設定ファイル（`claude_desktop_config.json`）に以下を追加します：

### macOSの場合
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Windowsの場合
`%APPDATA%\Claude\claude_desktop_config.json`

### 設定内容

```json
{
  "mcpServers": {
    "smaregi-remote": {
      "url": "https://smaregi-mcp.your-subdomain.workers.dev/mcp",
      "transport": {
        "type": "http"
      }
    }
  }
}
```

注：`your-subdomain`を実際のWorkers URLに置き換えてください。

## 動作確認

### 1. ヘルスチェック

```bash
curl https://smaregi-mcp.your-subdomain.workers.dev/health
```

### 2. 認証フロー

Claude Desktopで以下のツールを使用：

```
authenticate_smaregi action: start
```

表示されたURLでスマレジにログインし、認証を完了させます。

### 3. 取引データの取得

```
transactions_list 
  transaction_date_time-from: "2024-01-01T00:00:00+09:00"
  transaction_date_time-to: "2024-01-31T23:59:59+09:00"
```

## トラブルシューティング

### KVネームスペースのデバッグ

```bash
# セッション一覧
wrangler kv:key list --namespace-id=YOUR_SESSIONS_ID

# 特定のセッションを確認
wrangler kv:key get "session:SESSION_ID" --namespace-id=YOUR_SESSIONS_ID
```

### ログの確認

```bash
wrangler tail
```

### 環境変数の確認

```bash
wrangler secret list
```

## セキュリティ上の注意

1. **CLIENT_SECRET**は必ずシークレットとして設定し、`wrangler.toml`には含めないでください
2. 本番環境では適切なCORSヘッダーを設定してください
3. アクセス制限が必要な場合は、Cloudflare Access等を使用してください

## 更新とメンテナンス

### コードの更新

```bash
# 変更をビルド
npm run build:cloudflare

# 再デプロイ
wrangler deploy
```

### KVデータのクリア

```bash
# すべてのセッションをクリア（注意！）
wrangler kv:bulk delete keys.json --namespace-id=YOUR_SESSIONS_ID
```

## 料金について

- Workers: 100,000リクエスト/日まで無料
- KV: 100,000読み取り/日、1,000書き込み/日まで無料
- 詳細は[Cloudflare料金ページ](https://www.cloudflare.com/plans/developer-platform/)を参照

## サポート

問題が発生した場合は、以下を確認してください：

1. Wranglerのログ出力
2. CloudflareダッシュボードのWorkersログ
3. GitHubのIssuesセクション