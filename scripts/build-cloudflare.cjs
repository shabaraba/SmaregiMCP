/**
 * Cloudflare Workers用のビルドスクリプト
 * Node.js向けのネイティブモジュールを使用しているファイルをブラウザ環境で実行できるように変更し、
 * esbuildでバンドルします。
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// 一時的なバックアップディレクトリ
const BACKUP_DIR = path.join(__dirname, '../temp-backup');

// 修正が必要なファイルリスト
const FILES_TO_MODIFY = [
  path.join(__dirname, '../src/conversion/schema-converter.ts'),
  path.join(__dirname, '../src/utils/package-info.ts'),
  path.join(__dirname, '../src/server/resources.ts'),
  path.join(__dirname, '../src/utils/config.ts')
];

// バックアップディレクトリを作成
function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

// ファイルをバックアップ
function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  fs.copyFileSync(filePath, backupPath);
  console.log(`Backed up ${filePath} to ${backupPath}`);
  return backupPath;
}

// バックアップからファイルを復元
function restoreFile(filePath, backupPath) {
  fs.copyFileSync(backupPath, filePath);
  console.log(`Restored ${filePath} from ${backupPath}`);
}

// ファイルを修正してNode.js固有のモジュールをブラウザ互換にする
function modifyFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // fs, pathのインポートを削除して特別なコメントに変更
  content = content.replace(/import \* as fs from ['"]fs['"];?/g, '/* fs import removed for Cloudflare compatibility */');
  content = content.replace(/import \* as path from ['"]path['"];?/g, '/* path import removed for Cloudflare compatibility */');
  
  // Cloudflare環境でのダミー実装を挿入
  const cloudflarePolyfill = `
// Cloudflare Workers環境用のポリフィル
const fs = {
  readFileSync: (filePath, options) => {
    console.error(\`[WARN] fs.readFileSync called in Cloudflare environment: \${filePath}\`);
    return '';
  },
  existsSync: (filePath) => {
    console.error(\`[WARN] fs.existsSync called in Cloudflare environment: \${filePath}\`);
    return false;
  },
  writeFileSync: (filePath, data, options) => {
    console.error(\`[WARN] fs.writeFileSync called in Cloudflare environment: \${filePath}\`);
    return;
  },
  mkdirSync: (dirPath, options) => {
    console.error(\`[WARN] fs.mkdirSync called in Cloudflare environment: \${dirPath}\`);
    return;
  }
};

const path = {
  resolve: (...paths) => {
    return '/' + paths.filter(Boolean).join('/').replace(/\\/+/g, '/');
  },
  join: (...paths) => {
    return paths.filter(Boolean).join('/').replace(/\\/+/g, '/');
  },
  dirname: (filePath) => {
    return filePath.split('/').slice(0, -1).join('/') || '/';
  },
  basename: (filePath, ext) => {
    const base = filePath.split('/').pop() || '';
    if (ext && base.endsWith(ext)) {
      return base.slice(0, -ext.length);
    }
    return base;
  }
};

// Cloudflare Workers環境用のprocess.cwdポリフィル
const process = {
  cwd: () => '/',
  env: { NODE_ENV: 'production' }
};
`;
  
  // ポリフィルを挿入
  if (!content.includes('// Cloudflare Workers環境用のポリフィル')) {
    const importIndex = content.indexOf('import');
    if (importIndex !== -1) {
      content = content.slice(0, importIndex) + cloudflarePolyfill + content.slice(importIndex);
    } else {
      content = cloudflarePolyfill + content;
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Modified ${filePath} for Cloudflare compatibility`);
}

// メイン処理
async function main() {
  try {
    // スキーマ生成
    console.log('Generating OpenAPI schemas...');
    await execAsync('npm run generate-schemas');
    
    // バックアップディレクトリを作成
    createBackupDir();
    
    // ファイルをバックアップして修正
    const backupPaths = [];
    for (const file of FILES_TO_MODIFY) {
      if (fs.existsSync(file)) {
        const backupPath = backupFile(file);
        backupPaths.push({ original: file, backup: backupPath });
        modifyFile(file);
      } else {
        console.warn(`Warning: File ${file} does not exist, skipping`);
      }
    }
    
    // dist/workerディレクトリ作成
    if (!fs.existsSync(path.join(__dirname, '../dist/worker'))) {
      fs.mkdirSync(path.join(__dirname, '../dist/worker'), { recursive: true });
    }
    
    // esbuildでバンドル
    console.log('Bundling with esbuild...');
    await execAsync('npx esbuild src/cloudflare-main.ts --bundle --outfile=dist/worker/index.js --format=esm --platform=browser --minify --sourcemap --external:node:* --external:typescript-json-schema');
    
    console.log('Build completed successfully');
    
    // ファイルを復元
    for (const { original, backup } of backupPaths) {
      restoreFile(original, backup);
    }
    
    // バックアップファイルを削除
    for (const { backup } of backupPaths) {
      fs.unlinkSync(backup);
    }
    
    // バックアップディレクトリを削除
    if (fs.existsSync(BACKUP_DIR)) {
      fs.rmdirSync(BACKUP_DIR);
    }
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();