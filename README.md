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

## トラブルシューティング

### データベース接続エラー

データベース接続エラー（SQLITE_CANTOPEN）が発生した場合は、以下の点を確認してください：

1. `.env` ファイルで設定されているデータベースパスが正しいか確認してください
2. **重要**: 相対パス（`./smaregi-mcp.sqlite`）ではなく、絶対パス（`/path/to/your/smaregi-mcp.sqlite`）を使用することを強く推奨します
3. データベースファイルへの読み書き権限があることを確認してください

例えば、`.env` ファイルに以下のように設定します：

```
DATABASE_PATH=/Users/yourusername/path/to/SmaregiMCP/smaregi-mcp.sqlite
```

### JSON解析エラー

MCPサーバー実行時に次のようなエラーが表示される場合：

```
Unexpected token '', "[32m[Nest"... is not valid JSON
```

これはNestJSが出力するカラーログとMCP通信プロトコルが競合していることが原因です。このプロジェクトでは、次の対策を実装済みです：

1. NestJSのロギングを標準エラー出力（stderr）に変更
2. カラー出力を無効化
3. MCPプロトコル通信と標準ログ出力を分離

もし同様のエラーが発生する場合は、サーバー起動時に環境変数 `NO_COLOR=1` を設定することで、カラー出力を完全に無効化できます：

```bash
NO_COLOR=1 npm run mcp:run
```

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

3. アプリケーションをビルド

```bash
npm run build
```

4. MCPサーバーをClaude Desktopに登録

```bash
npm run mcp:init
```

この操作により、MCPサーバーがClaude Desktopの設定に登録されます。**このステップだけで完了です**。
MCPサーバーはClaude Desktopにより必要なときに自動的に起動されます。

### 使用方法

**注意**: `npm run mcp:init` を実行した後は、通常、手動でサーバーを起動する必要はありません。
Claude Desktopはスマレジの機能にアクセスするときに自動的にMCPサーバーを起動します。

開発やテスト目的で手動でサーバーを起動する場合：

```bash
npm run mcp:run
```

開発モードで起動（ファイル変更の監視）：

```bash
npm run mcp:dev
```

ヘルプを表示：

```bash
npm run mcp:help
```

### 既知の問題: サーバーの二重起動

もし `npm run mcp:init` を実行した後、手動で `npm run mcp:run` を実行すると、次のようなエラーが発生することがあります：

```
[ERROR] [NestApplication] Error: listen EADDRINUSE: address already in use :::3000
```

これは、Claude Desktopによって起動されたMCPサーバーと手動で起動したサーバーが同じポートを使用しようとするために発生します。

**解決方法**:
1. 既存のMCPサーバープロセスを終了する
   ```bash
   # サーバープロセスを見つける
   ps aux | grep 'node.*SmaregiMCP.*main.js'
   
   # 見つかったプロセスIDを使って終了
   kill <プロセスID>
   ```
2. 通常はMCPサーバーを手動で起動する必要はありません。Claude Desktopが自動的に管理します。


## MCP Inspector

このプロジェクトには、MCP Inspectorが統合されています。MCP Inspectorは、MCPサーバーとの対話をデバッグするための強力なツールです。

### MCP Inspectorの起動

```bash
npm run mcp:inspect
```

このコマンドを実行すると、ブラウザが自動的に開き、http://localhost:6274 でインスペクターのUIが表示されます。

### 機能

- MCPサーバーとの接続状態の確認
- 利用可能なツール、リソース、プロンプトの一覧表示
- APIリクエストの実行とレスポンスの確認
- リクエスト/レスポンスの履歴の確認
- サーバー通知の監視

詳細については、[MCP Inspector ガイド](./docs/mcp-inspector-guide.md)を参照してください。

