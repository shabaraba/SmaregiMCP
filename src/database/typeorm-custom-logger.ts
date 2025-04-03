import { Logger, QueryRunner } from 'typeorm';

/**
 * TypeORMカスタムロガー
 * 
 * SQLiteのロギングをstderrに出力するためのカスタムロガー実装。
 * MCPプロトコルがJSONメッセージを標準出力経由でやり取りするため、
 * データベースのログが標準出力に表示されると競合を起こす問題を解決する。
 */
export class TypeOrmCustomLogger implements Logger {
  /**
   * コンストラクタ
   * @param debugMode デバッグモードが有効かどうか（クエリのログなどの詳細なログを出力するかどうか）
   * @param logPrefix ログの接頭辞（デフォルトは '[TypeORM]'）
   */
  constructor(
    private readonly debugMode = false,
    private readonly logPrefix = '[TypeORM]'
  ) {}

  /**
   * ログメッセージを標準エラー出力に出力する
   */
  private logToStderr(message: string, queryRunner?: QueryRunner): void {
    process.stderr.write(`${this.logPrefix} ${message}\n`);
  }

  /**
   * クエリを記録する
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    if (this.debugMode) {
      const sql = query + (parameters && parameters.length 
        ? ' -- Parameters: ' + this.stringifyParams(parameters) 
        : '');
      this.logToStderr(`Query: ${sql}`, queryRunner);
    }
  }

  /**
   * クエリエラーを記録する
   */
  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const sql = query + (parameters && parameters.length 
      ? ' -- Parameters: ' + this.stringifyParams(parameters) 
      : '');
    this.logToStderr(`Query Error: ${sql}`, queryRunner);
    this.logToStderr(`Error: ${error instanceof Error ? error.message : error}`, queryRunner);
    if (error instanceof Error && error.stack) {
      this.logToStderr(`Stack: ${error.stack}`, queryRunner);
    }
  }

  /**
   * 遅いクエリを記録する
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    const sql = query + (parameters && parameters.length 
      ? ' -- Parameters: ' + this.stringifyParams(parameters) 
      : '');
    this.logToStderr(`Slow Query (${time}ms): ${sql}`, queryRunner);
  }

  /**
   * スキーマビルド処理を記録する
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    if (this.debugMode) {
      this.logToStderr(`Schema Build: ${message}`, queryRunner);
    }
  }

  /**
   * マイグレーション処理を記録する
   */
  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.logToStderr(`Migration: ${message}`, queryRunner);
  }

  /**
   * 一般的なログメッセージを記録する
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): void {
    if (level === 'log' && !this.debugMode) return;
    this.logToStderr(`${level.toUpperCase()}: ${message}`, queryRunner);
  }

  /**
   * パラメータを文字列に変換する
   */
  private stringifyParams(parameters: any[]): string {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters.toString();
    }
  }
}
