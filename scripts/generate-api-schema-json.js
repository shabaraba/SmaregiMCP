"use strict";
/**
 * TypeScript定義からJSONスキーマを生成するスクリプト
 * openapi-typescriptで生成された.d.tsファイルをJSONに変換し、
 * APIツール生成で使用しやすい形式にします
 */
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
var schema_converter_js_1 = require("../src/conversion/schema-converter.js");
var url_1 = require("url");
var path_1 = require("path");
var fs = require("fs");
// ディレクトリパスを取得
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
var projectRoot = (0, path_1.resolve)(__dirname, '..');
// 出力ディレクトリを作成
var outputDir = (0, path_1.resolve)(projectRoot, 'src', 'schema', 'converted');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
/**
 * エラーハンドラー関数
 */
function handleError(message, error) {
    console.error("[ERROR] ".concat(message, ":"), error);
    if (error instanceof Error) {
        console.error("[ERROR] ".concat(error.stack));
    }
    process.exit(1);
}
// メイン処理
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var schemaConverter, posSchema, commonSchema, posJsonPath, commonJsonPath;
        return __generator(this, function (_a) {
            try {
                console.log('[INFO] OpenAPI TypeScript定義からJSONスキーマを生成します...');
                schemaConverter = new schema_converter_js_1.SchemaConverter();
                // POSスキーマの変換
                try {
                    console.log('[INFO] POS APIスキーマを変換しています...');
                    posSchema = schemaConverter.convertTypeScriptToJson('pos');
                    if (posSchema) {
                        schemaConverter.saveSchemaAsJson('pos', posSchema);
                        console.log('[SUCCESS] POS APIスキーマをJSONに変換して保存しました');
                    }
                    else {
                        console.warn('[WARN] POSスキーマの変換結果がnullでした');
                    }
                }
                catch (posError) {
                    console.error('[ERROR] POSスキーマの変換中にエラーが発生しました:', posError);
                }
                // 共通スキーマの変換
                try {
                    console.log('[INFO] 共通APIスキーマを変換しています...');
                    commonSchema = schemaConverter.convertTypeScriptToJson('common');
                    if (commonSchema) {
                        schemaConverter.saveSchemaAsJson('common', commonSchema);
                        console.log('[SUCCESS] 共通APIスキーマをJSONに変換して保存しました');
                    }
                    else {
                        console.warn('[WARN] 共通スキーマの変換結果がnullでした');
                    }
                }
                catch (commonError) {
                    console.error('[ERROR] 共通スキーマの変換中にエラーが発生しました:', commonError);
                }
                posJsonPath = (0, path_1.resolve)(outputDir, 'pos.json');
                commonJsonPath = (0, path_1.resolve)(outputDir, 'common.json');
                if (fs.existsSync(posJsonPath) && fs.existsSync(commonJsonPath)) {
                    console.log('[SUCCESS] すべてのスキーマの変換が完了しました');
                }
                else {
                    console.warn('[WARN] 一部のスキーマが生成されていません。生成状況を確認してください。');
                }
            }
            catch (error) {
                handleError('スキーマ変換中に予期しないエラーが発生しました', error);
            }
            return [2 /*return*/];
        });
    });
}
// スクリプト実行
main().catch(function (error) {
    handleError('スクリプト実行中に予期しないエラーが発生しました', error);
});
