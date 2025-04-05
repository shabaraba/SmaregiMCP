"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaConverter = void 0;
var fs = require("fs");
var path = require("path");
var TJS = require("typescript-json-schema");
/**
 * Converts OpenAPI TypeScript definitions to a format usable by the API tool generator
 */
var SchemaConverter = /** @class */ (function () {
    function SchemaConverter() {
    }
    /**
     * Convert OpenAPI TypeScript definitions to JSON format
     * @param namespace Namespace to import from (pos or common)
     * @returns JSON representation of the schema
     */
    SchemaConverter.prototype.convertTypeScriptToJson = function (namespace) {
        try {
            // First try to read the converted JSON file if it exists
            var convertedFilePath = path.resolve(process.cwd(), 'src', 'schema', 'converted', "".concat(namespace, ".json"));
            if (fs.existsSync(convertedFilePath)) {
                console.error("[INFO] Using pre-converted schema: ".concat(convertedFilePath));
                var jsonContent = fs.readFileSync(convertedFilePath, 'utf-8');
                return JSON.parse(jsonContent);
            }
            console.error("[INFO] Generating schema from TypeScript definitions for ".concat(namespace));
            // Path to the TypeScript definition file
            var tsDefPath = path.resolve(process.cwd(), 'src', 'schema', "".concat(namespace, ".d.ts"));
            if (!fs.existsSync(tsDefPath)) {
                console.error("[ERROR] TypeScript definition file not found: ".concat(tsDefPath));
                return this.generateMockSchema(namespace);
            }
            // TypeScript compiler options
            var compilerOptions = {
                strictNullChecks: true,
            };
            // Schema generator settings
            var settings = {
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
            var program = TJS.getProgramFromFiles([tsDefPath], compilerOptions);
            // Create schema generator
            var generator = TJS.buildGenerator(program, settings);
            if (!generator) {
                console.error("[ERROR] Failed to create schema generator for ".concat(namespace));
                return this.generateMockSchema(namespace);
            }
            // Get all user symbols
            var symbols = generator.getUserSymbols();
            // Look for 'paths' symbol which is typically the root of OpenAPI definitions
            if (symbols.includes('paths')) {
                console.error("[INFO] Found 'paths' symbol in ".concat(namespace, " schema"));
                var schema = generator.getSchemaForSymbol('paths');
                // In OpenAPI definitions, paths properties contain the API endpoints
                if (schema && schema.properties) {
                    // Process each path to ensure it has the right format for API tools
                    var processedPaths = this.processPathsStructure(schema.properties);
                    return { paths: processedPaths };
                }
                else {
                    console.error("[ERROR] Invalid schema structure for ".concat(namespace, ", missing properties"));
                    return this.generateMockSchema(namespace);
                }
            }
            else {
                console.error("[ERROR] No 'paths' symbol found in ".concat(namespace, " schema"));
                return this.generateMockSchema(namespace);
            }
        }
        catch (error) {
            console.error("[ERROR] Schema conversion failed: ".concat(error));
            return this.generateMockSchema(namespace);
        }
    };
    /**
     * Process paths structure to ensure it's in the right format for API tools
     * @param paths Paths object from the TypeScript JSON schema
     * @returns Processed paths object
     */
    SchemaConverter.prototype.processPathsStructure = function (paths) {
        var processedPaths = {};
        for (var _i = 0, _a = Object.entries(paths); _i < _a.length; _i++) {
            var _b = _a[_i], path_1 = _b[0], pathObj = _b[1];
            processedPaths[path_1] = {};
            // Add path-level properties if they exist
            if (pathObj.parameters) {
                processedPaths[path_1].parameters = pathObj.parameters;
            }
            // Process HTTP methods
            for (var _c = 0, _d = Object.entries(pathObj); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], value = _e[1];
                if (key === 'parameters')
                    continue;
                // Check if key is an HTTP method (get, post, put, delete, etc.)
                if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(key)) {
                    processedPaths[path_1][key] = this.processHttpMethod(value);
                }
                else {
                    // For non-HTTP method properties, just copy them
                    processedPaths[path_1][key] = value;
                }
            }
        }
        return processedPaths;
    };
    /**
     * Process HTTP method object to ensure it has the right structure
     * @param method HTTP method object
     * @returns Processed HTTP method object
     */
    SchemaConverter.prototype.processHttpMethod = function (method) {
        var processedMethod = __assign({}, method);
        // Process parameters if they exist
        if (method.parameters) {
            processedMethod.parameters = this.processParameters(method.parameters);
        }
        // Process requestBody if it exists
        if (method.requestBody) {
            processedMethod.requestBody = this.processRequestBody(method.requestBody);
        }
        return processedMethod;
    };
    /**
     * Process parameters to ensure they have the right structure
     * @param parameters Parameters array from the OpenAPI definition
     * @returns Processed parameters array
     */
    SchemaConverter.prototype.processParameters = function (parameters) {
        if (!Array.isArray(parameters)) {
            return [];
        }
        return parameters.map(function (param) {
            // Ensure parameter has a name and other required fields
            if (!param.name) {
                return null;
            }
            return {
                name: param.name,
                in: param.in || 'query',
                description: param.description || "".concat(param.name, " parameter"),
                required: param.required === true,
                type: param.type || 'string',
                format: param.format,
                schema: param.schema,
                enum: param.enum,
                // Add other properties as needed
            };
        }).filter(Boolean);
    };
    /**
     * Process requestBody to ensure it has the right structure
     * @param requestBody RequestBody object from the OpenAPI definition
     * @returns Processed requestBody object
     */
    SchemaConverter.prototype.processRequestBody = function (requestBody) {
        if (!requestBody || !requestBody.content) {
            return requestBody;
        }
        var processedRequestBody = __assign({}, requestBody);
        // Process content types (application/json, etc.)
        for (var _i = 0, _a = Object.entries(requestBody.content); _i < _a.length; _i++) {
            var _b = _a[_i], contentType = _b[0], contentObj = _b[1];
            if (contentObj && contentObj.schema) {
                // Process schema properties
                if (contentObj.schema.properties) {
                    processedRequestBody.content[contentType] = __assign(__assign({}, contentObj), { schema: __assign(__assign({}, contentObj.schema), { properties: this.processSchemaProperties(contentObj.schema.properties) }) });
                }
            }
        }
        return processedRequestBody;
    };
    /**
     * Process schema properties to ensure they have the right structure
     * @param properties Properties object from the schema
     * @returns Processed properties object
     */
    SchemaConverter.prototype.processSchemaProperties = function (properties) {
        var processedProperties = {};
        for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
            var _b = _a[_i], propName = _b[0], propObj = _b[1];
            processedProperties[propName] = __assign(__assign({}, propObj), { 
                // Add default type if missing
                type: propObj.type || 'string' });
        }
        return processedProperties;
    };
    /**
     * Generate a mock schema in case of conversion failure
     * @param namespace Namespace to generate mock for
     * @returns Mock schema object
     */
    SchemaConverter.prototype.generateMockSchema = function (namespace) {
        console.error("[INFO] Using mock schema for ".concat(namespace));
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
        }
        else {
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
    };
    /**
     * Convert JSON Schema to Zod schema string
     * @param jsonSchema JSON Schema object
     * @returns Zod schema as a string
     */
    SchemaConverter.prototype.convertJsonSchemaToZodSchema = function (jsonSchema) {
        if (!jsonSchema || typeof jsonSchema !== 'object') {
            return 'z.any()';
        }
        // Handle different schema types
        if (jsonSchema.type === 'object' && jsonSchema.properties) {
            return this.convertObjectSchema(jsonSchema);
        }
        else if (jsonSchema.type === 'array') {
            return this.convertArraySchema(jsonSchema);
        }
        else if (jsonSchema.type === 'string') {
            return this.convertStringSchema(jsonSchema);
        }
        else if (jsonSchema.type === 'number' || jsonSchema.type === 'integer') {
            return this.convertNumberSchema(jsonSchema);
        }
        else if (jsonSchema.type === 'boolean') {
            return this.convertBooleanSchema(jsonSchema);
        }
        else if (jsonSchema.enum) {
            return this.convertEnumSchema(jsonSchema);
        }
        else if (jsonSchema.oneOf || jsonSchema.anyOf) {
            return this.convertUnionSchema(jsonSchema);
        }
        else if (jsonSchema.allOf) {
            return this.convertIntersectionSchema(jsonSchema);
        }
        else if (jsonSchema.$ref) {
            return this.convertRefSchema(jsonSchema);
        }
        // Default to any if we can't determine the type
        return 'z.any()';
    };
    /**
     * Convert object schema to Zod schema
     */
    SchemaConverter.prototype.convertObjectSchema = function (schema) {
        var properties = schema.properties || {};
        var required = schema.required || [];
        var zodCode = 'z.object({\n';
        for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
            var _b = _a[_i], propName = _b[0], propSchema = _b[1];
            var isRequired = required.includes(propName);
            var propCode = this.convertJsonSchemaToZodSchema(propSchema);
            // Add optional() if not required
            if (!isRequired) {
                propCode += '.optional()';
            }
            // Add description if available
            if (propSchema.description) {
                propCode += ".describe(".concat(JSON.stringify(propSchema.description), ")");
            }
            zodCode += "  ".concat(propName, ": ").concat(propCode, ",\n");
        }
        zodCode += '})';
        // Add additional validations
        if (schema.additionalProperties === false) {
            zodCode += '.strict()';
        }
        return zodCode;
    };
    /**
     * Convert array schema to Zod schema
     */
    SchemaConverter.prototype.convertArraySchema = function (schema) {
        var itemSchema = schema.items || {};
        var itemType = this.convertJsonSchemaToZodSchema(itemSchema);
        var zodCode = "z.array(".concat(itemType, ")");
        // Add validations
        if (schema.minItems !== undefined) {
            zodCode += ".min(".concat(schema.minItems, ")");
        }
        if (schema.maxItems !== undefined) {
            zodCode += ".max(".concat(schema.maxItems, ")");
        }
        return zodCode;
    };
    /**
     * Convert string schema to Zod schema
     */
    SchemaConverter.prototype.convertStringSchema = function (schema) {
        var zodCode = 'z.string()';
        // Add validations
        if (schema.minLength !== undefined) {
            zodCode += ".min(".concat(schema.minLength, ")");
        }
        if (schema.maxLength !== undefined) {
            zodCode += ".max(".concat(schema.maxLength, ")");
        }
        if (schema.pattern) {
            zodCode += ".regex(/".concat(schema.pattern, "/)");
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
    };
    /**
     * Convert number schema to Zod schema
     */
    SchemaConverter.prototype.convertNumberSchema = function (schema) {
        var baseType = schema.type === 'integer' ? 'z.number().int()' : 'z.number()';
        var zodCode = baseType;
        // Add validations
        if (schema.minimum !== undefined) {
            zodCode += ".min(".concat(schema.minimum, ")");
        }
        if (schema.maximum !== undefined) {
            zodCode += ".max(".concat(schema.maximum, ")");
        }
        if (schema.exclusiveMinimum !== undefined) {
            zodCode += ".gt(".concat(schema.exclusiveMinimum, ")");
        }
        if (schema.exclusiveMaximum !== undefined) {
            zodCode += ".lt(".concat(schema.exclusiveMaximum, ")");
        }
        if (schema.multipleOf !== undefined) {
            zodCode += ".multipleOf(".concat(schema.multipleOf, ")");
        }
        return zodCode;
    };
    /**
     * Convert boolean schema to Zod schema
     */
    SchemaConverter.prototype.convertBooleanSchema = function (schema) {
        return 'z.boolean()';
    };
    /**
     * Convert enum schema to Zod schema
     */
    SchemaConverter.prototype.convertEnumSchema = function (schema) {
        if (!schema.enum || !Array.isArray(schema.enum) || schema.enum.length === 0) {
            return 'z.any()';
        }
        var enumValues = schema.enum.map(function (value) { return JSON.stringify(value); });
        // For single-value enums, use literal
        if (enumValues.length === 1) {
            return "z.literal(".concat(enumValues[0], ")");
        }
        // For multiple values, use enum
        return "z.enum([".concat(enumValues.join(', '), "])");
    };
    /**
     * Convert union schema to Zod schema
     */
    SchemaConverter.prototype.convertUnionSchema = function (schema) {
        var _this = this;
        var schemas = schema.oneOf || schema.anyOf || [];
        if (!Array.isArray(schemas) || schemas.length === 0) {
            return 'z.any()';
        }
        var unionTypes = schemas.map(function (s) { return _this.convertJsonSchemaToZodSchema(s); });
        return "z.union([".concat(unionTypes.join(', '), "])");
    };
    /**
     * Convert intersection schema to Zod schema
     */
    SchemaConverter.prototype.convertIntersectionSchema = function (schema) {
        var _this = this;
        var schemas = schema.allOf || [];
        if (!Array.isArray(schemas) || schemas.length === 0) {
            return 'z.any()';
        }
        var intersectionTypes = schemas.map(function (s) { return _this.convertJsonSchemaToZodSchema(s); });
        return "z.intersection([".concat(intersectionTypes.join(', '), "])");
    };
    /**
     * Convert ref schema to Zod schema
     */
    SchemaConverter.prototype.convertRefSchema = function (schema) {
        // Extract name from $ref
        var refName = schema.$ref.split('/').pop();
        if (!refName) {
            return 'z.any()';
        }
        // Convert to camelCase and add Schema suffix
        var zodSchemaName = "".concat(refName.charAt(0).toLowerCase() + refName.slice(1), "Schema");
        return zodSchemaName;
    };
    /**
     * Save schema as JSON
     * @param namespace Namespace of the schema (pos or common)
     * @param schema Schema object to save
     */
    SchemaConverter.prototype.saveSchemaAsJson = function (namespace, schema) {
        try {
            var outputDir = path.resolve(process.cwd(), 'src', 'schema', 'converted');
            // Create directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            var outputPath = path.join(outputDir, "".concat(namespace, ".json"));
            fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2), 'utf-8');
            console.error("[INFO] Saved schema to ".concat(outputPath));
        }
        catch (error) {
            console.error("[ERROR] Failed to save schema: ".concat(error));
        }
    };
    return SchemaConverter;
}());
exports.SchemaConverter = SchemaConverter;
