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
exports.createServer = createServer;
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var schema_converter_js_1 = require("../conversion/schema-converter.js");
var tool_generator_js_1 = require("../conversion/tool-generator.js");
var auth_service_js_1 = require("../auth/auth.service.js");
var api_service_js_1 = require("../api/api.service.js");
var package_info_js_1 = require("../utils/package-info.js");
var resources_js_1 = require("./resources.js");
var tools_js_1 = require("./tools.js");
var prompts_js_1 = require("./prompts.js");
var zod_1 = require("zod");
// Schema for resource listing
var ListResourcesRequestSchema = zod_1.z.object({
    method: zod_1.z.literal('resources/list'),
    params: zod_1.z.object({}),
});
// Schema for prompts listing
var ListPromptsRequestSchema = zod_1.z.object({
    method: zod_1.z.literal('prompts/list'),
    params: zod_1.z.object({}),
});
// Schema for prompt retrieval
var GetPromptRequestSchema = zod_1.z.object({
    method: zod_1.z.literal('prompts/get'),
    params: zod_1.z.object({
        name: zod_1.z.string(),
        arguments: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
/**
 * MCP Server creation function
 * Creates and configures an MCP server instance
 */
function createServer() {
    return __awaiter(this, void 0, void 0, function () {
        var mcpServer, schemaConverter, apiToolGenerator, authService, apiService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.error('[INFO] Creating MCP server...');
                    mcpServer = new mcp_js_1.McpServer({
                        name: 'smaregi',
                        version: package_info_js_1.packageInfo.version,
                    }, {
                        capabilities: {
                            resources: {},
                            prompts: {},
                        },
                    });
                    schemaConverter = new schema_converter_js_1.SchemaConverter();
                    apiToolGenerator = new tool_generator_js_1.ApiToolGenerator(schemaConverter);
                    authService = new auth_service_js_1.AuthService();
                    apiService = new api_service_js_1.ApiService(authService);
                    // Set default request handlers
                    setupDefaultHandlers(mcpServer.server);
                    // Register resources, tools, and prompts
                    return [4 /*yield*/, (0, resources_js_1.registerResources)(mcpServer, apiService, schemaConverter)];
                case 1:
                    // Register resources, tools, and prompts
                    _a.sent();
                    return [4 /*yield*/, (0, tools_js_1.registerTools)(mcpServer, authService, apiService, apiToolGenerator)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, prompts_js_1.registerPrompts)(mcpServer)];
                case 3:
                    _a.sent();
                    console.error('[INFO] MCP server created and configured successfully');
                    return [2 /*return*/, {
                            server: mcpServer.server,
                            mcpServer: mcpServer
                        }];
            }
        });
    });
}
/**
 * Setup default request handlers for resources and prompts listing
 * @param server - The MCP server instance
 */
function setupDefaultHandlers(server) {
    var _this = this;
    // Set resource listing handler
    server.setRequestHandler(ListResourcesRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
        var resourceTemplates, resources;
        return __generator(this, function (_a) {
            resourceTemplates = [
                { template: 'smaregi://api/{category}/{path}', description: 'スマレジAPIリソース' },
                { template: 'smaregi://docs/{document}', description: 'スマレジAPIドキュメント' }
            ];
            resources = [
                { id: 'smaregi://docs/readme', description: 'スマレジMCPについて' },
                { id: 'smaregi://docs/api-overview', description: 'スマレジAPI概要' },
                { id: 'smaregi://docs/authentication', description: '認証ガイド' },
                { id: 'smaregi://api/pos', description: 'POSシステムAPI' },
                { id: 'smaregi://api/auth', description: '認証API' },
                { id: 'smaregi://api/system', description: 'システム管理API' }
            ];
            console.error("[INFO] resources/list response: ".concat(resourceTemplates.length, " templates, ").concat(resources.length, " resources"));
            return [2 /*return*/, {
                    resourceTemplates: resourceTemplates,
                    resources: resources
                }];
        });
    }); });
    // Set prompts listing handler
    server.setRequestHandler(ListPromptsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
        var prompts;
        return __generator(this, function (_a) {
            prompts = [
                {
                    name: 'search-products',
                    description: '商品を検索',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['商品を検索して', '在庫のある商品を教えて'],
                    parameters: {
                        type: 'object',
                        properties: {
                            keyword: {
                                type: 'string',
                                description: '検索キーワード'
                            },
                            category: {
                                type: 'string',
                                description: '商品カテゴリ'
                            }
                        }
                    }
                },
                {
                    name: 'analyze-sales',
                    description: '売上データを分析',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['売上分析をして', '今週の売上を見せて'],
                    parameters: {
                        type: 'object',
                        properties: {
                            period: {
                                type: 'string',
                                description: '分析期間（例: 今週、先月、過去3ヶ月）'
                            },
                            storeId: {
                                type: 'string',
                                description: '店舗ID'
                            }
                        }
                    }
                },
                {
                    name: 'manage-inventory',
                    description: '在庫管理',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['在庫状況を確認して', '在庫不足の商品を表示して'],
                    parameters: {
                        type: 'object',
                        properties: {
                            storeId: {
                                type: 'string',
                                description: '店舗ID'
                            },
                            category: {
                                type: 'string',
                                description: '商品カテゴリ'
                            }
                        }
                    }
                },
                {
                    name: 'analyze-customers',
                    description: '顧客データを分析',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['顧客分析をして', 'リピーター顧客を分析して'],
                    parameters: {
                        type: 'object',
                        properties: {
                            period: {
                                type: 'string',
                                description: '分析期間'
                            },
                            segment: {
                                type: 'string',
                                description: '顧客セグメント'
                            }
                        }
                    }
                }
            ];
            console.error("[INFO] prompts/list response: ".concat(prompts.length, " prompts"));
            return [2 /*return*/, {
                    prompts: prompts
                }];
        });
    }); });
    // Set prompt retrieval handler
    server.setRequestHandler(GetPromptRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name, promptArgs, allPrompts, promptDef, messages;
        return __generator(this, function (_b) {
            _a = request.params, name = _a.name, promptArgs = _a.arguments;
            console.error("[INFO] prompts/get request: ".concat(name));
            allPrompts = [
                {
                    name: 'search-products',
                    description: '商品を検索',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['商品を検索して', '在庫のある商品を教えて']
                },
                {
                    name: 'analyze-sales',
                    description: '売上データを分析',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['売上分析をして', '今週の売上を見せて']
                },
                {
                    name: 'manage-inventory',
                    description: '在庫管理',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['在庫状況を確認して', '在庫不足の商品を表示して']
                },
                {
                    name: 'analyze-customers',
                    description: '顧客データを分析',
                    is_user_prompt_template: true,
                    sample_user_prompts: ['顧客分析をして', 'リピーター顧客を分析して']
                }
            ];
            promptDef = allPrompts.find(function (p) { return p.name === name; });
            if (!promptDef) {
                throw new Error("\u30D7\u30ED\u30F3\u30D7\u30C8 \"".concat(name, "\" \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093"));
            }
            messages = [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: "".concat(promptDef.description, "\u306B\u3064\u3044\u3066\u306E\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002")
                    }
                }
            ];
            return [2 /*return*/, {
                    description: promptDef.description,
                    messages: messages
                }];
        });
    }); });
}
