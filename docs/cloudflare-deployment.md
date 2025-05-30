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

##### デフォルト環境（開発用）
```bash
# OAuthクライアントID
wrangler secret put CLIENT_ID

# OAuthクライアントシークレット
wrangler secret put CLIENT_SECRET
```

##### プレビュー環境
```bash
# プレビュー環境用のOAuthクライアントID
wrangler secret put CLIENT_ID --env preview

# プレビュー環境用のOAuthクライアントシークレット
wrangler secret put CLIENT_SECRET --env preview
```

##### 本番環境
```bash
# 本番環境用のOAuthクライアントID
wrangler secret put CLIENT_ID --env production

# 本番環境用のOAuthクライアントシークレット
wrangler secret put CLIENT_SECRET --env production
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

#### プレビュー環境へのデプロイ

```bash
# プロジェクトをビルド
npm run build:cloudflare

# プレビュー環境にデプロイ
npm run deploy:preview

# または直接
wrangler deploy --env preview
```

デプロイ後のURL例：
```
https://preview.smaregi-mcp.<your-subdomain>.workers.dev
```

#### 本番環境へのデプロイ

```bash
# プロジェクトをビルド
npm run build:cloudflare

# 本番環境にデプロイ
npm run deploy:cloudflare

# または直接
wrangler deploy
```

### 6. スマレジOAuthアプリの設定

スマレジの開発者ポータルで、環境ごとにリダイレクトURIを設定してください：

#### プレビュー環境
```
https://preview.smaregi-mcp.<your-subdomain>.workers.dev/auth/callback
```

#### 本番環境
```
https://smaregi-mcp.<your-subdomain>.workers.dev/auth/callback
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

## 環境別の開発とテスト

### ローカル開発（プレビュー環境）

```bash
# プレビュー環境でローカル開発
npm run preview:cloudflare

# または
wrangler dev --env preview
```

### 環境変数の確認

```bash
# デフォルト環境
wrangler secret list

# プレビュー環境
wrangler secret list --env preview

# 本番環境
wrangler secret list --env production
```

## トラブルシューティング

### KVネームスペースのデバッグ

```bash
# セッション一覧（環境を指定）
wrangler kv:key list --namespace-id=YOUR_SESSIONS_ID --env preview

# 特定のセッションを確認
wrangler kv:key get "session:SESSION_ID" --namespace-id=YOUR_SESSIONS_ID --env preview
```

### ログの確認

```bash
# デフォルト環境のログ
wrangler tail

# プレビュー環境のログ
wrangler tail --env preview

# 本番環境のログ
wrangler tail --env production
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