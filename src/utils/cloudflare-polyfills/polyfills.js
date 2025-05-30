/**
 * Cloudflare Workers向けのグローバルポリフィル
 */

// プロセスオブジェクトのモック
if (typeof process === 'undefined') {
  globalThis.process = {
    env: { NODE_ENV: 'production' },
    cwd: () => '/'
  };
}

// fs モジュールのダミー実装
globalThis.fs = {
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
  },
  mkdirSync: (dirPath, options) => {
    console.error(`[WARN] fs.mkdirSync called in Cloudflare environment: ${dirPath}`);
  }
};

// path モジュールのダミー実装
globalThis.path = {
  resolve: (...paths) => {
    return '/' + paths.join('/').replace(/\/+/g, '/');
  },
  join: (...paths) => {
    return paths.join('/').replace(/\/+/g, '/');
  },
  dirname: (path) => {
    return path.split('/').slice(0, -1).join('/') || '/';
  },
  basename: (path, ext) => {
    const base = path.split('/').pop() || '';
    if (ext && base.endsWith(ext)) {
      return base.slice(0, -ext.length);
    }
    return base;
  }
};

// Node.js の Buffer クラスのモック
globalThis.Buffer = {
  from: (str, encoding) => {
    console.error(`[WARN] Buffer.from called in Cloudflare environment`);
    return { toString: () => str };
  }
};

// console.log('Cloudflare Workers polyfills loaded');