/**
 * TypeScript定義からJSONスキーマを生成するスクリプト
 * openapi-typescriptで生成された.d.tsファイルをJSONに変換し、
 * APIツール生成で使用しやすい形式にします
 */

import { SchemaConverter } from '../src/conversion/schema-converter.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as fs from 'fs';

// ディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 出力ディレクトリを作成
const outputDir = resolve(projectRoot, 'src', 'schema', 'converted');
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

// メイン処理
async function main() {
  try {
    console.log('[INFO] OpenAPI TypeScript定義からJSONスキーマを生成します...');
    
    const schemaConverter = new SchemaConverter();
    
    // POSスキーマの変換
    try {
      console.log('[INFO] POS APIスキーマを変換しています...');
      const posSchema = schemaConverter.convertTypeScriptToJson('pos');
      if (posSchema) {
        schemaConverter.saveSchemaAsJson('pos', posSchema);
        console.log('[SUCCESS] POS APIスキーマをJSONに変換して保存しました');
      } else {
        console.warn('[WARN] POSスキーマの変換結果がnullでした');
      }
    } catch (posError) {
      console.error('[ERROR] POSスキーマの変換中にエラーが発生しました:', posError);
    }
    
    // 共通スキーマの変換
    try {
      console.log('[INFO] 共通APIスキーマを変換しています...');
      const commonSchema = schemaConverter.convertTypeScriptToJson('common');
      if (commonSchema) {
        schemaConverter.saveSchemaAsJson('common', commonSchema);
        console.log('[SUCCESS] 共通APIスキーマをJSONに変換して保存しました');
      } else {
        console.warn('[WARN] 共通スキーマの変換結果がnullでした');
      }
    } catch (commonError) {
      console.error('[ERROR] 共通スキーマの変換中にエラーが発生しました:', commonError);
    }
    
    // 変換結果の検証
    const posJsonPath = resolve(outputDir, 'pos.json');
    const commonJsonPath = resolve(outputDir, 'common.json');
    
    if (fs.existsSync(posJsonPath) && fs.existsSync(commonJsonPath)) {
      console.log('[SUCCESS] すべてのスキーマの変換が完了しました');
    } else {
      console.warn('[WARN] 一部のスキーマが生成されていません。生成状況を確認してください。');
    }
  } catch (error) {
    handleError('スキーマ変換中に予期しないエラーが発生しました', error);
  }
}

// スクリプト実行
main().catch(error => {
  handleError('スクリプト実行中に予期しないエラーが発生しました', error);
});
