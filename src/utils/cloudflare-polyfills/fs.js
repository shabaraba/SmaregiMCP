/**
 * Cloudflare Workers用のfs互換レイヤー
 * Cloudflare KVをファイルシステムに見立てた最小限の実装
 */

// ダミーの実装
export function readFileSync(filePath, options) {
  console.error(`[WARN] readFileSync called in Cloudflare environment: ${filePath}`);
  return '';
}

export function existsSync(filePath) {
  console.error(`[WARN] existsSync called in Cloudflare environment: ${filePath}`);
  return false;
}

export function writeFileSync(filePath, data, options) {
  console.error(`[WARN] writeFileSync called in Cloudflare environment: ${filePath}`);
  return;
}

export function mkdirSync(dirPath, options) {
  console.error(`[WARN] mkdirSync called in Cloudflare environment: ${dirPath}`);
  return;
}

// その他必要なメソッドを追加

// デフォルトエクスポート
export default {
  readFileSync,
  existsSync,
  writeFileSync,
  mkdirSync
};