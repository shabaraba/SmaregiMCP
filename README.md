# スマレジ - Claude MCP (Microservice Connection Point)

スマレジPOSシステムのデータをClaudeと連携させるためのマイクロサービスです。このAPIを通じて、スマレジのデータを取得し、Claudeによる自然言語での分析や質問応答を実現します。

## 機能

- スマレジAPIとの連携
  - 商品情報の取得
  - 売上情報の取得
  - 在庫情報の取得
  - 店舗情報の取得
  - 従業員情報の取得
- Claude APIとの連携
  - テキスト生成
  - チャット機能
  - スマレジデータの分析

## 必要条件

- Node.js (v14以上)
- npm または yarn
- スマレジAPIのアクセス権限
- Claude APIのアクセスキー

## インストール

```bash
# リポジトリのクローン
git clone <リポジトリURL>
cd smaregi-mcp

# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定してください
```

## 環境変数の設定

`.env`ファイルに以下の環境変数を設定してください：

```
# スマレジAPI認証情報
SMAREGI_CLIENT_ID=your_client_id
SMAREGI_CLIENT_SECRET=your_client_secret
SMAREGI_CONTRACT_ID=your_contract_id
SMAREGI_ACCESS_TOKEN_URL=https://id.smaregi.jp/app/token
SMAREGI_API_BASE_URL=https://api.smaregi.jp

# Claude API認証情報
CLAUDE_API_KEY=your_claude_api_key
CLAUDE_API_URL=https://api.anthropic.com/v1

# サーバー設定
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# JWT Secret (認証用)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

## 使用方法

### サーバーの起動

```bash
# 開発モード
npm run dev

# 本番モード
npm start
```

サーバーは`http://localhost:3000`で起動します（環境変数で設定した場合は異なるポートになります）。

### API認証

全てのAPIエンドポイントでJWT認証が必要です。トークンを取得するには：

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

レスポンス例：

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### APIエンドポイント

#### 認証

- `POST /api/auth/login` - ログイン
- `GET /api/auth/verify` - トークン検証

#### スマレジデータ

- `GET /api/smaregi/products` - 商品一覧の取得
- `GET /api/smaregi/products/:productCode` - 商品詳細の取得
- `GET /api/smaregi/sales` - 売上一覧の取得
- `GET /api/smaregi/sales/:transactionId` - 売上詳細の取得
- `GET /api/smaregi/inventory` - 在庫一覧の取得
- `GET /api/smaregi/stores` - 店舗一覧の取得
- `GET /api/smaregi/staff` - 従業員一覧の取得

#### Claude連携

- `POST /api/claude/generate` - テキスト生成
- `POST /api/claude/chat` - チャット
- `POST /api/claude/analyze-smaregi` - スマレジデータの分析
- `PUT /api/claude/config` - Claudeの設定更新

## 使用例

### スマレジデータの分析

```bash
curl -X POST http://localhost:3000/api/claude/analyze-smaregi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "先月の売上が最も高かった商品は何ですか？",
    "dataTypes": ["products", "sales"],
    "params": {
      "sales": {
        "from": "2023-01-01",
        "to": "2023-01-31"
      }
    }
  }'
```

## エラーハンドリング

APIはエラー発生時に適切なHTTPステータスコードとJSONレスポンスを返します：

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## 開発

### プロジェクト構造

```
smaregi-mcp/
├── config/           # 設定ファイル
├── docs/             # ドキュメント
├── logs/             # ログファイル（production環境）
├── src/
│   ├── api/          # APIルート
│   ├── auth/         # 認証関連
│   ├── models/       # データモデル
│   ├── services/     # サービス層
│   ├── utils/        # ユーティリティ
│   └── index.js      # エントリーポイント
├── .env              # 環境変数
├── .env.example      # 環境変数の例
├── package.json      # パッケージ情報
└── README.md         # このファイル
```

## ライセンス

このプロジェクトは[ISCライセンス](LICENSE)の下で公開されています。

## 著者

- [著者名]

## 謝辞

- [スマレジ](https://smaregi.jp/)
- [Anthropic（Claude）](https://www.anthropic.com/)
