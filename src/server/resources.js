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
exports.registerResources = registerResources;
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
/**
 * Register all resources to the MCP server
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 * @param schemaConverter - The schema converter
 */
function registerResources(mcpServer, apiService, schemaConverter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.error('[INFO] Registering resources...');
            // Register API category resource template
            registerApiCategoryResource(mcpServer, apiService);
            // Register API path resource template
            registerApiPathResource(mcpServer, apiService);
            // Register document resources
            registerDocumentResources(mcpServer);
            console.error('[INFO] Resources registered successfully');
            return [2 /*return*/];
        });
    });
}
/**
 * Register API category resource template
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiCategoryResource(mcpServer, apiService) {
    var _this = this;
    console.error('[INFO] Registering API category resource template');
    mcpServer.resource('api-category', new mcp_js_1.ResourceTemplate('smaregi://api/{category}', {
        list: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        resources: [
                            { uri: 'smaregi://api/pos', description: 'POSシステムAPI' },
                            { uri: 'smaregi://api/auth', description: '認証API' },
                            { uri: 'smaregi://api/system', description: 'システム管理API' },
                        ]
                    })];
            });
        }); }
    }), function (uri, variables) { return __awaiter(_this, void 0, void 0, function () {
        var category, categoryStr, overview;
        return __generator(this, function (_a) {
            category = variables.category;
            try {
                categoryStr = Array.isArray(category) ? category[0] : category;
                overview = apiService.getApiCategoryOverview(categoryStr);
                if (!overview) {
                    return [2 /*return*/, {
                            isError: true,
                            error: {
                                message: "Unknown API category: ".concat(categoryStr)
                            }
                        }];
                }
                return [2 /*return*/, {
                        content: "# ".concat(categoryStr.toUpperCase(), " API\n\n").concat(overview)
                    }];
            }
            catch (error) {
                console.error("[ERROR] Error retrieving category resource: ".concat(error));
                return [2 /*return*/, {
                        isError: true,
                        error: {
                            message: "Error retrieving API category: ".concat(error)
                        }
                    }];
            }
            return [2 /*return*/];
        });
    }); });
}
/**
 * Register API path resource template
 * @param mcpServer - The MCP server instance
 * @param apiService - The API service
 */
function registerApiPathResource(mcpServer, apiService) {
    var _this = this;
    console.error('[INFO] Registering API path resource template');
    mcpServer.resource('api-path', new mcp_js_1.ResourceTemplate('smaregi://api/{category}/{path}', {
        list: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // 固定のリソースリストを返す
                // 実際のクエリ時にはgetメソッドで動的にリソースを返す
                return [2 /*return*/, {
                        resources: [
                            { uri: 'smaregi://api/pos/products', description: '商品API' },
                            { uri: 'smaregi://api/pos/transactions', description: '取引API' },
                            { uri: 'smaregi://api/pos/stocks', description: '在庫API' },
                            { uri: 'smaregi://api/pos/stores', description: '店舗API' },
                            { uri: 'smaregi://api/pos/customers', description: '顧客API' }
                        ]
                    }];
            });
        }); }
    }), function (uri, variables) { return __awaiter(_this, void 0, void 0, function () {
        var category, path, categoryStr, pathStr, pathDetails, content;
        return __generator(this, function (_a) {
            category = variables.category, path = variables.path;
            categoryStr = Array.isArray(category) ? category[0] : category;
            pathStr = Array.isArray(path) ? path[0] : path;
            try {
                pathDetails = apiService.getApiPathDetails(categoryStr, pathStr);
                if (!pathDetails) {
                    return [2 /*return*/, {
                            isError: true,
                            error: {
                                message: "Unknown API path: ".concat(categoryStr, "/").concat(pathStr)
                            }
                        }];
                }
                content = formatPathDetails(pathDetails);
                return [2 /*return*/, { content: content }];
            }
            catch (error) {
                console.error("[ERROR] Error retrieving path resource: ".concat(error));
                return [2 /*return*/, {
                        isError: true,
                        error: {
                            message: "Error retrieving API path ".concat(categoryStr, "/").concat(pathStr, ": ").concat(error)
                        }
                    }];
            }
            return [2 /*return*/];
        });
    }); });
}
/**
 * Register document resources
 * @param mcpServer - The MCP server instance
 */
function registerDocumentResources(mcpServer) {
    var _this = this;
    console.error('[INFO] Registering document resources');
    // Register README document
    mcpServer.resource('readme', 'smaregi://docs/readme', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    content: "# \u30B9\u30DE\u30EC\u30B8API MCP\n\n## \u6982\u8981\n\u3053\u306EMCP\u30B5\u30FC\u30D0\u30FC\u306F\u30B9\u30DE\u30EC\u30B8\u306EPOS API\u4ED5\u69D8\u3092Claude\u306B\u63D0\u4F9B\u3057\u3001\u4EE5\u4E0B\u306E\u6A5F\u80FD\u3092\u53EF\u80FD\u306B\u3057\u307E\u3059\uFF1A\n\n- \u30B9\u30DE\u30EC\u30B8API\u4ED5\u69D8\u306E\u691C\u7D22\u30FB\u53C2\u7167\n- \u30EA\u30BD\u30FC\u30B9\u30D9\u30FC\u30B9\u3067\u306EAPI\u30A2\u30AF\u30BB\u30B9\n- OAuth\u8A8D\u8A3C\u30D7\u30ED\u30BB\u30B9\u306E\u652F\u63F4\n- API\u30EA\u30AF\u30A8\u30B9\u30C8\u306E\u5B9F\u884C\n\n## \u8A8D\u8A3C\n\u30B9\u30DE\u30EC\u30B8API\u3092\u4F7F\u7528\u3059\u308B\u306B\u306F\u3001OAuth 2.0\u306B\u3088\u308B\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002\n\u4EE5\u4E0B\u306E\u30C4\u30FC\u30EB\u3067\u8A8D\u8A3C\u30D7\u30ED\u30BB\u30B9\u3092\u5B9F\u884C\u3067\u304D\u307E\u3059\uFF1A\n\n1. `getAuthorizationUrl` - \u8A8D\u8A3CURL\u3092\u751F\u6210\n2. `checkAuthStatus` - \u8A8D\u8A3C\u72B6\u614B\u3092\u78BA\u8A8D\n\n## API\u30A2\u30AF\u30BB\u30B9\n\u8A8D\u8A3C\u5F8C\u3001\u4EE5\u4E0B\u306E\u3088\u3046\u306BAPI\u30A2\u30AF\u30BB\u30B9\u304C\u53EF\u80FD\u3067\u3059\uFF1A\n\n- \u30EA\u30BD\u30FC\u30B9\u30D9\u30FC\u30B9: `smaregi://api/{category}/{path}`\n- \u30C4\u30FC\u30EB\u30D9\u30FC\u30B9: `executeApiRequest` \u307E\u305F\u306FAPI\u56FA\u6709\u30C4\u30FC\u30EB\n\n## \u30D7\u30ED\u30F3\u30D7\u30C8\n\u5B9A\u7FA9\u6E08\u307F\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u4F7F\u7528\u3057\u3066\u4E00\u822C\u7684\u306A\u30BF\u30B9\u30AF\u3092\u5B9F\u884C\u3067\u304D\u307E\u3059\uFF1A\n\n- `search-products` - \u5546\u54C1\u691C\u7D22\n- `analyze-sales` - \u58F2\u4E0A\u5206\u6790\n\n\u8A73\u7D30\u306F\u5404\u30EA\u30BD\u30FC\u30B9\u3084\u30C4\u30FC\u30EB\u306E\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u3092\u53C2\u7167\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
                }];
        });
    }); });
    // Register API overview document
    mcpServer.resource('api-overview', 'smaregi://docs/api-overview', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    content: "# \u30B9\u30DE\u30EC\u30B8API\u6982\u8981\n\n\u30B9\u30DE\u30EC\u30B8API\u306FREST API\u3067\u3042\u308A\u3001\u4EE5\u4E0B\u306E\u30AB\u30C6\u30B4\u30EA\u306B\u5206\u304B\u308C\u3066\u3044\u307E\u3059\uFF1A\n\n## POS\u30B7\u30B9\u30C6\u30E0API (pos)\n\u30B9\u30DE\u30EC\u30B8\u306EPOS\u30B7\u30B9\u30C6\u30E0\u306B\u95A2\u3059\u308BAPI\u3067\u3001\u4E3B\u306B\u4EE5\u4E0B\u306E\u6A5F\u80FD\u3092\u63D0\u4F9B\u3057\u307E\u3059\uFF1A\n\n- \u5546\u54C1\u7BA1\u7406 (products)\n- \u5728\u5EAB\u7BA1\u7406 (stocks)\n- \u53D6\u5F15\u7BA1\u7406 (transactions)\n- \u9867\u5BA2\u7BA1\u7406 (customers)\n- \u5E97\u8217\u7BA1\u7406 (stores)\n- \u30B9\u30BF\u30C3\u30D5\u7BA1\u7406 (staffs)\n\n## \u8A8D\u8A3CAPI (auth)\nOAuth 2.0\u306B\u57FA\u3065\u304F\u8A8D\u8A3C\u6A5F\u80FD\u3092\u63D0\u4F9B\u3057\u307E\u3059\uFF1A\n\n- \u8A8D\u8A3CURL\u306E\u751F\u6210\n- \u30A2\u30AF\u30BB\u30B9\u30C8\u30FC\u30AF\u30F3\u53D6\u5F97\n- \u30C8\u30FC\u30AF\u30F3\u66F4\u65B0\n- \u30C8\u30FC\u30AF\u30F3\u7121\u52B9\u5316\n\n## \u30B7\u30B9\u30C6\u30E0\u7BA1\u7406API (system)\n\u30B7\u30B9\u30C6\u30E0\u8A2D\u5B9A\u3084\u30E1\u30BF\u30C7\u30FC\u30BF\u95A2\u9023\u306EAPI\u3067\u3059\uFF1A\n\n- \u30A2\u30AB\u30A6\u30F3\u30C8\u60C5\u5831\n- \u5951\u7D04\u60C5\u5831\n- \u30DE\u30B9\u30BF\u30C7\u30FC\u30BF\n\n\u5404\u30AB\u30C6\u30B4\u30EA\u306E\u8A73\u7D30\u306F `smaregi://api/{category}` \u30EA\u30BD\u30FC\u30B9\u3067\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002"
                }];
        });
    }); });
    // Register Authentication document
    mcpServer.resource('auth-guide', 'smaregi://docs/authentication', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    content: "# \u30B9\u30DE\u30EC\u30B8API\u8A8D\u8A3C\u30AC\u30A4\u30C9\n\n\u30B9\u30DE\u30EC\u30B8API\u306FOAuth 2.0\u3092\u4F7F\u7528\u3057\u3066\u8A8D\u8A3C\u3092\u884C\u3044\u307E\u3059\u3002\u8A8D\u8A3C\u30D5\u30ED\u30FC\u306F\u4EE5\u4E0B\u306E\u901A\u308A\u3067\u3059\uFF1A\n\n## 1. \u8A8D\u8A3CURL\u306E\u53D6\u5F97\n`getAuthorizationUrl` \u30C4\u30FC\u30EB\u3092\u4F7F\u7528\u3057\u3066\u8A8D\u8A3CURL\u3092\u53D6\u5F97\u3057\u307E\u3059\uFF1A\n\n```\n{\n  \"scopes\": [\"pos.products:read\", \"pos.transactions:read\"]\n}\n```\n\n\u3053\u306EURL\u3092\u30D6\u30E9\u30A6\u30B6\u3067\u958B\u304D\u3001\u30B9\u30DE\u30EC\u30B8\u30A2\u30AB\u30A6\u30F3\u30C8\u3067\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\n\n## 2. \u8A8D\u8A3C\u72B6\u614B\u306E\u78BA\u8A8D\n`checkAuthStatus` \u30C4\u30FC\u30EB\u3092\u4F7F\u7528\u3057\u3066\u8A8D\u8A3C\u304C\u5B8C\u4E86\u3057\u305F\u304B\u78BA\u8A8D\u3057\u307E\u3059\uFF1A\n\n```\n{\n  \"sessionId\": \"\u524D\u306E\u30B9\u30C6\u30C3\u30D7\u3067\u53D6\u5F97\u3057\u305FsessionId\"\n}\n```\n\n## 3. API\u547C\u3073\u51FA\u3057\n\u8A8D\u8A3C\u304C\u5B8C\u4E86\u3057\u305F\u3089\u3001`executeApiRequest` \u30C4\u30FC\u30EB\u3092\u4F7F\u7528\u3057\u3066API\u3092\u547C\u3073\u51FA\u305B\u307E\u3059\uFF1A\n\n```\n{\n  \"sessionId\": \"\u8A8D\u8A3C\u6E08\u307F\u306EsessionId\",\n  \"endpoint\": \"/pos/products\",\n  \"method\": \"GET\",\n  \"query\": { \"limit\": 10 }\n}\n```\n\n## \u8A8D\u8A3C\u60C5\u5831\u306E\u4FDD\u5B58\n\u8A8D\u8A3C\u60C5\u5831\u306F\u30ED\u30FC\u30AB\u30EB\u306ESQLite\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306B\u6697\u53F7\u5316\u3057\u3066\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002\u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u6709\u52B9\u671F\u9650\u306F24\u6642\u9593\u3067\u3059\u3002"
                }];
        });
    }); });
}
/**
 * Format API path details into markdown
 * @param pathDetails - The path details object
 * @returns Formatted markdown content
 */
function formatPathDetails(pathDetails) {
    if (!pathDetails)
        return '';
    var content = "# ".concat(pathDetails.name, "\n\n");
    if (pathDetails.description) {
        content += "".concat(pathDetails.description, "\n\n");
    }
    content += "## \u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8\n`".concat(pathDetails.method, " ").concat(pathDetails.path, "`\n\n");
    if (pathDetails.parameters && pathDetails.parameters.length > 0) {
        content += '## パラメータ\n\n';
        // Group parameters by type
        var pathParams = pathDetails.parameters.filter(function (p) { return p.in === 'path'; });
        var queryParams = pathDetails.parameters.filter(function (p) { return p.in === 'query'; });
        var bodyParams = pathDetails.parameters.filter(function (p) { return p.in === 'body'; });
        if (pathParams.length > 0) {
            content += '### パスパラメータ\n\n';
            pathParams.forEach(function (param) {
                content += "- `".concat(param.name, "`: ").concat(param.description || '説明なし', " ").concat(param.required ? '(必須)' : '(任意)', "\n");
            });
            content += '\n';
        }
        if (queryParams.length > 0) {
            content += '### クエリパラメータ\n\n';
            queryParams.forEach(function (param) {
                content += "- `".concat(param.name, "`: ").concat(param.description || '説明なし', " ").concat(param.required ? '(必須)' : '(任意)', "\n");
            });
            content += '\n';
        }
        if (bodyParams.length > 0) {
            content += '### ボディパラメータ\n\n';
            bodyParams.forEach(function (param) {
                content += "- `".concat(param.name, "`: ").concat(param.description || '説明なし', " ").concat(param.required ? '(必須)' : '(任意)', "\n");
            });
            content += '\n';
        }
    }
    if (pathDetails.responses) {
        content += '## レスポンス\n\n';
        Object.entries(pathDetails.responses).forEach(function (_a) {
            var code = _a[0], response = _a[1];
            content += "### ".concat(code, " ").concat(response.description || '', "\n\n");
            if (response.example) {
                content += '```json\n';
                content += JSON.stringify(response.example, null, 2);
                content += '\n```\n\n';
            }
        });
    }
    return content;
}
