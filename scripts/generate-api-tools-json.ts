/**
 * APIツールJSON生成スクリプト
 * スキーマJSONからAPIツールを生成し、ファイルに保存します
 * MCP TypeScript SDKに準拠した形式で出力します
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
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * エラーハンドラー関数
 */
function handleError(message, error) {
  console.error(`[ERROR] ${message}:`, error);
  if (error instanceof Error) {
    console.error(`[ERROR] ${error.stack}`);
  }
  process.exit(1);
}

/**
 * APIツールの生成と検証
 */
async function generateAndValidateTools() {
  try {
    console.log('[INFO] APIツールJSONを生成しています...');
    
    // スキーマ変換とAPIツール生成クラスのインスタンス化
    const schemaConverter = new SchemaConverter();
    const apiToolGenerator = new ApiToolGenerator(schemaConverter);
    
    // 入力ファイルの確認
    const posJsonPath = resolve(projectRoot, 'src', 'schema', 'converted', 'pos.json');
    const commonJsonPath = resolve(projectRoot, 'src', 'schema', 'converted', 'common.json');
    
    if (!fs.existsSync(posJsonPath) || !fs.existsSync(commonJsonPath)) {
      console.warn('[WARN] スキーマJSONファイルが一部または全部見つかりません。まず `npm run convert` を実行してください。');
    }
    
    // APIツールの生成
    const tools = apiToolGenerator.generateTools();
    
    if (tools.length === 0) {
      console.warn('[WARN] APIツールが生成されませんでした。スキーマファイルを確認してください。');
      return;
    }
    
    console.log(`[INFO] ${tools.length}個のAPIツールを生成しました`);
    
    // カテゴリ別のAPIツール数を表示
    const categoryCounts = tools.reduce((acc, tool) => {
      const category = tool.category || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('[INFO] カテゴリ別APIツール数:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count}`);
    });
    
    // ツールをJSONファイルに保存
    apiToolGenerator.saveToolsToFile(tools);
    console.log('[SUCCESS] APIツールJSONを保存しました');
    
    // 出力ファイルの確認
    const outputFilePath = resolve(outputDir, 'api-tools.json');
    if (fs.existsSync(outputFilePath)) {
      const stats = fs.statSync(outputFilePath);
      const fileSizeKb = Math.round(stats.size / 1024);
      console.log(`[INFO] 出力ファイルサイズ: ${fileSizeKb}KB`);
    }
  } catch (error) {
    handleError('APIツールJSON生成中にエラーが発生しました', error);
  }
}

// メイン処理
async function main() {
  try {
    await generateAndValidateTools();
  } catch (error) {
    handleError('予期しないエラーが発生しました', error);
  }
}

// スクリプト実行
main().catch(error => {
  handleError('スクリプト実行中に予期しないエラーが発生しました', error);
});
