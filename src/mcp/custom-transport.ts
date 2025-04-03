import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';
import { Duplex } from 'stream';
import { createInterface } from 'readline';
import { spawn, ChildProcess } from 'child_process';

/**
 * カスタムトランスポートクラス。
 * このクラスはMCPの通信用にNode.jsの子プロセスを使用し、
 * 標準出力とMCPメッセージングを分離します。
 */
export class CustomChildProcessTransport implements Transport {
  private onCloseHandler: (() => void) | undefined;
  private onErrorHandler: ((error: Error) => void) | undefined;
  private onMessageHandler: ((message: JSONRPCMessage) => void) | undefined;
  private childProcess: ChildProcess | null = null;
  private readline: any;

  /**
   * コンストラクタ
   */
  constructor() {
    // このトランスポートクラスの初期化ロジック
  }

  /**
   * トランスポートを起動します。
   * この実装では、MCPサーバーと通信するための専用プロセスを生成することはありません。
   * 代わりに、サーバープロセス自体を使用しますが、出力ストリームを適切に処理します。
   */
  async start(): Promise<void> {
    // 現在のプロセスのstdinとstdoutを使用
    this.setupStreamHandlers(process.stdin, process.stdout);
  }

  /**
   * トランスポートを閉じます。
   * この実装では実際のプロセスは終了しません。
   */
  async close(): Promise<void> {
    if (this.childProcess && !this.childProcess.killed) {
      this.childProcess.kill();
      this.childProcess = null;
    }
    
    if (this.onCloseHandler) {
      this.onCloseHandler();
    }
  }

  /**
   * メッセージを送信します。
   * @param message 送信するJSONRPCメッセージ
   */
  async send(message: JSONRPCMessage): Promise<void> {
    try {
      // JSONをパースしてから再度文字列化します
      // これにより、メッセージがJSON形式であることが保証されます
      const jsonMessage = JSON.stringify(message);
      
      // 子プロセスにメッセージを送信
      if (this.childProcess) {
        this.childProcess.stdin.write(jsonMessage + '\n');
      } else {
        // 子プロセスがない場合は標準出力に直接書き込み
        process.stdout.write(jsonMessage + '\n');
      }
    } catch (error: unknown) {
      console.error('メッセージ送信エラー:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '不明なエラー';
      
      if (this.onErrorHandler) {
        this.onErrorHandler(new Error(`メッセージ送信エラー: ${errorMessage}`));
      }
    }
  }

  /**
   * メッセージ受信時のコールバックを設定します。
   * @param callback メッセージ受信時に呼び出されるコールバック関数
   */
  set onmessage(callback: (message: JSONRPCMessage) => void) {
    this.onMessageHandler = callback;
  }

  /**
   * トランスポートが閉じられた時のコールバックを設定します。
   * @param callback トランスポートが閉じられた時に呼び出されるコールバック関数
   */
  set onclose(callback: () => void) {
    this.onCloseHandler = callback;
  }

  /**
   * エラー発生時のコールバックを設定します。
   * @param callback エラー発生時に呼び出されるコールバック関数
   */
  set onerror(callback: (error: Error) => void) {
    this.onErrorHandler = callback;
  }

  /**
   * セッションID プロパティ（インターフェースを満たすため）
   */
  sessionId?: string;

  /**
   * ストリームハンドラをセットアップします。
   * @param inputStream 入力ストリーム
   * @param outputStream 出力ストリーム
   */
  private setupStreamHandlers(inputStream: Duplex, outputStream: Duplex): void {
    // readlineインターフェースを設定
    this.readline = createInterface({
      input: inputStream,
      terminal: false
    });

    // メッセージの行を受信した際のハンドラ
    this.readline.on('line', (line: string) => {
      try {
        // 受信したラインがJSON形式かどうかをチェック
        const trimmedLine = line.trim();
        if (trimmedLine && trimmedLine.startsWith('{') && this.onMessageHandler) {
          // JSONパースを試みる
          const jsonMessage = JSON.parse(trimmedLine) as JSONRPCMessage;
          // パースが成功したらコールバックを呼び出す
          this.onMessageHandler(jsonMessage);
        }
      } catch (error: unknown) {
        // JSONパースに失敗した場合は標準エラー出力に書き込む
        // これによりMCPプロトコルの外でエラーを報告する
        const errorMessage = error instanceof Error 
          ? error.message 
          : '不明なエラー';
        
        console.error(`JSON解析エラー: ${errorMessage}, 受信ライン: ${line}`);
      }
    });

    // ストリームが閉じられた際のハンドラ
    inputStream.on('close', () => {
      if (this.onCloseHandler) {
        this.onCloseHandler();
      }
    });

    // エラーハンドラ
    inputStream.on('error', (error) => {
      console.error('入力ストリームエラー:', error);
      if (this.onErrorHandler) {
        this.onErrorHandler(error);
      }
    });

    outputStream.on('error', (error) => {
      console.error('出力ストリームエラー:', error);
      if (this.onErrorHandler) {
        this.onErrorHandler(error);
      }
    });
  }
}
