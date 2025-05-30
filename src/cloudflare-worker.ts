/**
 * Cloudflare Workers用のシンプルなMCPサーバー実装
 * 
 * SSEを使わず、REST APIとして実装します。
 * MCPクライアントは、HTTP POSTでメッセージを送信し、レスポンスを受け取ります。
 */

interface Env {
  SESSIONS: KVNamespace;
  TOKENS: KVNamespace;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  SMAREGI_AUTH_URL: string;
  SMAREGI_TOKEN_ENDPOINT: string;
  SMAREGI_API_URL: string;
}

// グローバル変数でツール定義を保持
const TOOLS = [
  {
    name: 'authenticate_smaregi',
    description: 'Smaregi APIの認証を管理します',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['start', 'check', 'status'],
          description: 'start: 認証を開始, check: コールバック処理, status: 認証状態確認',
        },
        code: {
          type: 'string',
          description: '認証コード（checkアクション時のみ必要）',
        },
      },
      required: ['action'],
    },
  },
  {
    name: 'transactions_list',
    description: '取引一覧を取得します。日付範囲の指定が必須です。',
    inputSchema: {
      type: 'object',
      properties: {
        'transaction_date_time-from': {
          type: 'string',
          description: '取引日時の開始（ISO 8601形式、例: 2024-01-01T00:00:00+09:00）',
        },
        'transaction_date_time-to': {
          type: 'string',
          description: '取引日時の終了（ISO 8601形式、例: 2024-01-31T23:59:59+09:00）',
        },
      },
      required: ['transaction_date_time-from', 'transaction_date_time-to'],
    },
  },
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS対応
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // ヘルスチェック
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        version: '1.0.0',
        transport: 'http',
        timestamp: new Date().toISOString() 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    // MCPメッセージハンドラー
    if (url.pathname === '/mcp' && request.method === 'POST') {
      try {
        const message = await request.json() as any;
        const response = await handleMCPMessage(message, env, ctx);
        
        return new Response(JSON.stringify(response), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal error',
            data: error instanceof Error ? error.message : String(error),
          },
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
    }
    
    // 認証コールバック
    if (url.pathname === '/auth/callback') {
      return handleAuthCallback(url, env);
    }
    
    // ルート
    if (url.pathname === '/') {
      return new Response(`
        <h1>Smaregi MCP Server</h1>
        <p>This is a Model Context Protocol server for Smaregi API.</p>
        <p>Status: <a href="/health">Health Check</a></p>
        <h2>Configuration for Claude Desktop</h2>
        <pre>{
  "mcpServers": {
    "smaregi-remote": {
      "url": "${url.origin}/mcp",
      "transport": {
        "type": "http"
      }
    }
  }
}</pre>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  },
};

/**
 * MCPメッセージを処理
 */
async function handleMCPMessage(message: any, env: Env, ctx: ExecutionContext): Promise<any> {
  const { method, params, id } = message;
  
  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            resources: { listChanged: true },
            prompts: { listChanged: true },
            tools: { listChanged: true },
          },
          serverInfo: {
            name: 'smaregi',
            version: '1.0.0',
          },
        },
      };
      
    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS,
        },
      };
      
    case 'tools/call':
      return await handleToolCall(params, env, ctx);
      
    case 'resources/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          resources: [],
        },
      };
      
    default:
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: 'Method not found',
        },
      };
  }
}

/**
 * ツール実行を処理
 */
async function handleToolCall(params: any, env: Env, ctx: ExecutionContext): Promise<any> {
  const { name, arguments: args } = params;
  
  try {
    if (name === 'authenticate_smaregi') {
      return await handleAuthTool(args, env);
    } else if (name === 'transactions_list') {
      return await handleTransactionsTool(args, env);
    } else {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: `Unknown tool: ${name}`,
        },
      };
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Tool execution error',
        data: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

/**
 * 認証ツールの処理
 */
async function handleAuthTool(args: any, env: Env): Promise<any> {
  const { action, code } = args;
  
  if (action === 'start') {
    // セッションIDを生成
    const sessionId = crypto.randomUUID();
    const state = crypto.randomUUID();
    
    // セッション情報を保存
    await env.SESSIONS.put(`session:${sessionId}`, JSON.stringify({
      state,
      createdAt: new Date().toISOString(),
    }), { expirationTtl: 600 }); // 10分で期限切れ
    
    const authUrl = `${env.SMAREGI_AUTH_URL}?response_type=code&client_id=${env.CLIENT_ID}&scope=pos.transactions:read&state=${state}&redirect_uri=${encodeURIComponent(env.REDIRECT_URI)}`;
    
    return {
      jsonrpc: '2.0',
      result: {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'auth_required',
            authUrl,
            sessionId,
            message: '認証URLにアクセスしてログインしてください',
          }),
        }],
      },
    };
  } else if (action === 'status') {
    // アクティブなセッションを確認
    const sessions = [];
    const list = await env.SESSIONS.list({ prefix: 'session:' });
    
    for (const key of list.keys) {
      const sessionData = await env.SESSIONS.get(key.name);
      if (sessionData) {
        const tokenKey = `token:${key.name.replace('session:', '')}`;
        const token = await env.TOKENS.get(tokenKey);
        if (token) {
          sessions.push({
            sessionId: key.name.replace('session:', ''),
            authenticated: true,
          });
        }
      }
    }
    
    return {
      jsonrpc: '2.0',
      result: {
        content: [{
          type: 'text',
          text: JSON.stringify({
            authenticated: sessions.length > 0,
            sessions,
          }),
        }],
      },
    };
  }
  
  return {
    jsonrpc: '2.0',
    error: {
      code: -32602,
      message: 'Invalid action',
    },
  };
}

/**
 * 取引一覧ツールの処理
 */
async function handleTransactionsTool(args: any, env: Env): Promise<any> {
  // 認証確認
  const list = await env.SESSIONS.list({ prefix: 'session:' });
  let accessToken = null;
  
  for (const key of list.keys) {
    const tokenKey = `token:${key.name.replace('session:', '')}`;
    const tokenData = await env.TOKENS.get(tokenKey);
    if (tokenData) {
      const token = JSON.parse(tokenData);
      accessToken = token.access_token;
      break;
    }
  }
  
  if (!accessToken) {
    return {
      jsonrpc: '2.0',
      result: {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: 'AUTHENTICATION_REQUIRED',
            message: '認証が必要です。authenticate_smaregi ツールで action: start を実行してください。',
          }),
        }],
        isError: true,
      },
    };
  }
  
  // APIリクエスト
  const queryParams = new URLSearchParams({
    limit: '100',
    page: '1',
    with_details: 'summary',
    'transaction_date_time-from': args['transaction_date_time-from'],
    'transaction_date_time-to': args['transaction_date_time-to'],
  });
  
  const response = await fetch(`${env.SMAREGI_API_URL}/pos/transactions?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    return {
      jsonrpc: '2.0',
      result: {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: 'API_ERROR',
            message: error,
          }),
        }],
        isError: true,
      },
    };
  }
  
  const data = await response.json();
  
  return {
    jsonrpc: '2.0',
    result: {
      content: [{
        type: 'text',
        text: JSON.stringify({
          total: data.length || 0,
          transactions: data,
        }),
      }],
    },
  };
}

/**
 * 認証コールバックを処理
 */
async function handleAuthCallback(url: URL, env: Env): Promise<Response> {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  if (!code || !state) {
    return new Response('認証エラー: 必要なパラメータがありません', { status: 400 });
  }
  
  // セッションを検証
  const list = await env.SESSIONS.list({ prefix: 'session:' });
  let validSession = null;
  
  for (const key of list.keys) {
    const sessionData = await env.SESSIONS.get(key.name);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.state === state) {
        validSession = key.name.replace('session:', '');
        break;
      }
    }
  }
  
  if (!validSession) {
    return new Response('認証エラー: 無効なセッション', { status: 400 });
  }
  
  // トークンを取得
  const tokenResponse = await fetch(env.SMAREGI_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.REDIRECT_URI,
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
    }),
  });
  
  if (!tokenResponse.ok) {
    return new Response('トークン取得エラー', { status: 500 });
  }
  
  const tokenData = await tokenResponse.json();
  
  // トークンを保存
  await env.TOKENS.put(`token:${validSession}`, JSON.stringify(tokenData), {
    expirationTtl: tokenData.expires_in || 3600,
  });
  
  return new Response(`
    <html>
      <head>
        <title>認証完了</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; }
          .success { color: green; }
        </style>
      </head>
      <body>
        <h1 class="success">認証が完了しました</h1>
        <p>このウィンドウは閉じても構いません。</p>
        <p>Claude Desktopに戻って作業を続けてください。</p>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}