import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { SchemaConverter } from './schema-converter.js';

/**
 * API Tool Parameter structure
 */
export interface ApiToolParameter {
  name: string;
  description: string;
  required: boolean;
  type: string; // 'path', 'query', or 'body'
  schema?: z.ZodTypeAny;
}

/**
 * API Tool structure
 */
export interface ApiTool {
  name: string;
  description: string;
  parameters: ApiToolParameter[];
  path: string;
  method: string;
  operationId?: string;
}

/**
 * Generates API tools from OpenAPI schemas
 */
export class ApiToolGenerator {
  private mockApiDefinition: any = null;
  private preGeneratedApiTools: ApiTool[] | null = null;
  
  constructor(private readonly schemaConverter: SchemaConverter) {
    // Try to load pre-generated tools on instantiation
    this.loadPreGeneratedTools();
  }
  
  /**
   * For testing only - set mock API definition
   */
  setMockApiDefinition(mockData: any): void {
    this.mockApiDefinition = mockData;
  }
  
  /**
   * Load pre-generated API tools from JSON file
   */
  private loadPreGeneratedTools(): ApiTool[] | null {
    try {
      const projectRoot = process.cwd();
      const filePath = path.resolve(projectRoot, 'src', 'tools', 'generated', 'api-tools.json');
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const tools = JSON.parse(content);
        
        // Rebuild Zod schemas for loaded tools
        const toolsWithSchema = this.rebuildZodSchemas(tools);
        
        console.error(`[INFO] Loaded pre-generated API tools: ${toolsWithSchema.length} tools`);
        this.preGeneratedApiTools = toolsWithSchema;
        return toolsWithSchema;
      }
      
      console.error('[WARN] No pre-generated API tools found. Dynamic generation will be needed.');
      return null;
    } catch (error) {
      console.error(`[ERROR] Failed to load pre-generated API tools: ${error}`);
      return null;
    }
  }
  
  /**
   * Rebuild Zod schemas for JSON-formatted tools
   */
  private rebuildZodSchemas(tools: any[]): ApiTool[] {
    return tools.map(tool => ({
      ...tool,
      parameters: tool.parameters.map((param: any) => ({
        ...param,
        schema: this.recreateZodSchema(param.schema)
      }))
    }));
  }
  
  /**
   * Recreate Zod schema from schema info
   */
  private recreateZodSchema(schemaInfo: any): z.ZodTypeAny {
    if (!schemaInfo) return z.any();
    
    try {
      switch (schemaInfo.type) {
        case 'string':
          return z.string();
        case 'number':
        case 'integer':
          return z.number();
        case 'boolean':
          return z.boolean();
        case 'array':
          return z.array(
            schemaInfo.items ? this.recreateZodSchema(schemaInfo.items) : z.any()
          );
        case 'object':
          return z.record(z.any());
        default:
          return z.string();
      }
    } catch (error) {
      console.error(`[ERROR] Failed to recreate Zod schema: ${error}`);
      return z.any();
    }
  }
  
  /**
   * Extract resource name from path
   * Example: /products/{productId} -> products
   */
  private extractResourceFromPath(path: string): string {
    // Extract first segment from path
    const segments = path.split('/').filter(Boolean);
    return segments.length > 0 ? segments[0] : 'resource';
  }
  
  /**
   * Convert plural to singular form
   * Example: products -> product
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
   * Get action name from HTTP method
   */
  private getActionFromMethod(method: string, hasId: boolean): string {
    switch (method.toLowerCase()) {
      case 'get':
        return hasId ? 'get' : 'list';
      case 'post':
        return 'create';
      case 'put':
      case 'patch':
        return 'update';
      case 'delete':
        return 'delete';
      default:
        return method.toLowerCase();
    }
  }
  
  /**
   * Generate human-readable tool name from OpenAPI path and method
   */
  private generateToolName(path: string, method: string, operationId?: string): string {
    // Use operationId if provided
    if (operationId) {
      return operationId;
    }
    
    // Check if path contains path parameter
    const hasPathParam = path.includes('{');
    
    // Extract resource name
    let resource = this.extractResourceFromPath(path);
    
    // Convert to singular form for individual resource operations
    if (hasPathParam && method.toLowerCase() === 'get') {
      resource = this.singularize(resource);
    }
    
    // Get action name
    const action = this.getActionFromMethod(method, hasPathParam);
    
    // Add 'ById' suffix for operations with ID parameter
    const byId = hasPathParam && !['create', 'list'].includes(action) ? 'ById' : '';
    
    // Capitalize resource name
    const capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
    
    // Combine parts to form tool name
    return `${action}${capitalizedResource}${byId}`;
  }
  
  /**
   * Detect parameter type (path, query, or body)
   */
  private detectParameterType(
    path: string,
    paramName: string,
    method: string,
    pathParams: string[] = []
  ): 'path' | 'query' | 'body' {
    // Path parameter
    if (pathParams.includes(paramName) || path.includes(`{${paramName}}`)) {
      return 'path';
    }
    
    // Body parameter for POST, PUT, PATCH
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && !paramName.startsWith('query_')) {
      return 'body';
    }
    
    // Default to query parameter
    return 'query';
  }
  
  /**
   * Get Zod schema for parameter
   */
  private getZodSchemaForParameter(param: any): z.ZodTypeAny {
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
        // Handle array item type
        const itemsType = param.items?.type || 'string';
        schema = itemsType === 'number' || itemsType === 'integer'
          ? z.array(z.number())
          : z.array(z.string());
        break;
      case 'object':
        schema = z.record(z.any());
        break;
      default:
        // Special handling for date formats
        if (format === 'date' || format === 'date-time') {
          schema = z.string().refine(
            (val) => !Number.isNaN(new Date(val).getTime()),
            { message: `Invalid ${format} format` }
          );
        } else {
          schema = z.string();
        }
    }
    
    // Make optional if not required
    return isRequired ? schema : schema.optional();
  }
  
  /**
   * Generate API tool parameters from OpenAPI operation
   */
  private generateParameters(
    path: string,
    method: string,
    operation: any,
    pathParams: string[] = []
  ): ApiToolParameter[] {
    const parameters: ApiToolParameter[] = [];
    
    // Process path and query parameters
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
    
    // Process request body parameters
    if (operation.requestBody && operation.requestBody.content) {
      // Look for JSON content type
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
   * Generate API tools from OpenAPI schema
   */
  generateTools(): ApiTool[] {
    // Use pre-generated tools if available
    if (this.preGeneratedApiTools && this.preGeneratedApiTools.length > 0) {
      console.error(`[INFO] Using ${this.preGeneratedApiTools.length} pre-generated API tools`);
      return this.preGeneratedApiTools;
    }
    
    const tools: ApiTool[] = [];
    
    try {
      // Load POS API schema
      const posDefinition = this.mockApiDefinition || this.schemaConverter.convertTypeScriptToJson('pos');
      if (posDefinition && posDefinition.paths) {
        this.processPathsDefinition(posDefinition.paths, tools);
      }
      
      // Load Common API schema
      const commonDefinition = this.mockApiDefinition || this.schemaConverter.convertTypeScriptToJson('common');
      if (commonDefinition && commonDefinition.paths) {
        this.processPathsDefinition(commonDefinition.paths, tools);
      }
      
      // Generate mock tools if none were generated
      if (tools.length === 0) {
        console.error('[WARN] No API tools were generated from schemas. Using mock tools.');
        this.processPathsDefinition({
          '/pos/products': {
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
        }, tools);
      }
      
      console.error(`[INFO] Generated ${tools.length} API tools`);
      return tools;
    } catch (error) {
      console.error(`[ERROR] Tool generation failed: ${error}`);
      return [];
    }
  }
  
  /**
   * Process OpenAPI paths definition and generate tools
   */
  private processPathsDefinition(paths: any, tools: ApiTool[]): void {
    for (const [path, pathItem] of Object.entries<any>(paths)) {
      // Extract path parameters
      const pathParams = (path.match(/{([^}]+)}/g) || [])
        .map(param => param.slice(1, -1));
      
      // Process each HTTP method
      for (const [method, operation] of Object.entries<any>(pathItem)) {
        // Skip non-operation properties
        if (method === 'parameters' || typeof operation !== 'object') {
          continue;
        }
        
        // Get actual operation object
        const actualOperation = typeof operation === 'string' && operation.startsWith('operations[')
          ? { summary: operation } // Limited info for external operations
          : operation;
        
        if (!actualOperation) {
          continue;
        }
        
        // Generate tool name
        const operationId = 
          actualOperation.operationId || 
          (typeof operation === 'string' ? operation.replace(/^operations\[\"(.+)\"\]$/, '$1') : undefined);
        
        const toolName = this.generateToolName(path, method, operationId);
        
        // Generate tool description
        const description = 
          actualOperation.summary || 
          actualOperation.description || 
          `${method.toUpperCase()} ${path}`;
        
        // Generate parameters
        const parameters = this.generateParameters(path, method, actualOperation, pathParams);
        
        // Add tool
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
  
  /**
   * Save generated tools to JSON file
   */
  saveToolsToFile(tools: ApiTool[]): void {
    try {
      const outputDir = path.resolve(process.cwd(), 'src', 'tools', 'generated');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Prepare tools for serialization
      const serializableTools = tools.map(tool => ({
        ...tool,
        parameters: tool.parameters.map(param => ({
          ...param,
          schema: param.schema ? {
            type: this.getSchemaType(param.schema)
          } : undefined
        }))
      }));
      
      const outputPath = path.join(outputDir, 'api-tools.json');
      fs.writeFileSync(outputPath, JSON.stringify(serializableTools, null, 2), 'utf-8');
      console.error(`[INFO] Saved tools to ${outputPath}`);
    } catch (error) {
      console.error(`[ERROR] Failed to save tools: ${error}`);
    }
  }
  
  /**
   * Get schema type for serialization
   */
  private getSchemaType(schema: z.ZodTypeAny): string {
    if (schema instanceof z.ZodString) return 'string';
    if (schema instanceof z.ZodNumber) return 'number';
    if (schema instanceof z.ZodBoolean) return 'boolean';
    if (schema instanceof z.ZodArray) return 'array';
    if (schema instanceof z.ZodObject || schema instanceof z.ZodRecord) return 'object';
    return 'string';
  }
}
