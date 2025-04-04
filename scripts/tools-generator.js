/**
 * ビルド時にOpenAPI定義からツールリストを生成するスクリプト
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { ApiToolsGenerator } = require('../dist/tools/api-tools-generator');

// ディレクトリを作成する関数
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

async function generateTools() {
  console.log('ツール定義を生成しています...');
  
  try {
    // ApiToolsGeneratorのインスタンスを作成
    const generator = new ApiToolsGenerator();
    
    // ツール生成
    const tools = generator.generateTools();
    
    if (tools.length === 0) {
      console.warn('警告: 生成されたツールがありません');
      return;
    }
    
    // 出力ディレクトリを確保
    const outputDir = path.join(__dirname, '..', 'src', 'tools', 'generated');
    ensureDirectoryExists(outputDir);
    
    // 生成日時を含めたメタデータを追加
    const output = {
      generatedAt: new Date().toISOString(),
      count: tools.length,
      tools
    };
    
    // JSONとして保存
    const outputPath = path.join(outputDir, 'tools.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
    
    console.log(`成功: ${tools.length}個のツールを${outputPath}に保存しました`);
  } catch (error) {
    console.error('ツール生成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
generateTools();
