/**
 * このスクリプトはsrc/schema/converted内のpos.jsonとcommon.jsonからAPIツール用JSONファイルを生成します
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ソースファイルのパス
const posJsonPath = path.resolve(projectRoot, 'src', 'schema', 'converted', 'pos.json');
const commonJsonPath = path.resolve(projectRoot, 'src', 'schema', 'converted', 'common.json');

// 出力先ディレクトリ
const outputDir = path.resolve(projectRoot, 'src', 'tools', 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ツール生成処理
const tools = [];

// POS APIの処理
if (fs.existsSync(posJsonPath)) {
  try {
    const posJsonContent = fs.readFileSync(posJsonPath, 'utf8');
    const posJson = JSON.parse(posJsonContent);
    
    if (posJson.properties) {
      const posTools = generateTools(posJson.properties);
      tools.push(...posTools);
      console.log(`POS APIから${posTools.length}件のツールを生成しました`);
    } else {
      console.warn('POS JSONのフォーマットが不正です。propertiesキーが見つかりません。');
    }
  } catch (error) {
    console.error(`POS JSONの処理中にエラーが発生しました: ${error}`);
  }
} else {
  console.warn(`POS JSONファイルが見つかりません: ${posJsonPath}`);
}

// Common APIの処理
if (fs.existsSync(commonJsonPath)) {
  try {
    const commonJsonContent = fs.readFileSync(commonJsonPath, 'utf8');
    const commonJson = JSON.parse(commonJsonContent);
    
    if (commonJson.properties) {
      const commonTools = generateTools(commonJson.properties);
      tools.push(...commonTools);
      console.log(`Common APIから${commonTools.length}件のツールを生成しました`);
    } else {
      console.warn('Common JSONのフォーマットが不正です。propertiesキーが見つかりません。');
    }
  } catch (error) {
    console.error(`Common JSONの処理中にエラーが発生しました: ${error}`);
  }
} else {
  console.warn(`Common JSONファイルが見つかりません: ${commonJsonPath}`);
}

// 結果の出力（Zodスキーマをシリアライズ可能な形式に変換）
const serializableTools = tools.map(tool => ({
  ...tool,
  parameters: tool.parameters.map(param => ({
    ...param,
    // Zodスキーマをシリアライズするための処理
    schema: serializeZodSchema(param.schema)
  }))
}));

const outputPath = path.resolve(outputDir, 'api-tools.json');
fs.writeFileSync(outputPath, JSON.stringify(serializableTools, null, 2));
console.log(`合計${tools.length}件のAPIツールを生成し、${outputPath}に保存しました`);

/**
 * Zodスキーマをシリアライズ可能な形式に変換する
 * 注: 実際の利用時には再びZodスキーマを生成する必要があります
 */
function serializeZodSchema(schema) {
  if (!schema) return null;
  
  try {
    // スキーマタイプを抽出
    const typeName = schema._def?.typeName;
    if (!typeName) return { type: 'string' };
    
    switch (typeName) {
      case 'ZodString':
        return { type: 'string' };
      case 'ZodNumber':
        return { type: 'number' };
      case 'ZodBoolean':
        return { type: 'boolean' };
      case 'ZodArray':
        return { 
          type: 'array',
          items: serializeZodSchema(schema._def.type)
        };
      case 'ZodObject':
        return { type: 'object' };
      default:
        return { type: 'string' };
    }
  } catch (error) {
    console.warn(`スキーマのシリアライズに失敗しました: ${error}`);
    return { type: 'string' };
  }
}

/**
 * pos.jsonのpropertiesからApiTool[]を生成する関数
 */
function generateTools(properties) {
  const tools = [];
  
  // パス定義を処理
  for (const [path, pathItem] of Object.entries(properties)) {
    // パスパラメータを抽出
    const pathParams = (path.match(/{([^}]+)}/g) || [])
      .map(param => param.slice(1, -1));
    
    // 各HTTPメソッドを処理
    for (const [method, operation] of Object.entries(pathItem.properties || {})) {
      // parametersキーをスキップ
      if (method === 'parameters') {
        continue;
      }
      
      // メソッドが小文字の場合のみ処理（get, post, put, delete, patchなど）
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
        continue;
      }
      
      // ツール名を生成
      const toolName = generateToolName(path, method);
      
      // ツール説明文を生成
      const description = operation.description || `${method.toUpperCase()} ${path}`;
      
      // パラメータを生成
      const parameters = generateParameters(path, method, operation, pathParams);
      
      // ツールを追加
      tools.push({
        name: toolName,
        description,
        parameters,
        path,
        method: method.toUpperCase(),
        operationId: null
      });
    }
  }
  
  return tools;
}

/**
 * パス分析からツール名を生成する関数
 */
function generateToolName(path, method) {
  // パスからリソース名を抽出
  const segments = path.split('/').filter(Boolean);
  const resource = segments.length > 0 ? segments[0] : 'resource';
  
  // パスパラメータが含まれるかどうかを確認
  const hasPathParam = path.includes('{');
  
  // アクション名を生成
  let action;
  switch (method.toLowerCase()) {
    case 'get':
      action = hasPathParam ? 'get' : 'list';
      break;
    case 'post':
      action = 'create';
      break;
    case 'put':
    case 'patch':
      action = 'update';
      break;
    case 'delete':
      action = 'delete';
      break;
    default:
      action = method.toLowerCase();
  }
  
  // リソース名の単数形と複数形を処理
  let resourceName = resource;
  // 単数形に変換（必要な場合）
  if (hasPathParam && method.toLowerCase() === 'get') {
    if (resourceName.endsWith('ies')) {
      resourceName = resourceName.slice(0, -3) + 'y';
    } else if (resourceName.endsWith('s') && !resourceName.endsWith('ss')) {
      resourceName = resourceName.slice(0, -1);
    }
  }
  
  // リソース名の先頭を大文字に
  const capitalizedResource = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  
  // ByIdを追加（必要な場合）
  const byId = hasPathParam && !['create', 'list'].includes(action) ? 'ById' : '';
  
  return `${action}${capitalizedResource}${byId}`;
}

/**
 * パラメータを生成する関数
 */
function generateParameters(path, method, operation, pathParams) {
  const parameters = [];
  
  // クエリパラメータを処理
  if (operation.properties?.parameters?.properties?.query?.properties) {
    const queryParams = operation.properties.parameters.properties.query.properties;
    for (const [paramName, paramSchema] of Object.entries(queryParams)) {
      parameters.push({
        name: paramName,
        description: paramSchema.description || `${paramName} parameter`,
        required: false, // APIの定義からrequiredを正確に判断するのは複雑なため、簡易的に全てfalseに
        type: 'query',
        schema: getZodSchema(paramSchema)
      });
    }
  }
  
  // パスパラメータを処理
  if (operation.properties?.parameters?.properties?.path?.properties) {
    const pathParamDefs = operation.properties.parameters.properties.path.properties;
    for (const [paramName, paramSchema] of Object.entries(pathParamDefs)) {
      parameters.push({
        name: paramName,
        description: paramSchema.description || `${paramName} parameter`,
        required: true, // パスパラメータは必須と仮定
        type: 'path',
        schema: getZodSchema(paramSchema)
      });
    }
  }
  
  // リクエストボディを処理
  if (operation.properties?.requestBody?.properties?.content?.properties?.['application/json']?.properties?.schema?.properties?.properties?.properties) {
    const bodyProps = operation.properties.requestBody.properties.content.properties['application/json'].properties.schema.properties.properties.properties;
    const requiredProps = operation.properties.requestBody.properties.content.properties['application/json'].properties.schema.properties.required?.items || [];
    
    for (const [propName, propSchema] of Object.entries(bodyProps)) {
      parameters.push({
        name: propName,
        description: propSchema.description || `${propName} parameter`,
        required: requiredProps.includes(propName),
        type: 'body',
        schema: getZodSchema(propSchema)
      });
    }
  }
  
  return parameters;
}

/**
 * Zodスキーマを生成する関数
 */
function getZodSchema(paramSchema) {
  // 型情報に基づいて適切なZodスキーマを返す
  const type = paramSchema.type || 'string';
  
  switch (type.toLowerCase()) {
    case 'integer':
    case 'number':
      return z.number();
    case 'boolean':
      return z.boolean();
    case 'array':
      return z.array(z.any());
    case 'object':
      return z.record(z.any());
    default:
      return z.string();
  }
}
