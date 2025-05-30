import express, { Request, Response } from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createMcpAuthMiddleware } from './auth/mcp-metadata-handler.js';

/**
 * SSE (Server-Sent Events) エンドポイントを追加
 * MCP クライアントが HTTP 経由で接続できるようにする
 */
export function setupSSEEndpoints(app: express.Express, mcpServer: McpServer) {
  const transports: { [sessionId: string]: SSEServerTransport } = {};
  const authMiddleware = createMcpAuthMiddleware();

  console.error('[INFO] Setting up SSE endpoints for MCP over HTTP...');

  // SSE接続エンドポイント (認証を一時的に無効化してテスト)
  app.get('/sse', async (req: Request, res: Response) => {
    try {
      console.error('[INFO] New SSE connection request received');
      
      const transport = new SSEServerTransport('/messages', res);
      transports[transport.sessionId] = transport;
      
      console.error(`[INFO] Created SSE transport with session ID: ${transport.sessionId}`);
      
      // 接続が閉じられたときのクリーンアップ
      res.on('close', () => {
        console.error(`[INFO] SSE connection closed for session: ${transport.sessionId}`);
        delete transports[transport.sessionId];
      });

      // SSE接続を開始
      await transport.start();
      console.error('[INFO] SSE transport started');

      // MCPサーバーと接続
      await mcpServer.connect(transport);
      console.error('[INFO] MCP server connected to SSE transport');
      
    } catch (error) {
      console.error('[ERROR] Failed to establish SSE connection:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to establish SSE connection' });
      }
    }
  });

  // メッセージ送信エンドポイント (認証を一時的に無効化してテスト)
  app.post('/messages', async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.sessionId as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId query parameter is required' });
      }

      const transport = transports[sessionId];
      
      if (!transport) {
        console.error(`[ERROR] No transport found for sessionId: ${sessionId}`);
        return res.status(400).json({ error: 'No transport found for sessionId' });
      }

      await transport.handlePostMessage(req, res);
      
    } catch (error) {
      console.error('[ERROR] Failed to handle POST message:', error);
      res.status(500).json({ error: 'Failed to handle message' });
    }
  });

  // 接続状態確認エンドポイント (認証を一時的に無効化してテスト)
  app.get('/status', (req: Request, res: Response) => {
    const activeConnections = Object.keys(transports).length;
    res.json({
      status: 'running',
      activeConnections,
      sessions: Object.keys(transports)
    });
  });

  console.error('[INFO] SSE endpoints configured successfully');
}