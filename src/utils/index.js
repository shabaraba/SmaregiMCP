"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.createDialog = createDialog;
exports.isDirectory = isDirectory;
exports.loadOpenAPISpec = loadOpenAPISpec;
exports.findEndpoint = findEndpoint;
var fs = require("node:fs");
/**
 * デバッグログを出力する関数
 */
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var debug = process.env.DEBUG === 'true';
    if (debug) {
        var msg = "[DEBUG ".concat(new Date().toISOString(), "] ").concat(args.join(' '), "\n");
        process.stderr.write(msg);
    }
}
/**
 * ダイアログメッセージを作成する関数
 */
function createDialog(lines) {
    var maxLineWidth = Math.max.apply(Math, __spreadArray(__spreadArray([], lines.map(function (line) { return line.length; }), false), [60], false));
    var border = '-'.repeat(maxLineWidth);
    return __spreadArray(__spreadArray([border], lines, true), [border, ''], false).join('\n');
}
/**
 * 指定されたパスがディレクトリかどうかを確認する関数
 */
function isDirectory(dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    }
    catch (error) {
        return false;
    }
}
/**
 * 指定されたパスからOpenAPI仕様を読み込む関数
 */
function loadOpenAPISpec(filePath) {
    try {
        var content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    }
    catch (error) {
        throw new Error("Failed to load OpenAPI spec: ".concat(error instanceof Error ? error.message : String(error)));
    }
}
/**
 * OpenAPIのパスから特定のエンドポイント情報を抽出する関数
 */
function findEndpoint(spec, path, method) {
    try {
        if (!spec.paths || !spec.paths[path] || !spec.paths[path][method.toLowerCase()]) {
            throw new Error("Endpoint not found: ".concat(method, " ").concat(path));
        }
        return spec.paths[path][method.toLowerCase()];
    }
    catch (error) {
        throw new Error("Failed to find endpoint: ".concat(error instanceof Error ? error.message : String(error)));
    }
}
