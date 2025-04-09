/**
 * APIツールJSON生成スクリプト
 * OpenAPI定義からAPIツールを生成し、ファイルに保存します
 * MCP TypeScript SDKに準拠した形式で出力します
 */

import { SchemaConverter } from '../src/conversion/schema-converter.js';
import { ApiToolGenerator } from '../src/conversion/tool-generator.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z } from 'zod';

// ディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const openapiDir = resolve(projectRoot, 'openapi', 'pos');
const outputDir = resolve(projectRoot, 'src', 'tools', 'generated');

// 出力ディレクトリを作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * APIエンドポイント情報インターフェース
 */
interface ApiEndpoint {
  path: string;
  method: string;
  operationId: string;
  description: string;
  tag: string;
  parameters: ApiEndpointParameter[];
  requestBody: boolean;
  responseType?: string;
}

/**
 * APIエンドポイントパラメータインターフェース
 */
interface ApiEndpointParameter {
  name: string;
  in: string;
  required: boolean;
  description: string;
  schema: any;
}

/**
 * エラーハンドラー関数
 */
function handleError(message: string, error: any): never {
  console.error(`[ERROR] ${message}:`, error);
  if (error instanceof Error) {
    console.error(`[ERROR] ${error.stack}`);
  }
  process.exit(1);
}

/**
 * OpenAPI定義からAPIエンドポイント情報を抽出
 */
function extractApiEndpoints(): ApiEndpoint[] {
  try {
    console.log('[INFO] OpenAPI定義からAPIエンドポイント情報を抽出しています...');
    
    const openapiPath = resolve(openapiDir, 'openapi.yaml');
    
    if (!fs.existsSync(openapiPath)) {
      console.error(`[ERROR] OpenAPI定義ファイルが見つかりません: ${openapiPath}`);
      return [];
    }
    
    const fileContents = fs.readFileSync(openapiPath, 'utf8');
    const openapiDoc = yaml.load(fileContents) as any;
    
    if (!openapiDoc || !openapiDoc.paths) {
      console.error('[ERROR] OpenAPI定義にpathsが見つかりません');
      return [];
    }
    
    const endpoints: ApiEndpoint[] = [];
    
    for (const [path, pathObj] of Object.entries(openapiDoc.paths)) {
      for (const [method, operationObj] of Object.entries(pathObj as any)) {
        if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;
        
        const operation = operationObj as any;
        const operationId = operation.operationId || `${method}${path.replace(/\W+/g, '_')}`;
        const tag = operation.tags?.[0] || 'default';
        
        const endpoint: ApiEndpoint = {
          path,
          method: method.toUpperCase(),
          operationId,
          description: operation.summary || operation.description || `${method.toUpperCase()} ${path}`,
          tag,
          parameters: [],
          requestBody: false,
        };
        
        if (operation.parameters) {
          for (const param of operation.parameters) {
            endpoint.parameters.push({
              name: param.name,
              in: param.in,
              required: !!param.required,
              description: param.description || `${param.name} パラメータ`,
              schema: param.schema
            });
          }
        }
        
        if (operation.requestBody) {
          endpoint.requestBody = true;
          
          const contentType = operation.requestBody.content?.['application/json'];
          if (contentType && contentType.schema) {
            const schema = contentType.schema;
            
            if (schema.properties) {
              const required = schema.required || [];
              
              for (const [propName, propSchema] of Object.entries(schema.properties)) {
                endpoint.parameters.push({
                  name: propName,
                  in: 'body',
                  required: required.includes(propName),
                  description: (propSchema as any).description || `${propName} パラメータ`,
                  schema: propSchema
                });
              }
            }
          }
        }
        
        if (operation.responses && operation.responses['200']) {
          const okResponse = operation.responses['200'];
          const contentType = okResponse.content?.['application/json'];
          
          if (contentType && contentType.schema) {
            endpoint.responseType = contentType.schema.$ref || 'any';
          }
        }
        
        endpoints.push(endpoint);
      }
    }
    
    console.log(`[SUCCESS] ${endpoints.length}個のAPIエンドポイントを抽出しました`);
    return endpoints;
  } catch (error) {
    console.error('[ERROR] APIエンドポイント抽出中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * APIエンドポイント情報をJSONファイルに保存
 */
function saveEndpointsToFile(endpoints: ApiEndpoint[]): void {
  try {
    const outputPath = resolve(outputDir, 'api-endpoints.json');
    fs.writeFileSync(outputPath, JSON.stringify(endpoints, null, 2), 'utf-8');
    console.log(`[SUCCESS] APIエンドポイント情報を保存しました: ${outputPath}`);
  } catch (error) {
    console.error('[ERROR] APIエンドポイント情報の保存中にエラーが発生しました:', error);
  }
}

/**
 * APIエンドポイントからAPIツールを生成
 */
function generateApiToolsFromEndpoints(endpoints: ApiEndpoint[]): any[] {
  try {
    console.log('[INFO] APIエンドポイントからAPIツールを生成しています...');
    
    const tools: any[] = [];
    
    for (const endpoint of endpoints) {
      const toolName = endpoint.operationId;
      
      const parameters: any[] = [
        {
          name: 'sessionId',
          description: '認証済みのセッションID',
          type: 'query',
          required: true,
          schema: { type: 'string' }
        }
      ];
      
      for (const param of endpoint.parameters) {
        parameters.push({
          name: param.name,
          description: param.description,
          type: param.in,
          required: param.required,
          schema: param.schema
        });
      }
      
      const tool = {
        name: toolName,
        description: endpoint.description,
        category: endpoint.tag,
        path: endpoint.path,
        method: endpoint.method,
        parameters,
        operationId: endpoint.operationId,
        version: '1.0'
      };
      
      tools.push(tool);
    }
    
    console.log(`[SUCCESS] ${tools.length}個のAPIツールを生成しました`);
    return tools;
  } catch (error) {
    console.error('[ERROR] APIツール生成中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * APIツールをJSONファイルに保存
 */
function saveToolsToFile(tools: any[]): void {
  try {
    const outputPath = resolve(outputDir, 'api-tools.json');
    fs.writeFileSync(outputPath, JSON.stringify(tools, null, 2), 'utf-8');
    console.log(`[SUCCESS] APIツールJSONを保存しました: ${outputPath}`);
  } catch (error) {
    console.error('[ERROR] APIツールJSONの保存中にエラーが発生しました:', error);
  }
}

/**
 * カテゴリ別のAPIツール数を表示
 */
function logToolStats(tools: any[]): void {
  const categoryCounts = tools.reduce((acc, tool) => {
    const category = tool.category || 'unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('[INFO] カテゴリ別APIツール数:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}`);
  });
}

/**
 * APIツールの生成と検証
 */
async function generateAndValidateTools() {
  try {
    console.log('[INFO] OpenAPI定義からAPIツールを生成しています...');
    
    const endpoints = extractApiEndpoints();
    
    if (endpoints.length === 0) {
      console.warn('[WARN] APIエンドポイントが抽出できませんでした。OpenAPI定義を確認してください。');
      return;
    }
    
    saveEndpointsToFile(endpoints);
    
    const tools = generateApiToolsFromEndpoints(endpoints);
    
    if (tools.length === 0) {
      console.warn('[WARN] APIツールが生成されませんでした。エンドポイント情報を確認してください。');
      return;
    }
    
    // カテゴリ別のAPIツール数を表示
    logToolStats(tools);
    
    saveToolsToFile(tools);
    
    // 出力ファイルの確認
    const outputFilePath = resolve(outputDir, 'api-tools.json');
    if (fs.existsSync(outputFilePath)) {
      const stats = fs.statSync(outputFilePath);
      const fileSizeKb = Math.round(stats.size / 1024);
      console.log(`[INFO] 出力ファイルサイズ: ${fileSizeKb}KB`);
    }
  } catch (error) {
    handleError('APIツール生成中にエラーが発生しました', error);
  }
}

// メイン処理
async function main() {
  try {
    await generateAndValidateTools();
  } catch (error) {
    handleError('予期しないエラーが発生しました', error);
  }
}

// スクリプト実行
main().catch(error => {
  handleError('スクリプト実行中に予期しないエラーが発生しました', error);
});
