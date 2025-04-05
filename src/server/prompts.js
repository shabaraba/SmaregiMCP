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
exports.registerPrompts = registerPrompts;
var zod_1 = require("zod");
/**
 * Register all prompts to the MCP server
 * @param mcpServer - The MCP server instance
 */
function registerPrompts(mcpServer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.error('[INFO] Registering prompts...');
            // Register product search prompt
            registerProductSearchPrompt(mcpServer);
            // Register sales analysis prompt
            registerSalesAnalysisPrompt(mcpServer);
            // Register inventory management prompt
            registerInventoryManagementPrompt(mcpServer);
            // Register customer analysis prompt
            registerCustomerAnalysisPrompt(mcpServer);
            console.error('[INFO] Prompts registered successfully');
            return [2 /*return*/];
        });
    });
}
/**
 * Register product search prompt
 * @param mcpServer - The MCP server instance
 */
function registerProductSearchPrompt(mcpServer) {
    var _this = this;
    console.error('[INFO] Registering product search prompt');
    mcpServer.prompt('search-products', '商品を検索', {
        keyword: zod_1.z.string().optional().describe('検索キーワード'),
        category: zod_1.z.string().optional().describe('商品カテゴリ'),
        inStock: zod_1.z.string().optional().describe('在庫がある商品のみを検索するか (「true」または「false」)'),
        limit: zod_1.z.string().optional().describe('取得する商品の最大数'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var boolInStock, numLimit;
        var keyword = _b.keyword, category = _b.category, inStock = _b.inStock, limit = _b.limit;
        return __generator(this, function (_c) {
            boolInStock = inStock === 'true' ? true : inStock === 'false' ? false : undefined;
            numLimit = limit ? parseInt(limit, 10) : undefined;
            return [2 /*return*/, {
                    description: '商品を検索するためのプロンプト',
                    isUserPromptTemplate: true,
                    sampleUserPrompts: [
                        '商品を検索して',
                        '在庫のある商品を教えて',
                        'Tシャツを探して',
                        '食品カテゴリの商品を検索'
                    ],
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: formatProductSearchPrompt({
                                    keyword: keyword,
                                    category: category,
                                    inStock: boolInStock,
                                    limit: numLimit
                                })
                            }
                        }
                    ]
                }];
        });
    }); });
}
/**
 * Format product search prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatProductSearchPrompt(params) {
    var keyword = params.keyword, category = params.category, inStock = params.inStock, limit = params.limit;
    var prompt = 'スマレジAPIを使用して商品を検索してください。\n\n';
    if (keyword) {
        prompt += "\u691C\u7D22\u30AD\u30FC\u30EF\u30FC\u30C9: ".concat(keyword, "\n");
    }
    if (category) {
        prompt += "\u30AB\u30C6\u30B4\u30EA: ".concat(category, "\n");
    }
    if (inStock !== undefined) {
        prompt += "\u5728\u5EAB\u3042\u308A: ".concat(inStock ? 'はい' : 'いいえ', "\n");
    }
    if (limit) {
        prompt += "\u6700\u5927\u8868\u793A\u4EF6\u6570: ".concat(limit, "\n");
    }
    prompt += '\n以下のツールを使用することで、効果的に検索できます：\n\n';
    prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
    prompt += '2. ユーザーに認証URLでの認証を依頼\n';
    prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
    prompt += '4. `executeApiRequest` ツールを使用して商品APIを呼び出し\n';
    if (inStock) {
        prompt += '5. 在庫APIを呼び出して在庫状況をチェック\n';
    }
    prompt += '\n検索結果は表形式で見やすくまとめてください。各商品の名前、価格、カテゴリ、在庫状況などの重要な情報を含めてください。';
    return prompt;
}
/**
 * Register sales analysis prompt
 * @param mcpServer - The MCP server instance
 */
function registerSalesAnalysisPrompt(mcpServer) {
    var _this = this;
    console.error('[INFO] Registering sales analysis prompt');
    mcpServer.prompt('analyze-sales', '売上データを分析', {
        period: zod_1.z.string().optional().describe('分析期間（例: 今週、先月、過去3ヶ月）'),
        storeId: zod_1.z.string().optional().describe('店舗ID'),
        groupBy: zod_1.z.string().optional().describe('グループ化の基準（例: 日別、週別、月別）'),
        includeChart: zod_1.z.string().optional().describe('グラフを含めるか (「true」または「false」)'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var boolIncludeChart;
        var period = _b.period, storeId = _b.storeId, groupBy = _b.groupBy, includeChart = _b.includeChart;
        return __generator(this, function (_c) {
            boolIncludeChart = includeChart === 'true' ? true : includeChart === 'false' ? false : undefined;
            return [2 /*return*/, {
                    description: '売上データを分析するためのプロンプト',
                    isUserPromptTemplate: true,
                    sampleUserPrompts: [
                        '売上分析をして',
                        '先月の売上を見せて',
                        '各店舗の売上を比較して',
                        '商品カテゴリ別の売上を分析'
                    ],
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: formatSalesAnalysisPrompt({
                                    period: period,
                                    storeId: storeId,
                                    groupBy: groupBy,
                                    includeChart: boolIncludeChart
                                })
                            }
                        }
                    ]
                }];
        });
    }); });
}
/**
 * Format sales analysis prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatSalesAnalysisPrompt(params) {
    var period = params.period, storeId = params.storeId, groupBy = params.groupBy, includeChart = params.includeChart;
    var prompt = 'スマレジAPIを使用して売上データを分析してください。\n\n';
    if (period) {
        prompt += "\u671F\u9593: ".concat(period, "\n");
    }
    if (storeId) {
        prompt += "\u5E97\u8217ID: ".concat(storeId, "\n");
    }
    if (groupBy) {
        prompt += "\u30B0\u30EB\u30FC\u30D7\u5316: ".concat(groupBy, "\n");
    }
    prompt += '\n以下のツールを使用することで、効果的に分析できます：\n\n';
    prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
    prompt += '2. ユーザーに認証URLでの認証を依頼\n';
    prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
    prompt += '4. `executeApiRequest` ツールを使用して取引APIを呼び出し\n';
    if (storeId) {
        prompt += '5. 店舗情報APIを呼び出して店舗詳細を取得\n';
    }
    prompt += '\n分析結果は以下の内容を含めてください：\n';
    prompt += '- 総売上額\n';
    prompt += '- 平均取引額\n';
    prompt += '- 取引数\n';
    if (groupBy) {
        prompt += "- ".concat(groupBy, "\u3054\u3068\u306E\u58F2\u4E0A\u63A8\u79FB\n");
    }
    if (includeChart) {
        prompt += '- 売上推移グラフ\n';
    }
    return prompt;
}
/**
 * Register inventory management prompt
 * @param mcpServer - The MCP server instance
 */
function registerInventoryManagementPrompt(mcpServer) {
    var _this = this;
    console.error('[INFO] Registering inventory management prompt');
    mcpServer.prompt('manage-inventory', '在庫管理', {
        storeId: zod_1.z.string().optional().describe('店舗ID'),
        lowStock: zod_1.z.string().optional().describe('在庫不足の商品のみを表示するか (「true」または「false」)'),
        threshold: zod_1.z.string().optional().describe('在庫不足と判断する閾値'),
        category: zod_1.z.string().optional().describe('商品カテゴリ'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var boolLowStock, numThreshold;
        var storeId = _b.storeId, lowStock = _b.lowStock, threshold = _b.threshold, category = _b.category;
        return __generator(this, function (_c) {
            boolLowStock = lowStock === 'true' ? true : lowStock === 'false' ? false : undefined;
            numThreshold = threshold ? parseInt(threshold, 10) : undefined;
            return [2 /*return*/, {
                    description: '在庫管理を行うためのプロンプト',
                    isUserPromptTemplate: true,
                    sampleUserPrompts: [
                        '在庫状況を確認して',
                        '在庫不足の商品を表示して',
                        '電化製品の在庫を確認',
                        '全店舗の在庫状況を分析'
                    ],
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: formatInventoryManagementPrompt({
                                    storeId: storeId,
                                    lowStock: boolLowStock,
                                    threshold: numThreshold,
                                    category: category
                                })
                            }
                        }
                    ]
                }];
        });
    }); });
}
/**
 * Format inventory management prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatInventoryManagementPrompt(params) {
    var storeId = params.storeId, lowStock = params.lowStock, threshold = params.threshold, category = params.category;
    var prompt = 'スマレジAPIを使用して在庫管理を行ってください。\n\n';
    if (storeId) {
        prompt += "\u5E97\u8217ID: ".concat(storeId, "\n");
    }
    if (lowStock !== undefined) {
        prompt += "\u5728\u5EAB\u4E0D\u8DB3\u5546\u54C1\u306E\u307F: ".concat(lowStock ? 'はい' : 'いいえ', "\n");
    }
    if (threshold !== undefined) {
        prompt += "\u5728\u5EAB\u4E0D\u8DB3\u95BE\u5024: ".concat(threshold, "\n");
    }
    if (category) {
        prompt += "\u30AB\u30C6\u30B4\u30EA: ".concat(category, "\n");
    }
    prompt += '\n以下のツールを使用することで、効果的に在庫管理できます：\n\n';
    prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
    prompt += '2. ユーザーに認証URLでの認証を依頼\n';
    prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
    prompt += '4. `executeApiRequest` ツールを使用して在庫APIと商品APIを呼び出し\n';
    if (storeId) {
        prompt += '5. 店舗情報APIを呼び出して店舗詳細を取得\n';
    }
    prompt += '\n在庫レポートは以下の内容を含めてください：\n';
    prompt += '- 商品名\n';
    prompt += '- 現在の在庫数\n';
    prompt += '- 在庫ステータス（十分/注意/不足）\n';
    if (lowStock) {
        prompt += '- 推奨発注数\n';
    }
    return prompt;
}
/**
 * Register customer analysis prompt
 * @param mcpServer - The MCP server instance
 */
function registerCustomerAnalysisPrompt(mcpServer) {
    var _this = this;
    console.error('[INFO] Registering customer analysis prompt');
    mcpServer.prompt('analyze-customers', '顧客データを分析', {
        period: zod_1.z.string().optional().describe('分析期間（例: 今年、過去6ヶ月）'),
        segment: zod_1.z.string().optional().describe('顧客セグメント（例: 新規、リピーター、VIP）'),
        includeChart: zod_1.z.string().optional().describe('グラフを含めるか (「true」または「false」)'),
    }, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var boolIncludeChart;
        var period = _b.period, segment = _b.segment, includeChart = _b.includeChart;
        return __generator(this, function (_c) {
            boolIncludeChart = includeChart === 'true' ? true : includeChart === 'false' ? false : undefined;
            return [2 /*return*/, {
                    description: '顧客データを分析するためのプロンプト',
                    isUserPromptTemplate: true,
                    sampleUserPrompts: [
                        '顧客分析をして',
                        'リピーター顧客を分析して',
                        '新規顧客の獲得状況を確認',
                        '顧客の購買傾向を分析'
                    ],
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: formatCustomerAnalysisPrompt({
                                    period: period,
                                    segment: segment,
                                    includeChart: boolIncludeChart
                                })
                            }
                        }
                    ]
                }];
        });
    }); });
}
/**
 * Format customer analysis prompt
 * @param params - Prompt parameters
 * @returns Formatted prompt text
 */
function formatCustomerAnalysisPrompt(params) {
    var period = params.period, segment = params.segment, includeChart = params.includeChart;
    var prompt = 'スマレジAPIを使用して顧客データを分析してください。\n\n';
    if (period) {
        prompt += "\u671F\u9593: ".concat(period, "\n");
    }
    if (segment) {
        prompt += "\u9867\u5BA2\u30BB\u30B0\u30E1\u30F3\u30C8: ".concat(segment, "\n");
    }
    prompt += '\n以下のツールを使用することで、効果的に顧客分析できます：\n\n';
    prompt += '1. `getAuthorizationUrl` ツールを使用して認証URLを取得\n';
    prompt += '2. ユーザーに認証URLでの認証を依頼\n';
    prompt += '3. `checkAuthStatus` ツールで認証状態を確認\n';
    prompt += '4. `executeApiRequest` ツールを使用して顧客APIと取引APIを呼び出し\n';
    prompt += '\n顧客分析レポートは以下の内容を含めてください：\n';
    prompt += '- 顧客数\n';
    prompt += '- 顧客セグメント分布\n';
    prompt += '- 平均客単価\n';
    prompt += '- 購買頻度\n';
    if (segment) {
        prompt += "- ".concat(segment, "\u30BB\u30B0\u30E1\u30F3\u30C8\u306E\u7279\u5FB4\u5206\u6790\n");
    }
    if (includeChart) {
        prompt += '- 顧客分布グラフ\n';
        prompt += '- 購買頻度グラフ\n';
    }
    return prompt;
}
