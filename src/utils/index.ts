import * as fs from 'node:fs';

/**
 * デバッグログを出力する関数
 */
export function log(...args: any[]): void {
  const debug = process.env.DEBUG === 'true';
  if (debug) {
    const msg = `[DEBUG ${new Date().toISOString()}] ${args.join(' ')}\n`;
    process.stderr.write(msg);
  }
}

/**
 * ダイアログメッセージを作成する関数
 */
export function createDialog(lines: string[]): string {
  const maxLineWidth = Math.max(...lines.map((line) => line.length), 60);
  const border = '-'.repeat(maxLineWidth);
  return [border, ...lines, border, ''].join('\n');
}

/**
 * 指定されたパスがディレクトリかどうかを確認する関数
 */
export function isDirectory(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * 指定されたパスからOpenAPI仕様を読み込む関数
 */
export function loadOpenAPISpec(filePath: string): object {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load OpenAPI spec: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * OpenAPIのパスから特定のエンドポイント情報を抽出する関数
 */
export function findEndpoint(spec: any, path: string, method: string): any {
  try {
    if (!spec.paths || !spec.paths[path] || !spec.paths[path][method.toLowerCase()]) {
      throw new Error(`Endpoint not found: ${method} ${path}`);
    }
    return spec.paths[path][method.toLowerCase()];
  } catch (error) {
    throw new Error(`Failed to find endpoint: ${error instanceof Error ? error.message : String(error)}`);
  }
}
