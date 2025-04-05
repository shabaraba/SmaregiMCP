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
if (\!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// メイン処理
async function main() {
  try {
    console.log('OpenAPI TypeScript定義からJSONスキーマを生成します...');
    
    const schemaConverter = new SchemaConverter();
    
    // POSスキーマの変換
    console.log('POS APIスキーマを変換しています...');
    const posSchema = schemaConverter.convertTypeScriptToJson('pos');
    if (posSchema) {
      schemaConverter.saveSchemaAsJson('pos', posSchema);
      console.log('POS APIスキーマをJSONに変換して保存しました');
    }
    
    // 共通スキーマの変換
    console.log('共通APIスキーマを変換しています...');
    const commonSchema = schemaConverter.convertTypeScriptToJson('common');
    if (commonSchema) {
      schemaConverter.saveSchemaAsJson('common', commonSchema);
      console.log('共通APIスキーマをJSONに変換して保存しました');
    }
    
    console.log('すべてのスキーマの変換が完了しました');
  } catch (error) {
    console.error('スキーマ変換中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
main();
