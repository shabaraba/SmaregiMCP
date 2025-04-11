import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AuthService } from "../auth/auth.service.js";
import { ApiService } from "../api/api.service.js";
import { ApiToolGenerator } from "../conversion/tool-generator.js";
import { ZodApiToolGenerator } from "../tools/generators/zod-api-tool-generator.js";

/**
 * Register all tools to the MCP server
 * @param mcpServer - The MCP server instance
 * @param authService - The authentication service
 * @param apiService - The API service
 * @param apiToolGenerator - The API tool generator
 */
export async function registerTools(
  mcpServer: McpServer,
  authService: AuthService,
  apiService: ApiService,
  apiToolGenerator: ApiToolGenerator,
): Promise<void> {
  console.error("[INFO] Registering tools...");

  // Register authentication tools
  registerAuthTools(mcpServer, authService);

  // Register API request tools
  // registerApiRequestTools(mcpServer, apiService);

  // Register API info tools
  // registerApiInfoTools(mcpServer, apiService);

  // Register Zod-based API tools
  await registerZodApiTools(mcpServer, apiService);

  // Register generated API tools (will be gradually replaced by Zod-based tools)
  // await registerGeneratedApiTools(mcpServer, apiToolGenerator, apiService);

  console.error("[INFO] Tools registered successfully");
}

/**
 * Register authentication tools
 * @param mcpServer - The MCP server instance
 * @param authService - The authentication service
 */
function registerAuthTools(
  mcpServer: McpServer,
  authService: AuthService,
): void {
  console.error("[INFO] Registering authentication tools");

  // Authentication tool - Get Authorization URL
  mcpServer.tool(
    "getAuthorizationUrl",
    "スマレジAPIにアクセスするための認証URLを生成します。ユーザーはこのURLでブラウザにアクセスして認証を完了する必要があります。",
    {},
    async ({}) => {
      try {
        const scopes = [
          "openid",
          "pos.products:read",
          "pos.products:write",
          "pos.customers:read",
          "pos.customers:write",
          "pos.stock:read",
          "pos.stock:write",
          "pos.stock-changes:read",
          "pos.transactions:read",
          "pos.transactions:write",
          "pos.suppliers:read",
          "pos.suppliers:write",
          "pos.stores:read",
          "pos.stores:write",
          "pos.staffs:read",
          "pos.staffs:write",
        ];
        // Get authorization URL from auth service
        const result = await authService.getAuthorizationUrl(scopes);

        return {
          content: [
            {
              type: "text",
              text: `# 認証URL\n\n以下のURLをブラウザで開き、スマレジアカウントでログインしてください：\n\n${result.url}\n\n認証リンクをユーザーに提示してください。\n\n認証が完了したら、\`checkAuthStatus\`ツールを使用して認証状態を確認できます。セッションID: \`${result.sessionId}\``,
            },
          ],
        };
      } catch (error) {
        console.error(`[ERROR] getAuthorizationUrl failed: ${error}`);
        return {
          content: [
            {
              type: "text",
              text: `認証URL生成エラー: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Authentication tool - Check Authorization Status
  mcpServer.tool(
    "checkAuthStatus",
    "認証状態を確認します。ユーザーが認証URLで認証を完了したかどうかを確認できます。",
    {
      sessionId: z
        .string()
        .describe("getAuthorizationUrlで取得したセッションID"),
    },
    async ({ sessionId }) => {
      try {
        // Check auth status from auth service
        const result = await authService.checkAuthStatus(sessionId);

        if (result.isAuthenticated) {
          return {
            content: [
              {
                type: "text",
                text: `# 認証状態: 成功 ✅\n\n認証が完了しています。このセッションIDを使用してAPIリクエストを実行できます：\`${sessionId}\`\n\n以下のようにAPIリクエストを実行できます：\n\n\`\`\`json\n{\n  "sessionId": "${sessionId}",\n  "endpoint": "/pos/products",\n  "method": "GET",\n  "query": { "limit": 10 }\n}\n\`\`\``,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `# 認証状態: 待機中 ⏳\n\n認証がまだ完了していません。ユーザーはブラウザで認証プロセスを完了する必要があります。\n\n認証URLが期限切れの場合は、\`getAuthorizationUrl\`ツールで新しいURLを生成してください。`,
              },
            ],
          };
        }
      } catch (error) {
        console.error(`[ERROR] checkAuthStatus failed: ${error}`);
        return {
          content: [
            {
              type: "text",
              text: `認証状態確認エラー: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Authentication tool - Revoke token
  mcpServer.tool(
    "revokeToken",
    "認証トークンを無効化し、セッションを終了します。",
    {
      sessionId: z.string().describe("無効化するセッションID"),
    },
    async ({ sessionId }) => {
      try {
        // Revoke token
        const result = await authService.revokeToken(sessionId);

        if (result) {
          return {
            content: [
              {
                type: "text",
                text: `# トークン無効化: 成功 ✅\n\nセッション \`${sessionId}\` のトークンが正常に無効化されました。\n\n新しい認証を開始するには、\`getAuthorizationUrl\`ツールを使用してください。`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `# トークン無効化: 失敗 ❌\n\nセッション \`${sessionId}\` のトークン無効化に失敗しました。詳細はサーバーログを確認してください。`,
              },
            ],
          };
        }
      } catch (error) {
        console.error(`[ERROR] revokeToken failed: ${error}`);
        return {
          content: [
            {
              type: "text",
              text: `トークン無効化エラー: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}

/**
 * 動的に生成されたAPIツールでリクエストを実行する共通関数
 * @param sessionId
 * @param endpoint APIエンドポイント
 * @param method HTTPメソッド
 * @param apiService APIサービス
 * @param pathParams パスパラメータ
 * @param queryParams クエリパラメータ
 * @param bodyParams ボディパラメータ
 * @returns ツール実行結果
 */
async function executeApiRequest(
  sessionId: string,
  endpoint: string,
  method: string,
  apiService: ApiService,
  pathParams: Record<string, any> = {},
  queryParams: Record<string, any> = {},
  bodyParams: Record<string, any> | undefined = undefined,
): Promise<any> {
  try {
    console.error(`[DEBUG] API call: ${method} ${endpoint}`);
    console.error(`[DEBUG] Path params: ${JSON.stringify(pathParams)}`);
    console.error(`[DEBUG] Query params: ${JSON.stringify(queryParams)}`);
    if (bodyParams) {
      console.error(`[DEBUG] Body params: ${JSON.stringify(bodyParams)}`);
    }

    const response = await apiService.executeRequest({
      sessionId,
      endpoint,
      method,
      body: bodyParams,
      path: pathParams,
      query: queryParams,
    });

    let responseText = `# API ${method} ${endpoint} レスポンス\n\n`;

    responseText += `## リクエスト情報\n`;
    responseText += `- エンドポイント: \`${endpoint}\`\n`;
    responseText += `- メソッド: \`${method}\`\n`;

    if (Object.keys(pathParams).length > 0) {
      responseText += `- パスパラメータ: \`${JSON.stringify(pathParams)}\`\n`;
    }

    if (Object.keys(queryParams).length > 0) {
      responseText += `- クエリパラメータ: \`${JSON.stringify(queryParams)}\`\n`;
    }

    if (bodyParams && Object.keys(bodyParams).length > 0) {
      responseText += `- リクエストボディ: \`${JSON.stringify(bodyParams)}\`\n`;
    }

    responseText += `\n## レスポンスデータ\n\n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\`\n`;

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  } catch (error) {
    console.error(`[ERROR] API request failed:`, error);
    return {
      content: [
        {
          type: "text",
          text: `API リクエスト失敗: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * ZodスキーマからAPIツールを登録
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 * @returns Number of registered tools
 */
async function registerZodApiTools(
  mcpServer: McpServer,
  apiService: ApiService,
): Promise<number> {
  try {
    console.error("[INFO] Registering Zod API tools...");

    // ZodApiToolGeneratorのインスタンス化
    const zodGenerator = new ZodApiToolGenerator();

    // Zodスキーマからツールを生成
    const tools = await zodGenerator.generateToolsFromZodSchema();
    console.error(`[INFO] Generated ${tools.length} Zod API tools`);

    // ツールを登録
    let registeredCount = 0;

    // カテゴリ別に整理
    const toolsByCategory = new Map<string, any[]>();
    for (const tool of tools) {
      const category = tool.name.split(".")[0] || "default";

      if (!toolsByCategory.has(category)) {
        toolsByCategory.set(category, []);
      }

      toolsByCategory.get(category)!.push(tool);
    }

    // カテゴリ別に登録
    for (const [category, categoryTools] of toolsByCategory.entries()) {
      console.error(
        `[INFO] Registering ${categoryTools.length} Zod tools for category: ${category}`,
      );

      for (const tool of categoryTools) {
        try {
          await registerSingleTool(mcpServer, tool, apiService);
          registeredCount++;
        } catch (error) {
          console.error(
            `[ERROR] Failed to register Zod tool ${tool.name}:`,
            error,
          );
        }
      }
    }

    console.error(
      `[INFO] Successfully registered ${registeredCount} Zod API tools`,
    );
    return registeredCount;
  } catch (error) {
    console.error("[ERROR] Failed to register Zod API tools:", error);
    return 0;
  }
}

/**
 * Register a single tool
 * @param mcpServer - The MCP server instance
 * @param tool - API tool definition
 * @param apiService - The API service
 */
async function registerSingleTool(
  mcpServer: McpServer,
  tool: any,
  apiService: ApiService,
): Promise<void> {
  try {
    console.error(`[DEBUG] Registering tool: ${tool.name}`);

    const paramsSchema: Record<string, z.ZodTypeAny> = {};

    for (const param of tool.parameters) {
      paramsSchema[param.name] = param.schema.describe(param.description);
    }

    mcpServer.tool(
      tool.name,
      tool.description,
      paramsSchema,
      async (args) => {
        try {
          const pathParams: Record<string, any> = {};
          const queryParams: Record<string, any> = {};
          let bodyParams: Record<string, any> | undefined = undefined;

          for (const param of tool.parameters) {
            switch (param.type) {
              case "path":
                pathParams[param.name] = args[param.name];
                break;
              case "query":
                queryParams[param.name] = args[param.name];
                break;
              case "body":
                if (!bodyParams) bodyParams = {};
                bodyParams[param.name] = args[param.name];
                break;
              default:
                break;
            }
          }

          return await executeApiRequest(
            args.sessionId,
            tool.path,
            tool.method,
            apiService,
            pathParams,
            queryParams,
            bodyParams,
          );
        } catch (error) {
          console.error(`[ERROR] ${tool.name} execution error:`, error);
          return {
            content: [
              {
                type: "text",
                text: `ツール実行エラー (${tool.name}): ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  } catch (error) {
    console.error(`[ERROR] Failed to register tool ${tool.name}: ${error}`);
  }
}
