#!/usr/bin/env node

import path from 'path';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESモジュールでの __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const OpenApiGeneratorModule = await import('./crawler/generate_openapi.js');
    const OpenApiGenerator = OpenApiGeneratorModule.default;
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
