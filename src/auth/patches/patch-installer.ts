/**
 * デバッグ強化パッチをインストールするスクリプト
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { patchedCallback } from './debug-callback.js';

// ESモジュール対応のパス解決
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// プロジェクトルートパス
const projectRoot = path.resolve(__dirname, '..', '..', '..');

// OpenIDAuthServiceのパス
const openidAuthServicePath = path.join(projectRoot, 'src', 'auth', 'openid-auth.service.ts');

// バックアップを作成
function createBackup(filePath: string) {
  const backupPath = `${filePath}.bak`;
  console.log(`Creating backup of ${filePath} to ${backupPath}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// パッチを適用
function applyPatch() {
  console.log('Applying debug patches to openid-auth.service.ts');
  
  // バックアップ作成
  const backupPath = createBackup(openidAuthServicePath);
  
  // ファイルを読み込む
  let content = fs.readFileSync(openidAuthServicePath, 'utf8');
  
  // callbackメソッドを置換
  const callbackPattern = /callback: async \(redirectUri: string, params: any, checks: any\) => \{[\s\S]*?return tokenData;[\s\S]*?\},/;
  if (callbackPattern.test(content)) {
    content = content.replace(callbackPattern, patchedCallback);
    console.log('✅ Callback method patched successfully');
  } else {
    console.error('❌ Failed to find callback method pattern in the source file');
    return false;
  }
  
  // 修正したコンテンツを書き込む
  fs.writeFileSync(openidAuthServicePath, content);
  console.log('✅ Patches applied successfully');
  
  return true;
}

// メイン実行
try {
  if (applyPatch()) {
    console.log('✅ All patches have been applied. Please rebuild the project with:');
    console.log('   npm run build');
  } else {
    console.error('❌ Failed to apply patches');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error occurred while applying patches:', error);
  process.exit(1);
}
