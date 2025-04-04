#!/usr/bin/env node
/**
 * このスクリプトはビルド時にOpenAPI定義からAPIツールを生成し、JSONファイルに保存します
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ビルドディレクトリを確認
const distDir = path.resolve(projectRoot, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('ビルドディレクトリが見つかりません。先にビルドを実行してください。');
  process.exit(1);
}

// 生成先ディレクトリを作成
const generatedDir = path.resolve(projectRoot, 'src', 'tools', 'generated');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// ApiToolsGeneratorをインスタンス化するための一時的なスクリプトを作成
const tempScriptPath = path.resolve(projectRoot, 'dist', 'temp-generate-tools.js');
const tempScriptContent = `
import { ApiToolsGenerator } from './tools/api-tools-generator.js';

// ジェネレーターをインスタンス化
const generator = new ApiToolsGenerator();

// ツールを生成
const tools = generator.generateTools();

// JSONとして出力
console.log(JSON.stringify(tools, null, 2));
`;

fs.writeFileSync(tempScriptPath, tempScriptContent);

// 一時スクリプトを実行してツールを生成
exec(`node ${tempScriptPath}`, (error, stdout, stderr) => {
  // 一時スクリプトを削除
  try {
    fs.unlinkSync(tempScriptPath);
  } catch (err) {
    console.warn('一時スクリプトの削除に失敗しました', err);
  }

  if (error) {
    console.error('ツール生成中にエラーが発生しました:', error);
    console.error(stderr);
    process.exit(1);
  }

  try {
    // 出力をJSON文字列として解析
    const toolsJson = stdout.trim();
    
    // 生成されたツールをファイルに保存
    const outputPath = path.resolve(generatedDir, 'tools.json');
    fs.writeFileSync(outputPath, toolsJson);
    
    console.log(`APIツールが正常に生成されました。(${outputPath})`);
    
    // ツールの数を出力
    try {
      const tools = JSON.parse(toolsJson);
      console.log(`生成されたツール: ${tools.length}件`);
    } catch (parseError) {
      console.warn('ツール数の集計に失敗しました:', parseError);
    }
  } catch (writeError) {
    console.error('ファイル書き込み中にエラーが発生しました:', writeError);
    process.exit(1);
  }
});
