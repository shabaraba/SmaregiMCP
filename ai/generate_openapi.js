#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const { execSync } = require('child_process');

/**
 * メイン実行関数
 */
async function main() {
  try {
    console.log('Starting Smaregi API Documentation crawler...');
    
    // 必要な依存関係をインストール
    console.log('Installing dependencies...');
    execSync('npm install playwright js-yaml', { stdio: 'inherit' });
    
    // クローラーとパーサーのディレクトリが存在することを確認
    const crawlerDir = path.join(__dirname, 'crawler');
    await fs.mkdir(crawlerDir, { recursive: true });
    
    // OpenAPIジェネレーターを実行
    console.log('Running OpenAPI generator...');
    const OpenApiGenerator = require('./crawler/generate_openapi');
    const generator = new OpenApiGenerator('https://www1.smaregi.dev/apidoc/');
    await generator.run();
    
    console.log('OpenAPI generation completed successfully!');
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

// スクリプトを実行
main().catch(console.error);
