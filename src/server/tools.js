"use strict";
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
exports.registerTools = registerTools;
var zod_1 = require("zod");
/**
 * Register all tools to the MCP server
 * @param mcpServer - The MCP server instance
 * @param authService - The authentication service
 * @param apiService - The API service
 * @param apiToolGenerator - The API tool generator
 */
function registerTools(mcpServer, authService, apiService, apiToolGenerator) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.error('[INFO] Registering tools...');
                    // Register authentication tools
                    registerAuthTools(mcpServer, authService);
                    // Register API request tools
                    registerApiRequestTools(mcpServer, apiService);
                    // Register API info tools
                    registerApiInfoTools(mcpServer, apiService);
                    // Register generated API tools
                    return [4 /*yield*/, registerGeneratedApiTools(mcpServer, apiToolGenerator, apiService)];
                case 1:
                    // Register generated API tools
                    _a.sent();
                    console.error('[INFO] Tools registered successfully');
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Register authentication tools
 * @param mcpServer - The MCP server instance
 * @param authService - The authentication service
 */
function registerAuthTools(mcpServer, authService) {
    var _this = this;
    console.error('[INFO] Registering authentication tools');
    // Authentication tool - Get Authorization URL
    mcpServer.tool('getAuthorizationUrl', 'スマレジAPIにアクセスするための認証URLを生成します。ユーザーはこのURLでブラウザにアクセスして認証を完了する必要があります。', {
        scopes: zod_1.z.array(zod_1.z.string()).describe('要求するスコープのリスト（例：["pos.products:read", "pos.transactions:read"]）'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var result, error_1;
        var scopes = _b.scopes;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authService.getAuthorizationUrl(scopes)];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "# \u8A8D\u8A3CURL\n\n\u4EE5\u4E0B\u306EURL\u3092\u30D6\u30E9\u30A6\u30B6\u3067\u958B\u304D\u3001\u30B9\u30DE\u30EC\u30B8\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A\n\n".concat(result.url, "\n\n\u8A8D\u8A3C\u304C\u5B8C\u4E86\u3057\u305F\u3089\u3001`checkAuthStatus`\u30C4\u30FC\u30EB\u3092\u4F7F\u7528\u3057\u3066\u8A8D\u8A3C\u72B6\u614B\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002\u30BB\u30C3\u30B7\u30E7\u30F3ID: `").concat(result.sessionId, "`")
                                }
                            ]
                        }];
                case 2:
                    error_1 = _c.sent();
                    console.error("[ERROR] getAuthorizationUrl failed: ".concat(error_1));
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "\u8A8D\u8A3CURL\u751F\u6210\u30A8\u30E9\u30FC: ".concat(error_1)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Authentication tool - Check Authorization Status
    mcpServer.tool('checkAuthStatus', '認証状態を確認します。ユーザーが認証URLで認証を完了したかどうかを確認できます。', {
        sessionId: zod_1.z.string().describe('getAuthorizationUrlで取得したセッションID'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var result, error_2;
        var sessionId = _b.sessionId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authService.checkAuthStatus(sessionId)];
                case 1:
                    result = _c.sent();
                    if (result.isAuthenticated) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# \u8A8D\u8A3C\u72B6\u614B: \u6210\u529F\n\n\u8A8D\u8A3C\u304C\u5B8C\u4E86\u3057\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u30BB\u30C3\u30B7\u30E7\u30F3ID\u3092\u4F7F\u7528\u3057\u3066API\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u5B9F\u884C\u3067\u304D\u307E\u3059\uFF1A`".concat(sessionId, "`\n\n\u4EE5\u4E0B\u306E\u3088\u3046\u306BAPI\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u5B9F\u884C\u3067\u304D\u307E\u3059\uFF1A\n\n```json\n{\n  \"sessionId\": \"").concat(sessionId, "\",\n  \"endpoint\": \"/pos/products\",\n  \"method\": \"GET\",\n  \"query\": { \"limit\": 10 }\n}\n```")
                                    }
                                ]
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# \u8A8D\u8A3C\u72B6\u614B: \u5F85\u6A5F\u4E2D\n\n\u8A8D\u8A3C\u304C\u307E\u3060\u5B8C\u4E86\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u30E6\u30FC\u30B6\u30FC\u306F\u30D6\u30E9\u30A6\u30B6\u3067\u8A8D\u8A3C\u30D7\u30ED\u30BB\u30B9\u3092\u5B8C\u4E86\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002\n\n\u8A8D\u8A3CURL\u304C\u671F\u9650\u5207\u308C\u306E\u5834\u5408\u306F\u3001`getAuthorizationUrl`\u30C4\u30FC\u30EB\u3067\u65B0\u3057\u3044URL\u3092\u751F\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
                                    }
                                ]
                            }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    console.error("[ERROR] checkAuthStatus failed: ".concat(error_2));
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "\u8A8D\u8A3C\u72B6\u614B\u78BA\u8A8D\u30A8\u30E9\u30FC: ".concat(error_2)
                                }
                            ],
                            isError: true
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
/**
 * Register API request tools
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiRequestTools(mcpServer, apiService) {
    var _this = this;
    console.error('[INFO] Registering API request tools');
    // API tool - Execute API Request
    mcpServer.tool('executeApiRequest', 'スマレジAPIにリクエストを送信します。認証済みのセッションが必要です。', {
        sessionId: zod_1.z.string().describe('認証済みのセッションID'),
        endpoint: zod_1.z.string().describe('APIエンドポイント（例："/pos/products"）'),
        method: zod_1.z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTPメソッド'),
        data: zod_1.z.object({}).passthrough().optional().describe('リクエストボディ（POSTまたはPUTリクエスト用）'),
        path: zod_1.z.record(zod_1.z.any()).optional().describe('パスパラメータ（例：{ product_id: "123" }）'),
        query: zod_1.z.record(zod_1.z.any()).optional().describe('クエリパラメータ（例：{ limit: 10, offset: 0 }）'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var response, responseText, error_3;
        var sessionId = _b.sessionId, endpoint = _b.endpoint, method = _b.method, data = _b.data, path = _b.path, query = _b.query;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.error("[INFO] executeApiRequest: ".concat(method, " ").concat(endpoint));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, apiService.executeRequest({
                            sessionId: sessionId,
                            endpoint: endpoint,
                            method: method,
                            data: data,
                            path: path,
                            query: query
                        })];
                case 2:
                    response = _c.sent();
                    responseText = "# API ".concat(method, " ").concat(endpoint, " \u30EC\u30B9\u30DD\u30F3\u30B9\n\n");
                    // Add info about the request
                    responseText += "## \u30EA\u30AF\u30A8\u30B9\u30C8\u60C5\u5831\n";
                    responseText += "- \u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8: `".concat(endpoint, "`\n");
                    responseText += "- \u30E1\u30BD\u30C3\u30C9: `".concat(method, "`\n");
                    if (path && Object.keys(path).length > 0) {
                        responseText += "- \u30D1\u30B9\u30D1\u30E9\u30E1\u30FC\u30BF: `".concat(JSON.stringify(path), "`\n");
                    }
                    if (query && Object.keys(query).length > 0) {
                        responseText += "- \u30AF\u30A8\u30EA\u30D1\u30E9\u30E1\u30FC\u30BF: `".concat(JSON.stringify(query), "`\n");
                    }
                    if (data && Object.keys(data).length > 0) {
                        responseText += "- \u30EA\u30AF\u30A8\u30B9\u30C8\u30DC\u30C7\u30A3: `".concat(JSON.stringify(data), "`\n");
                    }
                    responseText += "\n## \u30EC\u30B9\u30DD\u30F3\u30B9\u30C7\u30FC\u30BF\n\n```json\n".concat(JSON.stringify(response, null, 2), "\n```\n");
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: responseText
                                }
                            ]
                        }];
                case 3:
                    error_3 = _c.sent();
                    console.error("[ERROR] API request failed: ".concat(error_3));
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "API \u30EA\u30AF\u30A8\u30B9\u30C8\u5931\u6557: ".concat(error_3)
                                }
                            ],
                            isError: true
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
/**
 * Register API info tools
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiInfoTools(mcpServer, apiService) {
    var _this = this;
    console.error('[INFO] Registering API info tools');
    // API Info tool - Get Smaregi API Overview
    mcpServer.tool('getSmaregiApiOverview', 'スマレジAPIの概要情報を取得します。', {
        category: zod_1.z.string().optional().describe('情報を取得したいカテゴリ'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var overview, title;
        var category = _b.category;
        return __generator(this, function (_c) {
            try {
                overview = apiService.getApiCategoryOverview(category);
                if (!overview) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "API\u60C5\u5831\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: ".concat(category || 'すべてのカテゴリ')
                                }
                            ],
                            isError: true
                        }];
                }
                title = '# スマレジAPI 概要';
                if (category) {
                    title = "# \u30B9\u30DE\u30EC\u30B8API ".concat(category.toUpperCase(), " \u6982\u8981");
                }
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: "".concat(title, "\n\n").concat(overview)
                            }
                        ]
                    }];
            }
            catch (error) {
                console.error("[ERROR] API overview retrieval failed: ".concat(error));
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: "API\u60C5\u5831\u53D6\u5F97\u30A8\u30E9\u30FC: ".concat(error)
                            }
                        ],
                        isError: true
                    }];
            }
            return [2 /*return*/];
        });
    }); });
    // API Info tool - List API Endpoints
    mcpServer.tool('listApiEndpoints', 'スマレジAPIのエンドポイント一覧を取得します。', {
        category: zod_1.z.string().describe('APIカテゴリ（例："pos", "auth", "system"）'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var paths, content_1;
        var category = _b.category;
        return __generator(this, function (_c) {
            try {
                paths = apiService.getApiPaths(category);
                if (!paths || paths.length === 0) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "\u30AB\u30C6\u30B4\u30EA\u300C".concat(category, "\u300D\u306E\u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002")
                                }
                            ],
                            isError: true
                        }];
                }
                content_1 = "# ".concat(category.toUpperCase(), " API\u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8\u4E00\u89A7\n\n");
                paths.forEach(function (path) {
                    content_1 += "## ".concat(path.name, "\n");
                    if (path.description) {
                        content_1 += "".concat(path.description, "\n\n");
                    }
                    content_1 += "- \u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8: `".concat(path.method, " ").concat(path.path, "`\n");
                    content_1 += "- \u30EA\u30BD\u30FC\u30B9URI: `smaregi://api/".concat(category, "/").concat(path.name, "`\n\n");
                });
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: content_1
                            }
                        ]
                    }];
            }
            catch (error) {
                console.error("[ERROR] List API endpoints failed: ".concat(error));
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: "API\u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8\u4E00\u89A7\u53D6\u5F97\u30A8\u30E9\u30FC: ".concat(error)
                            }
                        ],
                        isError: true
                    }];
            }
            return [2 /*return*/];
        });
    }); });
}
/**
 * Register generated API tools
 * @param mcpServer - The MCP server instance
 * @param apiToolGenerator - The API tool generator
 * @param apiService - The API service
 * @returns Number of registered tools
 */
function registerGeneratedApiTools(mcpServer, apiToolGenerator, apiService) {
    return __awaiter(this, void 0, void 0, function () {
        var tools, _loop_1, _i, tools_1, tool;
        var _this = this;
        return __generator(this, function (_a) {
            try {
                console.error('[INFO] Registering generated API tools...');
                tools = apiToolGenerator.generateTools();
                _loop_1 = function (tool) {
                    console.error("[DEBUG] Registering tool: ".concat(tool.name));
                    // Convert parameters to Zod schema
                    var paramsSchema = {};
                    // Always add sessionId parameter
                    paramsSchema['sessionId'] = zod_1.z.string().describe('認証済みのセッションID');
                    tool.parameters.forEach(function (param) {
                        // Use default z.string() if schema is not set
                        var schema = param.schema || zod_1.z.string();
                        if (param.required) {
                            paramsSchema[param.name] = schema.describe(param.description);
                        }
                        else {
                            paramsSchema[param.name] = schema.optional().describe(param.description);
                        }
                    });
                    // Register tool
                    mcpServer.tool(tool.name, tool.description, paramsSchema, function (params) { return __awaiter(_this, void 0, void 0, function () {
                        var pathParams_1, queryParams_1, bodyParams_1, response, content, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    pathParams_1 = {};
                                    queryParams_1 = {};
                                    bodyParams_1 = undefined;
                                    // Distribute parameters to appropriate categories
                                    tool.parameters.forEach(function (param) {
                                        if (params[param.name] === undefined)
                                            return;
                                        switch (param.type) {
                                            case 'path':
                                                pathParams_1[param.name] = params[param.name];
                                                break;
                                            case 'query':
                                                queryParams_1[param.name] = params[param.name];
                                                break;
                                            case 'body':
                                                if (!bodyParams_1)
                                                    bodyParams_1 = {};
                                                bodyParams_1[param.name] = params[param.name];
                                                break;
                                        }
                                    });
                                    console.error("[DEBUG] API call: ".concat(tool.method, " ").concat(tool.path));
                                    console.error("[DEBUG] Path params: ".concat(JSON.stringify(pathParams_1)));
                                    console.error("[DEBUG] Query params: ".concat(JSON.stringify(queryParams_1)));
                                    if (bodyParams_1) {
                                        console.error("[DEBUG] Body params: ".concat(JSON.stringify(bodyParams_1)));
                                    }
                                    return [4 /*yield*/, apiService.executeRequest({
                                            sessionId: params.sessionId,
                                            endpoint: tool.path,
                                            method: tool.method,
                                            data: bodyParams_1,
                                            path: pathParams_1,
                                            query: queryParams_1
                                        })];
                                case 1:
                                    response = _a.sent();
                                    content = "# ".concat(tool.name, " \u30EC\u30B9\u30DD\u30F3\u30B9\n\n");
                                    content += "## \u30EA\u30AF\u30A8\u30B9\u30C8\u60C5\u5831\n";
                                    content += "- \u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8: `".concat(tool.path, "`\n");
                                    content += "- \u30E1\u30BD\u30C3\u30C9: `".concat(tool.method, "`\n\n");
                                    content += "## \u30EC\u30B9\u30DD\u30F3\u30B9\u30C7\u30FC\u30BF\n\n```json\n".concat(JSON.stringify(response, null, 2), "\n```\n");
                                    return [2 /*return*/, {
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: content
                                                }
                                            ]
                                        }];
                                case 2:
                                    error_4 = _a.sent();
                                    console.error("[ERROR] Tool execution error (".concat(tool.name, "): ").concat(error_4));
                                    return [2 /*return*/, {
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: "Error executing ".concat(tool.name, ": ").concat(error_4)
                                                }
                                            ],
                                            isError: true
                                        }];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                };
                // Register each tool
                for (_i = 0, tools_1 = tools; _i < tools_1.length; _i++) {
                    tool = tools_1[_i];
                    _loop_1(tool);
                }
                console.error("[INFO] Registered ".concat(tools.length, " API tools"));
                return [2 /*return*/, tools.length];
            }
            catch (error) {
                console.error("[ERROR] Failed to register API tools: ".concat(error));
                return [2 /*return*/, 0];
            }
            return [2 /*return*/];
        });
    });
}
