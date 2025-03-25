# スマレジ - Claude MCP (Model Context Protocol) サーバー

スマレジPOSシステムのデータをClaudeやその他のLLMと連携するためのMCPサーバーです。このツールを使用することで、スマレジのPOSデータにAIアシスタントがアクセスし、自然言語での分析や質問応答が可能になります。

## 機能

- スマレジデータへのアクセス
  - 商品情報の取得 (`get_products`)
  - 売上情報の取得 (`get_sales`)
  - 店舗情報の取得 (`get_stores`)
  - 売上分析機能 (`analyze_sales`)

## 必要条件

- [Bun](https://bun.sh) 1.0.0以上
- Node.js 18.0.0以上（一部の依存関係用）
- TypeScript
- スマレジAPIのアクセス権限（実装時）

## インストール

```bash
# リポジトリのクローン
git clone <リポジトリURL>
cd smaregi-mcp

# 依存パッケージのインストール
bun install
```

## 使用方法

### サーバーの起動

```bash
# 開発モード（ファイル変更を監視）
bun dev

# 本番モード
bun start
```

### Claude Desktopとの連携設定

Claude Desktopで使用する場合は、以下の設定を行います。

macOSの場合:
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "smaregi": {
    "command": "/path/to/bun",
    "args": ["run", "/path/to/smaregi-mcp/src/index.ts"]
  }
}
```

Windowsの場合:
```json
// %APPDATA%\Claude\claude_desktop_config.json
{
  "smaregi": {
    "command": "C:\\path\\to\\bun.exe",
    "args": ["run", "C:\\path\\to\\smaregi-mcp\\src\\index.ts"]
  }
}
```

## 実装の詳細

### 提供ツール

1. **get_products**: 商品情報の取得
   - 利用可能なパラメータ:
     - `limit`: 返す商品数の上限
     - `page`: ページング用のページ番号
     - `category`: カテゴリでフィルタリング

2. **get_sales**: 売上情報の取得
   - 利用可能なパラメータ:
     - `startDate`: 開始日（YYYY-MM-DD形式）
     - `endDate`: 終了日（YYYY-MM-DD形式）
     - `storeId`: 店舗IDでフィルタリング
     - `limit`: 返す売上レコード数の上限
     - `page`: ページング用のページ番号

3. **get_stores**: 店舗情報の取得
   - パラメータなし

4. **analyze_sales**: 売上分析
   - 利用可能なパラメータ:
     - `analysisType`: 分析タイプ（"top_products", "sales_by_category", "store_comparison", "daily_trend"）
     - `startDate`: 分析の開始日（YYYY-MM-DD形式）
     - `endDate`: 分析の終了日（YYYY-MM-DD形式）
     - `limit`: 結果に含める項目の上限数

### 開発

現在のバージョンではモックデータを使用していますが、実際のスマレジAPIとの連携を実装する予定です。APIクライアントは `src/services/` ディレクトリに実装される予定です。

## カスタマイズと拡張

実際のスマレジAPIとの連携を実装するには、`index.ts`内のツール実装を修正し、実際のAPIクライアントを使用するよう変更してください。また、必要に応じて新しいツールを追加することも可能です。

```typescript
// 実装例
import { SmaregiApiClient } from './services/smaregiApiClient';

const apiClient = new SmaregiApiClient({
  clientId: process.env.SMAREGI_CLIENT_ID,
  clientSecret: process.env.SMAREGI_CLIENT_SECRET,
  contractId: process.env.SMAREGI_CONTRACT_ID
});

// Products tool implementation
server.tool(
  "get_products",
  "...",
  ProductsQuerySchema.shape,
  async (args) => {
    try {
      // 実際のAPIを呼び出す
      const products = await apiClient.getProducts(args);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(products, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      // エラー処理
    }
  }
);
```

## ライセンス

このプロジェクトはISCライセンスの下で公開されています。

## 貢献

バグ報告、機能リクエスト、プルリクエストを歓迎します。大きな変更を行う前には、まずIssueを開いて議論してください。

## 謝辞

- [スマレジ](https://smaregi.jp/)
- [Anthropic（Claude）](https://www.anthropic.com/)
- [Model Context Protocol](https://modelcontextprotocol.ai/)
