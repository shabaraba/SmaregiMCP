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
exports.ApiToolGenerator = void 0;
var zod_1 = require("zod");
var fs = require("fs");
var path = require("path");
/**
 * Generates API tools from OpenAPI schemas, aligned with MCP TypeScript SDK
 */
var ApiToolGenerator = /** @class */ (function () {
    function ApiToolGenerator(schemaConverter) {
        this.schemaConverter = schemaConverter;
        this.mockApiDefinition = null;
        this.preGeneratedApiTools = null;
        // Try to load pre-generated tools on instantiation
        this.loadPreGeneratedTools();
    }
    /**
     * For testing only - set mock API definition
     */
    ApiToolGenerator.prototype.setMockApiDefinition = function (mockData) {
        this.mockApiDefinition = mockData;
    };
    /**
     * Load pre-generated API tools from JSON file
     */
    ApiToolGenerator.prototype.loadPreGeneratedTools = function () {
        try {
            var projectRoot = process.cwd();
            var filePath = path.resolve(projectRoot, 'src', 'tools', 'generated', 'api-tools.json');
            if (fs.existsSync(filePath)) {
                var content = fs.readFileSync(filePath, 'utf8');
                var tools = JSON.parse(content);
                // Rebuild Zod schemas for loaded tools
                var toolsWithSchema = this.rebuildZodSchemas(tools);
                console.error("[INFO] Loaded pre-generated API tools: ".concat(toolsWithSchema.length, " tools"));
                this.preGeneratedApiTools = toolsWithSchema;
                return toolsWithSchema;
            }
            console.error('[WARN] No pre-generated API tools found. Dynamic generation will be needed.');
            return null;
        }
        catch (error) {
            console.error("[ERROR] Failed to load pre-generated API tools: ".concat(error));
            return null;
        }
    };
    /**
     * Rebuild Zod schemas for JSON-formatted tools
     */
    ApiToolGenerator.prototype.rebuildZodSchemas = function (tools) {
        var _this = this;
        return tools.map(function (tool) { return (__assign(__assign({}, tool), { parameters: tool.parameters.map(function (param) { return (__assign(__assign({}, param), { schema: _this.recreateZodSchema(param.schema) })); }) })); });
    };
    /**
     * Recreate Zod schema from schema info
     */
    ApiToolGenerator.prototype.recreateZodSchema = function (schemaInfo) {
        if (!schemaInfo)
            return zod_1.z.any();
        try {
            switch (schemaInfo.type) {
                case 'string':
                    return zod_1.z.string();
                case 'number':
                case 'integer':
                    return zod_1.z.number();
                case 'boolean':
                    return zod_1.z.boolean();
                case 'array':
                    return zod_1.z.array(schemaInfo.items ? this.recreateZodSchema(schemaInfo.items) : zod_1.z.any());
                case 'object':
                    return zod_1.z.record(zod_1.z.any());
                default:
                    return zod_1.z.string();
            }
        }
        catch (error) {
            console.error("[ERROR] Failed to recreate Zod schema: ".concat(error));
            return zod_1.z.any();
        }
    };
    /**
     * Extract resource name from path
     * Example: /products/{productId} -> products
     */
    ApiToolGenerator.prototype.extractResourceFromPath = function (path) {
        // Extract segments from path
        var segments = path.split('/').filter(Boolean);
        // Special handling for API paths with namespaces like /pos/products
        // In this case, we want to extract 'products' not 'pos'
        if (segments.length > 1 && ['pos', 'common'].includes(segments[0])) {
            return segments[1];
        }
        return segments.length > 0 ? segments[0] : 'resource';
    };
    /**
     * Extract category from path
     * Example: /pos/products/{productId} -> pos
     */
    ApiToolGenerator.prototype.extractCategoryFromPath = function (path) {
        var segments = path.split('/').filter(Boolean);
        // Check if the path starts with a standard category like 'pos' or 'common'
        if (segments.length > 0 && ['pos', 'common'].includes(segments[0])) {
            return segments[0];
        }
        return 'api'; // Default category if no specific one is identified
    };
    /**
     * Convert plural to singular form
     * Example: products -> product
     */
    ApiToolGenerator.prototype.singularize = function (word) {
        if (word.endsWith('ies')) {
            return word.slice(0, -3) + 'y';
        }
        else if (word.endsWith('s') && !word.endsWith('ss')) {
            return word.slice(0, -1);
        }
        return word;
    };
    /**
     * Get action name from HTTP method
     */
    ApiToolGenerator.prototype.getActionFromMethod = function (method, hasId) {
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
    };
    /**
     * Generate human-readable tool name from OpenAPI path and method
     */
    ApiToolGenerator.prototype.generateToolName = function (path, method, category, operationId) {
        // Use operationId if provided
        if (operationId) {
            return operationId;
        }
        // Check if path contains path parameter
        var hasPathParam = path.includes('{');
        // Extract resource name
        var resource = this.extractResourceFromPath(path);
        // Convert to singular form for individual resource operations
        if (hasPathParam && method.toLowerCase() === 'get') {
            resource = this.singularize(resource);
        }
        // Get action name
        var action = this.getActionFromMethod(method, hasPathParam);
        // Add 'ById' suffix for operations with ID parameter
        var byId = hasPathParam && !['create', 'list'].includes(action) ? 'ById' : '';
        // Capitalize resource name
        var capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
        // Format according to MCP SDK standard, including category
        return "".concat(category, ".").concat(action).concat(capitalizedResource).concat(byId);
    };
    /**
     * Detect parameter type (path, query, or body)
     */
    ApiToolGenerator.prototype.detectParameterType = function (path, paramName, method, pathParams) {
        if (pathParams === void 0) { pathParams = []; }
        // Path parameter
        if (pathParams.includes(paramName) || path.includes("{".concat(paramName, "}"))) {
            return 'path';
        }
        // Body parameter for POST, PUT, PATCH
        if (['post', 'put', 'patch'].includes(method.toLowerCase()) && !paramName.startsWith('query_')) {
            return 'body';
        }
        // Default to query parameter
        return 'query';
    };
    /**
     * Get Zod schema for parameter
     */
    ApiToolGenerator.prototype.getZodSchemaForParameter = function (param) {
        var _a;
        var type = param.type || 'string';
        var format = param.format;
        var isRequired = param.required === true;
        var schema;
        switch (type.toLowerCase()) {
            case 'integer':
                schema = zod_1.z.number().int();
                break;
            case 'number':
                schema = zod_1.z.number();
                break;
            case 'boolean':
                schema = zod_1.z.boolean();
                break;
            case 'array':
                // Handle array item type
                var itemsType = ((_a = param.items) === null || _a === void 0 ? void 0 : _a.type) || 'string';
                schema = itemsType === 'number' || itemsType === 'integer'
                    ? zod_1.z.array(zod_1.z.number())
                    : zod_1.z.array(zod_1.z.string());
                break;
            case 'object':
                schema = param.properties
                    ? this.buildObjectSchema(param.properties, param.required || [])
                    : zod_1.z.record(zod_1.z.any());
                break;
            default:
                // Special handling for date formats
                if (format === 'date' || format === 'date-time') {
                    schema = zod_1.z.string().refine(function (val) { return !Number.isNaN(new Date(val).getTime()); }, { message: "Invalid ".concat(format, " format") });
                }
                else if (param.enum) {
                    // Handle enum values
                    schema = zod_1.z.enum(param.enum);
                }
                else {
                    schema = zod_1.z.string();
                }
        }
        // Make optional if not required
        return isRequired ? schema : schema.optional();
    };
    /**
     * Build Zod object schema from properties
     */
    ApiToolGenerator.prototype.buildObjectSchema = function (properties, required) {
        var shape = {};
        for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], prop = _b[1];
            var isRequired = required.includes(name_1);
            var propSchema = this.getZodSchemaForParameter(__assign(__assign({}, prop), { required: isRequired }));
            shape[name_1] = propSchema;
        }
        return zod_1.z.object(shape);
    };
    /**
     * Generate API tool parameters from OpenAPI operation
     */
    ApiToolGenerator.prototype.generateParameters = function (path, method, operation, pathParams) {
        if (pathParams === void 0) { pathParams = []; }
        var parameters = [];
        // Process path and query parameters
        if (operation.parameters) {
            for (var _i = 0, _a = operation.parameters; _i < _a.length; _i++) {
                var param = _a[_i];
                var paramType = this.detectParameterType(path, param.name, method, pathParams);
                var schema = this.getZodSchemaForParameter(param);
                parameters.push({
                    name: param.name,
                    description: param.description || "".concat(param.name, " parameter"),
                    required: param.required === true,
                    type: paramType,
                    schema: schema
                });
            }
        }
        // Process request body parameters
        if (operation.requestBody && operation.requestBody.content) {
            // Look for JSON content type
            var jsonContent = operation.requestBody.content['application/json'] ||
                operation.requestBody.content['application/x-www-form-urlencoded'];
            if (jsonContent && jsonContent.schema) {
                if (jsonContent.schema.properties) {
                    // Process individual body parameters
                    var bodyRequired = jsonContent.schema.required || [];
                    for (var _b = 0, _c = Object.entries(jsonContent.schema.properties); _b < _c.length; _b++) {
                        var _d = _c[_b], propName = _d[0], propSchema = _d[1];
                        var isRequired = bodyRequired.includes(propName);
                        var schema = this.getZodSchemaForParameter(__assign(__assign({}, propSchema), { required: isRequired }));
                        parameters.push({
                            name: propName,
                            description: propSchema.description || "".concat(propName, " parameter"),
                            required: isRequired,
                            type: 'body',
                            schema: schema
                        });
                    }
                }
                else {
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
    };
    /**
     * Generate API tools from OpenAPI schema
     */
    ApiToolGenerator.prototype.generateTools = function () {
        // Use pre-generated tools if available
        if (this.preGeneratedApiTools && this.preGeneratedApiTools.length > 0) {
            console.error("[INFO] Using ".concat(this.preGeneratedApiTools.length, " pre-generated API tools"));
            return this.preGeneratedApiTools;
        }
        var tools = [];
        try {
            // Load POS API schema
            var posDefinition = this.mockApiDefinition || this.schemaConverter.convertTypeScriptToJson('pos');
            if (posDefinition && posDefinition.paths) {
                this.processPathsDefinition(posDefinition.paths, tools, 'pos');
            }
            // Load Common API schema
            var commonDefinition = this.mockApiDefinition || this.schemaConverter.convertTypeScriptToJson('common');
            if (commonDefinition && commonDefinition.paths) {
                this.processPathsDefinition(commonDefinition.paths, tools, 'common');
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
                }, tools, 'pos');
            }
            console.error("[INFO] Generated ".concat(tools.length, " API tools"));
            return tools;
        }
        catch (error) {
            console.error("[ERROR] Tool generation failed: ".concat(error));
            return [];
        }
    };
    /**
     * Process OpenAPI paths definition and generate tools
     */
    ApiToolGenerator.prototype.processPathsDefinition = function (paths, tools, defaultCategory) {
        if (defaultCategory === void 0) { defaultCategory = 'api'; }
        for (var _i = 0, _a = Object.entries(paths); _i < _a.length; _i++) {
            var _b = _a[_i], path_1 = _b[0], pathItem = _b[1];
            // Extract path parameters
            var pathParams = (path_1.match(/{([^}]+)}/g) || [])
                .map(function (param) { return param.slice(1, -1); });
            // Extract category from path
            var category = this.extractCategoryFromPath(path_1) || defaultCategory;
            // Process each HTTP method
            for (var _c = 0, _d = Object.entries(pathItem); _c < _d.length; _c++) {
                var _e = _d[_c], method = _e[0], operation = _e[1];
                // Skip non-operation properties
                if (method === 'parameters' || typeof operation !== 'object') {
                    continue;
                }
                // Get actual operation object
                var actualOperation = typeof operation === 'string' && operation.startsWith('operations[')
                    ? { summary: operation } // Limited info for external operations
                    : operation;
                if (!actualOperation) {
                    continue;
                }
                // Generate tool name
                var operationId = actualOperation.operationId ||
                    (typeof operation === 'string' ? operation.replace(/^operations\[\"(.+)\"\]$/, '$1') : undefined);
                var toolName = this.generateToolName(path_1, method, category, operationId);
                // Generate tool description
                var description = actualOperation.summary ||
                    actualOperation.description ||
                    "".concat(method.toUpperCase(), " ").concat(path_1);
                // Generate parameters
                var parameters = this.generateParameters(path_1, method, actualOperation, pathParams);
                // Add tool
                tools.push({
                    name: toolName,
                    description: description,
                    parameters: parameters,
                    path: path_1,
                    method: method.toUpperCase(),
                    operationId: operationId,
                    category: category,
                    version: '1.0' // Default version if not specified
                });
            }
        }
    };
    /**
     * Save generated tools to JSON file
     */
    ApiToolGenerator.prototype.saveToolsToFile = function (tools) {
        var _this = this;
        try {
            var outputDir = path.resolve(process.cwd(), 'src', 'tools', 'generated');
            // Create directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            // Prepare tools for serialization
            var serializableTools = tools.map(function (tool) { return (__assign(__assign({}, tool), { parameters: tool.parameters.map(function (param) { return (__assign(__assign({}, param), { schema: param.schema ? {
                        type: _this.getSchemaType(param.schema)
                    } : undefined })); }) })); });
            var outputPath = path.join(outputDir, 'api-tools.json');
            fs.writeFileSync(outputPath, JSON.stringify(serializableTools, null, 2), 'utf-8');
            console.error("[INFO] Saved tools to ".concat(outputPath));
        }
        catch (error) {
            console.error("[ERROR] Failed to save tools: ".concat(error));
        }
    };
    /**
     * Get schema type for serialization
     */
    ApiToolGenerator.prototype.getSchemaType = function (schema) {
        if (schema instanceof zod_1.z.ZodString)
            return 'string';
        if (schema instanceof zod_1.z.ZodNumber)
            return 'number';
        if (schema instanceof zod_1.z.ZodBoolean)
            return 'boolean';
        if (schema instanceof zod_1.z.ZodArray)
            return 'array';
        if (schema instanceof zod_1.z.ZodObject || schema instanceof zod_1.z.ZodRecord)
            return 'object';
        if (schema instanceof zod_1.z.ZodEnum)
            return 'enum';
        if (schema instanceof zod_1.z.ZodOptional) {
            var innerSchema = schema._def.innerType;
            return this.getSchemaType(innerSchema);
        }
        return 'string';
    };
    return ApiToolGenerator;
}());
exports.ApiToolGenerator = ApiToolGenerator;
