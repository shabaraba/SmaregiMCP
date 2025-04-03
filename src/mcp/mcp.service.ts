import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server } from '@modelcontextprotocol/sdk/dist/esm/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/dist/esm/server/stdio';
import { ToolsService } from './tools/tools.service';
import { ToolHandlerService } from './tools/tool-handler.service';

@Injectable()
export class McpService implements OnModuleInit {
  private server: Server;

  constructor(
    private configService: ConfigService,
    private toolsService: ToolsService,
    private toolHandlerService: ToolHandlerService,
  ) {}

  /**
   * モジュール初期化時にMCPサーバーを起動
   */
  async onModuleInit() {
    try {
      console.log('MCPサーバーを初期化中...');
      
      // MCPサーバー作成
      this.server = new Server(
        { 
          name: 'smaregi', 
          version: this.configService.get('npm_package_version', '1.0.0'),
        },
        { capabilities: { tools: {} } },
      );
      
      // ツール一覧ハンドラー
      this.server.setRequestHandler('listTools', async () => {
        console.log('ツール一覧リクエストを受信しました');
        return { tools: this.toolsService.getTools() };
      });
      
      // ツール呼び出しハンドラー
      this.server.setRequestHandler('callTool', async (request) => {
        console.log('ツール呼び出しリクエストを受信しました:', request);
        try {
          return await this.toolHandlerService.handleToolCall(request);
        } catch (error) {
          console.error('ツール呼び出しエラー:', error);
          return {
            content: [
              {
                type: 'text',
                text: `エラー: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      });
      
      // MCPトランスポート接続
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.log('MCPサーバーが接続され、実行中です');
    } catch (error) {
      console.error('MCPサーバー初期化エラー:', error);
      throw error;
    }
  }
}
