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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiToolsGenerator = void 0;
var common_1 = require("@nestjs/common");
var zod_1 = require("zod");
var fs = require("node:fs");
var path = require("node:path");
/**
 * OpenAPI定義から動的にツールリストを生成するクラス
 */
var ApiToolsGenerator = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ApiToolsGenerator = _classThis = /** @class */ (function () {
        function ApiToolsGenerator_1() {
            this.logger = new common_1.Logger(ApiToolsGenerator.name);
            this.mockApiDefinition = null;
            this.preGeneratedApiTools = null;
            // インスタンス化時に事前生成されたツールの読み込みを試みる
            this.loadPreGeneratedTools();
        }
        /**
         * テスト用にモックAPIデータを設定
         * この関数はテストでのみ使用されます
         */
        ApiToolsGenerator_1.prototype.setMockApiDefinition = function (mockData) {
            this.mockApiDefinition = mockData;
        };
        /**
         * 事前生成されたAPIツールJSONファイルからツールリストを読み込む
         * 読み込みに失敗した場合はnullを返す
         */
        ApiToolsGenerator_1.prototype.loadPreGeneratedTools = function () {
            try {
                var projectRoot = process.cwd();
                var filePath = path.resolve(projectRoot, 'src', 'tools', 'generated', 'api-tools.json');
                if (fs.existsSync(filePath)) {
                    var content = fs.readFileSync(filePath, 'utf8');
                    var tools = JSON.parse(content);
                    // JSONからロードしたツールのスキーマを再生成
                    var toolsWithSchema = this.rebuildZodSchemas(tools);
                    this.logger.log("\u4E8B\u524D\u751F\u6210\u3055\u308C\u305FAPI\u30C4\u30FC\u30EB\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F: ".concat(toolsWithSchema.length, "\u4EF6"));
                    this.preGeneratedApiTools = toolsWithSchema;
                    return toolsWithSchema;
                }
                this.logger.warn('事前生成されたAPIツールが見つかりません。動的生成が必要です。');
                return null;
            }
            catch (error) {
                this.logger.error("\u4E8B\u524D\u751F\u6210\u3055\u308C\u305FAPI\u30C4\u30FC\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ".concat(error));
                return null;
            }
        };
        /**
         * JSON形式のツールからZodスキーマを再構築する
         */
        ApiToolsGenerator_1.prototype.rebuildZodSchemas = function (tools) {
            var _this = this;
            return tools.map(function (tool) { return (__assign(__assign({}, tool), { parameters: tool.parameters.map(function (param) { return (__assign(__assign({}, param), { schema: _this.recreateZodSchema(param.schema) })); }) })); });
        };
        /**
         * シリアライズされたスキーマ情報からZodスキーマを再生成する
         */
        ApiToolsGenerator_1.prototype.recreateZodSchema = function (schemaInfo) {
            if (!schemaInfo)
                return zod_1.z.any();
            try {
                switch (schemaInfo.type) {
                    case 'string':
                        return zod_1.z.string();
                    case 'number':
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
                this.logger.error("Zod\u30B9\u30AD\u30FC\u30DE\u306E\u518D\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ".concat(error));
                return zod_1.z.any();
            }
        };
        /**
         * OpenAPI定義ファイルを読み込む
         */
        ApiToolsGenerator_1.prototype.loadOpenApiDefinition = function (filename) {
            // テスト用のモックデータが設定されている場合はそれを使用
            if (this.mockApiDefinition) {
                return this.mockApiDefinition;
            }
            try {
                var projectRoot = process.cwd();
                // 変更: 正しいディレクトリパスを指定
                var filePath = path.resolve(projectRoot, 'src', 'schema', 'converted', filename);
                if (fs.existsSync(filePath)) {
                    var content = fs.readFileSync(filePath, 'utf8');
                    var jsonData = JSON.parse(content);
                    // openapi-typescriptが生成するJSONファイルの構造に対応
                    if (jsonData.properties) {
                        return { paths: jsonData.properties };
                    }
                    return jsonData;
                }
                // モックデータを返す
                this.logger.warn("OpenAPI\u5B9A\u7FA9\u30D5\u30A1\u30A4\u30EB ".concat(filename, " \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30E2\u30C3\u30AF\u30C7\u30FC\u30BF\u3092\u4F7F\u7528\u3057\u307E\u3059\u3002"));
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
            }
            catch (error) {
                this.logger.error("OpenAPI\u5B9A\u7FA9\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ".concat(error));
                return { paths: {} };
            }
        };
        /**
         * パスからリソース名を抽出する
         * 例: /products/{productId} -> products
         */
        ApiToolsGenerator_1.prototype.extractResourceFromPath = function (path) {
            // パスから最初のセグメントを抽出
            var segments = path.split('/').filter(Boolean);
            return segments.length > 0 ? segments[0] : 'resource';
        };
        /**
         * 単数形に変換する簡易関数
         * 例: products -> product
         */
        ApiToolsGenerator_1.prototype.singularize = function (word) {
            if (word.endsWith('ies')) {
                return word.slice(0, -3) + 'y';
            }
            else if (word.endsWith('s') && !word.endsWith('ss')) {
                return word.slice(0, -1);
            }
            return word;
        };
        /**
         * HTTPメソッドに基づいてアクション名を生成
         */
        ApiToolsGenerator_1.prototype.getActionFromMethod = function (method, hasId) {
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
        };
        /**
         * OpenAPI定義から人間が理解しやすいツール名を生成する
         * @param path APIパス
         * @param method HTTPメソッド
         * @param operationId 操作ID（設定されている場合）
         */
        ApiToolsGenerator_1.prototype.generateToolName = function (path, method, operationId) {
            // 既にoperationIdが設定されている場合は、それを優先して使用
            if (operationId) {
                return operationId;
            }
            // パスパラメータが含まれるかどうかを確認
            var hasPathParam = path.includes('{');
            // リソース名を抽出
            var resource = this.extractResourceFromPath(path);
            // リソース名が複数形の場合は単数形に変換（個別リソース取得の場合）
            if (hasPathParam && method.toLowerCase() === 'get') {
                resource = this.singularize(resource);
            }
            // アクション名を生成
            var action = this.getActionFromMethod(method, hasPathParam);
            // パスにIDパラメータが含まれている場合、ByIdを追加
            var byId = hasPathParam && !['create', 'list'].includes(action) ? 'ById' : '';
            // リソース名の先頭を大文字に
            var capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
            // ツール名を生成
            return "".concat(action).concat(capitalizedResource).concat(byId);
        };
        /**
         * パスからパラメータの種類を判定する
         * @param path APIパス
         * @param paramName パラメータ名
         * @param method HTTPメソッド
         */
        ApiToolsGenerator_1.prototype.detectParameterType = function (path, paramName, method, pathParams) {
            if (pathParams === void 0) { pathParams = []; }
            // パスパラメータの場合
            if (pathParams.includes(paramName) || path.includes("{".concat(paramName, "}"))) {
                return 'path';
            }
            // POSTやPUTのボディパラメータの場合
            if (['post', 'put', 'patch'].includes(method.toLowerCase()) && !paramName.startsWith('query_')) {
                return 'body';
            }
            // それ以外はクエリパラメータと判断
            return 'query';
        };
        /**
         * Zodスキーマタイプを判定する
         */
        ApiToolsGenerator_1.prototype.getZodSchemaForParameter = function (param) {
            var _a;
            // 型情報に基づいて適切なZodスキーマを返す
            var type = param.type || 'string';
            var format = param.format;
            var isRequired = param.required === true;
            var schema;
            switch (type.toLowerCase()) {
                case 'integer':
                case 'number':
                    schema = zod_1.z.number();
                    break;
                case 'boolean':
                    schema = zod_1.z.boolean();
                    break;
                case 'array':
                    // 配列の場合は要素の型も考慮
                    var itemsType = ((_a = param.items) === null || _a === void 0 ? void 0 : _a.type) || 'string';
                    schema = itemsType === 'number' || itemsType === 'integer'
                        ? zod_1.z.array(zod_1.z.number())
                        : zod_1.z.array(zod_1.z.string());
                    break;
                case 'object':
                    schema = zod_1.z.record(zod_1.z.any());
                    break;
                default:
                    // フォーマットに基づく特殊な型
                    if (format === 'date' || format === 'date-time') {
                        schema = zod_1.z.string().refine(function (val) { return !Number.isNaN(new Date(val).getTime()); }, { message: "Invalid ".concat(format, " format") });
                    }
                    else {
                        schema = zod_1.z.string();
                    }
            }
            return isRequired ? schema : schema.optional();
        };
        /**
         * OpenAPI定義からAPI Toolのパラメータを生成する
         */
        ApiToolsGenerator_1.prototype.generateParameters = function (path, method, operation, pathParams) {
            if (pathParams === void 0) { pathParams = []; }
            var parameters = [];
            // パスパラメータ、クエリパラメータを処理
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
            // リクエストボディがある場合、そのプロパティをパラメータとして追加
            if (operation.requestBody && operation.requestBody.content) {
                // JSONコンテンツタイプの場合
                var jsonContent = operation.requestBody.content['application/json'] ||
                    operation.requestBody.content['application/x-www-form-urlencoded'];
                if (jsonContent && jsonContent.schema && jsonContent.schema.properties) {
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
            }
            return parameters;
        };
        /**
         * OpenAPI定義からツールリストを生成する
         */
        ApiToolsGenerator_1.prototype.generateTools = function () {
            // 事前生成されたツールがあればそれを使用する
            if (this.preGeneratedApiTools && this.preGeneratedApiTools.length > 0) {
                this.logger.log("\u4E8B\u524D\u751F\u6210\u3055\u308C\u305F".concat(this.preGeneratedApiTools.length, "\u4EF6\u306EAPI\u30C4\u30FC\u30EB\u3092\u4F7F\u7528\u3057\u307E\u3059"));
                return this.preGeneratedApiTools;
            }
            var tools = [];
            try {
                // POS API定義の読み込み
                var posDefinition = this.loadOpenApiDefinition('pos.json');
                if (posDefinition && posDefinition.paths) {
                    this.processPathsDefinition(posDefinition.paths, tools);
                }
                // Common API定義の読み込み
                var commonDefinition = this.loadOpenApiDefinition('common.json');
                if (commonDefinition && commonDefinition.paths) {
                    this.processPathsDefinition(commonDefinition.paths, tools);
                }
                // Yamlファイルも探してみる（ファイル拡張子が変わっている可能性がある）
                if (tools.length === 0) {
                    try {
                        var projectRoot = process.cwd();
                        var yamlFiles = [
                            path.resolve(projectRoot, 'openapi', 'pos', 'openapi.yaml'),
                            path.resolve(projectRoot, 'openapi', 'common', 'openapi.yaml'),
                            path.resolve(projectRoot, 'openapi.yaml')
                        ];
                        for (var _i = 0, yamlFiles_1 = yamlFiles; _i < yamlFiles_1.length; _i++) {
                            var yamlFile = yamlFiles_1[_i];
                            if (fs.existsSync(yamlFile)) {
                                this.logger.log("OpenAPI YAML\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F: ".concat(yamlFile));
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
                    }
                    catch (error) {
                        this.logger.error("YAML\u30D5\u30A1\u30A4\u30EB\u306E\u51E6\u7406\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F: ".concat(error));
                    }
                }
                // ツールが生成されなかった場合はデフォルトのモックデータを使用
                if (tools.length === 0) {
                    this.logger.warn('有効なOpenAPI定義が見つかりませんでした。モックデータを使用します。');
                    var mockDefinition = {
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
                this.logger.debug("\u751F\u6210\u3055\u308C\u305F\u30C4\u30FC\u30EB: ".concat(tools.length, "\u4EF6"));
                return tools;
            }
            catch (error) {
                this.logger.error("\u30C4\u30FC\u30EB\u751F\u6210\u30A8\u30E9\u30FC: ".concat(error));
                return [];
            }
        };
        /**
         * paths定義からツールを生成する
         */
        ApiToolsGenerator_1.prototype.processPathsDefinition = function (paths, tools) {
            for (var _i = 0, _a = Object.entries(paths); _i < _a.length; _i++) {
                var _b = _a[_i], path_1 = _b[0], pathItem = _b[1];
                // パスパラメータを抽出
                var pathParams = (path_1.match(/{([^}]+)}/g) || [])
                    .map(function (param) { return param.slice(1, -1); });
                // 各HTTPメソッドを処理
                for (var _c = 0, _d = Object.entries(pathItem); _c < _d.length; _c++) {
                    var _e = _d[_c], method = _e[0], operation = _e[1];
                    // parametersやget/post/putなど以外のプロパティはスキップ
                    if (method === 'parameters' || typeof operation !== 'object') {
                        continue;
                    }
                    // operations[操作ID]形式の場合、実際の操作オブジェクトを取得
                    var actualOperation = typeof operation === 'string' && operation.startsWith('operations[')
                        ? { summary: operation } // 実際の操作は型定義からは取得できないため、操作ID情報のみ保持
                        : operation;
                    if (!actualOperation) {
                        continue;
                    }
                    // ツール名を生成
                    var operationId = actualOperation.operationId ||
                        (typeof operation === 'string' ? operation.replace(/^operations\[\"(.+)\"\]$/, '$1') : undefined);
                    var toolName = this.generateToolName(path_1, method, operationId);
                    // ツール説明文を生成
                    var description = actualOperation.summary ||
                        actualOperation.description ||
                        "".concat(method.toUpperCase(), " ").concat(path_1);
                    // パラメータを生成
                    var parameters = this.generateParameters(path_1, method, actualOperation, pathParams);
                    // ツールを追加
                    tools.push({
                        name: toolName,
                        description: description,
                        parameters: parameters,
                        path: path_1,
                        method: method.toUpperCase(),
                        operationId: operationId
                    });
                }
            }
        };
        return ApiToolsGenerator_1;
    }());
    __setFunctionName(_classThis, "ApiToolsGenerator");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiToolsGenerator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiToolsGenerator = _classThis;
}();
exports.ApiToolsGenerator = ApiToolsGenerator;
