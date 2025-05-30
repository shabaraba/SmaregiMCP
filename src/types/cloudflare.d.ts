/**
 * Cloudflare Workers向けの型定義
 */

declare interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<string | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string, limit?: number, cursor?: string }): Promise<{ keys: { name: string, expiration?: number }[], list_complete: boolean, cursor?: string }>;
}

declare interface Env {
  SESSIONS: KVNamespace;
  TOKENS: KVNamespace;
  DB: import('@cloudflare/workers-types').D1Database;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
  REDIRECT_URI?: string;
  SMAREGI_AUTH_URL?: string;
  SMAREGI_TOKEN_ENDPOINT?: string;
  SMAREGI_API_URL?: string;
  DEBUG?: string;
  SERVER_NAME?: string;
  SERVER_VERSION?: string;
  NODE_ENV?: string;
}

declare interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

declare type WorkerHandler = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;