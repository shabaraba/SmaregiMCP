import { Transport, TransportCallback } from '@modelcontextprotocol/sdk/shared/transport.js';
import { Duplex } from 'stream';
import { createInterface } from 'readline';
import { spawn, ChildProcess } from 'child_process';

/**
 * カスタムトランスポートクラス。
 * このクラスはMCPの通信用にNode.jsの子プロセスを使用し、
 * 標準出力とMCPメッセージングを分離します。
 */
export class CustomChildProcessTransport implements Transport {
  private onCloseCallback: TransportCallback | null = null;
  private onMessageCallback: TransportCallback | null = null;
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
  start(): void {
    // 現在のプロセスのstdinとstdoutを使用
    this.setupStreamHandlers(process.stdin, process.stdout);
  }

  /**
   * トランスポートを閉じます。
   * この実装では実際のプロセスは終了しません。
   */
  close(): void {
    if (this.childProcess && !this.childProcess.killed) {
      this.childProcess.kill();
      this.childProcess = null;
    }
    
    if (this.onCloseCallback) {
      this.onCloseCallback(null);
    }
  }

  /**
   * メッセージを送信します。
   * @param message 送信するメッセージ
   */
  sendMessage(message: string): void {
    try {
      // JSONをパースしてから再度文字列化します
      // これにより、メッセージがJSON形式であることが保証されます
      const jsonMessage = JSON.stringify(JSON.parse(message));
      
      // 子プロセスにメッセージを送信
      if (this.childProcess) {
        this.childProcess.stdin.write(jsonMessage + '\n');
      } else {
        // 子プロセスがない場合は標準出力に直接書き込み
        process.stdout.write(jsonMessage + '\n');
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      if (this.onCloseCallback) {
        this.onCloseCallback(new Error(`メッセージ送信エラー: ${error.message}`));
      }
    }
  }

  /**
   * メッセージ受信時のコールバックを設定します。
   * @param callback メッセージ受信時に呼び出されるコールバック関数
   */
  onMessage(callback: TransportCallback): void {
    this.onMessageCallback = callback;
  }

  /**
   * トランスポートが閉じられた時のコールバックを設定します。
   * @param callback トランスポートが閉じられた時に呼び出されるコールバック関数
   */
  onClose(callback: TransportCallback): void {
    this.onCloseCallback = callback;
  }

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
        if (trimmedLine && trimmedLine.startsWith('{') && this.onMessageCallback) {
          // JSONパースを試みる
          JSON.parse(trimmedLine);
          // パースが成功したらコールバックを呼び出す
          this.onMessageCallback(null, trimmedLine);
        }
      } catch (error) {
        // JSONパースに失敗した場合は標準エラー出力に書き込む
        // これによりMCPプロトコルの外でエラーを報告する
        console.error(`JSON解析エラー: ${error.message}, 受信ライン: ${line}`);
      }
    });

    // ストリームが閉じられた際のハンドラ
    inputStream.on('close', () => {
      if (this.onCloseCallback) {
        this.onCloseCallback(null);
      }
    });

    // エラーハンドラ
    inputStream.on('error', (error) => {
      console.error('入力ストリームエラー:', error);
      if (this.onCloseCallback) {
        this.onCloseCallback(error);
      }
    });

    outputStream.on('error', (error) => {
      console.error('出力ストリームエラー:', error);
      if (this.onCloseCallback) {
        this.onCloseCallback(error);
      }
    });
  }
}
