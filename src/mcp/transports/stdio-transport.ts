/**
 * 標準入出力を使用したMCPトランスポート
 * MCPサーバとの通信を標準入出力を介して行う
 */
export class StdioServerTransport {
  
  onmessage: ((message: string) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: Error) => void) | null = null;
  
  // セッションID (任意の値)
  readonly sessionId: string = 'stdio-session';
  
  // 終了フラグ
  private isShutdown = false;
  
  constructor() {
    // 標準入力からの読み込み設定
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', this.handleInput.bind(this));
    
    // プロセス終了イベントを監視
    process.on('SIGINT', this.onProcessExit.bind(this));
    process.on('SIGTERM', this.onProcessExit.bind(this));
    process.on('SIGHUP', this.onProcessExit.bind(this));
    
    // 親プロセスが終了した場合も終了
    setInterval(() => {
      if (process.ppid === 1 || process.ppid === undefined) {
        this.onProcessExit();
      }
    }, 5000);
  }
  
  /**
   * メッセージを送信する
   * @param message 送信するメッセージ
   */
  send(message: string): void {
    if (this.isShutdown) {
      return;
    }
    
    // 標準出力にJSON形式のメッセージを書き込む
    // MCPの仕様に従って各メッセージを改行で区切る
    process.stdout.write(message + '\n');
  }
  
  /**
   * 標準入力からのデータを処理する
   * @param chunk 入力データ
   */
  private handleInput(chunk: string): void {
    if (this.isShutdown) {
      return;
    }
    
    try {
      // 改行で分割して複数のメッセージを処理
      const lines = chunk.toString().split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        // `onmessage` ハンドラが設定されていればメッセージを渡す
        if (this.onmessage) {
          this.onmessage(line);
        }
      }
    } catch (error) {
      // エラーハンドラが設定されていればエラーを渡す
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }
  
  /**
   * プロセス終了時の処理
   */
  private onProcessExit(): void {
    if (this.isShutdown) {
      return;
    }
    
    this.close();
  }
  
  /**
   * トランスポートを閉じる
   */
  async close(): Promise<void> {
    if (this.isShutdown) {
      return;
    }
    
    this.isShutdown = true;
    
    // イベントリスナーを解除
    process.stdin.removeAllListeners('data');
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGTERM');
    process.removeAllListeners('SIGHUP');
    
    // `onclose` ハンドラが設定されていれば呼び出す
    if (this.onclose) {
      this.onclose();
    }
  }
  
  /**
   * トランスポートを開始する
   */
  async start(): Promise<void> {
    // 既に実装済みのコンストラクタで開始されるため、特に何もしない
  }
}
