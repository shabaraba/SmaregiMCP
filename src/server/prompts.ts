import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register all prompts to the MCP server
 * @param mcpServer - The MCP server instance
 */
export async function registerPrompts(
  mcpServer: McpServer
): Promise<void> {
  console.error('[INFO] Registering prompts...');
  
  // Register product search prompt
  registerProductSearchPrompt(mcpServer);
  
  // Register sales analysis prompt
  registerSalesAnalysisPrompt(mcpServer);
  
  // Register inventory management prompt
  registerInventoryManagementPrompt(mcpServer);
  
  // Register customer analysis prompt
  registerCustomerAnalysisPrompt(mcpServer);
  
  console.error('[INFO] Prompts registered successfully');
}

/**
 * Register product search prompt
 * @param mcpServer - The MCP server instance
 */
function registerProductSearchPrompt(mcpServer: McpServer): void {
  console.error('[INFO] Registering product search prompt');
  
  mcpServer.prompt(
    'search-products',
    '商品を検索',
    {
      keyword: z.string().optional().describe('検索キーワード'),
      category: z.string().optional().describe('商品カテゴリ'),
      inStock: z.string().optional().describe('在庫がある商品のみを検索するか (「true」または「false」)'),
      limit: z.string().optional().describe('取得する商品の最大数'),
    },
    async ({ keyword, category, inStock, limit }) => {
      // Convert string parameters to appropriate types
      const boolInStock = inStock === 'true' ? true : inStock === 'false' ? false : undefined;
      const numLimit = limit ? parseInt(limit, 10) : undefined;
      
      return {
        description: '商品を検索するためのプロンプト',
        isUserPromptTemplate: true,
        sampleUserPrompts: [
          '商品を検索して',
          '在庫のある商品を教えて',
          'Tシャツを探して',
          '食品カテゴリの商品を検索'
        ],
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: formatProductSearchPrompt({ 
                keyword, 
                category, 
                inStock: boolInStock, 
                limit: numLimit 
              })
            }
          }
        ]
      };
    }
  );
}

/**
 * Format product search prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatProductSearchPrompt(params: {
  keyword?: string;
  category?: string;
  inStock?: boolean;
  limit?: number;
}): string {
  const { keyword, category, inStock, limit } = params;
  
  let prompt = 'スマレジAPIを使用して商品を検索してください。\n\n';
  
  if (keyword) {
    prompt += `検索キーワード: ${keyword}\n`;
  }
  
  if (category) {
    prompt += `カテゴリ: ${category}\n`;
  }
  
  if (inStock !== undefined) {
    prompt += `在庫あり: ${inStock ? 'はい' : 'いいえ'}\n`;
  }
  
  if (limit) {
    prompt += `最大表示件数: ${limit}\n`;
  }
  
  prompt += '\n以下のツールを使用することで、効果的に検索できます：\n\n';
  prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
  prompt += '2. ユーザーに認証URLでの認証を依頼\n';
  prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
  prompt += '4. `executeApiRequest` ツールを使用して商品APIを呼び出し\n';
  
  if (inStock) {
    prompt += '5. 在庫APIを呼び出して在庫状況をチェック\n';
  }
  
  prompt += '\n検索結果は表形式で見やすくまとめてください。各商品の名前、価格、カテゴリ、在庫状況などの重要な情報を含めてください。';
  
  return prompt;
}

/**
 * Register sales analysis prompt
 * @param mcpServer - The MCP server instance
 */
function registerSalesAnalysisPrompt(mcpServer: McpServer): void {
  console.error('[INFO] Registering sales analysis prompt');
  
  mcpServer.prompt(
    'analyze-sales',
    '売上データを分析',
    {
      period: z.string().optional().describe('分析期間（例: 今週、先月、過去3ヶ月）'),
      storeId: z.string().optional().describe('店舗ID'),
      groupBy: z.string().optional().describe('グループ化の基準（例: 日別、週別、月別）'),
      includeChart: z.string().optional().describe('グラフを含めるか (「true」または「false」)'),
    },
    async ({ period, storeId, groupBy, includeChart }) => {
      // Convert string parameter to appropriate type
      const boolIncludeChart = includeChart === 'true' ? true : includeChart === 'false' ? false : undefined;
      
      return {
        description: '売上データを分析するためのプロンプト',
        isUserPromptTemplate: true,
        sampleUserPrompts: [
          '売上分析をして',
          '先月の売上を見せて',
          '各店舗の売上を比較して',
          '商品カテゴリ別の売上を分析'
        ],
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: formatSalesAnalysisPrompt({ 
                period, 
                storeId, 
                groupBy, 
                includeChart: boolIncludeChart 
              })
            }
          }
        ]
      };
    }
  );
}

/**
 * Format sales analysis prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatSalesAnalysisPrompt(params: {
  period?: string;
  storeId?: string;
  groupBy?: string;
  includeChart?: boolean;
}): string {
  const { period, storeId, groupBy, includeChart } = params;
  
  let prompt = 'スマレジAPIを使用して売上データを分析してください。\n\n';
  
  if (period) {
    prompt += `期間: ${period}\n`;
  }
  
  if (storeId) {
    prompt += `店舗ID: ${storeId}\n`;
  }
  
  if (groupBy) {
    prompt += `グループ化: ${groupBy}\n`;
  }
  
  prompt += '\n以下のツールを使用することで、効果的に分析できます：\n\n';
  prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
  prompt += '2. ユーザーに認証URLでの認証を依頼\n';
  prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
  prompt += '4. `executeApiRequest` ツールを使用して取引APIを呼び出し\n';
  
  if (storeId) {
    prompt += '5. 店舗情報APIを呼び出して店舗詳細を取得\n';
  }
  
  prompt += '\n分析結果は以下の内容を含めてください：\n';
  prompt += '- 総売上額\n';
  prompt += '- 平均取引額\n';
  prompt += '- 取引数\n';
  
  if (groupBy) {
    prompt += `- ${groupBy}ごとの売上推移\n`;
  }
  
  if (includeChart) {
    prompt += '- 売上推移グラフ\n';
  }
  
  return prompt;
}

/**
 * Register inventory management prompt
 * @param mcpServer - The MCP server instance
 */
function registerInventoryManagementPrompt(mcpServer: McpServer): void {
  console.error('[INFO] Registering inventory management prompt');
  
  mcpServer.prompt(
    'manage-inventory',
    '在庫管理',
    {
      storeId: z.string().optional().describe('店舗ID'),
      lowStock: z.string().optional().describe('在庫不足の商品のみを表示するか (「true」または「false」)'),
      threshold: z.string().optional().describe('在庫不足と判断する閾値'),
      category: z.string().optional().describe('商品カテゴリ'),
    },
    async ({ storeId, lowStock, threshold, category }) => {
      // Convert string parameters to appropriate types
      const boolLowStock = lowStock === 'true' ? true : lowStock === 'false' ? false : undefined;
      const numThreshold = threshold ? parseInt(threshold, 10) : undefined;
      
      return {
        description: '在庫管理を行うためのプロンプト',
        isUserPromptTemplate: true,
        sampleUserPrompts: [
          '在庫状況を確認して',
          '在庫不足の商品を表示して',
          '電化製品の在庫を確認',
          '全店舗の在庫状況を分析'
        ],
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: formatInventoryManagementPrompt({ 
                storeId, 
                lowStock: boolLowStock, 
                threshold: numThreshold, 
                category 
              })
            }
          }
        ]
      };
    }
  );
}

/**
 * Format inventory management prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatInventoryManagementPrompt(params: {
  storeId?: string;
  lowStock?: boolean;
  threshold?: number;
  category?: string;
}): string {
  const { storeId, lowStock, threshold, category } = params;
  
  let prompt = 'スマレジAPIを使用して在庫管理を行ってください。\n\n';
  
  if (storeId) {
    prompt += `店舗ID: ${storeId}\n`;
  }
  
  if (lowStock !== undefined) {
    prompt += `在庫不足商品のみ: ${lowStock ? 'はい' : 'いいえ'}\n`;
  }
  
  if (threshold !== undefined) {
    prompt += `在庫不足閾値: ${threshold}\n`;
  }
  
  if (category) {
    prompt += `カテゴリ: ${category}\n`;
  }
  
  prompt += '\n以下のツールを使用することで、効果的に在庫管理できます：\n\n';
  prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
  prompt += '2. ユーザーに認証URLでの認証を依頼\n';
  prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
  prompt += '4. `executeApiRequest` ツールを使用して在庫APIと商品APIを呼び出し\n';
  
  if (storeId) {
    prompt += '5. 店舗情報APIを呼び出して店舗詳細を取得\n';
  }
  
  prompt += '\n在庫レポートは以下の内容を含めてください：\n';
  prompt += '- 商品名\n';
  prompt += '- 現在の在庫数\n';
  prompt += '- 在庫ステータス（十分/注意/不足）\n';
  
  if (lowStock) {
    prompt += '- 推奨発注数\n';
  }
  
  return prompt;
}

/**
 * Register customer analysis prompt
 * @param mcpServer - The MCP server instance
 */
function registerCustomerAnalysisPrompt(mcpServer: McpServer): void {
  console.error('[INFO] Registering customer analysis prompt');
  
  mcpServer.prompt(
    'analyze-customers',
    '顧客データを分析',
    {
      period: z.string().optional().describe('分析期間（例: 今年、過去6ヶ月）'),
      segment: z.string().optional().describe('顧客セグメント（例: 新規、リピーター、VIP）'),
      includeChart: z.string().optional().describe('グラフを含めるか (「true」または「false」)'),
    },
    async ({ period, segment, includeChart }) => {
      // Convert string parameter to appropriate type
      const boolIncludeChart = includeChart === 'true' ? true : includeChart === 'false' ? false : undefined;
      
      return {
        description: '顧客データを分析するためのプロンプト',
        isUserPromptTemplate: true,
        sampleUserPrompts: [
          '顧客分析をして',
          'リピーター顧客を分析して',
          '新規顧客の獲得状況を確認',
          '顧客の購買傾向を分析'
        ],
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: formatCustomerAnalysisPrompt({ 
                period, 
                segment, 
                includeChart: boolIncludeChart 
              })
            }
          }
        ]
      };
    }
  );
}

/**
 * Format customer analysis prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatCustomerAnalysisPrompt(params: {
  period?: string;
  segment?: string;
  includeChart?: boolean;
}): string {
  const { period, segment, includeChart } = params;
  
  let prompt = 'スマレジAPIを使用して顧客データを分析してください。\n\n';
  
  if (period) {
    prompt += `期間: ${period}\n`;
  }
  
  if (segment) {
    prompt += `顧客セグメント: ${segment}\n`;
  }
  
  prompt += '\n以下のツールを使用することで、効果的に顧客分析できます：\n\n';
  prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
  prompt += '2. ユーザーに認証URLでの認証を依頼\n';
  prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
  prompt += '4. `executeApiRequest` ツールを使用して顧客APIと取引APIを呼び出し\n';
  
  prompt += '\n顧客分析レポートは以下の内容を含めてください：\n';
  prompt += '- 顧客数\n';
  prompt += '- 顧客セグメント分布\n';
  prompt += '- 平均客単価\n';
  prompt += '- 購買頻度\n';
  
  if (segment) {
    prompt += `- ${segment}セグメントの特徴分析\n`;
  }
  
  if (includeChart) {
    prompt += '- 顧客分布グラフ\n';
    prompt += '- 購買頻度グラフ\n';
  }
  
  return prompt;
}