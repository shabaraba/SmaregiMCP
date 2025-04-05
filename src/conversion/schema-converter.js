import * as fs from 'fs';
import * as path from 'path';
import * as TJS from 'typescript-json-schema';

/**
 * Converts OpenAPI TypeScript definitions to a format usable by the API tool generator
 */
export class SchemaConverter {
  /**
   * Convert OpenAPI TypeScript definitions to JSON format
   * @param namespace Namespace to import from (pos or common)
   * @returns JSON representation of the schema
   */
  convertTypeScriptToJson(namespace) {
    try {
      // First try to read the converted JSON file if it exists
      const convertedFilePath = path.resolve(process.cwd(), 'src', 'schema', 'converted', `${namespace}.json`);
      if (fs.existsSync(convertedFilePath)) {
        console.error(`[INFO] Using pre-converted schema: ${convertedFilePath}`);
        const jsonContent = fs.readFileSync(convertedFilePath, 'utf-8');
        return JSON.parse(jsonContent);
      }
      
      console.error(`[INFO] Generating schema from TypeScript definitions for ${namespace}`);
      
      // Path to the TypeScript definition file
      const tsDefPath = path.resolve(process.cwd(), 'src', 'schema', `${namespace}.d.ts`);
      
      if (!fs.existsSync(tsDefPath)) {
        console.error(`[ERROR] TypeScript definition file not found: ${tsDefPath}`);
        return this.generateMockSchema(namespace);
      }
      
      // TypeScript compiler options
      const compilerOptions = {
        strictNullChecks: true,
      };
      
      // Schema generator settings
      const settings = {
        required: true,
        ref: false, // We want to embed refs for better readability
        aliasRef: false,
        topRef: false,
        titles: true,
        noExtraProps: false,
        propOrder: true,
        typeOfKeyword: true,
        defaultNumberType: 'number',
        defaultProps: true
      };
      
      // Create TypeScript program from the definition file
      const program = TJS.getProgramFromFiles([tsDefPath], compilerOptions);
      
      // Create schema generator
      const generator = TJS.buildGenerator(program, settings);
      if (!generator) {
        console.error(`[ERROR] Failed to create schema generator for ${namespace}`);
        return this.generateMockSchema(namespace);
      }
      
      // Get all user symbols
      const symbols = generator.getUserSymbols();
      
      // Look for 'paths' symbol which is typically the root of OpenAPI definitions
      if (symbols.includes('paths')) {
        console.error(`[INFO] Found 'paths' symbol in ${namespace} schema`);
        const schema = generator.getSchemaForSymbol('paths');
        
        // In OpenAPI definitions, paths properties contain the API endpoints
        if (schema && schema.properties) {
          // Process each path to ensure it has the right format for API tools
          const processedPaths = this.processPathsStructure(schema.properties);
          return { paths: processedPaths };
        } else {
          console.error(`[ERROR] Invalid schema structure for ${namespace}, missing properties`);
          return this.generateMockSchema(namespace);
        }
      } else {
        console.error(`[ERROR] No 'paths' symbol found in ${namespace} schema`);
        return this.generateMockSchema(namespace);
      }
    } catch (error) {
      console.error(`[ERROR] Schema conversion failed: ${error}`);
      return this.generateMockSchema(namespace);
    }
  }

  /**
   * Process paths structure to ensure it's in the right format for API tools
   * @param paths Paths object from the TypeScript JSON schema
   * @returns Processed paths object
   */
  processPathsStructure(paths) {
    const processedPaths = {};
    
    for (const [path, pathObj] of Object.entries(paths)) {
      processedPaths[path] = {};
      
      // Add path-level properties if they exist
      if (pathObj.parameters) {
        processedPaths[path].parameters = pathObj.parameters;
      }
      
      // Process HTTP methods
      for (const [key, value] of Object.entries(pathObj)) {
        if (key === 'parameters') continue;
        
        // Check if key is an HTTP method (get, post, put, delete, etc.)
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(key)) {
          processedPaths[path][key] = this.processHttpMethod(value);
        } else {
          // For non-HTTP method properties, just copy them
          processedPaths[path][key] = value;
        }
      }
    }
    
    return processedPaths;
  }
  
  /**
   * Process HTTP method object to ensure it has the right structure
   * @param method HTTP method object
   * @returns Processed HTTP method object
   */
  processHttpMethod(method) {
    const processedMethod = { ...method };
    
    // Process parameters if they exist
    if (method.parameters) {
      processedMethod.parameters = this.processParameters(method.parameters);
    }
    
    // Process requestBody if it exists
    if (method.requestBody) {
      processedMethod.requestBody = this.processRequestBody(method.requestBody);
    }
    
    return processedMethod;
  }
  
  /**
   * Process parameters to ensure they have the right structure
   * @param parameters Parameters array from the OpenAPI definition
   * @returns Processed parameters array
   */
  processParameters(parameters) {
    if (!Array.isArray(parameters)) {
      return [];
    }
    
    return parameters.map(param => {
      // Ensure parameter has a name and other required fields
      if (!param.name) {
        return null;
      }
      
      return {
        name: param.name,
        in: param.in || 'query',
        description: param.description || `${param.name} parameter`,
        required: param.required === true,
        type: param.type || 'string',
        format: param.format,
        schema: param.schema,
        enum: param.enum,
        // Add other properties as needed
      };
    }).filter(Boolean);
  }
  
  /**
   * Process requestBody to ensure it has the right structure
   * @param requestBody RequestBody object from the OpenAPI definition
   * @returns Processed requestBody object
   */
  processRequestBody(requestBody) {
    if (!requestBody || !requestBody.content) {
      return requestBody;
    }
    
    const processedRequestBody = { ...requestBody };
    
    // Process content types (application/json, etc.)
    for (const [contentType, contentObj] of Object.entries(requestBody.content)) {
      if (contentObj && contentObj.schema) {
        // Process schema properties
        if (contentObj.schema.properties) {
          processedRequestBody.content[contentType] = {
            ...contentObj,
            schema: {
              ...contentObj.schema,
              properties: this.processSchemaProperties(contentObj.schema.properties)
            }
          };
        }
      }
    }
    
    return processedRequestBody;
  }
  
  /**
   * Process schema properties to ensure they have the right structure
   * @param properties Properties object from the schema
   * @returns Processed properties object
   */
  processSchemaProperties(properties) {
    const processedProperties = {};
    
    for (const [propName, propObj] of Object.entries(properties)) {
      processedProperties[propName] = {
        ...propObj,
        // Add default type if missing
        type: propObj.type || 'string'
      };
    }
    
    return processedProperties;
  }

  /**
   * Generate a mock schema in case of conversion failure
   * @param namespace Namespace to generate mock for
   * @returns Mock schema object
   */
  generateMockSchema(namespace) {
    console.error(`[INFO] Using mock schema for ${namespace}`);
    
    if (namespace === 'pos') {
      return {
        paths: {
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
          '/pos/products/{productId}': {
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
          },
          '/pos/transactions': {
            get: {
              summary: '取引一覧を取得',
              parameters: [
                {
                  name: 'storeId',
                  in: 'query',
                  description: '店舗ID',
                  required: false,
                  type: 'string'
                },
                {
                  name: 'startDate',
                  in: 'query',
                  description: '検索開始日',
                  required: false,
                  type: 'string',
                  format: 'date'
                },
                {
                  name: 'endDate',
                  in: 'query',
                  description: '検索終了日',
                  required: false,
                  type: 'string',
                  format: 'date'
                }
              ]
            }
          }
        }
      };
    } else {
      // Common namespace mock
      return {
        paths: {
          '/common/stores': {
            get: {
              summary: '店舗一覧を取得',
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
          },
          '/common/staff': {
            get: {
              summary: 'スタッフ一覧を取得',
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
    }
  }

  /**
   * Convert JSON Schema to Zod schema string
   * @param jsonSchema JSON Schema object
   * @returns Zod schema as a string
   */
  convertJsonSchemaToZodSchema(jsonSchema) {
    if (!jsonSchema || typeof jsonSchema !== 'object') {
      return 'z.any()';
    }
    
    // Handle different schema types
    if (jsonSchema.type === 'object' && jsonSchema.properties) {
      return this.convertObjectSchema(jsonSchema);
    } else if (jsonSchema.type === 'array') {
      return this.convertArraySchema(jsonSchema);
    } else if (jsonSchema.type === 'string') {
      return this.convertStringSchema(jsonSchema);
    } else if (jsonSchema.type === 'number' || jsonSchema.type === 'integer') {
      return this.convertNumberSchema(jsonSchema);
    } else if (jsonSchema.type === 'boolean') {
      return this.convertBooleanSchema(jsonSchema);
    } else if (jsonSchema.enum) {
      return this.convertEnumSchema(jsonSchema);
    } else if (jsonSchema.oneOf || jsonSchema.anyOf) {
      return this.convertUnionSchema(jsonSchema);
    } else if (jsonSchema.allOf) {
      return this.convertIntersectionSchema(jsonSchema);
    } else if (jsonSchema.$ref) {
      return this.convertRefSchema(jsonSchema);
    }
    
    // Default to any if we can't determine the type
    return 'z.any()';
  }
  
  /**
   * Convert object schema to Zod schema
   */
  convertObjectSchema(schema) {
    const properties = schema.properties || {};
    const required = schema.required || [];
    
    let zodCode = 'z.object({\n';
    
    for (const [propName, propSchema] of Object.entries(properties)) {
      const isRequired = required.includes(propName);
      
      let propCode = this.convertJsonSchemaToZodSchema(propSchema);
      
      // Add optional() if not required
      if (!isRequired) {
        propCode += '.optional()';
      }
      
      // Add description if available
      if (propSchema.description) {
        propCode += `.describe(${JSON.stringify(propSchema.description)})`;
      }
      
      zodCode += `  ${propName}: ${propCode},\n`;
    }
    
    zodCode += '})';
    
    // Add additional validations
    if (schema.additionalProperties === false) {
      zodCode += '.strict()';
    }
    
    return zodCode;
  }
  
  /**
   * Convert array schema to Zod schema
   */
  convertArraySchema(schema) {
    const itemSchema = schema.items || {};
    const itemType = this.convertJsonSchemaToZodSchema(itemSchema);
    
    let zodCode = `z.array(${itemType})`;
    
    // Add validations
    if (schema.minItems !== undefined) {
      zodCode += `.min(${schema.minItems})`;
    }
    
    if (schema.maxItems !== undefined) {
      zodCode += `.max(${schema.maxItems})`;
    }
    
    return zodCode;
  }
  
  /**
   * Convert string schema to Zod schema
   */
  convertStringSchema(schema) {
    let zodCode = 'z.string()';
    
    // Add validations
    if (schema.minLength !== undefined) {
      zodCode += `.min(${schema.minLength})`;
    }
    
    if (schema.maxLength !== undefined) {
      zodCode += `.max(${schema.maxLength})`;
    }
    
    if (schema.pattern) {
      zodCode += `.regex(/${schema.pattern}/)`;
    }
    
    // Add format validations
    if (schema.format) {
      switch (schema.format) {
        case 'email':
          zodCode += '.email()';
          break;
        case 'uri':
        case 'url':
          zodCode += '.url()';
          break;
        case 'date-time':
          zodCode += '.datetime()';
          break;
        case 'uuid':
          zodCode += '.uuid()';
          break;
      }
    }
    
    return zodCode;
  }
  
  /**
   * Convert number schema to Zod schema
   */
  convertNumberSchema(schema) {
    const baseType = schema.type === 'integer' ? 'z.number().int()' : 'z.number()';
    let zodCode = baseType;
    
    // Add validations
    if (schema.minimum !== undefined) {
      zodCode += `.min(${schema.minimum})`;
    }
    
    if (schema.maximum !== undefined) {
      zodCode += `.max(${schema.maximum})`;
    }
    
    if (schema.exclusiveMinimum !== undefined) {
      zodCode += `.gt(${schema.exclusiveMinimum})`;
    }
    
    if (schema.exclusiveMaximum !== undefined) {
      zodCode += `.lt(${schema.exclusiveMaximum})`;
    }
    
    if (schema.multipleOf !== undefined) {
      zodCode += `.multipleOf(${schema.multipleOf})`;
    }
    
    return zodCode;
  }
  
  /**
   * Convert boolean schema to Zod schema
   */
  convertBooleanSchema(schema) {
    return 'z.boolean()';
  }
  
  /**
   * Convert enum schema to Zod schema
   */
  convertEnumSchema(schema) {
    if (!schema.enum || !Array.isArray(schema.enum) || schema.enum.length === 0) {
      return 'z.any()';
    }
    
    const enumValues = schema.enum.map(value => JSON.stringify(value));
    
    // For single-value enums, use literal
    if (enumValues.length === 1) {
      return `z.literal(${enumValues[0]})`;
    }
    
    // For multiple values, use enum
    return `z.enum([${enumValues.join(', ')}])`;
  }
  
  /**
   * Convert union schema to Zod schema
   */
  convertUnionSchema(schema) {
    const schemas = schema.oneOf || schema.anyOf || [];
    
    if (!Array.isArray(schemas) || schemas.length === 0) {
      return 'z.any()';
    }
    
    const unionTypes = schemas.map(s => this.convertJsonSchemaToZodSchema(s));
    return `z.union([${unionTypes.join(', ')}])`;
  }
  
  /**
   * Convert intersection schema to Zod schema
   */
  convertIntersectionSchema(schema) {
    const schemas = schema.allOf || [];
    
    if (!Array.isArray(schemas) || schemas.length === 0) {
      return 'z.any()';
    }
    
    const intersectionTypes = schemas.map(s => this.convertJsonSchemaToZodSchema(s));
    return `z.intersection([${intersectionTypes.join(', ')}])`;
  }
  
  /**
   * Convert ref schema to Zod schema
   */
  convertRefSchema(schema) {
    // Extract name from $ref
    const refName = schema.$ref.split('/').pop();
    if (!refName) {
      return 'z.any()';
    }
    
    // Convert to camelCase and add Schema suffix
    const zodSchemaName = `${refName.charAt(0).toLowerCase() + refName.slice(1)}Schema`;
    return zodSchemaName;
  }

  /**
   * Save schema as JSON
   * @param namespace Namespace of the schema (pos or common)
   * @param schema Schema object to save
   */
  saveSchemaAsJson(namespace, schema) {
    try {
      const outputDir = path.resolve(process.cwd(), 'src', 'schema', 'converted');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, `${namespace}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2), 'utf-8');
      console.error(`[INFO] Saved schema to ${outputPath}`);
    } catch (error) {
      console.error(`[ERROR] Failed to save schema: ${error}`);
    }
  }
}