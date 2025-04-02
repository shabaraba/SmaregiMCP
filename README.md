# スマレジ・プラットフォームAPI OpenAPI仕様 & MCP サーバー

## 概要

スマレジ・プラットフォームAPIのOpenAPI 3.0仕様書です。このリポジトリでは、スマレジのPOS機能を利用するためのAPIインターフェースを定義しています。

## 構成

APIの仕様は次のように構成されています：

- `openapi.yaml`: メインのOpenAPI仕様ファイル
- `paths/`: APIエンドポイントの定義
- `schemas/`: データモデルの定義

## 使用方法

### APIドキュメントの表示

このリポジトリをクローンした後、以下のいずれかの方法でAPIドキュメントを表示できます：

1. Swagger UIを使用
2. Redocを使用
3. Stoplight Studioを使用

### 例：Swagger UIでの表示

```bash
# Swagger UIのDockerイメージを使用
docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd):/usr/share/nginx/html/specs swaggerapi/swagger-ui
```

ブラウザで `http://localhost:8080` にアクセスすると、APIドキュメントが表示されます。

## API概要

このAPIを使用して、以下の機能にアクセスできます：

- 部門管理
- 商品管理
- 在庫管理
- 取引管理
- 会員管理
- 店舗管理
- スタッフ管理
- 予算管理
- 仕入先管理
- 発注/入荷/出荷管理
- 棚卸管理
など

## 認証

APIはOAuth 2.0認証を使用しています。APIを呼び出すには、以下のいずれかの認証情報が必要です：

1. アプリアクセストークン（ClientCredentials）
2. ユーザーアクセストークン（AuthorizationCode）

詳細はAPIドキュメントの「Authentication」セクションを参照してください。

## 利用条件

スマレジ・プラットフォームAPIの利用には、スマレジとの契約が必要です。詳細は[スマレジ公式ウェブサイト](https://www.smaregi.jp/)を参照してください。

## ライセンス

このOpenAPI仕様は、スマレジが提供するAPIの使用方法を示すためのものであり、スマレジの利用規約に基づいて提供されています。

## MCP サーバー

このリポジトリには、スマレジAPIをClaude AIから利用するためのMCP（Model Context Protocol）サーバーも含まれています。MCPを使用することで、ClaudeはスマレジAPIの仕様を理解し、より効果的な支援を提供できます。

### MCPサーバーのセットアップ

1. 必要なパッケージをインストール

```bash
npm install
```

2. 環境設定

`.env.example`ファイルを`.env`にコピーして、必要に応じて設定を変更します。

```bash
cp .env.example .env
```

3. MCPサーバーをClaude Desktopに登録

```bash
npm run mcp:init
```

この操作により、MCPサーバーがClaude Desktopの設定に登録されます。

### 使用方法

MCPサーバーを起動：

```bash
npm run mcp:run
```

開発モードで起動（ファイル変更の監視）：

```bash
npm run mcp:dev
```

### Claudeでの使用例

Claude Desktopを起動し、以下のような質問ができます：

- 「スマレジAPIの概要を教えて」
- 「商品管理のAPIエンドポイントを教えて」
- 「商品登録のAPIリクエスト例を示して」

MCPサーバーが正しく設定されていれば、ClaudeはスマレジAPIの詳細情報にアクセスして回答します。
