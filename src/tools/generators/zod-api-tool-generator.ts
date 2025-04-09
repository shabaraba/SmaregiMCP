import { z } from 'zod';
import { ApiTool, ApiToolParameter } from '../interfaces/api-tool.interface';
import { EndpointByMethod } from '../../schema/zod/pos.zod';

/**
 * ZodApiToolGenerator - typed-openapiで生成されたZodスキーマからAPIツールを生成するクラス
 */
export class ZodApiToolGenerator {
  
  /**
   * EndpointByMethodからAPIツールを生成
   */
  public generateToolsFromZodSchema(): ApiTool[] {
    const tools: ApiTool[] = [];
    
    // HTTP methodごとに処理
    for (const [method, endpoints] of Object.entries(EndpointByMethod)) {
      for (const [path, endpoint] of Object.entries(endpoints)) {
        try {
          // ツール名を生成
          const toolName = this.generateToolName(method, path);
          
          // パラメータを抽出・変換
          const parameters = this.convertZodSchemaToParameters(endpoint.parameters);
          
          // 説明文を生成
          const description = `${method.toUpperCase()} ${path} エンドポイントへのアクセス`;
          
          // APIツールを作成
          const tool: ApiTool = {
            name: toolName,
            description,
            parameters,
            path,
            method: method.toUpperCase(),
            operationId: toolName
          };
          
          tools.push(tool);
        } catch (error) {
          console.error(`[ERROR] Failed to generate tool for ${method} ${path}:`, error);
        }
      }
    }
    
    return tools;
  }
  
  /**
   * ツール名を生成
   */
  private generateToolName(method: string, path: string): string {
    // resourceとactionを抽出
    const segments = path.split('/').filter(Boolean);
    const resource = segments[segments.length - 1].replace(/\{([^}]+)\}/, '$1') || 'resource';
    
    // メソッドに基づいてアクション名を生成
    let action;
    if (method.toLowerCase() === 'get') {
      action = path.includes('{') ? 'get' : 'list';
    } else if (method.toLowerCase() === 'post') {
      action = 'create';
    } else if (['put', 'patch'].includes(method.toLowerCase())) {
      action = 'update';
    } else if (method.toLowerCase() === 'delete') {
      action = 'delete';
    } else {
      action = method.toLowerCase();
    }
    
    const category = segments[0] || 'api';
    const capitalizedResource = this.capitalize(resource);
    
    return `${category}.${action}${capitalizedResource}`;
  }
  
  /**
   * 文字列の先頭を大文字に変換
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Zodスキーマからパラメータを抽出
   */
  private convertZodSchemaToParameters(
    parameters: any
  ): ApiToolParameter[] {
    const result: ApiToolParameter[] = [
      // セッションIDは常に必須
      {
        name: 'sessionId',
        description: '認証済みのセッションID',
        required: true,
        type: 'query',
        schema: z.string()
      }
    ];
    
    // queryパラメータを処理
    if (parameters?.query) {
      const queryParams = this.extractParametersFromZodObject(parameters.query, 'query');
      result.push(...queryParams);
    }
    
    // pathパラメータを処理
    if (parameters?.path) {
      const pathParams = this.extractParametersFromZodObject(parameters.path, 'path');
      result.push(...pathParams);
    }
    
    // bodyパラメータを処理
    if (parameters?.body) {
      const bodyParams = this.extractParametersFromZodObject(parameters.body, 'body');
      result.push(...bodyParams);
    }
    
    return result;
  }
  
  /**
   * Zodオブジェクトからパラメータを抽出
   */
  private extractParametersFromZodObject(
    zodObject: any,
    paramType: string
  ): ApiToolParameter[] {
    const result: ApiToolParameter[] = [];
    
    try {
      // shape取得
      const shape = zodObject.shape || {};
      
      // Zodオブジェクトの各プロパティを処理
      for (const [name, schema] of Object.entries(shape)) {
        try {
          const isRequired = !this.isOptional(schema);
          
          // スキーマをzodオブジェクトに変換
          const zodSchema = schema instanceof z.ZodType 
            ? schema 
            : z.any(); // zod型でない場合はany()を使用
          
          result.push({
            name,
            description: `${name} パラメータ`,
            required: isRequired,
            type: paramType,
            schema: zodSchema
          });
        } catch (error) {
          console.error(`[ERROR] Failed to extract parameter ${name}:`, error);
        }
      }
    } catch (error) {
      console.error(`[ERROR] Failed to extract parameters from Zod object:`, error);
    }
    
    return result;
  }
  
  /**
   * Zodスキーマがオプショナルかどうかを判定
   */
  private isOptional(schema: any): boolean {
    if (schema instanceof z.ZodOptional) {
      return true;
    }
    
    // _defプロパティを持っていればそれを使用
    if (schema?._def?.typeName === 'ZodOptional') {
      return true;
    }
    
    return false;
  }
}
