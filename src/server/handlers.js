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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHandlers = setupHandlers;
// モジュールのインポート
var fs = require("node:fs");
var path = require("node:path");
// @ts-ignore - 型定義の問題を回避
var yaml = require("js-yaml");
var url_1 = require("url");
var index_js_1 = require("../utils/index.js");
// モジュールのディレクトリパスを取得
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path.dirname(__filename);
// プロジェクトのルートディレクトリを取得（__dirnameは src/server なので2階層上がルート）
var PROJECT_ROOT = path.resolve(__dirname, '..', '..');
/**
 * OpenAPI仕様をYAML形式から読み込む関数
 */
function loadYamlSpec(filePath) {
    try {
        (0, index_js_1.log)("Loading YAML spec from: ".concat(filePath));
        var content = fs.readFileSync(filePath, 'utf8');
        (0, index_js_1.log)("File read successfully, size: ".concat(content.length, " bytes"));
        // 最初の数行をログに出力
        var previewLines = content.split('\n').slice(0, 5).join('\n');
        (0, index_js_1.log)("Preview of content: \n".concat(previewLines, "...\n"));
        // YAMLをパース
        var result = yaml.load(content);
        (0, index_js_1.log)("YAML parsed successfully");
        return result;
    }
    catch (error) {
        (0, index_js_1.log)("Error loading YAML: ".concat(error instanceof Error ? error.message : String(error)));
        throw new Error("Failed to load YAML spec: ".concat(error instanceof Error ? error.message : String(error)));
    }
}
/**
 * スマレジプロジェクトのルートディレクトリからOpenAPI仕様のパスを取得
 */
function getOpenApiSpecPath() {
    (0, index_js_1.log)("Project root directory: ".concat(PROJECT_ROOT));
    // 候補となるパスを設定
    var possiblePaths = [
        path.resolve(PROJECT_ROOT, 'openapi-simple.yaml'),
        path.resolve(PROJECT_ROOT, 'openapi.yaml'),
        path.resolve(PROJECT_ROOT, 'openapi', 'pos', 'openapi.yaml'),
        path.resolve(PROJECT_ROOT, 'openapi', 'common', 'openapi.yaml'),
        path.resolve(PROJECT_ROOT, 'dist', 'openapi', 'pos', 'openapi.yaml'),
        path.resolve(PROJECT_ROOT, 'dist', 'openapi', 'common', 'openapi.yaml')
    ];
    (0, index_js_1.log)("Checking possible paths: ".concat(possiblePaths.join(', ')));
    // 存在する最初のパスを使用
    for (var _i = 0, possiblePaths_1 = possiblePaths; _i < possiblePaths_1.length; _i++) {
        var candidatePath = possiblePaths_1[_i];
        (0, index_js_1.log)("Checking if exists: ".concat(candidatePath));
        if (fs.existsSync(candidatePath)) {
            (0, index_js_1.log)("OpenAPI spec found at ".concat(candidatePath));
            return candidatePath;
        }
        else {
            (0, index_js_1.log)("File not found: ".concat(candidatePath));
        }
    }
    // 見つからない場合はデバッグ情報を出力
    (0, index_js_1.log)("Warning: OpenAPI spec not found at expected locations");
    // openapi ディレクトリがある場合はその内容を確認
    var openapiDir = path.resolve(PROJECT_ROOT, 'openapi');
    if (fs.existsSync(openapiDir)) {
        (0, index_js_1.log)("Openapi directory exists at: ".concat(openapiDir));
        (0, index_js_1.log)("Listing files in openapi directory:");
        try {
            var files = fs.readdirSync(openapiDir);
            (0, index_js_1.log)("Files in openapi dir: ".concat(files.join(', ')));
            // さらに詳細を確認
            for (var _a = 0, files_1 = files; _a < files_1.length; _a++) {
                var file = files_1[_a];
                var filePath = path.join(openapiDir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    var subFiles = fs.readdirSync(filePath);
                    (0, index_js_1.log)("Files in ".concat(file, "/: ").concat(subFiles.join(', ')));
                }
            }
        }
        catch (e) {
            (0, index_js_1.log)("Error listing openapi directory: ".concat(e instanceof Error ? e.message : String(e)));
        }
    }
    else {
        (0, index_js_1.log)("openapi directory not found at: ".concat(openapiDir));
        (0, index_js_1.log)("Listing files in project root:");
        try {
            var files = fs.readdirSync(PROJECT_ROOT);
            (0, index_js_1.log)("Files in project root: ".concat(files.join(', ')));
        }
        catch (e) {
            (0, index_js_1.log)("Error listing directory: ".concat(e instanceof Error ? e.message : String(e)));
        }
    }
    // デフォルトのパス（最初の候補）を返す
    (0, index_js_1.log)("Returning default path: ".concat(possiblePaths[1]));
    return possiblePaths[1]; // POSのOpenAPIファイルをデフォルトとして返す
}
/**
 * カテゴリ別のOpenAPI情報を抽出する関数
 */
function extractCategoryInfo(spec, category) {
    var _a;
    var categoryTag = (_a = spec.tags) === null || _a === void 0 ? void 0 : _a.find(function (tag) {
        return tag.name.toLowerCase() === category.toLowerCase();
    });
    if (!categoryTag) {
        throw new Error("Category not found: ".concat(category));
    }
    var paths = {};
    // 指定されたカテゴリに関連するパスを抽出
    Object.entries(spec.paths || {}).forEach(function (_a) {
        var path = _a[0], methods = _a[1];
        Object.entries(methods).forEach(function (_a) {
            var _b;
            var method = _a[0], operation = _a[1];
            if ((_b = operation.tags) === null || _b === void 0 ? void 0 : _b.some(function (tag) { return tag.toLowerCase() === category.toLowerCase(); })) {
                if (!paths[path]) {
                    paths[path] = {};
                }
                paths[path][method] = operation;
            }
        });
    });
    return {
        category: categoryTag.name,
        description: categoryTag.description,
        paths: paths
    };
}
/**
 * すべてのエンドポイントを一覧表示する関数
 */
function listAllEndpoints(spec, category) {
    var endpoints = [];
    Object.entries(spec.paths || {}).forEach(function (_a) {
        var path = _a[0], methods = _a[1];
        Object.entries(methods).forEach(function (_a) {
            var _b;
            var method = _a[0], operation = _a[1];
            // カテゴリが指定されている場合はフィルタリング
            if (category && !((_b = operation.tags) === null || _b === void 0 ? void 0 : _b.some(function (tag) {
                return tag.toLowerCase() === category.toLowerCase();
            }))) {
                return;
            }
            endpoints.push({
                path: path,
                method: method.toUpperCase(),
                summary: operation.summary || '',
                tags: operation.tags || [],
                operationId: operation.operationId || '',
            });
        });
    });
    return endpoints;
}
/**
 * スキーマ情報を取得する関数
 */
function getSchemaInfo(spec, schemaName) {
    var _a, _b;
    var schema = (_b = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.schemas) === null || _b === void 0 ? void 0 : _b[schemaName];
    if (!schema) {
        throw new Error("Schema not found: ".concat(schemaName));
    }
    return {
        name: schemaName,
        schema: schema
    };
}
/**
 * 特定のエンドポイント情報を取得する関数
 */
function getEndpointInfo(spec, path, method) {
    var _a, _b;
    var methodLower = method.toLowerCase();
    var operation = (_b = (_a = spec.paths) === null || _a === void 0 ? void 0 : _a[path]) === null || _b === void 0 ? void 0 : _b[methodLower];
    if (!operation) {
        throw new Error("Endpoint not found: ".concat(method, " ").concat(path));
    }
    return __assign({ path: path, method: method.toUpperCase() }, operation);
}
/**
 * ツールハンドラーを設定する関数
 */
function setupHandlers() {
    var _this = this;
    var specPath = getOpenApiSpecPath();
    var spec;
    try {
        spec = loadYamlSpec(specPath);
    }
    catch (error) {
        (0, index_js_1.log)('Error loading OpenAPI spec:', error);
        throw new Error("Failed to load OpenAPI specification: ".concat(error instanceof Error ? error.message : String(error)));
    }
    return {
        // スマレジAPIの概要を取得するハンドラー
        getSmaregiApiOverview: function (request) { return __awaiter(_this, void 0, void 0, function () {
            var category, responseContent;
            var _a, _b;
            return __generator(this, function (_c) {
                category = (request.params.arguments || {}).category;
                (0, index_js_1.log)('Executing getSmaregiApiOverview, category:', category);
                try {
                    responseContent = void 0;
                    if (category) {
                        // 特定カテゴリの情報を取得
                        responseContent = extractCategoryInfo(spec, category);
                    }
                    else {
                        // APIの全体概要を取得
                        responseContent = {
                            title: spec.info.title,
                            description: spec.info.description,
                            version: spec.info.version,
                            servers: spec.servers,
                            security: (_a = spec.components) === null || _a === void 0 ? void 0 : _a.securitySchemes,
                            categories: (_b = spec.tags) === null || _b === void 0 ? void 0 : _b.map(function (tag) { return ({
                                name: tag.name,
                                description: tag.description
                            }); })
                        };
                    }
                    return [2 /*return*/, {
                            content: [{ type: 'text', text: JSON.stringify(responseContent, null, 2) }],
                            metadata: {},
                        }];
                }
                catch (error) {
                    (0, index_js_1.log)('Error handling Smaregi API overview request:', error);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error: ".concat(error instanceof Error ? error.message : String(error)),
                                },
                            ],
                            metadata: {},
                            isError: true,
                        }];
                }
                return [2 /*return*/];
            });
        }); },
        // 特定のAPIエンドポイントの詳細を取得するハンドラー
        getSmaregiApiOperation: function (request) { return __awaiter(_this, void 0, void 0, function () {
            var _a, path, method, endpointInfo;
            return __generator(this, function (_b) {
                _a = request.params.arguments, path = _a.path, method = _a.method;
                (0, index_js_1.log)('Executing getSmaregiApiOperation, path:', path, 'method:', method);
                try {
                    endpointInfo = getEndpointInfo(spec, path, method);
                    return [2 /*return*/, {
                            content: [{ type: 'text', text: JSON.stringify(endpointInfo, null, 2) }],
                            metadata: {},
                        }];
                }
                catch (error) {
                    (0, index_js_1.log)('Error handling Smaregi API operation request:', error);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error: ".concat(error instanceof Error ? error.message : String(error)),
                                },
                            ],
                            metadata: {},
                            isError: true,
                        }];
                }
                return [2 /*return*/];
            });
        }); },
        // スマレジAPIのスキーマ情報を取得するハンドラー
        getSmaregiApiSchema: function (request) { return __awaiter(_this, void 0, void 0, function () {
            var schemaName, schemaInfo;
            return __generator(this, function (_a) {
                schemaName = request.params.arguments.schemaName;
                (0, index_js_1.log)('Executing getSmaregiApiSchema, schemaName:', schemaName);
                try {
                    schemaInfo = getSchemaInfo(spec, schemaName);
                    return [2 /*return*/, {
                            content: [{ type: 'text', text: JSON.stringify(schemaInfo, null, 2) }],
                            metadata: {},
                        }];
                }
                catch (error) {
                    (0, index_js_1.log)('Error handling Smaregi API schema request:', error);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error: ".concat(error instanceof Error ? error.message : String(error)),
                                },
                            ],
                            metadata: {},
                            isError: true,
                        }];
                }
                return [2 /*return*/];
            });
        }); },
        // エンドポイント一覧を取得するハンドラー
        listSmaregiApiEndpoints: function (request) { return __awaiter(_this, void 0, void 0, function () {
            var category, endpoints;
            return __generator(this, function (_a) {
                category = (request.params.arguments || {}).category;
                (0, index_js_1.log)('Executing listSmaregiApiEndpoints, category:', category);
                try {
                    endpoints = listAllEndpoints(spec, category);
                    return [2 /*return*/, {
                            content: [{ type: 'text', text: JSON.stringify(endpoints, null, 2) }],
                            metadata: {},
                        }];
                }
                catch (error) {
                    (0, index_js_1.log)('Error handling Smaregi API endpoints list request:', error);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error: ".concat(error instanceof Error ? error.message : String(error)),
                                },
                            ],
                            metadata: {},
                            isError: true,
                        }];
                }
                return [2 /*return*/];
            });
        }); },
    };
}
