/**
 * APIツールJSON生成スクリプト
 * スキーマJSONからAPIツールを生成し、ファイルに保存します
 */

import { SchemaConverter } from '../src/conversion/schema-converter.js';
import { ApiToolGenerator } from '../src/conversion/tool-generator.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as fs from 'fs';

// ディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 出力ディレクトリを作成
const outputDir = resolve(projectRoot, 'src', 'tools', 'generated');
if (\!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// メイン処理
async function main() {
  try {
    console.log('APIツールJSONを生成しています...');
    
    // スキーマ変換とAPIツール生成クラスのインスタンス化
    const schemaConverter = new SchemaConverter();
    const apiToolGenerator = new ApiToolGenerator(schemaConverter);
    
    // APIツールの生成
    const tools = apiToolGenerator.generateTools();
    console.log(`${tools.length}個のAPIツールを生成しました`);
    
    // ツールをJSONファイルに保存
    apiToolGenerator.saveToolsToFile(tools);
    console.log('APIツールJSONを保存しました');
  } catch (error) {
    console.error('APIツールJSON生成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
main();
