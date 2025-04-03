import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ESMでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// プロジェクトのルートディレクトリを取得
const projectRoot = dirname(__dirname);

console.log('プロジェクトルートディレクトリ:', projectRoot);

// .envファイルのパスを取得
const envPath = join(projectRoot, '.env');
console.log('.envファイルパス:', envPath);
console.log('.envファイルが存在するか:', fs.existsSync(envPath));

// .envの内容を表示
if (fs.existsSync(envPath)) {
  console.log('.envファイルの内容:');
  console.log(fs.readFileSync(envPath, 'utf8'));
}

// dotenvの設定を試す
const result = config({ path: envPath });
console.log('dotenv設定結果:', result);
console.log('環境変数が読み込まれたか:', result.parsed !== undefined);

// 読み込まれた環境変数を確認
console.log('環境変数CLIENT_ID:', process.env.CLIENT_ID);
console.log('環境変数DATABASE_PATH:', process.env.DATABASE_PATH);

// NestJSのConfigServiceをエミュレートする簡易実装
class ConfigService {
  get(key, defaultValue) {
    return process.env[key] || defaultValue;
  }
}

// ConfigServiceで取得してみる
const configService = new ConfigService();
console.log('ConfigServiceでCLIENT_ID:', configService.get('CLIENT_ID', ''));
console.log('ConfigServiceでDATABASE_PATH:', configService.get('DATABASE_PATH', 'default-path.sqlite'));
