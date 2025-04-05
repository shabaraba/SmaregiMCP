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
exports.ApiService = void 0;
/**
 * Handles API requests to Smaregi API
 */
var ApiService = /** @class */ (function () {
    function ApiService(authService) {
        this.authService = authService;
        this.baseUrl = 'https://api.smaregi.jp';
    }
    /**
     * Execute API request
     */
    ApiService.prototype.executeRequest = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, endpoint, method, data, query, path, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = params.sessionId, endpoint = params.endpoint, method = params.method, data = params.data, query = params.query, path = params.path;
                        return [4 /*yield*/, this.authService.getAccessToken(sessionId)];
                    case 1:
                        accessToken = _a.sent();
                        if (!accessToken) {
                            throw new Error('Not authenticated. Please complete authentication first.');
                        }
                        // For Phase 1, we're just returning mock responses
                        console.error("[INFO] Would execute API request: ".concat(method, " ").concat(endpoint));
                        // Return mock response based on endpoint pattern
                        if (endpoint.includes('products')) {
                            return [2 /*return*/, this.getMockProducts()];
                        }
                        else if (endpoint.includes('transactions')) {
                            return [2 /*return*/, this.getMockTransactions()];
                        }
                        else if (endpoint.includes('stores')) {
                            return [2 /*return*/, this.getMockStores()];
                        }
                        else {
                            return [2 /*return*/, {
                                    message: "Mock response for ".concat(method, " ").concat(endpoint),
                                    timestamp: new Date().toISOString()
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get API overview information
     */
    ApiService.prototype.getApiOverview = function (category) {
        if (category) {
            return this.getApiCategoryOverview(category);
        }
        return 'スマレジAPIは、POSシステムおよび周辺サービスのデータにアクセスするためのAPIです。主なカテゴリとして、POS API（商品管理、在庫管理、取引管理）と共通API（店舗管理、スタッフ管理）があります。';
    };
    /**
     * Get API category overview information
     */
    ApiService.prototype.getApiCategoryOverview = function (category) {
        switch (category.toLowerCase()) {
            case 'pos':
                return 'スマレジPOS APIは、POSシステムのデータにアクセスするためのAPIです。商品管理、在庫管理、取引管理などの機能があります。';
            case 'auth':
                return 'スマレジ認証APIは、OAuth2.0に基づく認証機能を提供します。認証URLの生成、アクセストークン取得、トークン更新、トークン無効化などの機能があります。';
            case 'system':
                return 'スマレジシステム管理APIは、アカウント情報、契約情報、マスタデータなどシステム設定やメタデータ関連の機能を提供します。';
            case 'common':
                return 'スマレジ共通APIは、複数のサービスで共通して使用される機能を提供します。店舗管理、スタッフ管理などの機能があります。';
            default:
                return "".concat(category, "\u30AB\u30C6\u30B4\u30EA\u306B\u95A2\u3059\u308B\u60C5\u5831\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
        }
    };
    /**
     * Get API paths for a category
     */
    ApiService.prototype.getApiPaths = function (category) {
        switch (category.toLowerCase()) {
            case 'pos':
                return [
                    { name: 'products', description: '商品情報API', method: 'GET', path: '/pos/products' },
                    { name: 'transactions', description: '取引API', method: 'GET', path: '/pos/transactions' },
                    { name: 'stocks', description: '在庫API', method: 'GET', path: '/pos/stocks' },
                    { name: 'stores', description: '店舗API', method: 'GET', path: '/pos/stores' },
                    { name: 'customers', description: '顧客API', method: 'GET', path: '/pos/customers' }
                ];
            case 'auth':
                return [
                    { name: 'token', description: 'トークン取得API', method: 'POST', path: '/auth/token' },
                    { name: 'revoke', description: 'トークン無効化API', method: 'POST', path: '/auth/revoke' }
                ];
            case 'system':
                return [
                    { name: 'account', description: 'アカウント情報API', method: 'GET', path: '/system/account' },
                    { name: 'contracts', description: '契約情報API', method: 'GET', path: '/system/contracts' },
                    { name: 'masters', description: 'マスタデータAPI', method: 'GET', path: '/system/masters' }
                ];
            default:
                return [];
        }
    };
    /**
     * Get API path details
     */
    ApiService.prototype.getApiPathDetails = function (category, path) {
        var paths = this.getApiPaths(category);
        var pathDetail = paths.find(function (p) { return p.name === path; });
        if (!pathDetail) {
            return null;
        }
        // Return basic details with mock parameters and responses
        var details = __assign(__assign({}, pathDetail), { parameters: [], responses: {
                '200': {
                    description: '成功レスポンス',
                    example: {}
                },
                '400': {
                    description: 'リクエストエラー',
                    example: { error: 'Bad Request', message: 'Invalid parameters' }
                },
                '401': {
                    description: '認証エラー',
                    example: { error: 'Unauthorized', message: 'Authentication required' }
                }
            } });
        // Add parameters based on the path type
        switch (path) {
            case 'products':
                details.parameters = [
                    { name: 'limit', in: 'query', description: '取得する件数', required: false },
                    { name: 'offset', in: 'query', description: '開始位置', required: false },
                    { name: 'product_id', in: 'query', description: '商品ID', required: false }
                ];
                details.responses['200'].example = this.getMockProducts();
                break;
            case 'transactions':
                details.parameters = [
                    { name: 'limit', in: 'query', description: '取得する件数', required: false },
                    { name: 'offset', in: 'query', description: '開始位置', required: false },
                    { name: 'start_date', in: 'query', description: '開始日時', required: false },
                    { name: 'end_date', in: 'query', description: '終了日時', required: false }
                ];
                details.responses['200'].example = this.getMockTransactions();
                break;
            case 'stores':
                details.parameters = [
                    { name: 'limit', in: 'query', description: '取得する件数', required: false },
                    { name: 'offset', in: 'query', description: '開始位置', required: false },
                    { name: 'store_id', in: 'query', description: '店舗ID', required: false }
                ];
                details.responses['200'].example = this.getMockStores();
                break;
        }
        return details;
    };
    ApiService.prototype.getMockProducts = function () {
        return {
            products: [
                {
                    product_id: '1001',
                    product_code: 'ITEM001',
                    product_name: 'Tシャツ 白 Mサイズ',
                    price: 2000,
                    tax_rate: 10,
                    stock: 50
                },
                {
                    product_id: '1002',
                    product_code: 'ITEM002',
                    product_name: 'Tシャツ 黒 Mサイズ',
                    price: 2000,
                    tax_rate: 10,
                    stock: 30
                },
                {
                    product_id: '1003',
                    product_code: 'ITEM003',
                    product_name: 'ジーンズ 青 Mサイズ',
                    price: 5000,
                    tax_rate: 10,
                    stock: 20
                }
            ],
            total: 3,
            limit: 100,
            offset: 0
        };
    };
    /**
     * Mock transactions data
     */
    ApiService.prototype.getMockTransactions = function () {
        return {
            transactions: [
                {
                    transaction_id: '20001',
                    store_id: '1',
                    transaction_date: '2025-04-05T09:30:00+09:00',
                    total_amount: 3300,
                    payment_method: 'cash'
                },
                {
                    transaction_id: '20002',
                    store_id: '1',
                    transaction_date: '2025-04-05T10:15:00+09:00',
                    total_amount: 5500,
                    payment_method: 'credit'
                },
                {
                    transaction_id: '20003',
                    store_id: '2',
                    transaction_date: '2025-04-05T11:00:00+09:00',
                    total_amount: 7700,
                    payment_method: 'credit'
                }
            ],
            total: 3,
            limit: 100,
            offset: 0
        };
    };
    /**
     * Mock stores data
     */
    ApiService.prototype.getMockStores = function () {
        return {
            stores: [
                {
                    store_id: '1',
                    store_code: 'STORE001',
                    store_name: '東京本店',
                    tel: '03-1234-5678',
                    address: '東京都渋谷区'
                },
                {
                    store_id: '2',
                    store_code: 'STORE002',
                    store_name: '大阪支店',
                    tel: '06-1234-5678',
                    address: '大阪府大阪市'
                }
            ],
            total: 2,
            limit: 100,
            offset: 0
        };
    };
    return ApiService;
}());
exports.ApiService = ApiService;
