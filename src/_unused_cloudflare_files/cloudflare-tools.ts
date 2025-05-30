import { McpServer } from "@modelcontextprotocol/sdk/dist/esm/server/mcp.js";
import { z } from "zod";
import { CloudflareAuthService } from "../auth/cloudflare-auth-service.js";
import { TransactionDataTool } from "../tools/transaction-data-tool.js";
import { D1Database } from '@cloudflare/workers-types';

/**
 * Cloudflare Workers用のツール登録
 * @param mcpServer MCP server instance
 * @param authService 認証サービス
 * @param env Cloudflare environment
 * @param db D1 database instance
 */
export async function registerCloudflareTools(
  mcpServer: McpServer,
  authService: CloudflareAuthService,
  env: Env,
  db: D1Database,
): Promise<void> {
  console.error("[INFO] Registering Cloudflare tools...");

  // TransactionDataToolのインスタンス作成
  const transactionDataTool = new TransactionDataTool(authService, db, env);

  // 取引データ取得ツールを登録
  mcpServer.tool(
    "getTransactionAnalysisData",
    "指定した期間（最大1ヶ月）の取引データを取得します。分析用に最適化されたデータを返します。認証が切れている場合は自動的に再認証を試みます。",
    {
      startDate: z
        .string()
        .optional()
        .describe("開始日（YYYY-MM-DD形式）。指定しない場合は1ヶ月前から取得します。"),
      endDate: z
        .string()
        .optional()
        .describe("終了日（YYYY-MM-DD形式）。指定しない場合は今日まで取得します。"),
      storeId: z
        .string()
        .optional()
        .describe("店舗ID。指定した場合、その店舗のみのデータを取得します。"),
      sessionId: z
        .string()
        .optional()
        .describe("認証セッションID。指定しない場合は自動的に有効なセッションを探します。"),
    },
    async ({ startDate, endDate, storeId, sessionId }) => {
      try {
        const result = await transactionDataTool.getTransactionAnalysisData({
          startDate,
          endDate,
          storeId,
          sessionId,
        });

        if (result.success) {
          let responseText = `# 取引データ取得結果 ✅\n\n`;
          responseText += `**期間**: ${startDate || '1ヶ月前'} ～ ${endDate || '今日'}\n`;
          responseText += `**総件数**: ${result.totalRecords} 件\n`;
          
          if (storeId) {
            responseText += `**店舗ID**: ${storeId}\n`;
          }
          
          if (result.sessionId) {
            responseText += `**認証セッション**: ${result.sessionId}\n`;
          }
          
          responseText += `\n## データ構造\n\n`;
          responseText += `以下のフィールドが含まれています：\n`;
          responseText += `- transactionHeadId: 取引ID\n`;
          responseText += `- transactionDateTime: 取引日時\n`;
          responseText += `- transactionHeadDivision: 取引区分\n`;
          responseText += `- cancelDivision: キャンセル区分\n`;
          responseText += `- total: 合計金額\n`;
          responseText += `- costTotal: 原価合計\n`;
          responseText += `- storeId: 店舗ID\n`;
          responseText += `- customerId: 顧客ID\n`;
          responseText += `- customerRank: 顧客ランク\n`;
          responseText += `- customerGroupId1-5: 顧客グループID\n`;
          responseText += `- staffId: スタッフID\n`;
          responseText += `- guestNumbers*: 来客数（男性、女性、不明別）\n`;
          responseText += `- tags: タグ\n\n`;
          
          responseText += `## 取得データ\n\n`;
          responseText += `\`\`\`json\n${JSON.stringify(result.data, null, 2)}\n\`\`\`\n`;

          return {
            content: [
              {
                type: "text",
                text: responseText,
              },
            ],
          };
        } else {
          let errorText = `# 取引データ取得エラー ❌\n\n`;
          
          // エラーの種類に応じてメッセージを調整
          switch (result.error) {
            case 'authentication_required':
              errorText += `**認証が必要です**\n\n`;
              errorText += `有効な認証セッションが見つかりませんでした。\n`;
              errorText += `認証を行ってから再試行してください。\n\n`;
              errorText += `認証方法:\n`;
              errorText += `1. ブラウザで認証URLにアクセス\n`;
              errorText += `2. スマレジアカウントでログイン\n`;
              errorText += `3. 認証完了後、このツールを再実行\n`;
              break;
              
            case 'api_limit_reached':
              errorText += `**API制限に達しました**\n\n`;
              errorText += `スマレジAPIのレート制限に達しています。\n`;
              errorText += `しばらく時間をおいてから再試行してください。\n`;
              break;
              
            case 'invalid_parameters':
              errorText += `**パラメータエラー**\n\n`;
              errorText += `指定されたパラメータが正しくありません。\n`;
              errorText += `- 日付は YYYY-MM-DD 形式で指定してください\n`;
              errorText += `- 期間は最大31日間です\n`;
              errorText += `- 開始日は終了日より前である必要があります\n`;
              break;
              
            default:
              errorText += `**予期しないエラー**\n\n`;
              errorText += `${result.message}\n`;
          }

          return {
            content: [
              {
                type: "text",
                text: errorText,
              },
            ],
            isError: true,
          };
        }
      } catch (error) {
        console.error(`[ERROR] getTransactionAnalysisData failed: ${error}`);
        return {
          content: [
            {
              type: "text",
              text: `# 取引データ取得エラー ❌\n\n予期しないエラーが発生しました：\n${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  console.error("[INFO] Cloudflare tools registered successfully");
}