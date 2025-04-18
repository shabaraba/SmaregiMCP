import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { SchemaConverter } from './schema-converter.js';

/**
 * API Tool Parameter structure aligned with MCP TypeScript SDK
 */
export interface ApiToolParameter {
  name: string;
  description: string;
  required: boolean;
  type: string; // 'path', 'query', or 'body'
  schema?: z.ZodTypeAny;
}

/**
 * API Tool structure aligned with MCP TypeScript SDK
 */
export interface ApiTool {
  name: string;
  description: string;
  parameters: ApiToolParameter[];
  path: string;
  method: string;
  operationId?: string;
  category?: string;
  version?: string;
}

/**
 * Generates API tools from OpenAPI schemas, aligned with MCP TypeScript SDK
 */
export class ApiToolGenerator {
  private mockApiDefinition: any = null;
  private preGeneratedApiTools: ApiTool[] | null = null;
  
  constructor(private readonly schemaConverter: SchemaConverter) {
    // Try to load pre-generated tools on instantiation
    this.loadPreGeneratedTools();
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
    // Extract segments from path
    const segments = path.split('/').filter(Boolean);
    
    // Special handling for API paths with namespaces like /pos/products
    // In this case, we want to extract 'products' not 'pos'
    if (segments.length > 1 && ['pos', 'common'].includes(segments[0])) {
      return segments[1];
    }
    
    return segments.length > 0 ? segments[0] : 'resource';
  }
  
  /**
   * Extract category from path
   * Example: /pos/products/{productId} -> pos
   */
  private extractCategoryFromPath(path: string): string {
    const segments = path.split('/').filter(Boolean);
    
    // Check if the path starts with a standard category like 'pos' or 'common'
    if (segments.length > 0 && ['pos', 'common'].includes(segments[0])) {
      return segments[0];
    }
    
    return 'api'; // Default category if no specific one is identified
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
  private generateToolName(path: string, method: string, category: string, operationId?: string): string {
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
    const capitalizedResource = (resource.charAt(0).toUpperCase() + resource.slice(1)).replace(category, "");
    
    // Format according to MCP SDK standard, including category
    return `${category}_${action}${capitalizedResource}${byId}`;
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
        schema = z.number().int();
        break;
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
        schema = param.properties 
          ? this.buildObjectSchema(param.properties, param.required || [])
          : z.record(z.any());
        break;
      default:
        // Special handling for date formats
        if (format === 'date' || format === 'date-time') {
          schema = z.string().refine(
            (val) => !Number.isNaN(new Date(val).getTime()),
            { message: `Invalid ${format} format` }
          );
        } else if (param.enum) {
          // Handle enum values
          schema = z.enum(param.enum);
        } else {
          schema = z.string();
        }
    }
    
    // Make optional if not required
    return isRequired ? schema : schema.optional();
  }
  
  /**
   * Build Zod object schema from properties
   */
  private buildObjectSchema(properties: any, required: string[]): z.ZodTypeAny {
    const shape: Record<string, z.ZodTypeAny> = {};
    
    for (const [name, prop] of Object.entries<any>(properties)) {
      const isRequired = required.includes(name);
      let propSchema = this.getZodSchemaForParameter({
        ...prop,
        required: isRequired
      });
      
      shape[name] = propSchema;
    }
    
    return z.object(shape);
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
    if (operation.parameters && Array.isArray(operation.parameters)) {
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
      
      if (jsonContent && jsonContent.schema) {
        if (jsonContent.schema.properties) {
          // Process individual body parameters
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
        } else {
          // If no properties, handle as entire body object
          parameters.push({
            name: 'body',
            description: 'Request body',
            required: operation.requestBody.required === true,
            type: 'body',
            schema: this.getZodSchemaForParameter(jsonContent.schema)
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
    // if (this.preGeneratedApiTools && this.preGeneratedApiTools.length > 0) {
    //   console.error(`[INFO] Using ${this.preGeneratedApiTools.length} pre-generated API tools`);
    //   return this.preGeneratedApiTools;
    // }
    
    const tools: ApiTool[] = [];
    
    try {
      // Load POS API schema
      const posDefinition = this.schemaConverter.convertTypeScriptToJson('pos');
      if (posDefinition && posDefinition.properties) {
        this.processPathsDefinition(posDefinition.properties, tools, 'pos');
      }
      
      // Load Common API schema
      const commonDefinition = this.schemaConverter.convertTypeScriptToJson('common');
      if (commonDefinition && commonDefinition.properties) {
        this.processPathsDefinition(commonDefinition.properties, tools, 'common');
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
  private processPathsDefinition(paths: object, tools: ApiTool[], defaultCategory: string = 'api'): void {
    for (const [path, _pathItem] of Object.entries<any>(paths)) {
      const pathItem = _pathItem.properties;
      // Extract path parameters
      const pathParams = (path.match(/{([^}]+)}/g) || [])
        .map(param => param.slice(1, -1));
      
      // Extract category from path
      // const category = this.extractCategoryFromPath(path) || defaultCategory;
      const category = defaultCategory;
      
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
        
        const toolName = this.generateToolName(path, method, category, operationId);
        
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
          operationId,
          category,
          version: '1.0' // Default version if not specified
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
    if (schema instanceof z.ZodEnum) return 'enum';
    if (schema instanceof z.ZodOptional) {
      const innerSchema = schema.unwrap();
      return this.getSchemaType(innerSchema);
    }
    return 'string';
  }
}
