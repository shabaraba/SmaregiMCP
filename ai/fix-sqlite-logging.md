# SQLite ログの標準出力問題の修正案

## 問題の概要

現在、SQLiteのログが標準出力に出力されており、それがMCPプロトコルの通信と競合していると考えられます。MCP通信はJSON形式のメッセージを標準出力/入力経由でやり取りするため、SQLiteのログ出力がJSONメッセージの構造を壊している可能性があります。

## 解決策

SQLiteのログを標準エラー出力（stderr）に出力するか、あるいはファイルに出力するようにTypeORMの設定を変更します。

### 1. TypeORMのロギング設定を変更する

`app.module.ts`の`TypeOrmModule.forRootAsync`の設定内で、ロギングの設定を以下のように変更します：

```typescript
return {
  type: 'sqlite',
  database: absoluteDbPath,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: configService.get('NODE_ENV') !== 'production',
  // カスタムロガーを設定
  logging: configService.get('NODE_ENV') !== 'production',
  logger: configService.get('NODE_ENV') !== 'production' ? 'advanced-console' : undefined,
  // ロギングオプションを追加
  loggingQueries: configService.get('NODE_ENV') !== 'production',
  loggerLevel: 'debug', // 'query', 'error', 'schema', 'warn', 'info', 'log', 'all'
};
```

### 2. カスタムロガーの実装を追加する

カスタムロガークラスを作成して、SQLiteのログを標準エラー出力に振り向けます：

```typescript
// database/typeorm-custom-logger.ts
import { Logger, QueryRunner } from 'typeorm';

export class TypeOrmCustomLogger implements Logger {
  constructor(private readonly debugMode = false) {}

  /**
   * ログメッセージを出力します（標準エラー出力に）
   */
  private logToStderr(message: string, queryRunner?: QueryRunner): void {
    process.stderr.write(`[TypeORM] ${message}\n`);
  }

  /**
   * クエリと関連パラメータを記録
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    if (this.debugMode) {
      const sql = query + (parameters && parameters.length ? ' -- Parameters: ' + this.stringifyParams(parameters) : '');
      this.logToStderr(`Query: ${sql}`, queryRunner);
    }
  }

  /**
   * クエリエラーを記録
   */
  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const sql = query + (parameters && parameters.length ? ' -- Parameters: ' + this.stringifyParams(parameters) : '');
    this.logToStderr(`Query Error: ${sql}`, queryRunner);
    this.logToStderr(`Error: ${error}`, queryRunner);
  }

  /**
   * クエリの実行時間を記録
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const sql = query + (parameters && parameters.length ? ' -- Parameters: ' + this.stringifyParams(parameters) : '');
    this.logToStderr(`Slow Query (${time}ms): ${sql}`, queryRunner);
  }

  /**
   * スキーマビルド処理を記録
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    if (this.debugMode) {
      this.logToStderr(`Schema Build: ${message}`, queryRunner);
    }
  }

  /**
   * スキーマ同期を記録
   */
  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.logToStderr(`Migration: ${message}`, queryRunner);
  }

  /**
   * 一般的なログメッセージを記録
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): void {
    if (level === 'log' && !this.debugMode) return;
    this.logToStderr(`${level.toUpperCase()}: ${message}`, queryRunner);
  }

  /**
   * パラメータを文字列に変換
   */
  private stringifyParams(parameters: any[]): string {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters.toString();
    }
  }
}
```

### 3. カスタムロガーをTypeORM設定に適用する

`app.module.ts`のロギング設定をカスタムロガーを使うように変更します：

```typescript
import { TypeOrmCustomLogger } from './database/typeorm-custom-logger.js';

// ...

return {
  type: 'sqlite',
  database: absoluteDbPath,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: configService.get('NODE_ENV') !== 'production',
  // カスタムロガーを設定
  logging: configService.get('NODE_ENV') !== 'production',
  logger: new TypeOrmCustomLogger(configService.get('NODE_ENV') !== 'production'),
};
```

## 実装計画

1. TypeORMのカスタムロガークラスを実装する
2. app.module.tsのTypeORM設定を更新する
3. 修正をテストして、SQLiteのログが標準出力に出力されなくなり、MCPプロトコルの動作に影響を与えないことを確認する

## 注意事項

- カスタムロガーの実装では、TypeORMのLoggerインターフェースを完全に実装する必要があります
- ログレベルを設定可能にして、本番環境ではログが最小限になるようにする
- MCPトランスポートとの競合を避けるため、すべてのログが標準エラー出力に出力されるようにする
