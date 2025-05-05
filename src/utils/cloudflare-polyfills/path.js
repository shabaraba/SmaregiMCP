/**
 * Cloudflare Workers用のpath互換レイヤー
 * 最小限のpath関数の実装
 */

// 基本的なパス結合
export function join(...paths) {
  return paths
    .map(path => path.replace(/^\/+/, '').replace(/\/+$/, ''))
    .filter(Boolean)
    .join('/');
}

// ディレクトリ名取得
export function dirname(path) {
  return path.split('/').slice(0, -1).join('/');
}

// ファイル名取得
export function basename(path, ext) {
  const base = path.split('/').pop();
  if (ext && base.endsWith(ext)) {
    return base.slice(0, -ext.length);
  }
  return base;
}

// 拡張子取得
export function extname(path) {
  const base = basename(path);
  const lastDotIndex = base.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : base.slice(lastDotIndex);
}

// 絶対パス判定
export function isAbsolute(path) {
  return path.startsWith('/');
}

// パス解決
export function resolve(...paths) {
  let resolvedPath = '';
  for (const path of paths) {
    if (isAbsolute(path)) {
      resolvedPath = path;
    } else {
      resolvedPath = join(resolvedPath, path);
    }
  }
  return '/' + resolvedPath;
}

// デフォルトエクスポート
export default {
  join,
  dirname,
  basename,
  extname,
  isAbsolute,
  resolve
};