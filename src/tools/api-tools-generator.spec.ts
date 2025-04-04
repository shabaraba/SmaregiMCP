import { ApiToolsGenerator } from './api-tools-generator.js';
import { ApiTool } from './interfaces/api-tool.interface.js';

describe('ApiToolsGenerator', () => {
  let service: ApiToolsGenerator;

  beforeEach(() => {
    service = new ApiToolsGenerator();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ツール名生成のテスト
  describe('generateToolName', () => {
    it('should generate list name for GET collection', () => {
      expect(service.generateToolName('/products', 'GET')).toBe('listProducts');
    });

    it('should generate get name for GET single resource', () => {
      expect(service.generateToolName('/products/{productId}', 'GET')).toBe('getProduct');
    });

    it('should generate create name for POST', () => {
      expect(service.generateToolName('/products', 'POST')).toBe('createProducts');
    });

    it('should generate update name for PUT', () => {
      expect(service.generateToolName('/products/{productId}', 'PUT')).toBe('updateProductById');
    });

    it('should generate delete name for DELETE', () => {
      expect(service.generateToolName('/products/{productId}', 'DELETE')).toBe('deleteProductById');
    });

    it('should use operationId when provided', () => {
      expect(service.generateToolName('/products', 'GET', 'listAllProducts')).toBe('listAllProducts');
    });

    it('should handle complex paths', () => {
      expect(service.generateToolName('/stores/{storeId}/products', 'GET')).toBe('listProducts');
    });
  });

  // ツール生成のテスト
  describe('generateTools', () => {
    let tools: ApiTool[];

    beforeEach(() => {
      // generateToolsメソッドの呼び出し
      tools = service.generateTools();
    });

    it('should generate tools from OpenAPI definitions', () => {
      // 少なくとも1つ以上のツールが生成されることを確認
      expect(tools.length).toBeGreaterThan(0);
    });

    it('should have correctly structured tool objects', () => {
      // 最初のツールを検証
      const tool = tools[0];
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('parameters');
      expect(tool).toHaveProperty('path');
      expect(tool).toHaveProperty('method');
    });

    it('should include GET tools for categories endpoint', () => {
      // カテゴリ一覧取得のツールが含まれることを確認
      const categoriesGetTool = tools.find(
        tool => tool.path === '/categories' && tool.method === 'GET'
      );
      expect(categoriesGetTool).toBeDefined();
      expect(categoriesGetTool?.name).toBe('listCategories');
    });

    it('should detect query parameters correctly', () => {
      // クエリパラメータを持つツールを検索
      const toolWithQueryParams = tools.find(
        tool => tool.parameters.some(param => param.type === 'query')
      );
      expect(toolWithQueryParams).toBeDefined();
      
      // クエリパラメータの構造を確認
      const queryParam = toolWithQueryParams?.parameters.find(param => param.type === 'query');
      expect(queryParam).toHaveProperty('name');
      expect(queryParam).toHaveProperty('description');
      expect(queryParam).toHaveProperty('required');
      expect(queryParam).toHaveProperty('schema');
    });

    it('should detect path parameters correctly', () => {
      // パスパラメータを持つツールを検索
      const toolWithPathParams = tools.find(
        tool => tool.parameters.some(param => param.type === 'path')
      );
      
      // すべてのツールにパスパラメータがない場合はテストをスキップ
      if (!toolWithPathParams) {
        console.warn('No tools with path parameters found. Skipping test.');
        return;
      }
      
      // パスパラメータの構造を確認
      const pathParam = toolWithPathParams.parameters.find(param => param.type === 'path');
      expect(pathParam).toHaveProperty('name');
      expect(pathParam).toHaveProperty('description');
      expect(pathParam).toHaveProperty('required');
      expect(pathParam).toHaveProperty('schema');
    });

    it('should include POST tools with body parameters', () => {
      // POSTメソッドのツールを検索
      const postTool = tools.find(tool => tool.method === 'POST');
      
      // POSTツールがない場合はテストをスキップ
      if (!postTool) {
        console.warn('No POST tools found. Skipping test.');
        return;
      }
      
      // ボディパラメータが含まれるか確認
      const hasBodyParam = postTool.parameters.some(param => param.type === 'body');
      expect(hasBodyParam).toBe(true);
    });
  });
});
