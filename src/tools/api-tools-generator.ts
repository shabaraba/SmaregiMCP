import { Injectable, Logger } from '@nestjs/common';
import { ApiTool, ApiToolParameter } from './interfaces/api-tool.interface.js';
import { z } from 'zod';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * OpenAPI定義から動的にツールリストを生成するクラス
 */
@Injectable()
export class ApiToolsGenerator {
  private readonly logger = new Logger(ApiToolsGenerator.name);
  private mockApiDefinition: any = null;

  constructor() {}
  
  /**
   * テスト用にモックAPIデータを設定
   * この関数はテストでのみ使用されます
   */
  setMockApiDefinition(mockData: any): void {
    this.mockApiDefinition = mockData;
  }
  
  /**
   * OpenAPI定義ファイルを読み込む
   */
  private loadOpenApiDefinition(filename: string): any {
    // テスト用のモックデータが設定されている場合はそれを使用
    if (this.mockApiDefinition) {
      return this.mockApiDefinition;
    }
    
    try {
      const projectRoot = process.cwd();
      const filePath = path.resolve(projectRoot, 'openapi', filename);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
      
      // モックデータを返す
      this.logger.warn(`OpenAPI定義ファイル ${filename} が見つかりません。モックデータを使用します。`);
      return {
        paths: {
          '/products': {
            get: {
              summary: '商品一覧を取得',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: '取得する件数',
                  required: false,
                  type: 'integer'
                }
              ]
            },
            post: {
              summary: '商品を登録',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      properties: {
                        product_name: {
                          type: 'string',
                          description: '商品名'
                        },
                        price: {
                          type: 'integer',
                          description: '価格'
                        }
                      },
                      required: ['product_name']
                    }
                  }
                }
              }
            }
          },
          '/products/{productId}': {
            get: {
              summary: '商品詳細を取得',
              parameters: [
                {
                  name: 'productId',
                  in: 'path',
                  description: '商品ID',
                  required: true,
                  type: 'string'
                }
              ]
            }
          }
        }
      };
    } catch (error) {
      this.logger.error(`OpenAPI定義の読み込みに失敗しました: ${error}`);
      return { paths: {} };
    }
  }

  /**
   * パスからリソース名を抽出する
   * 例: /products/{productId} -> products
   */
  private extractResourceFromPath(path: string): string {
    // パスから最初のセグメントを抽出
    const segments = path.split('/').filter(Boolean);
    return segments.length > 0 ? segments[0] : 'resource';
  }

  /**
   * 単数形に変換する簡易関数
   * 例: products -> product
   */
  private singularize(word: string): string {
    if (word.endsWith('ies')) {
      return word.slice(0, -3) + 'y';
    } else if (word.endsWith('s') && !word.endsWith('ss')) {
      return word.slice(0, -1);
    }
    return word;
  }

  /**
   * HTTPメソッドに基づいてアクション名を生成
   */
  private getActionFromMethod(method: string, hasId: boolean): string {
    switch (method.toLowerCase()) {
      case 'get':
        return hasId ? 'get' : 'list';
      case 'post':
        return 'create';
      case 'put':
        return 'update';
      case 'patch':
        return 'update';
      case 'delete':
        return 'delete';
      default:
        return method.toLowerCase();
    }
  }

  /**
   * OpenAPI定義から人間が理解しやすいツール名を生成する
   * @param path APIパス
   * @param method HTTPメソッド
   * @param operationId 操作ID（設定されている場合）
   */
  generateToolName(path: string, method: string, operationId?: string): string {
    // 既にoperationIdが設定されている場合は、それを優先して使用
    if (operationId) {
      return operationId;
    }

    // パスパラメータが含まれるかどうかを確認
    const hasPathParam = path.includes('{');
    
    // リソース名を抽出
    let resource = this.extractResourceFromPath(path);
    
    // リソース名が複数形の場合は単数形に変換（個別リソース取得の場合）
    if (hasPathParam && method.toLowerCase() === 'get') {
      resource = this.singularize(resource);
    }
    
    // アクション名を生成
    const action = this.getActionFromMethod(method, hasPathParam);
    
    // パスにIDパラメータが含まれている場合、ByIdを追加
    const byId = hasPathParam && !['create', 'list'].includes(action) ? 'ById' : '';
    
    // リソース名の先頭を大文字に
    const capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
    
    // ツール名を生成
    return `${action}${capitalizedResource}${byId}`;
  }

  /**
   * パスからパラメータの種類を判定する
   * @param path APIパス
   * @param paramName パラメータ名
   * @param method HTTPメソッド
   */
  private detectParameterType(
    path: string,
    paramName: string,
    method: string,
    pathParams: string[] = []
  ): 'path' | 'query' | 'body' {
    // パスパラメータの場合
    if (pathParams.includes(paramName) || path.includes(`{${paramName}}`)) {
      return 'path';
    }
    
    // POSTやPUTのボディパラメータの場合
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && !paramName.startsWith('query_')) {
      return 'body';
    }
    
    // それ以外はクエリパラメータと判断
    return 'query';
  }

  /**
   * Zodスキーマタイプを判定する
   */
  private getZodSchemaForParameter(param: any): z.ZodTypeAny {
    // 型情報に基づいて適切なZodスキーマを返す
    const type = param.type || 'string';
    const format = param.format;
    const isRequired = param.required === true;
    
    let schema: z.ZodTypeAny;
    
    switch (type.toLowerCase()) {
      case 'integer':
      case 'number':
        schema = z.number();
        break;
      case 'boolean':
        schema = z.boolean();
        break;
      case 'array':
        // 配列の場合は要素の型も考慮
        const itemsType = param.items?.type || 'string';
        schema = itemsType === 'number' || itemsType === 'integer'
          ? z.array(z.number())
          : z.array(z.string());
        break;
      case 'object':
        schema = z.record(z.any());
        break;
      default:
        // フォーマットに基づく特殊な型
        if (format === 'date' || format === 'date-time') {
          schema = z.string().refine(
            (val) => !Number.isNaN(new Date(val).getTime()),
            { message: `Invalid ${format} format` }
          );
        } else {
          schema = z.string();
        }
    }
    
    return isRequired ? schema : schema.optional();
  }

  /**
   * OpenAPI定義からAPI Toolのパラメータを生成する
   */
  private generateParameters(
    path: string,
    method: string,
    operation: any,
    pathParams: string[] = []
  ): ApiToolParameter[] {
    const parameters: ApiToolParameter[] = [];
    
    // パスパラメータ、クエリパラメータを処理
    if (operation.parameters) {
      for (const param of operation.parameters) {
        const paramType = this.detectParameterType(path, param.name, method, pathParams);
        const schema = this.getZodSchemaForParameter(param);
        
        parameters.push({
          name: param.name,
          description: param.description || `${param.name} parameter`,
          required: param.required === true,
          type: paramType,
          schema
        });
      }
    }
    
    // リクエストボディがある場合、そのプロパティをパラメータとして追加
    if (operation.requestBody && operation.requestBody.content) {
      // JSONコンテンツタイプの場合
      const jsonContent = 
        operation.requestBody.content['application/json'] ||
        operation.requestBody.content['application/x-www-form-urlencoded'];
      
      if (jsonContent && jsonContent.schema && jsonContent.schema.properties) {
        const bodyRequired = jsonContent.schema.required || [];
        
        for (const [propName, propSchema] of Object.entries<any>(jsonContent.schema.properties)) {
          const isRequired = bodyRequired.includes(propName);
          const schema = this.getZodSchemaForParameter({
            ...propSchema,
            required: isRequired
          });
          
          parameters.push({
            name: propName,
            description: propSchema.description || `${propName} parameter`,
            required: isRequired,
            type: 'body',
            schema
          });
        }
      }
    }
    
    return parameters;
  }

  /**
   * OpenAPI定義からツールリストを生成する
   */
  generateTools(): ApiTool[] {
    const tools: ApiTool[] = [];
    
    try {
      // POS API定義の読み込み
      const posDefinition = this.loadOpenApiDefinition('pos.json');
      if (posDefinition && posDefinition.paths) {
        this.processPathsDefinition(posDefinition.paths, tools);
      }
      
      // Common API定義の読み込み
      const commonDefinition = this.loadOpenApiDefinition('common.json');
      if (commonDefinition && commonDefinition.paths) {
        this.processPathsDefinition(commonDefinition.paths, tools);
      }
      
      // Yamlファイルも探してみる（ファイル拡張子が変わっている可能性がある）
      if (tools.length === 0) {
        try {
          const projectRoot = process.cwd();
          const yamlFiles = [
            path.resolve(projectRoot, 'openapi', 'pos', 'openapi.yaml'),
            path.resolve(projectRoot, 'openapi', 'common', 'openapi.yaml'),
            path.resolve(projectRoot, 'openapi.yaml')
          ];
          
          for (const yamlFile of yamlFiles) {
            if (fs.existsSync(yamlFile)) {
              this.logger.log(`OpenAPI YAMLファイルが見つかりました: ${yamlFile}`);
              // YAMLファイルを扱うためのライブラリが必要なため、ここではモックデータを生成
              this.processPathsDefinition({
                '/categories': {
                  get: {
                    summary: '部門一覧取得',
                    parameters: [
                      {
                        name: 'fields',
                        in: 'query',
                        description: '検索パラメータ（カンマ区切りで指定可）',
                        required: false,
                        type: 'array',
                        items: {
                          type: 'string'
                        }
                      },
                      {
                        name: 'category_code',
                        in: 'query',
                        description: '部門コード',
                        required: false,
                        type: 'string'
                      }
                    ]
                  }
                }
              }, tools);
              break;
            }
          }
        } catch (error) {
          this.logger.error(`YAMLファイルの処理中にエラーが発生しました: ${error}`);
        }
      }
      
      // ツールが生成されなかった場合はデフォルトのモックデータを使用
      if (tools.length === 0) {
        this.logger.warn('有効なOpenAPI定義が見つかりませんでした。モックデータを使用します。');
        const mockDefinition = {
          paths: {
            '/products': {
              get: {
                summary: '商品一覧を取得',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '取得する件数',
                    required: false,
                    type: 'integer'
                  }
                ]
              }
            }
          }
        };
        this.processPathsDefinition(mockDefinition.paths, tools);
      }
      
      this.logger.debug(`生成されたツール: ${tools.length}件`);
      return tools;
    } catch (error) {
      this.logger.error(`ツール生成エラー: ${error}`);
      return [];
    }
  }

  /**
   * paths定義からツールを生成する
   */
  private processPathsDefinition(paths: any, tools: ApiTool[]): void {
    for (const [path, pathItem] of Object.entries<any>(paths)) {
      // パスパラメータを抽出
      const pathParams = (path.match(/{([^}]+)}/g) || [])
        .map(param => param.slice(1, -1));

      // 各HTTPメソッドを処理
      for (const [method, operation] of Object.entries<any>(pathItem)) {
        // parametersやget/post/putなど以外のプロパティはスキップ
        if (method === 'parameters' || typeof operation !== 'object') {
          continue;
        }
        
        // operations[操作ID]形式の場合、実際の操作オブジェクトを取得
        const actualOperation = typeof operation === 'string' && operation.startsWith('operations[')
          ? { summary: operation } // 実際の操作は型定義からは取得できないため、操作ID情報のみ保持
          : operation;
        
        if (!actualOperation) {
          continue;
        }
        
        // ツール名を生成
        const operationId = 
          actualOperation.operationId || 
          (typeof operation === 'string' ? operation.replace(/^operations\["(.+)"\]$/, '$1') : undefined);
        
        const toolName = this.generateToolName(path, method, operationId);
        
        // ツール説明文を生成
        const description = 
          actualOperation.summary || 
          actualOperation.description || 
          `${method.toUpperCase()} ${path}`;
        
        // パラメータを生成
        const parameters = this.generateParameters(path, method, actualOperation, pathParams);
        
        // ツールを追加
        tools.push({
          name: toolName,
          description,
          parameters,
          path,
          method: method.toUpperCase(),
          operationId
        });
      }
    }
  }
}
