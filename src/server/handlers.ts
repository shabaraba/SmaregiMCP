// モジュールのインポート
import * as fs from 'node:fs';
import * as path from 'node:path';
// @ts-ignore - 型定義の問題を回避
import * as yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { log } from '../utils/index.js';

// モジュールのディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// プロジェクトのルートディレクトリを取得（__dirnameは src/server なので2階層上がルート）
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

/**
 * OpenAPI仕様をYAML形式から読み込む関数
 */
function loadYamlSpec(filePath: string): any {
  try {
    log(`Loading YAML spec from: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    log(`File read successfully, size: ${content.length} bytes`);
    
    // 最初の数行をログに出力
    const previewLines = content.split('\n').slice(0, 5).join('\n');
    log(`Preview of content: \n${previewLines}...\n`);
    
    // YAMLをパース
    const result = yaml.load(content);
    log(`YAML parsed successfully`);
    return result;
  } catch (error) {
    log(`Error loading YAML: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to load YAML spec: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * スマレジプロジェクトのルートディレクトリからOpenAPI仕様のパスを取得
 */
function getOpenApiSpecPath(): string {
  log(`Project root directory: ${PROJECT_ROOT}`);
  
  // 候補となるパスを設定
  const possiblePaths = [
    path.resolve(PROJECT_ROOT, 'openapi-simple.yaml'),
    path.resolve(PROJECT_ROOT, 'openapi.yaml'),
    path.resolve(PROJECT_ROOT, 'openapi', 'pos', 'openapi.yaml'),
    path.resolve(PROJECT_ROOT, 'openapi', 'common', 'openapi.yaml'),
    path.resolve(PROJECT_ROOT, 'dist', 'openapi', 'pos', 'openapi.yaml'),
    path.resolve(PROJECT_ROOT, 'dist', 'openapi', 'common', 'openapi.yaml')
  ];
  
  log(`Checking possible paths: ${possiblePaths.join(', ')}`);
  
  // 存在する最初のパスを使用
  for (const candidatePath of possiblePaths) {
    log(`Checking if exists: ${candidatePath}`);
    if (fs.existsSync(candidatePath)) {
      log(`OpenAPI spec found at ${candidatePath}`);
      return candidatePath;
    } else {
      log(`File not found: ${candidatePath}`);
    }
  }
  
  // 見つからない場合はデバッグ情報を出力
  log(`Warning: OpenAPI spec not found at expected locations`);
  
  // openapi ディレクトリがある場合はその内容を確認
  const openapiDir = path.resolve(PROJECT_ROOT, 'openapi');
  if (fs.existsSync(openapiDir)) {
    log(`Openapi directory exists at: ${openapiDir}`);
    log(`Listing files in openapi directory:`);
    try {
      const files = fs.readdirSync(openapiDir);
      log(`Files in openapi dir: ${files.join(', ')}`);
      
      // さらに詳細を確認
      for (const file of files) {
        const filePath = path.join(openapiDir, file);
        if (fs.statSync(filePath).isDirectory()) {
          const subFiles = fs.readdirSync(filePath);
          log(`Files in ${file}/: ${subFiles.join(', ')}`);
        }
      }
    } catch (e) {
      log(`Error listing openapi directory: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    log(`openapi directory not found at: ${openapiDir}`);
    log(`Listing files in project root:`);
    try {
      const files = fs.readdirSync(PROJECT_ROOT);
      log(`Files in project root: ${files.join(', ')}`);
    } catch (e) {
      log(`Error listing directory: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  
  // デフォルトのパス（最初の候補）を返す
  log(`Returning default path: ${possiblePaths[1]}`);
  return possiblePaths[1]; // POSのOpenAPIファイルをデフォルトとして返す
}

/**
 * カテゴリ別のOpenAPI情報を抽出する関数
 */
function extractCategoryInfo(spec: any, category: string): any {
  const categoryTag = spec.tags?.find((tag: any) => 
    tag.name.toLowerCase() === category.toLowerCase()
  );
  
  if (!categoryTag) {
    throw new Error(`Category not found: ${category}`);
  }

  const paths: Record<string, any> = {};
  
  // 指定されたカテゴリに関連するパスを抽出
  Object.entries(spec.paths || {}).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, operation]: [string, any]) => {
      if (operation.tags?.some((tag: string) => tag.toLowerCase() === category.toLowerCase())) {
        if (!paths[path]) {
          paths[path] = {};
        }
        paths[path][method] = operation;
      }
    });
  });

  return {
    category: categoryTag.name,
    description: categoryTag.description,
    paths
  };
}

/**
 * すべてのエンドポイントを一覧表示する関数
 */
function listAllEndpoints(spec: any, category?: string): any[] {
  const endpoints: any[] = [];

  Object.entries(spec.paths || {}).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, operation]: [string, any]) => {
      // カテゴリが指定されている場合はフィルタリング
      if (category && !operation.tags?.some((tag: string) => 
        tag.toLowerCase() === category.toLowerCase())
      ) {
        return;
      }

      endpoints.push({
        path,
        method: method.toUpperCase(),
        summary: operation.summary || '',
        tags: operation.tags || [],
        operationId: operation.operationId || '',
      });
    });
  });

  return endpoints;
}

/**
 * スキーマ情報を取得する関数
 */
function getSchemaInfo(spec: any, schemaName: string): any {
  const schema = spec.components?.schemas?.[schemaName];
  
  if (!schema) {
    throw new Error(`Schema not found: ${schemaName}`);
  }

  return {
    name: schemaName,
    schema
  };
}

/**
 * 特定のエンドポイント情報を取得する関数
 */
function getEndpointInfo(spec: any, path: string, method: string): any {
  const methodLower = method.toLowerCase();
  const operation = spec.paths?.[path]?.[methodLower];
  
  if (!operation) {
    throw new Error(`Endpoint not found: ${method} ${path}`);
  }

  return {
    path,
    method: method.toUpperCase(),
    ...operation
  };
}

/**
 * ツールハンドラーを設定する関数
 */
export function setupHandlers() {
  const specPath = getOpenApiSpecPath();
  let spec: any;

  try {
    spec = loadYamlSpec(specPath);
  } catch (error) {
    log('Error loading OpenAPI spec:', error);
    throw new Error(`Failed to load OpenAPI specification: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    // スマレジAPIの概要を取得するハンドラー
    getSmaregiApiOverview: async (request: any) => {
      const { category } = request.params.arguments || {};
      log('Executing getSmaregiApiOverview, category:', category);

      try {
        let responseContent;

        if (category) {
          // 特定カテゴリの情報を取得
          responseContent = extractCategoryInfo(spec, category);
        } else {
          // APIの全体概要を取得
          responseContent = {
            title: spec.info.title,
            description: spec.info.description,
            version: spec.info.version,
            servers: spec.servers,
            security: spec.components?.securitySchemes,
            categories: spec.tags?.map((tag: any) => ({
              name: tag.name,
              description: tag.description
            }))
          };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(responseContent, null, 2) }],
          metadata: {},
        };
      } catch (error) {
        log('Error handling Smaregi API overview request:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          metadata: {},
          isError: true,
        };
      }
    },

    // 特定のAPIエンドポイントの詳細を取得するハンドラー
    getSmaregiApiOperation: async (request: any) => {
      const { path, method } = request.params.arguments;
      log('Executing getSmaregiApiOperation, path:', path, 'method:', method);

      try {
        const endpointInfo = getEndpointInfo(spec, path, method);

        return {
          content: [{ type: 'text', text: JSON.stringify(endpointInfo, null, 2) }],
          metadata: {},
        };
      } catch (error) {
        log('Error handling Smaregi API operation request:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          metadata: {},
          isError: true,
        };
      }
    },

    // スマレジAPIのスキーマ情報を取得するハンドラー
    getSmaregiApiSchema: async (request: any) => {
      const { schemaName } = request.params.arguments;
      log('Executing getSmaregiApiSchema, schemaName:', schemaName);

      try {
        const schemaInfo = getSchemaInfo(spec, schemaName);

        return {
          content: [{ type: 'text', text: JSON.stringify(schemaInfo, null, 2) }],
          metadata: {},
        };
      } catch (error) {
        log('Error handling Smaregi API schema request:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          metadata: {},
          isError: true,
        };
      }
    },

    // エンドポイント一覧を取得するハンドラー
    listSmaregiApiEndpoints: async (request: any) => {
      const { category } = request.params.arguments || {};
      log('Executing listSmaregiApiEndpoints, category:', category);

      try {
        const endpoints = listAllEndpoints(spec, category);

        return {
          content: [{ type: 'text', text: JSON.stringify(endpoints, null, 2) }],
          metadata: {},
        };
      } catch (error) {
        log('Error handling Smaregi API endpoints list request:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          metadata: {},
          isError: true,
        };
      }
    },
  };
}
