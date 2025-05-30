-- セッション管理テーブル
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  verifier TEXT NOT NULL,
  code_challenge TEXT NOT NULL, 
  code_challenge_method TEXT NOT NULL DEFAULT 'S256',
  scopes TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
  updated_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
  expires_at TIMESTAMP NOT NULL DEFAULT (datetime('now', '+1 hour')),
  is_authenticated INTEGER NOT NULL DEFAULT 0,
  metadata TEXT
);

-- セッションテーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_sessions_state ON sessions(state);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- トークン管理テーブル
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  scope TEXT NOT NULL,
  id_token TEXT,
  contract_id TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

-- 取引データの一時キャッシュテーブル
CREATE TABLE IF NOT EXISTS transaction_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  data TEXT NOT NULL, -- JSON形式で保存
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, page_number)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_transaction_cache_session_id ON transaction_cache(session_id);
CREATE INDEX IF NOT EXISTS idx_transaction_cache_created_at ON transaction_cache(created_at);

-- 古いキャッシュを削除するためのトリガー（24時間以上経過したデータ）
-- D1ではトリガーがサポートされていない場合は、定期的なクリーンアップジョブを実装する必要があります