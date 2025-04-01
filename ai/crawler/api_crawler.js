import path from 'path';
import { promises as fs } from 'fs';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

// ESモジュールでの __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * スマレジAPIドキュメントをクロールしてOpenAPI仕様を生成するクラス
 */
class ApiCrawler {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.page = null;
    this.apiEndpoints = [];
  }

  /**
   * ブラウザを初期化
   */
  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    console.log('Browser initialized');
  }

  /**
   * ブラウザを閉じる
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }

  /**
   * APIドキュメントのインデックスページをクロール
   */
  async crawlIndexPage() {
    await this.page.goto(this.baseUrl);
    console.log(`Navigated to ${this.baseUrl}`);

    // APIのエンドポイント一覧を取得
    const endpoints = await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      return links
        .filter(link => link.href && link.href.includes('#tag/'))
        .map(link => {
          const href = link.href;
          const tag = href.split('#tag/')[1];
          return {
            tag,
            url: href,
            name: link.textContent.trim()
          };
        });
    });

    console.log(`Found ${endpoints.length} API endpoint categories`);
    this.apiEndpoints = endpoints;
    
    return endpoints;
  }

  /**
   * 特定のAPIエンドポイントの詳細情報を取得
   */
  async crawlEndpointDetails(endpoint) {
    await this.page.goto(endpoint.url);
    console.log(`Crawling endpoint: ${endpoint.name}`);

    // APIの詳細情報を取得
    const details = await this.page.evaluate(() => {
      const operations = Array.from(document.querySelectorAll('.opblock'));
      
      return operations.map(op => {
        // HTTP Method と Path
        const methodEl = op.querySelector('.opblock-summary-method');
        const pathEl = op.querySelector('.opblock-summary-path');
        
        const method = methodEl ? methodEl.textContent.trim() : '';
        const path = pathEl ? pathEl.getAttribute('data-path') : '';

        // API概要
        const summaryEl = op.querySelector('.opblock-summary-description');
        const summary = summaryEl ? summaryEl.textContent.trim() : '';
        
        // 必要なスコープ
        const scopeEl = op.querySelector('.authorization__btn');
        const scope = scopeEl ? scopeEl.textContent.trim() : '';
        
        return {
          method,
          path,
          summary,
          scope
        };
      });
    });

    return {
      ...endpoint,
      operations: details
    };
  }

  /**
   * すべてのAPIエンドポイントをクロール
   */
  async crawlAllEndpoints() {
    const allEndpointDetails = [];
    
    for (const endpoint of this.apiEndpoints) {
      const details = await this.crawlEndpointDetails(endpoint);
      allEndpointDetails.push(details);
    }
    
    return allEndpointDetails;
  }

  /**
   * OpenAPI仕様に変換
   */
  convertToOpenApi(allEndpoints) {
    // OpenAPIの基本構造
    const openapi = {
      openapi: '3.0.3',
      info: {
        title: 'スマレジ・プラットフォームAPI POS仕様',
        description: 'スマレジ・プラットフォームAPIのPOS機能を利用するためのAPI仕様書です。',
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
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          AppAccessToken: {
            type: 'oauth2',
            description: 'アプリアクセストークン。',
            flows: {
              clientCredentials: {
                tokenUrl: 'https://id.smaregi.dev/app/{contractId}/token',
                refreshUrl: 'https://id.smaregi.dev/app/{contractId}/token',
                scopes: {}
              }
            }
          },
          UserAccessToken: {
            type: 'oauth2',
            description: 'ユーザーアクセストークン。',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://id.smaregi.dev/authorize',
                tokenUrl: 'https://id.smaregi.dev/authorize/token',
                refreshUrl: 'https://id.smaregi.dev/authorize/token',
                scopes: {}
              }
            }
          }
        }
      },
      tags: []
    };

    // タグと各APIエンドポイントを追加
    allEndpoints.forEach(endpoint => {
      // タグを追加
      openapi.tags.push({
        name: endpoint.name,
        description: `${endpoint.name}に関する操作`
      });

      // 各APIエンドポイントのパスを追加
      endpoint.operations.forEach(op => {
        if (!op.path) return;
        
        if (!openapi.paths[op.path]) {
          openapi.paths[op.path] = {};
        }
        
        const method = op.method.toLowerCase();
        openapi.paths[op.path][method] = {
          tags: [endpoint.name],
          summary: op.summary,
          description: '',
          operationId: `${method}${op.path.replace(/\W+/g, '_')}`,
          parameters: [],
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            },
            '400': {
              description: 'Bad Request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Not Found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          },
          security: [
            {
              AppAccessToken: []
            },
            {
              UserAccessToken: []
            }
          ]
        };
      });
    });

    return openapi;
  }

  /**
   * OpenAPI仕様をファイルに保存
   */
  async saveOpenApiSpec(openapi, outputPath) {
    const yaml = await import('js-yaml');
    const outputDir = path.dirname(outputPath);
    
    // ディレクトリが存在しない場合は作成
    await fs.mkdir(outputDir, { recursive: true });
    
    // YAML形式で保存
    const openapiYaml = yaml.dump(openapi, { lineWidth: -1 });
    await fs.writeFile(outputPath, openapiYaml, 'utf8');
    
    console.log(`OpenAPI spec saved to ${outputPath}`);
  }

  /**
   * APIセクションごとにファイルを分割して保存
   */
  async splitAndSaveOpenApiSpec(openapi, baseDir) {
    const yaml = await import('js-yaml');

    // paths と schemas を分割保存
    await this.splitPaths(openapi.paths, path.join(baseDir, 'paths'));
    
    // スキーマを分割保存するメソッドも必要に応じて実装
    
    // メインファイルから分離したパーツを参照
    const mainOpenapi = { ...openapi };
    mainOpenapi.paths = { '$ref': './paths/_index.yaml' };
    mainOpenapi.components.schemas = { '$ref': './schemas/_index.yaml' };
    
    // メインファイルを保存
    const mainOpenapiYaml = yaml.dump(mainOpenapi, { lineWidth: -1 });
    await fs.writeFile(path.join(baseDir, 'openapi.yaml'), mainOpenapiYaml, 'utf8');
    
    console.log(`Split OpenAPI spec saved to ${baseDir}`);
  }

  /**
   * パスをタグごとに分割して保存
   */
  async splitPaths(paths, outputDir) {
    const yamlModule = await import('js-yaml');
    const yaml = yamlModule.default;
    const pathsByTag = {};
    
    // パスをタグごとに整理
    Object.entries(paths).forEach(([pathUrl, pathObj]) => {
      const method = Object.keys(pathObj)[0]; // 最初のHTTPメソッド
      const tags = pathObj[method].tags || ['other'];
      const tag = tags[0].toLowerCase().replace(/\s+/g, '_');
      
      if (!pathsByTag[tag]) {
        pathsByTag[tag] = {};
      }
      
      pathsByTag[tag][pathUrl] = pathObj;
    });
    
    // ディレクトリが存在しない場合は作成
    await fs.mkdir(outputDir, { recursive: true });
    
    // タグごとのファイルを作成
    const indexContent = {};
    
    for (const [tag, tagPaths] of Object.entries(pathsByTag)) {
      const tagDir = path.join(outputDir, tag);
      await fs.mkdir(tagDir, { recursive: true });
      
      for (const [pathUrl, pathObj] of Object.entries(tagPaths)) {
        const fileName = pathUrl.replace(/\//g, '_').replace(/[{}]/g, '_').replace(/^_/, '') + '.yaml';
        const filePath = path.join(tagDir, fileName);
        
        const pathYaml = yaml.dump(pathObj, { lineWidth: -1 });
        await fs.writeFile(filePath, pathYaml, 'utf8');
        
        // インデックスファイルに追加
        if (!indexContent[tag]) {
          indexContent[tag] = {};
        }
        
        indexContent[tag][pathUrl] = `./paths/${tag}/${fileName}`;
      }
    }
    
    // インデックスファイルを作成
    const indexYaml = yaml.dump(indexContent, { lineWidth: -1 });
    await fs.writeFile(path.join(outputDir, '_index.yaml'), indexYaml, 'utf8');
  }

  /**
   * メイン処理を実行
   */
  async run() {
    try {
      await this.initialize();
      const endpoints = await this.crawlIndexPage();
      const allEndpointDetails = await this.crawlAllEndpoints();
      
      const openapi = this.convertToOpenApi(allEndpointDetails);
      
      // 一つのファイルに保存
      await this.saveOpenApiSpec(openapi, './openapi.yaml');
      
      // ファイルを分割して保存
      await this.splitAndSaveOpenApiSpec(openapi, '.');
      
      await this.close();
    } catch (error) {
      console.error('Error running API crawler:', error);
      await this.close();
    }
  }
}

export default ApiCrawler;
