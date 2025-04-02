/**
 * 利用可能なツールの定義
 */

// スマレジAPIの概要を取得するツール定義
const GET_SMAREGI_API_OVERVIEW = {
  name: 'getSmaregiApiOverview',
  description: 'スマレジAPIの概要情報を取得します。APIの基本情報、認証方法、主要なエンドポイントカテゴリなどが提供されます。',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: '情報を取得したいカテゴリ（例: 商品, 取引, 在庫）。指定しない場合は全体の概要を返します。',
      },
    },
    required: [],
  },
};

// 特定のAPIエンドポイントの詳細を取得するツール定義
const GET_SMAREGI_API_OPERATION = {
  name: 'getSmaregiApiOperation',
  description: 'スマレジAPIの特定のエンドポイントに関する詳細情報を取得します。パラメータ、レスポンス形式、認証要件などが提供されます。',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'APIエンドポイントのパス（例: /pos/products, /pos/transactions）',
      },
      method: {
        type: 'string',
        description: 'HTTPメソッド（GET, POST, PUT, DELETE）',
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    },
    required: ['path', 'method'],
  },
};

// スマレジAPIのスキーマ情報を取得するツール定義
const GET_SMAREGI_API_SCHEMA = {
  name: 'getSmaregiApiSchema',
  description: 'スマレジAPIで使用されるデータモデル（スキーマ）の定義を取得します。',
  inputSchema: {
    type: 'object',
    properties: {
      schemaName: {
        type: 'string',
        description: '情報を取得したいスキーマ名（例: Product, Transaction, Stock）',
      },
    },
    required: ['schemaName'],
  },
};

// エンドポイント一覧を取得するツール定義
const LIST_SMAREGI_API_ENDPOINTS = {
  name: 'listSmaregiApiEndpoints',
  description: 'スマレジAPIで利用可能なエンドポイントの一覧を取得します。カテゴリでフィルタリングすることも可能です。',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'エンドポイントのカテゴリ（例: 商品, 取引, 在庫）。指定しない場合は全てのエンドポイントを返します。',
      },
    },
    required: [],
  },
};

// 全てのツール定義を返す関数
export function loadTools() {
  return [
    GET_SMAREGI_API_OVERVIEW,
    GET_SMAREGI_API_OPERATION,
    GET_SMAREGI_API_SCHEMA,
    LIST_SMAREGI_API_ENDPOINTS,
  ];
}
