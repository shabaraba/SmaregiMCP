/**
 * Cloudflare Workers向けのメインエントリーポイント
 * このファイルはwebpack/esbuildなどでバンドルされ、Cloudflare Workersにデプロイされます。
 * 実際のハンドラーロジックはsrc/worker.tsに記載されています。
 */

// エントリポイントをインポート
import workerHandler from './worker.js';

// Workersハンドラーをエクスポート
export default workerHandler;