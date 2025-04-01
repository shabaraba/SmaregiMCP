import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

// ESモジュールでの __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * スマレジAPIドキュメントからOpenAPI仕様を生成するメインクラス
 */
class OpenApiGenerator {
  constructor(apiDocsUrl) {
    this.apiDocsUrl = apiDocsUrl;
    this.outputDir = path.join(path.dirname(__dirname), '../');
    this.pathsDir = path.join(this.outputDir, 'paths');
    this.schemasDir = path.join(this.outputDir, 'schemas');
  }

  /**
   * メイン処理を実行
   */
  async run() {
    try {
      console.log('Starting OpenAPI generation process...');
      
      // APIドキュメントのエンドポイント一覧を取得
      const { default: ApiCrawler } = await import('./api_crawler.js');
      const crawler = new ApiCrawler(this.apiDocsUrl);
      await crawler.initialize();
      const endpoints = await crawler.crawlIndexPage();
      await crawler.close();
      
      console.log(`Found ${endpoints.length} API endpoint categories`);
      
      // 各エンドポイントの詳細情報を解析
      const { default: ApiEndpointParser } = await import('./api_endpoint_parser.js');
      const parser = new ApiEndpointParser(this.apiDocsUrl);
      await parser.initialize();
      
      const allEndpointDetails = [];
      for (const endpoint of endpoints) {
        const detailedEndpoint = await parser.parseEndpointDetails(endpoint);
        allEndpointDetails.push(detailedEndpoint);
      }
      
      await parser.close();
      
      // パスファイルを生成・保存
      await this.generatePathFiles(allEndpointDetails);
      
      // スキーマファイルを生成・保存
      await this.generateSchemaFiles(allEndpointDetails);
      
      // メインのOpenAPIファイルを生成
      await this.generateMainOpenApiFile();
      
      console.log('OpenAPI generation completed successfully!');
    } catch (error) {
      console.error('Error generating OpenAPI spec:', error);
    }
  }

  /**
   * パスファイルを生成・保存
   */
  async generatePathFiles(endpoints) {
    console.log('Generating path files...');
    
    // 既存のパスディレクトリを削除
    try {
      await this.removeDirectory(this.pathsDir);
    } catch (error) {
      console.log('No existing paths directory to remove');
    }
    
    // パスディレクトリを作成
    await fs.mkdir(this.pathsDir, { recursive: true });
    
    // 各エンドポイントのパスを生成
    const { default: ApiEndpointParser } = await import('./api_endpoint_parser.js');
    const parser = new ApiEndpointParser(this.apiDocsUrl);
    const pathIndexes = {};
    
    for (const endpoint of endpoints) {
      // タグに基づいたディレクトリ名を作成
      const tagName = endpoint.name;
      const tagDir = tagName.toLowerCase().replace(/\s+/g, '_');
      const tagOutputDir = path.join(this.pathsDir, tagDir);
      
      // ディレクトリが存在しない場合は作成
      await fs.mkdir(tagOutputDir, { recursive: true });
      
      // 各オペレーションのパスオブジェクトを生成
      const paths = parser.convertToOpenApiPaths(endpoint);
      
      // パスごとに個別のファイルを作成
      for (const [pathUrl, pathObj] of Object.entries(paths)) {
        const pathFileName = pathUrl.replace(/\//g, '_').replace(/[{}]/g, '_').replace(/^_/, '') + '.yaml';
        const pathFilePath = path.join(tagOutputDir, pathFileName);
        
        const yamlModule = await import('js-yaml');
        const yaml = yamlModule.default;
        const pathYaml = yaml.dump(pathObj, { lineWidth: -1 });
        await fs.writeFile(pathFilePath, pathYaml, 'utf8');
        
        // インデックスに追加
        if (!pathIndexes[tagDir]) {
          pathIndexes[tagDir] = {};
        }
        
        pathIndexes[tagDir][pathUrl] = `./${tagDir}/${pathFileName}`;
      }
    }
    
    // インデックスファイルを作成
    const yamlModule = await import('js-yaml');
    const yaml = yamlModule.default;
    const indexYaml = yaml.dump(pathIndexes, { lineWidth: -1 });
    await fs.writeFile(path.join(this.pathsDir, '_index.yaml'), indexYaml, 'utf8');
    
    console.log('Path files generated successfully');
  }

  /**
   * スキーマファイルを生成・保存
   */
  async generateSchemaFiles(endpoints) {
    console.log('Generating schema files...');
    
    // 既存のスキーマディレクトリを削除
    try {
      await this.removeDirectory(this.schemasDir);
    } catch (error) {
      console.log('No existing schemas directory to remove');
    }
    
    // スキーマディレクトリを作成
    await fs.mkdir(this.schemasDir, { recursive: true });
    
    // スキーマを生成
    const { default: SchemaGenerator } = await import('./schema_generator.js');
    const schemaGenerator = new SchemaGenerator();
    schemaGenerator.generateSchemasFromEndpoints(endpoints);
    
    // 基本的なスキーマを追加
    this.addBasicSchemas(schemaGenerator);
    
    // スキーマを保存
    await schemaGenerator.saveSchemas(this.schemasDir);
    
    console.log('Schema files generated successfully');
  }

  /**
   * 基本的なスキーマ（Error, Pagination等）を追加
   */
  addBasicSchemas(schemaGenerator) {
    // エラースキーマ
    schemaGenerator.schemas['Error'] = {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'エラーコード'
        },
        message: {
          type: 'string',
          description: 'エラーメッセージ'
        },
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
                description: 'エラーが発生したフィールド'
              },
              message: {
                type: 'string',
                description: 'フィールド固有のエラーメッセージ'
              }
            }
          },
          description: 'エラーの詳細情報'
        }
      },
      required: ['code', 'message']
    };
    
    // ページネーションスキーマ
    schemaGenerator.schemas['Pagination'] = {
      type: 'object',
      properties: {
        totalCount: {
          type: 'integer',
          description: '総件数'
        },
        limit: {
          type: 'integer',
          description: '1ページあたりの最大件数'
        },
        page: {
          type: 'integer',
          description: '現在のページ番号（1ベース）'
        },
        totalPages: {
          type: 'integer',
          description: '総ページ数'
        }
      },
      required: ['totalCount', 'limit', 'page', 'totalPages']
    };
  }

  /**
   * メインのOpenAPIファイルを生成
   */
  async generateMainOpenApiFile() {
    console.log('Generating main OpenAPI file...');
    
    const openapi = {
      openapi: '3.0.3',
      info: {
        title: 'スマレジ・プラットフォームAPI POS仕様',
        description: 'スマレジ・プラットフォームAPIのPOS機能を利用するためのAPI仕様書です。POSシステムの基本機能である商品管理、在庫管理、取引管理などの機能を提供します。',
        version: '1.0.0',
        contact: {
          name: 'スマレジサポート',
          url: 'https://www.smaregi.jp/support/'
        }
      },
      servers: [
        {
          url: 'https://api.smaregi.dev/{contractId}/pos',
          description: 'サンドボックス環境',
          variables: {
            contractId: {
              description: '契約ID',
              default: 'dummy'
            }
          }
        },
        {
          url: 'https://api.smaregi.jp/{contractId}/pos',
          description: '本番環境',
          variables: {
            contractId: {
              description: '契約ID',
              default: 'dummy'
            }
          }
        }
      ],
      paths: {
        '$ref': './paths/_index.yaml'
      },
      components: {
        schemas: {
          '$ref': './schemas/_index.yaml'
        },
        securitySchemes: {
          AppAccessToken: {
            type: 'oauth2',
            description: 'アプリアクセストークン。',
            flows: {
              clientCredentials: {
                tokenUrl: 'https://id.smaregi.dev/app/{contractId}/token',
                refreshUrl: 'https://id.smaregi.dev/app/{contractId}/token',
                scopes: {
                  'pos.products:read': '商品/部門の参照ができます。',
                  'pos.products:write': '商品/部門の更新ができます。',
                  'pos.customers:read': '会員/ポイントの参照ができます。',
                  'pos.customers:write': '会員/ポイントの更新ができます。',
                  'pos.stock:read': '在庫の参照ができます。',
                  'pos.stock:write': '在庫の更新ができます。',
                  'pos.stock-changes:read': '在庫変動履歴の参照ができます。',
                  'pos.transactions:read': '取引/予算/精算/日次締め情報の参照ができます。',
                  'pos.transactions:write': '取引/予算/精算/日次締め情報の更新ができます。',
                  'pos.suppliers:read': '仕入先の参照ができます。',
                  'pos.suppliers:write': '仕入先の更新ができます。',
                  'pos.stores:read': '店舗の参照ができます。',
                  'pos.stores:write': '店舗の更新ができます。',
                  'pos.staffs:read': 'スタッフの参照ができます。',
                  'pos.staffs:write': 'スタッフの更新ができます。',
                  'pos.losses:read': 'ロスの参照ができます。',
                  'pos.losses:write': 'ロスの更新ができます。',
                  'pos.orders:read': '発注/入荷/出荷の参照ができます。',
                  'pos.orders:write': '発注/入荷/出荷の更新ができます。',
                  'pos.transfers:read': '店間移動(入出庫)の参照ができます。',
                  'pos.transfers:write': '店間移動(入出庫)の更新ができます。',
                  'pos.stocktaking:read': '棚卸の参照ができます。'
                }
              }
            }
          },
          UserAccessToken: {
            type: 'oauth2',
            description: 'ユーザーアクセストークン。管理画面における制御と同等の、ユーザー（＝スタッフ）の所属店舗による制御や、属する役割・役職に設定された各種権限に基づく実行制御が適用されます。',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://id.smaregi.dev/authorize',
                tokenUrl: 'https://id.smaregi.dev/authorize/token',
                refreshUrl: 'https://id.smaregi.dev/authorize/token',
                scopes: {
                  'pos.products:read': '商品/部門の参照ができます。',
                  'pos.products:write': '商品/部門の更新ができます。',
                  'pos.customers:read': '会員/ポイントの参照ができます。',
                  'pos.customers:write': '会員/ポイントの更新ができます。',
                  'pos.stock:read': '在庫の参照ができます。',
                  'pos.stock:write': '在庫の更新ができます。',
                  'pos.stock-changes:read': '在庫変動履歴の参照ができます。',
                  'pos.transactions:read': '取引/予算/精算/日次締め情報の参照ができます。',
                  'pos.transactions:write': '取引/予算/精算/日次締め情報の更新ができます。',
                  'pos.suppliers:read': '仕入先の参照ができます。',
                  'pos.suppliers:write': '仕入先の更新ができます。',
                  'pos.stores:read': '店舗の参照ができます。',
                  'pos.stores:write': '店舗の更新ができます。',
                  'pos.staffs:read': 'スタッフの参照ができます。',
                  'pos.staffs:write': 'スタッフの更新ができます。'
                }
              }
            }
          }
        }
      },
      tags: [
        { name: '部門', description: '部門に関する操作' },
        { name: '商品', description: '商品に関する操作' },
        { name: '取引', description: '取引に関する操作' },
        { name: '在庫', description: '在庫に関する操作' },
        { name: '店舗', description: '店舗に関する操作' },
        { name: 'スタッフ', description: 'スタッフに関する操作' },
        { name: '会員', description: '会員に関する操作' },
        { name: 'セール', description: 'セール情報に関する操作' },
        { name: '仕入先', description: '仕入先に関する操作' },
        { name: '発注', description: '発注に関する操作' },
        { name: '入出庫', description: '入庫・出庫に関する操作' },
        { name: '棚卸', description: '棚卸に関する操作' },
        { name: '支払方法', description: '支払方法に関する操作' },
        { name: 'オプショングループ', description: 'オプショングループに関する操作' },
        { name: 'バンドル販売', description: 'バンドル販売に関する操作' },
        { name: 'クーポン', description: 'クーポンに関する操作' }
      ]
    };
    
    // YAML形式で保存
    const yamlModule = await import('js-yaml');
    const yaml = yamlModule.default;
    const openapiYaml = yaml.dump(openapi, { lineWidth: -1 });
    await fs.writeFile(path.join(this.outputDir, 'openapi.yaml'), openapiYaml, 'utf8');
    
    console.log('Main OpenAPI file generated successfully');
  }

  /**
   * ディレクトリを削除（再帰的）
   */
  async removeDirectory(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        await this.removeDirectory(fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    }
    
    await fs.rmdir(dirPath);
  }
}

export default OpenApiGenerator;
