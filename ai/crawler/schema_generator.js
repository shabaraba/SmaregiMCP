import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

// ESモジュールでの __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * APIレスポンス例からOpenAPIスキーマを生成するクラス
 */
class SchemaGenerator {
  constructor() {
    this.schemas = {};
  }

  /**
   * JSONオブジェクトからスキーマを推測
   */
  inferSchema(obj, name) {
    if (obj === null) {
      return { type: 'null' };
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return {
          type: 'array',
          items: {}
        };
      }
      
      // 配列の最初の要素からアイテムのスキーマを推測
      const firstItem = obj[0];
      const itemSchema = this.inferSchema(firstItem, `${name}Item`);
      
      return {
        type: 'array',
        items: itemSchema
      };
    }

    if (typeof obj === 'object') {
      const properties = {};
      const required = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const propName = this.formatPropertyName(key);
        properties[propName] = this.inferSchema(value, `${name}${this.capitalizeFirstLetter(propName)}`);
        
        // 必須プロパティの判定（ここではすべてのプロパティを必須とする）
        required.push(propName);
      }
      
      return {
        type: 'object',
        properties,
        required
      };
    }

    if (typeof obj === 'string') {
      // 日付形式の判定
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
        return {
          type: 'string',
          format: 'date-time'
        };
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(obj)) {
        return {
          type: 'string',
          format: 'date'
        };
      }
      
      return { type: 'string' };
    }

    if (typeof obj === 'number') {
      if (Number.isInteger(obj)) {
        return { type: 'integer' };
      }
      return { type: 'number' };
    }

    if (typeof obj === 'boolean') {
      return { type: 'boolean' };
    }

    // その他の型
    return { type: 'string' };
  }

  /**
   * プロパティ名をキャメルケースにフォーマット
   */
  formatPropertyName(name) {
    return name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * 文字列の最初の文字を大文字に変換
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * レスポンス例からスキーマを生成
   */
  generateSchemaFromResponse(response, schemaName) {
    if (!response || typeof response !== 'object') {
      return null;
    }
    
    let schemaObj;
    
    // レスポンスオブジェクトがリスト形式かどうかをチェック
    if (Array.isArray(response)) {
      // 配列の要素からスキーマを生成
      const itemSchema = this.inferSchema(response[0], `${schemaName}Item`);
      
      schemaObj = {
        type: 'array',
        items: itemSchema
      };
    } else {
      // オブジェクトからスキーマを生成
      schemaObj = this.inferSchema(response, schemaName);
    }
    
    this.schemas[schemaName] = schemaObj;
    return schemaObj;
  }

  /**
   * 生成したスキーマをファイルに保存
   */
  async saveSchemas(outputDir) {
    // ディレクトリが存在しない場合は作成
    await fs.mkdir(outputDir, { recursive: true });
    
    for (const [schemaName, schema] of Object.entries(this.schemas)) {
      const fileName = `${schemaName}.yaml`;
      const filePath = path.join(outputDir, fileName);
      
      const yamlModule = await import('js-yaml');
      const yaml = yamlModule.default;
      const schemaYaml = yaml.dump(schema, { lineWidth: -1 });
      await fs.writeFile(filePath, schemaYaml, 'utf8');
      
      console.log(`Saved schema ${schemaName} to ${filePath}`);
    }
    
    // インデックスファイルを作成
    const indexContent = {};
    for (const schemaName of Object.keys(this.schemas)) {
      indexContent[schemaName] = `./${schemaName}.yaml`;
    }
    
    const yamlModule = await import('js-yaml');
    const yaml = yamlModule.default;
    const indexPath = path.join(outputDir, '_index.yaml');
    const indexYaml = yaml.dump(indexContent, { lineWidth: -1 });
    await fs.writeFile(indexPath, indexYaml, 'utf8');
    
    console.log(`Saved schemas index to ${indexPath}`);
  }

  /**
   * APIオペレーションの詳細情報からスキーマを生成
   */
  generateSchemasFromEndpoints(endpoints) {
    for (const endpoint of endpoints) {
      const tagName = endpoint.name;
      
      for (const operation of endpoint.operations) {
        const operationId = operation.operationId || `${operation.method}${operation.path.replace(/\W+/g, '_')}`;
        
        // リクエストボディからスキーマを生成
        if (operation.requestBody) {
          const requestSchemaName = `${this.capitalizeFirstLetter(operationId)}Request`;
          this.generateSchemaFromResponse(operation.requestBody, requestSchemaName);
        }
        
        // レスポンスからスキーマを生成
        for (const [code, response] of Object.entries(operation.responses)) {
          if (response.example && code.startsWith('2')) { // 成功レスポンスのみ
            const responseSchemaName = `${this.capitalizeFirstLetter(operationId)}Response`;
            this.generateSchemaFromResponse(response.example, responseSchemaName);
          }
        }
      }
    }
    
    return this.schemas;
  }
}

export default SchemaGenerator;
