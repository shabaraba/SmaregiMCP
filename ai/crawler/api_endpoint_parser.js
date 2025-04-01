const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

/**
 * APIエンドポイントの詳細情報を解析するクラス
 */
class ApiEndpointParser {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.page = null;
  }

  /**
   * ブラウザを初期化
   */
  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    console.log('Browser initialized for endpoint parser');
  }

  /**
   * ブラウザを閉じる
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed for endpoint parser');
    }
  }

  /**
   * 特定のAPIエンドポイントの詳細情報を解析
   */
  async parseEndpointDetails(endpoint) {
    if (!this.page) {
      await this.initialize();
    }

    await this.page.goto(endpoint.url);
    console.log(`Parsing endpoint details: ${endpoint.name}`);

    // 各オペレーションブロックを取得
    const operationIds = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.opblock')).map(op => {
        const id = op.id;
        return id;
      });
    });

    const operationDetails = [];

    for (const opId of operationIds) {
      // オペレーションブロックを開く
      try {
        await this.page.click(`#${opId} .opblock-summary`);
        await this.page.waitForSelector(`#${opId} .opblock-body`, { state: 'visible', timeout: 5000 });
      } catch (e) {
        console.log(`Could not expand operation ${opId}: ${e.message}`);
        continue;
      }

      // オペレーションの詳細情報を取得
      const details = await this.page.evaluate((operationId) => {
        const opBlock = document.getElementById(operationId);
        if (!opBlock) return null;

        // HTTP メソッドとパス
        const methodEl = opBlock.querySelector('.opblock-summary-method');
        const pathEl = opBlock.querySelector('.opblock-summary-path');
        
        const method = methodEl ? methodEl.textContent.trim() : '';
        const path = pathEl ? pathEl.getAttribute('data-path') : '';

        // 概要
        const summaryEl = opBlock.querySelector('.opblock-summary-description');
        const summary = summaryEl ? summaryEl.textContent.trim() : '';

        // 説明
        const descriptionEl = opBlock.querySelector('.opblock-description');
        const description = descriptionEl ? descriptionEl.textContent.trim() : '';

        // パラメータ
        const parameters = Array.from(opBlock.querySelectorAll('.parameters-container .parameters .parameter__name')).map(param => {
          const nameEl = param.querySelector('.parameter__name');
          const name = nameEl ? nameEl.textContent.replace('*', '').trim() : '';
          
          const typeEl = param.closest('.parameter').querySelector('.parameter__type');
          const type = typeEl ? typeEl.textContent.trim() : '';
          
          const descEl = param.closest('.parameter').querySelector('.parameter__description');
          const desc = descEl ? descEl.textContent.trim() : '';
          
          const requiredEl = param.querySelector('.parameter__required');
          const required = requiredEl ? true : false;
          
          return { name, type, description: desc, required };
        });

        // リクエストボディ
        let requestBody = null;
        const requestBodyEl = opBlock.querySelector('.opblock-body .body-param');
        if (requestBodyEl) {
          const exampleEl = opBlock.querySelector('.opblock-body .body-param-content');
          const example = exampleEl ? exampleEl.textContent.trim() : '';
          try {
            requestBody = example ? JSON.parse(example) : null;
          } catch (e) {
            requestBody = example;
          }
        }

        // レスポンス
        const responses = {};
        const responseBlocks = opBlock.querySelectorAll('.responses-table .response');
        
        responseBlocks.forEach(responseBlock => {
          const codeEl = responseBlock.querySelector('.response-col_status');
          if (!codeEl) return;
          
          const code = codeEl.textContent.trim();
          const descEl = responseBlock.querySelector('.response-col_description');
          const desc = descEl ? descEl.textContent.trim() : '';
          
          responses[code] = { description: desc };
          
          // レスポンスの例
          const exampleEl = responseBlock.querySelector('.highlight-code');
          if (exampleEl) {
            const example = exampleEl.textContent.trim();
            try {
              responses[code].example = example ? JSON.parse(example) : null;
            } catch (e) {
              responses[code].example = example;
            }
          }
        });

        return {
          method,
          path,
          summary,
          description,
          parameters,
          requestBody,
          responses
        };
      }, opId);

      if (details) {
        operationDetails.push(details);
      }

      // オペレーションブロックを閉じる
      try {
        await this.page.click(`#${opId} .opblock-summary`);
      } catch (e) {
        console.log(`Could not collapse operation ${opId}: ${e.message}`);
      }
    }

    return {
      ...endpoint,
      operations: operationDetails
    };
  }

  /**
   * エンドポイントの詳細情報をOpenAPIスキーマに変換
   */
  convertToOpenApiPaths(endpoint) {
    const paths = {};

    endpoint.operations.forEach(op => {
      if (!op.path) return;
      
      if (!paths[op.path]) {
        paths[op.path] = {};
      }
      
      const method = op.method.toLowerCase();
      const pathItem = {
        tags: [endpoint.name],
        summary: op.summary,
        description: op.description || '',
        operationId: `${method}${op.path.replace(/\W+/g, '_')}`,
        parameters: this.convertParameters(op.parameters),
        responses: this.convertResponses(op.responses)
      };
      
      // リクエストボディがあれば追加
      if (op.requestBody) {
        pathItem.requestBody = this.convertRequestBody(op.requestBody);
      }
      
      paths[op.path][method] = pathItem;
    });

    return paths;
  }

  /**
   * パラメータをOpenAPI形式に変換
   */
  convertParameters(parameters) {
    if (!parameters || !parameters.length) return [];
    
    return parameters.map(param => {
      const openApiParam = {
        name: param.name,
        in: this.determineParameterLocation(param.name),
        description: param.description || '',
        required: param.required,
        schema: {
          type: this.determineParameterType(param.type)
        }
      };
      
      return openApiParam;
    });
  }

  /**
   * パラメータの場所（path, query, header, cookie）を判定
   */
  determineParameterLocation(paramName) {
    // 単純な判定ロジック（実際には文脈に応じて判定が必要）
    if (paramName.includes('id')) {
      return 'path';
    } else {
      return 'query';
    }
  }

  /**
   * パラメータのデータ型を判定
   */
  determineParameterType(typeString) {
    if (!typeString) return 'string';
    
    const lowerType = typeString.toLowerCase();
    
    if (lowerType.includes('int') || lowerType.includes('number')) {
      return 'integer';
    } else if (lowerType.includes('float') || lowerType.includes('double')) {
      return 'number';
    } else if (lowerType.includes('bool')) {
      return 'boolean';
    } else if (lowerType.includes('array')) {
      return 'array';
    } else if (lowerType.includes('object')) {
      return 'object';
    } else {
      return 'string';
    }
  }

  /**
   * リクエストボディをOpenAPI形式に変換
   */
  convertRequestBody(requestBody) {
    if (!requestBody) return null;
    
    return {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: requestBody
          }
        }
      },
      required: true
    };
  }

  /**
   * レスポンスをOpenAPI形式に変換
   */
  convertResponses(responses) {
    if (!responses || Object.keys(responses).length === 0) {
      // デフォルトのレスポンス
      return {
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
        }
      };
    }
    
    const openApiResponses = {};
    
    for (const [code, response] of Object.entries(responses)) {
      openApiResponses[code] = {
        description: response.description || '成功',
        content: {}
      };
      
      if (response.example) {
        openApiResponses[code].content['application/json'] = {
          schema: {
            type: 'object',
            example: response.example
          }
        };
      } else {
        openApiResponses[code].content['application/json'] = {
          schema: {
            type: 'object'
          }
        };
      }
    }
    
    return openApiResponses;
  }

  /**
   * OpenAPIの部分的なパスオブジェクトをYAMLファイルに保存
   */
  async savePathsToFile(paths, outputDir, endpointName) {
    const yaml = require('js-yaml');
    
    // ディレクトリが存在しない場合は作成
    await fs.mkdir(outputDir, { recursive: true });
    
    const fileName = endpointName.toLowerCase().replace(/\s+/g, '_') + '.yaml';
    const filePath = path.join(outputDir, fileName);
    
    const pathsYaml = yaml.dump(paths, { lineWidth: -1 });
    await fs.writeFile(filePath, pathsYaml, 'utf8');
    
    console.log(`Saved paths for ${endpointName} to ${filePath}`);
    
    return fileName;
  }

  /**
   * メイン処理を実行
   */
  async run(endpoints, outputDir) {
    try {
      await this.initialize();
      
      const pathIndexes = {};
      
      for (const endpoint of endpoints) {
        const detailedEndpoint = await this.parseEndpointDetails(endpoint);
        const paths = this.convertToOpenApiPaths(detailedEndpoint);
        
        // タグに基づいたディレクトリ名を作成
        const tagDir = endpoint.name.toLowerCase().replace(/\s+/g, '_');
        const tagOutputDir = path.join(outputDir, tagDir);
        
        // パスごとに個別のファイルを作成
        for (const [pathUrl, pathObj] of Object.entries(paths)) {
          const pathFileName = pathUrl.replace(/\//g, '_').replace(/[{}]/g, '_').replace(/^_/, '') + '.yaml';
          const pathFilePath = path.join(tagOutputDir, pathFileName);
          
          await fs.mkdir(tagOutputDir, { recursive: true });
          
          const pathYaml = yaml.dump(pathObj, { lineWidth: -1 });
          await fs.writeFile(pathFilePath, pathYaml, 'utf8');
          
          // インデックスに追加
          if (!pathIndexes[tagDir]) {
            pathIndexes[tagDir] = {};
          }
          
          pathIndexes[tagDir][pathUrl] = `./paths/${tagDir}/${pathFileName}`;
        }
      }
      
      // インデックスファイルを作成
      const indexYaml = yaml.dump(pathIndexes, { lineWidth: -1 });
      await fs.writeFile(path.join(outputDir, '_index.yaml'), indexYaml, 'utf8');
      
      await this.close();
    } catch (error) {
      console.error('Error running API endpoint parser:', error);
      await this.close();
    }
  }
}

module.exports = ApiEndpointParser;

// 直接実行する場合
if (require.main === module) {
  const ApiCrawler = require('./api_crawler');
  
  async function main() {
    const crawler = new ApiCrawler('https://www1.smaregi.dev/apidoc/');
    await crawler.initialize();
    const endpoints = await crawler.crawlIndexPage();
    await crawler.close();
    
    const parser = new ApiEndpointParser('https://www1.smaregi.dev/apidoc/');
    await parser.run(endpoints, path.join(__dirname, '../../paths'));
  }
  
  main().catch(console.error);
}
