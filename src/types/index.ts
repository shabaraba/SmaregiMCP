// 基本的なリクエスト型定義
export interface ToolRequest {
  params: {
    name: string;
    arguments: Record<string, any>;
  };
}

// スマレジAPI概要リクエスト型定義
export interface SmaregiApiOverviewRequest extends ToolRequest {
  params: {
    name: 'getSmaregiApiOverview';
    arguments: {
      category?: string;
    };
  };
}

// スマレジAPIオペレーションリクエスト型定義
export interface SmaregiApiOperationRequest extends ToolRequest {
  params: {
    name: 'getSmaregiApiOperation';
    arguments: {
      path: string;
      method: string;
    };
  };
}

// スマレジAPIスキーマリクエスト型定義
export interface SmaregiApiSchemaRequest extends ToolRequest {
  params: {
    name: 'getSmaregiApiSchema';
    arguments: {
      schemaName: string;
    };
  };
}

// スマレジAPIエンドポイント一覧リクエスト型定義
export interface SmaregiApiEndpointsRequest extends ToolRequest {
  params: {
    name: 'listSmaregiApiEndpoints';
    arguments: {
      category?: string;
    };
  };
}

// レスポンス型定義
export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  metadata: Record<string, any>;
  isError?: boolean;
}

// ツールハンドラー型定義
export type ToolHandler = (request: ToolRequest) => Promise<ToolResponse>;

// ハンドラーマップ型定義
export interface HandlerMap {
  [key: string]: ToolHandler;
}
