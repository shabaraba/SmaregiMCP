#!/usr/bin/env node

// .js 拡張子を追加するスクリプト（ESModule対応）
const fs = require('fs');
const path = require('path');

// コマンドライン引数からソースディレクトリを取得
const sourceDir = process.argv[2] || path.join(__dirname, '..', 'src');

// TypeScriptファイルの拡張子
const TS_EXT = '.ts';

// ファイルを再帰的に検索する関数
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith(TS_EXT)) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// ファイル内の import文に .js 拡張子を追加する関数
function addJsExtension(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 相対パスのimport文を修正（./ または ../ で始まる）
    const relativeImportRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?(['"])(\.[^'"]+)(['"])/g;
    content = content.replace(relativeImportRegex, (match, quote1, importPath, quote2) => {
      // すでに.jsや他の拡張子がある場合はスキップ
      if (path.extname(importPath)) {
        return match;
      }
      
      modified = true;
      return `import ${match.split('from')[0]}from ${quote1}${importPath}.js${quote2}`;
    });
    
    // SDK関連のimport文を修正
    const sdkImportRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?(['"])@modelcontextprotocol\/sdk\/([^'"]+)(['"])/g;
    content = content.replace(sdkImportRegex, (match, quote1, importPath, quote2) => {
      // すでに.jsがある場合はスキップ
      if (importPath.endsWith('.js')) {
        return match;
      }
      
      modified = true;
      return `import ${match.split('from')[0]}from ${quote1}@modelcontextprotocol/sdk/${importPath}.js${quote2}`;
    });
    
    // 変更があれば保存
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// メイン処理
function main() {
  console.log(`Scanning directory: ${sourceDir}`);
  
  const tsFiles = findFiles(sourceDir);
  console.log(`Found ${tsFiles.length} TypeScript files`);
  
  let updateCount = 0;
  
  for (const file of tsFiles) {
    if (addJsExtension(file)) {
      updateCount++;
    }
  }
  
  console.log(`Completed! Updated ${updateCount} files.`);
}

main();
