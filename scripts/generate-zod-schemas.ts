/**
 * TypeScript定義からZodスキーマを生成するスクリプト
 * openapi-typescriptで生成された.d.tsファイルをZodスキーマに変換し、
 * APIツール生成で使用しやすい形式にします
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const typeDefsDir = resolve(projectRoot, 'src', 'schema');
const outputDir = resolve(projectRoot, 'src', 'schema', 'zod');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * エラーハンドラー関数
 */
function handleError(message: string, error: any): never {
  console.error(`[ERROR] ${message}:`, error);
  if (error instanceof Error) {
    console.error(`[ERROR] ${error.stack}`);
  }
  process.exit(1);
}

const execAsync = promisify(exec);

/**
 * Zodスキーマを生成して保存する関数
 * CLIを使用してZodスキーマを生成します
 */
async function generateZodSchema(filename: string) {
  try {
    const inputFile = resolve(typeDefsDir, `${filename}.d.ts`);
    const outputFile = resolve(outputDir, `${filename}.zod.ts`);
    
    console.log(`[INFO] ${filename}のZodスキーマを生成しています...`);
    
    if (!fs.existsSync(inputFile)) {
      console.error(`[ERROR] 入力ファイルが見つかりません: ${inputFile}`);
      return null;
    }
    
    await execAsync(`npx ts-to-zod ${inputFile} ${outputFile}`);
    
    console.log(`[SUCCESS] ${filename}のZodスキーマを生成しました: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error(`[ERROR] ${filename}のZodスキーマ生成中にエラーが発生しました:`, error);
    throw error;
  }
}



async function main() {
  try {
    console.log('[INFO] TypeScript定義からZodスキーマを生成します...');
    
    await generateZodSchema('pos');
    
    await generateZodSchema('common');
    
    const posZodPath = resolve(outputDir, 'pos.zod.ts');
    const commonZodPath = resolve(outputDir, 'common.zod.ts');
    
    if (fs.existsSync(posZodPath) && fs.existsSync(commonZodPath)) {
      console.log('[SUCCESS] すべてのZodスキーマの生成が完了しました');
    } else {
      console.warn('[WARN] 一部のZodスキーマが生成されていません。生成状況を確認してください。');
    }
  } catch (error) {
    handleError('Zodスキーマ生成中に予期しないエラーが発生しました', error);
  }
}

main().catch(error => {
  handleError('スクリプト実行中に予期しないエラーが発生しました', error);
});
