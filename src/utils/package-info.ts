// 
// Cloudflare Workers環境用のポリフィル
const fs = {
  readFileSync: (filePath, options) => {
    console.error(`[WARN] fs.readFileSync called in Cloudflare environment: ${filePath}`);
    return '';
  },
  existsSync: (filePath) => {
    console.error(`[WARN] fs.existsSync called in Cloudflare environment: ${filePath}`);
    return false;
  },
  writeFileSync: (filePath, data, options) => {
    console.error(`[WARN] fs.writeFileSync called in Cloudflare environment: ${filePath}`);
    return;
  },
  mkdirSync: (dirPath, options) => {
    console.error(`[WARN] fs.mkdirSync called in Cloudflare environment: ${dirPath}`);
    return;
  }
};

const path = {
  resolve: (...paths) => {
    return '/' + paths.filter(Boolean).join('/').replace(/\/+/g, '/');
  },
  join: (...paths) => {
    return paths.filter(Boolean).join('/').replace(/\/+/g, '/');
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
import * as fs from 'fs';
// import * as path from 'path';

/**
 * Package info from package.json
 */
export const packageInfo = (() => {
  // Cloudflare環境ではハードコードしたバージョン情報を返す
  if (typeof process === 'undefined' || !process.env) {
    return {
      name: 'smaregi-mcp',
      version: '1.0.0',
      description: 'Smaregi MCP Server',
    };
  }

  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      return {
        name: packageJson.name || 'smaregi-mcp',
        version: packageJson.version || '1.0.0',
        description: packageJson.description || 'Smaregi MCP Server',
      };
    }
    
    return {
      name: 'smaregi-mcp',
      version: '1.0.0',
      description: 'Smaregi MCP Server',
    };
  } catch (error) {
    console.error(`[ERROR] Failed to read package.json: ${error}`);
    return {
      name: 'smaregi-mcp',
      version: '1.0.0',
      description: 'Smaregi MCP Server',
    };
  }
})();
