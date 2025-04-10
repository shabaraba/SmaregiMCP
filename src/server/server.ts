import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SchemaConverter } from '../conversion/schema-converter.js';
import { ApiToolGenerator } from '../conversion/tool-generator.js';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { packageInfo } from '../utils/package-info.js';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';
import { registerPrompts } from './prompts.js';
import { createExpressServer } from './express-server.js';

import { z } from 'zod';

// Schema for resource listing
const ListResourcesRequestSchema = z.object({
  method: z.literal('resources/list'),
  params: z.object({}),
});

// Schema for prompts listing
const ListPromptsRequestSchema = z.object({
  method: z.literal('prompts/list'),
  params: z.object({}),
});

// Schema for prompt retrieval
const GetPromptRequestSchema = z.object({
  method: z.literal('prompts/get'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.any()).optional(),
  }),
});

/**
 * MCP Server creation function
 * Creates and configures an MCP server instance
 */
export async function createServer() {
  console.error('[INFO] Creating MCP server...');
  
  // Create MCP Server instance
  const mcpServer = new McpServer(
    {
      name: 'smaregi',
      version: packageInfo.version,
    },
    {
      capabilities: {
        resources: {},
        prompts: {},
      },
    }
  );
  
  // Initialize services
  const schemaConverter = new SchemaConverter();
  const apiToolGenerator = new ApiToolGenerator(schemaConverter);
  const authService = new AuthService();
  const apiService = new ApiService(authService);
  
  // Set default request handlers
  setupDefaultHandlers(mcpServer.server);
  
  // Register resources, tools, and prompts
  await registerResources(mcpServer, apiService, schemaConverter, apiToolGenerator);
  await registerTools(mcpServer, authService, apiService, apiToolGenerator);
  await registerPrompts(mcpServer);
  
  // Create and set up Express server for handling auth callbacks
  const { server: expressServer } = createExpressServer();
  
  console.error('[INFO] MCP server created and configured successfully');
  
  return { 
    server: mcpServer.server,
    mcpServer,
    expressServer
  };
}

/**
 * Setup default request handlers for resources and prompts listing
 * @param server - The MCP server instance
 */
function setupDefaultHandlers(server: any) {
  // Resource listing handler is registered in resources.ts
  // Commented out to avoid duplicate handler error
  /*
  server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => {
      // Base resource templates
      const resourceTemplates = [
        { template: 'smaregi://api/{category}/{path}', description: 'スマレジAPIリソース' },
        { template: 'smaregi://docs/{document}', description: 'スマレジAPIドキュメント' }
      ];
      
      // Base resources
      const resources = [
        { id: 'smaregi://docs/readme', description: 'スマレジMCPについて' },
        { id: 'smaregi://docs/api-overview', description: 'スマレジAPI概要' },
        { id: 'smaregi://docs/authentication', description: '認証ガイド' },
        { id: 'smaregi://api/pos', description: 'POSシステムAPI' },
        { id: 'smaregi://api/auth', description: '認証API' },
        { id: 'smaregi://api/system', description: 'システム管理API' }
      ];
      
      console.error(`[INFO] resources/list response: ${resourceTemplates.length} templates, ${resources.length} resources`);
      
      return {
        resourceTemplates,
        resources
      };
    }
  );
  */
  
  // Prompts listing handler is registered in prompts.ts
  // Commented out to avoid duplicate handler error
  /*
  server.setRequestHandler(
    ListPromptsRequestSchema,
    async () => {
      // Base prompts - actual registration happens in prompts.ts
      const prompts = [
        {
          name: 'search-products',
          description: '商品を検索',
          is_user_prompt_template: true,
          sample_user_prompts: ['商品を検索して', '在庫のある商品を教えて'],
          parameters: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '検索キーワード'
              },
              category: {
                type: 'string',
                description: '商品カテゴリ'
              }
            }
          }
        },
        {
          name: 'analyze-sales',
          description: '売上データを分析',
          is_user_prompt_template: true,
          sample_user_prompts: ['売上分析をして', '今週の売上を見せて'],
          parameters: {
            type: 'object',
            properties: {
              period: {
                type: 'string',
                description: '分析期間（例: 今週、先月、過去3ヶ月）'
              },
              storeId: {
                type: 'string',
                description: '店舗ID'
              }
            }
          }
        },
        {
          name: 'manage-inventory',
          description: '在庫管理',
          is_user_prompt_template: true,
          sample_user_prompts: ['在庫状況を確認して', '在庫不足の商品を表示して'],
          parameters: {
            type: 'object',
            properties: {
              storeId: {
                type: 'string',
                description: '店舗ID'
              },
              category: {
                type: 'string',
                description: '商品カテゴリ'
              }
            }
          }
        },
        {
          name: 'analyze-customers',
          description: '顧客データを分析',
          is_user_prompt_template: true,
          sample_user_prompts: ['顧客分析をして', 'リピーター顧客を分析して'],
          parameters: {
            type: 'object',
            properties: {
              period: {
                type: 'string',
                description: '分析期間'
              },
              segment: {
                type: 'string',
                description: '顧客セグメント'
              }
            }
          }
        }
      ];
      
      console.error(`[INFO] prompts/list response: ${prompts.length} prompts`);
      
      return {
        prompts
      };
    }
  );
  */
  
  // Prompt retrieval handler is registered in prompts.ts
  // Commented out to avoid duplicate handler error
  /*
  server.setRequestHandler(
    GetPromptRequestSchema,
    async (request) => {
      const { name, arguments: promptArgs } = request.params;
      
      console.error(`[INFO] prompts/get request: ${name}`);
      
      // Find prompt by name
      const allPrompts = [
        {
          name: 'search-products',
          description: '商品を検索',
          is_user_prompt_template: true,
          sample_user_prompts: ['商品を検索して', '在庫のある商品を教えて']
        },
        {
          name: 'analyze-sales',
          description: '売上データを分析',
          is_user_prompt_template: true,
          sample_user_prompts: ['売上分析をして', '今週の売上を見せて']
        },
        {
          name: 'manage-inventory',
          description: '在庫管理',
          is_user_prompt_template: true,
          sample_user_prompts: ['在庫状況を確認して', '在庫不足の商品を表示して']
        },
        {
          name: 'analyze-customers',
          description: '顧客データを分析',
          is_user_prompt_template: true,
          sample_user_prompts: ['顧客分析をして', 'リピーター顧客を分析して']
        }
      ];
      
      const promptDef = allPrompts.find(p => p.name === name);
      
      if (!promptDef) {
        throw new Error(`プロンプト "${name}" が見つかりません`);
      }
      
      // For the default handler, just provide basic placeholder messages
      // The actual implementation is in prompts.ts
      const messages = [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `${promptDef.description}についての情報を表示します。`
          }
        }
      ];
      
      return {
        description: promptDef.description,
        messages
      };
    }
  );
  */
}
