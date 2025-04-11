import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as yaml from 'js-yaml';
import { glob } from 'glob';

// ファイルパスを設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const schemaFilePath = path.join(projectRoot, 'src', 'schema', 'pos.d.ts');
const zodFilePath = path.join(projectRoot, 'src', 'schema', 'zod', 'pos.zod.ts');
const openapiPathsDir = path.join(projectRoot, 'openapi', 'pos', 'paths');
const openapiSchemasDir = path.join(projectRoot, 'openapi', 'pos', 'schemas');

// 主要なスキーマに対する説明（手動マッピング）
const staticDescriptions: Record<string, string> = {
  // 主要なエンティティのマッピング
  'Category': '部門情報',
  'CategoryGroup': '部門グループ情報',
  'Product': '商品情報',
  'Transaction': '取引情報',
  'Customer': '会員情報',
  'Stock': '在庫情報',
  'StockChange': '在庫変動履歴情報',
  'Store': '店舗情報',
  'StoreGroup': '店舗グループ情報',
  'Staff': 'スタッフ情報',
  'Layaway': '取置情報',
  'PreSale': '予約販売情報',
  'TicketTransaction': 'チケット取引情報',

  // その他のエンティティも必要に応じて追加
  'Error': 'エラー情報',
  'Pagination': 'ページネーション情報',
};

// API OperationID と説明のマッピング
const operationDescriptions: Record<string, string> = {};

// スキーマプロパティの説明を格納するマップ
const propertyDescriptions: Record<string, Record<string, string>> = {};

/**
 * スキーマの名前から関連するサブタイプを判断する
 * @param schemaName スキーマ名
 */
function getSchemaDescription(schemaName: string): string | undefined {
  // 完全一致があればそれを返す
  if (staticDescriptions[schemaName]) {
    return staticDescriptions[schemaName];
  }
  
  // Create/Update/Bulk などの派生型の場合は、ベース名を抽出して説明を生成
  const baseSchemaMatch = /^(\w+)(Create|Update|Bulk\w+)$/.exec(schemaName);
  if (baseSchemaMatch) {
    const [, baseName, operationType] = baseSchemaMatch;
    
    // ベースタイプの説明があれば、それを元に派生型の説明を生成
    if (staticDescriptions[baseName]) {
      const baseDescription = staticDescriptions[baseName];
      
      if (operationType === 'Create') {
        return `${baseDescription}の登録用データ`;
      } else if (operationType === 'Update') {
        return `${baseDescription}の更新用データ`;
      } else if (operationType.startsWith('Bulk')) {
        return `${baseDescription}の一括操作用データ`;
      }
    }
  }
  
  return undefined;
}

/**
 * 説明文字列をバッククォートで囲むか判断して適切に変換する
 * @param description 説明文字列
 * @returns フォーマットされた説明文字列
 */
function formatDescription(description: string): string {
  if (!description) return '""';
  
  // 改行を含む場合はバッククォートで囲む
  if (description.includes('\n')) {
    // バッククォート内に含まれるバッククォートをエスケープする
    const escapedDesc = description.replace(/`/g, '\\`');
    return '`' + escapedDesc + '`';
  }
  
  // それ以外はダブルクォートで囲む（既存のダブルクォートはエスケープ）
  return `"${description.replace(/"/g, '\\"')}"`;
}

/**
 * OpenAPIファイルから説明を収集する
 */
async function collectDescriptionsFromOpenAPI(): Promise<void> {
  console.log('Collecting descriptions from OpenAPI files...');
  
  try {
    // 1. API エンドポイントの説明を収集
    const pathsFiles = await glob('**/*.yaml', { cwd: openapiPathsDir });
    
    for (const file of pathsFiles) {
      const filePath = path.join(openapiPathsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const yamlContent = yaml.load(content) as any;
      
      // GETやPOST、PATCHなどのメソッドを処理
      for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
        if (yamlContent[method]) {
          const operation = yamlContent[method];
          
          if (operation.operationId) {
            const summary = operation.summary || '';
            const description = operation.description || '';
            const fullDescription = summary + (description ? ` - ${description}` : '');
            
            // camelCase の operationId を get_GetOperation 形式に変換
            // 例: getStocktakingProducts → get_GetStocktakingProducts
            const methodPrefix = method.toLowerCase();
            let apiName = operation.operationId;
            apiName = apiName.charAt(0).toUpperCase() + apiName.slice(1);
            const fullOperationId = `${methodPrefix}_${apiName}`;
            
            operationDescriptions[fullOperationId] = fullDescription;
          }
          
          // パラメータの説明を収集
          if (operation.parameters) {
            for (const param of operation.parameters) {
              // クエリパラメータやパスパラメータの場合
              if (param.name && param.description) {
                // パラメータ名をスキーマプロパティ名に変換（スネークケースからキャメルケース）
                const propName = param.name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                
                // 該当するスキーマが存在しない場合は作成
                const schemaContext = 'parameters';
                if (!propertyDescriptions[schemaContext]) {
                  propertyDescriptions[schemaContext] = {};
                }
                
                propertyDescriptions[schemaContext][propName] = param.description;
              }
            }
          }
        }
      }
    }
    
    // 2. スキーマの説明を収集
    const schemaFiles = await glob('**/*.yaml', { cwd: openapiSchemasDir });
    
    for (const file of schemaFiles) {
      const filePath = path.join(openapiSchemasDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const yamlContent = yaml.load(content) as any;
      
      if (yamlContent && yamlContent.properties) {
        // ファイル名からスキーマ名を推測
        const baseFileName = path.basename(file, '.yaml');
        const schemaName = baseFileName.charAt(0).toUpperCase() + baseFileName.slice(1);
        
        // プロパティの説明を収集
        for (const [propName, propInfo] of Object.entries<any>(yamlContent.properties)) {
          if (propInfo.description) {
            // スキーマが存在しない場合は作成
            if (!propertyDescriptions[schemaName]) {
              propertyDescriptions[schemaName] = {};
            }
            
            // プロパティ名をキャメルケースに変換
            const camelCasePropName = propName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            propertyDescriptions[schemaName][camelCasePropName] = propInfo.description;
          }
        }
      }
    }
    
    console.log(`Collected descriptions for ${Object.keys(operationDescriptions).length} operations and ${Object.keys(propertyDescriptions).length} schemas`);
  } catch (error) {
    console.error('Error collecting descriptions from OpenAPI:', error);
  }
}

/**
 * Zodファイルにdescriptionを追加する関数
 */
function addDescriptionsToZod(zodFilePath: string): void {
  console.log(`Reading Zod file: ${zodFilePath}`);

  // ファイルの内容を読み込む
  const content = fs.readFileSync(zodFilePath, 'utf8');
  console.log(`Zod file content length: ${content.length} chars`);

  let updatedContent = content;
  let modificationCount = 0;
  
  // 1. スキーマレベルの説明を追加
  const typeDefinitionPattern = /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*z\.([^;]+);/g;
  let match;
  
  console.log(`Scanning for type definitions...`);
  while ((match = typeDefinitionPattern.exec(content)) !== null) {
    const [fullDefinition, typeName, schemaDefinition] = match;
    
    // すでに.describe()が含まれているかチェック
    if (fullDefinition.includes('.describe(')) {
      continue;
    }
    
    // 説明を取得
    const description = getSchemaDescription(typeName);
    if (!description) {
      continue;
    }
    
    console.log(`Adding description to schema: ${typeName}`);
    
    try {
      // 最後の閉じかっこを見つける
      const lastSemicolon = fullDefinition.lastIndexOf(';');
      
      if (lastSemicolon > 0) {
        // 最後の閉じかっこと;の間に.describe()を挿入
        const lastBracketIndex = fullDefinition.lastIndexOf(')', lastSemicolon);
        
        if (lastBracketIndex > 0) {
          const before = fullDefinition.substring(0, lastBracketIndex + 1);
          const after = fullDefinition.substring(lastBracketIndex + 1, lastSemicolon);
          
          const modifiedDefinition = before + 
                                  `.describe(${formatDescription(description)})` + 
                                  after + ';';
          
          // 置き換え
          updatedContent = updatedContent.replace(fullDefinition, modifiedDefinition);
          modificationCount++;
        }
      }
    } catch (err) {
      console.error(`Error processing ${typeName}:`, err);
    }
  }

  // 2. スキーマプロパティに説明を追加
  const propertyPattern = /([a-zA-Z0-9_]+):\s*z\.([^,}]+)(?:,|\n|})/g;
  let propMatch;
  let propModificationCount = 0;

  console.log(`Scanning for schema properties...`);
  // コンテンツを行に分割して処理する
  const lines = updatedContent.split('\n');
  let currentSchema = '';
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // スキーマ定義の開始を検出
    if (line.match(/export\s+const\s+([A-Za-z0-9_]+)\s*=\s*z\.object\({/)) {
      const match = line.match(/export\s+const\s+([A-Za-z0-9_]+)\s*=/);
      if (match) {
        currentSchema = match[1];
      }
      continue;
    }
    
    // プロパティ定義を検出
    const propMatch = line.match(/\s+([a-zA-Z0-9_]+):\s*z\.([^,}]+)(?:,|\n|}|$)/);
    if (propMatch && currentSchema) {
      const propName = propMatch[1];
      const propDef = propMatch[2];
      
      // すでに.describe()が含まれているかチェック
      if (line.includes('.describe(')) {
        continue;
      }
      
      // プロパティの説明を取得
      let propDescription = '';
      if (propertyDescriptions[currentSchema] && propertyDescriptions[currentSchema][propName]) {
        propDescription = propertyDescriptions[currentSchema][propName];
      } else if (propertyDescriptions['parameters'] && propertyDescriptions['parameters'][propName]) {
        propDescription = propertyDescriptions['parameters'][propName];
      }
      
      if (propDescription) {
        // .describe()を追加
        const lastChar = line.trim().slice(-1);
        const lineWithoutEnd = lastChar === ',' ? line.slice(0, -1) : line;
        
        // 値に.describe()を追加
        // z.string() → z.string().describe("説明")
        const lastParenIndex = lineWithoutEnd.lastIndexOf(')');
        if (lastParenIndex > 0) {
          const before = lineWithoutEnd.substring(0, lastParenIndex + 1);
          const after = lineWithoutEnd.substring(lastParenIndex + 1);
          
          lines[i] = before + 
                    `.describe(${formatDescription(propDescription)})` + 
                    after + (lastChar === ',' ? ',' : '');
          
          modified = true;
          propModificationCount++;
        }
      }
    }
  }
  
  if (modified) {
    updatedContent = lines.join('\n');
  }

  // 3. API 関数に説明を追加
  const apiPattern = /export\s+function\s+([a-zA-Z0-9_]+)\s*\(/g;
  let apiMatch;
  let apiModificationCount = 0;

  console.log(`Scanning for API functions...`);
  while ((apiMatch = apiPattern.exec(updatedContent)) !== null) {
    const [fullMatch, functionName] = apiMatch;
    
    // 関数に説明コメントがすでにあるかチェック
    const precedingText = updatedContent.substring(Math.max(0, apiMatch.index - 200), apiMatch.index);
    if (precedingText.includes('/**') && precedingText.includes('*/')) {
      continue;
    }
    
    // API 説明を取得
    const apiDescription = operationDescriptions[functionName];
    if (!apiDescription) {
      continue;
    }
    
    console.log(`Adding description to API function: ${functionName}`);
    
    // JSDoc形式のコメントを挿入
    const commentBlock = `/**
 * ${apiDescription}
 */
`;
    
    updatedContent = updatedContent.substring(0, apiMatch.index) + 
                    commentBlock + 
                    updatedContent.substring(apiMatch.index);
    
    // パターンのインデックスを調整（挿入されたコメントの長さ分）
    apiPattern.lastIndex += commentBlock.length;
    apiModificationCount++;
  }

  console.log(`Modified ${modificationCount} schema definitions, ${propModificationCount} properties, and ${apiModificationCount} API functions`);

  if (modificationCount > 0 || propModificationCount > 0 || apiModificationCount > 0) {
    // ファイルに書き込む
    try {
      fs.writeFileSync(zodFilePath, updatedContent, 'utf8');
      console.log(`Successfully wrote updated content to: ${zodFilePath}`);
      
      // 変更前後のファイルサイズを確認
      const originalSize = content.length;
      const updatedSize = updatedContent.length;
      console.log(`Original file size: ${originalSize}, Updated file size: ${updatedSize}`);
      console.log(`Difference: ${updatedSize - originalSize} characters`);
    } catch (err) {
      console.error(`Error writing to file: ${zodFilePath}`, err);
    }
  } else {
    console.log('No modifications made, skipping file write');
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    // OpenAPI からの説明を収集
    await collectDescriptionsFromOpenAPI();
    
    // Zodファイルにdescriptionを追加
    console.log('Adding descriptions to Zod schemas...');
    addDescriptionsToZod(zodFilePath);
    console.log('Completed successfully!');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

main();
