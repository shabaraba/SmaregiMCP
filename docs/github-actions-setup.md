# GitHub Actions 自動デプロイセットアップガイド

このガイドでは、GitHub Actionsを使用してCloudflare Workersへの自動デプロイを設定する方法を説明します。

## 概要

- **PRを作成/更新** → プレビュー環境に自動デプロイ
- **mainブランチにマージ** → 本番環境に自動デプロイ

## 前提条件

- Cloudflareアカウント
- GitHub リポジトリの管理者権限
- Wranglerで事前にKVネームスペースを作成済み

## セットアップ手順

### 1. Cloudflare APIトークンの作成

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/)にログイン
2. 右上のプロフィールアイコン → **My Profile** → **API Tokens**
3. **Create Token** をクリック
4. **Custom token** を選択して以下の権限を設定：

   **Account permissions:**
   - Account:Cloudflare Workers Scripts:Edit
   - Account:Workers KV Storage:Edit
   
   **Zone permissions:**
   - Zone:Workers Routes:Edit (必要な場合)

5. **Continue to summary** → **Create Token**
6. 表示されたトークンをコピー（この画面を離れると二度と表示されません）

### 2. Cloudflare Account IDの取得

1. Cloudflareダッシュボードの右サイドバーから **Account ID** をコピー

### 3. GitHub Secretsの設定

GitHubリポジトリで以下のシークレットを設定：

1. リポジトリの **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリックして以下を追加：

| Secret Name | Value | 説明 |
|------------|-------|-----|
| `CLOUDFLARE_API_TOKEN` | 手順1で作成したトークン | Cloudflare APIアクセス用 |
| `CLOUDFLARE_ACCOUNT_ID` | 手順2で取得したAccount ID | アカウント識別用 |

### 4. Cloudflareシークレットの設定

環境ごとにOAuthクライアントの認証情報を設定：

#### プレビュー環境
```bash
# CLIENT_IDとCLIENT_SECRETを設定
wrangler secret put CLIENT_ID --env preview
wrangler secret put CLIENT_SECRET --env preview
```

#### 本番環境
```bash
# CLIENT_IDとCLIENT_SECRETを設定
wrangler secret put CLIENT_ID --env production
wrangler secret put CLIENT_SECRET --env production
```

### 5. wrangler.tomlの確認

以下の環境設定が正しく記載されていることを確認：

```toml
[env.preview]
# プレビュー環境の設定
kv_namespaces = [
  { binding = "SESSIONS", id = "YOUR_PREVIEW_SESSIONS_ID" },
  { binding = "TOKENS", id = "YOUR_PREVIEW_TOKENS_ID" }
]

[env.production]
# 本番環境の設定
kv_namespaces = [
  { binding = "SESSIONS", id = "YOUR_PRODUCTION_SESSIONS_ID" },
  { binding = "TOKENS", id = "YOUR_PRODUCTION_TOKENS_ID" }
]
```

## 使用方法

### プレビュー環境へのデプロイ

1. 新しいブランチを作成してPRを開く
2. GitHub Actionsが自動的に実行される
3. デプロイが完了すると、PRにプレビューURLがコメントされる
4. コメントに記載されたURLでテスト可能

### 本番環境へのデプロイ

1. PRをmainブランチにマージ
2. GitHub Actionsが自動的に本番環境にデプロイ
3. Actions タブでデプロイ状況を確認可能

## デプロイURLの形式

### プレビュー環境
```
https://preview.smaregi-mcp.<account-id>.workers.dev
```

### 本番環境
```
https://smaregi-mcp.<account-id>.workers.dev
```

カスタムドメインを使用している場合は、それぞれの環境に応じたURLになります。

## トラブルシューティング

### デプロイが失敗する場合

1. **GitHub Actions のログを確認**
   - リポジトリの **Actions** タブでワークフローの詳細を確認

2. **シークレットの確認**
   ```bash
   # 設定されているシークレットの一覧を確認
   wrangler secret list --env preview
   wrangler secret list --env production
   ```

3. **KVネームスペースの確認**
   ```bash
   # KVネームスペースが存在するか確認
   wrangler kv:namespace list
   ```

### よくある問題

- **Authentication error**: `CLOUDFLARE_API_TOKEN`が正しく設定されているか確認
- **KV namespace not found**: wrangler.tomlのKV IDが正しいか確認
- **Script not found**: ワーカー名がwrangler.tomlと一致しているか確認

## セキュリティに関する注意

1. APIトークンは最小限の権限で作成する
2. 本番環境と開発環境で異なるOAuthクライアントを使用する
3. シークレットは絶対にコードにハードコードしない
4. APIトークンは定期的にローテーションする

## 関連ドキュメント

- [Cloudflare Workers デプロイメントガイド](./cloudflare-deployment.md)
- [Wrangler Action ドキュメント](https://github.com/cloudflare/wrangler-action)