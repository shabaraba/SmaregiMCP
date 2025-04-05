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
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var path = require("path");
var fs = require("node:fs");
var os = require("node:os");
var server_js_1 = require("./server/server.js");
/**
 * ロックファイルパス (重複起動防止用)
 */
var LOCK_FILE_PATH = path.join(os.tmpdir(), 'smaregi-mcp-server.lock');
/**
 * プロセスが実行中かどうかを確認
 */
function isProcessRunning(pid) {
    try {
        process.kill(pid, 0);
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * サーバーが既に実行中かどうか確認
 */
function checkIfServerAlreadyRunning() {
    try {
        if (fs.existsSync(LOCK_FILE_PATH)) {
            var pidStr = fs.readFileSync(LOCK_FILE_PATH, 'utf8');
            var pid = parseInt(pidStr, 10);
            if (pid && isProcessRunning(pid)) {
                console.error("[INFO] \u30B5\u30FC\u30D0\u30FC\u306F\u3059\u3067\u306BPID ".concat(pid, "\u3067\u5B9F\u884C\u4E2D\u3067\u3059"));
                return true;
            }
            else {
                fs.unlinkSync(LOCK_FILE_PATH);
            }
        }
        fs.writeFileSync(LOCK_FILE_PATH, process.pid.toString(), 'utf8');
        process.on('exit', function () {
            if (fs.existsSync(LOCK_FILE_PATH)) {
                try {
                    fs.unlinkSync(LOCK_FILE_PATH);
                }
                catch (err) {
                    // 終了時のエラーは無視
                }
            }
        });
        process.on('uncaughtException', function (err) {
            console.error("[ERROR] \u672A\u51E6\u7406\u306E\u4F8B\u5916: ".concat(err));
            if (fs.existsSync(LOCK_FILE_PATH)) {
                try {
                    fs.unlinkSync(LOCK_FILE_PATH);
                }
                catch (err) {
                    // 終了時のエラーは無視
                }
            }
            process.exit(1);
        });
        return false;
    }
    catch (err) {
        console.error("[ERROR] \u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u64CD\u4F5C\u4E2D\u306E\u30A8\u30E9\u30FC: ".concat(err));
        return false;
    }
}
/**
 * Claude Desktopの設定にMCPを追加
 */
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var claudeConfigPath, nodePath, projectRoot, distPath, config, configDirExists, existingConfig, newConfig, fullConfig;
        return __generator(this, function (_a) {
            console.log('👋 Welcome to Smaregi MCP Server!');
            console.log('💁‍♀️ This initialization process will install the Smaregi MCP Server into Claude Desktop');
            console.log('   enabling Claude to interact with the Smaregi API.');
            console.log('🧡 Let\'s get started.');
            console.log('Step 1: Checking for Claude Desktop...');
            claudeConfigPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
            nodePath = process.execPath;
            console.log("Found Node.js at: ".concat(nodePath));
            projectRoot = process.cwd();
            distPath = path.join(projectRoot, 'dist', 'main.js');
            config = {
                command: nodePath,
                args: [distPath, 'run'],
            };
            console.log("Looking for existing config in: ".concat(path.dirname(claudeConfigPath)));
            configDirExists = fs.existsSync(path.dirname(claudeConfigPath));
            if (configDirExists) {
                existingConfig = fs.existsSync(claudeConfigPath)
                    ? JSON.parse(fs.readFileSync(claudeConfigPath, 'utf8'))
                    : { mcpServers: {} };
                if ('smaregi' in ((existingConfig === null || existingConfig === void 0 ? void 0 : existingConfig.mcpServers) || {})) {
                    console.log("Note: Replacing existing Smaregi MCP config:\n".concat(JSON.stringify(existingConfig.mcpServers.smaregi)));
                }
                newConfig = __assign(__assign({}, existingConfig), { mcpServers: __assign(__assign({}, existingConfig.mcpServers), { smaregi: config }) });
                fs.writeFileSync(claudeConfigPath, JSON.stringify(newConfig, null, 2));
                console.log('Smaregi MCP Server configured & added to Claude Desktop!');
                console.log("Wrote config to ".concat(claudeConfigPath));
                console.log('Important: This command only configured the MCP server. The server will be');
                console.log('          automatically started by Claude Desktop when needed.');
                console.log('          You do NOT need to run "npm run mcp:run" manually.');
                console.log('Try asking Claude about the Smaregi API to get started!');
            }
            else {
                fullConfig = { mcpServers: { smaregi: config } };
                console.log("Couldn't detect Claude Desktop config at ".concat(claudeConfigPath, ".\nTo add the Smaregi MCP server manually, add the following config to your MCP config file:\n\n").concat(JSON.stringify(fullConfig, null, 2)));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * MCPサーバーを実行
 */
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var setupSignalHandlers, _a, server, mcpServer, transport, error_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.error('[INFO] Claude Desktopからの実行モードで起動します');
                    if (checkIfServerAlreadyRunning()) {
                        console.error('[INFO] 別のSmaregiMCPサーバープロセスが既に実行中です。このインスタンスは終了します。');
                        process.exit(0);
                        throw new Error('プロセスは終了しました');
                    }
                    console.error('[INFO] MCPサーバーを初期化します');
                    setupSignalHandlers = function (server) {
                        console.error('[INFO] 終了シグナルハンドラーを設定しています');
                        var cleanup = function (signal) { return __awaiter(_this, void 0, void 0, function () {
                            var error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.error("[INFO] \u30B7\u30B0\u30CA\u30EB".concat(signal, "\u3092\u53D7\u4FE1\u3057\u307E\u3057\u305F\u3002\u9069\u5207\u306B\u7D42\u4E86\u3057\u307E\u3059..."));
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        // MCPサーバーを終了
                                        return [4 /*yield*/, server.close()];
                                    case 2:
                                        // MCPサーバーを終了
                                        _a.sent();
                                        // ロックファイルを削除
                                        if (fs.existsSync(LOCK_FILE_PATH)) {
                                            fs.unlinkSync(LOCK_FILE_PATH);
                                        }
                                        console.error('[INFO] クリーンアップが完了しました。アプリケーションを終了します。');
                                        process.exit(0);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_2 = _a.sent();
                                        console.error("[ERROR] \u7D42\u4E86\u51E6\u7406\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F: ".concat(error_2));
                                        if (fs.existsSync(LOCK_FILE_PATH)) {
                                            try {
                                                fs.unlinkSync(LOCK_FILE_PATH);
                                            }
                                            catch (_) {
                                                // エラーは無視
                                            }
                                        }
                                        process.exit(1);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        // シグナルハンドラーを登録
                        process.on('SIGINT', function () { return cleanup('SIGINT'); });
                        process.on('SIGTERM', function () { return cleanup('SIGTERM'); });
                        process.on('SIGHUP', function () { return cleanup('SIGHUP'); });
                        // 親プロセスの終了検知
                        process.stdin.on('end', function () {
                            console.error('[INFO] 標準入力が閉じられました。親プロセスが終了した可能性があります。');
                            cleanup('STDIN_CLOSE');
                        });
                        console.error('[INFO] 終了シグナルハンドラーの設定が完了しました');
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, server_js_1.createServer)()];
                case 2:
                    _a = _b.sent(), server = _a.server, mcpServer = _a.mcpServer;
                    setupSignalHandlers(server);
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, mcpServer.connect(transport)];
                case 3:
                    _b.sent();
                    console.error('[INFO] MCPサーバーが起動しました');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("[ERROR] \u30B5\u30FC\u30D0\u30FC\u8D77\u52D5\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F: ".concat(error_1));
                    if (fs.existsSync(LOCK_FILE_PATH)) {
                        try {
                            fs.unlinkSync(LOCK_FILE_PATH);
                        }
                        catch (_) {
                            // エラーは無視
                        }
                    }
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// コマンドライン引数のパース
var _a = process.argv.slice(2), cmd = _a[0], args = _a.slice(1);
// コマンドに応じて処理を実行
switch (cmd) {
    case 'init':
        init()
            .then(function () {
            console.log('Initialization complete!');
            process.exit(0);
        })
            .catch(function (error) {
            console.error('Error during initialization:', error);
            process.exit(1);
        });
        break;
    case 'run':
        run()
            .catch(function (error) {
            console.error("Unhandled error: ".concat(error));
            process.exit(1);
        });
        break;
    default:
        // ヘルプ表示
        console.log('Usage: node dist/main.js <command>');
        console.log('Available commands:');
        console.log('  init - Configure the MCP server in Claude Desktop');
        console.log('  run  - Run the MCP server');
        process.exit(0);
}
