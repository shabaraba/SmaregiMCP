import { ZodApiToolGenerator } from './zod-api-tool-generator.js';

// EndpointByMethodのモックデータ
jest.mock('../../schema/zod/pos.zod.js', () => {
  return {
    EndpointByMethod: {
      get: {
        '/categories': {
          method: 'GET',
          path: '/categories',
          requestFormat: 'json',
          parameters: {
            query: {
              shape: {
                fields: { _def: { typeName: 'ZodOptional' } },
                sort: { _def: { typeName: 'ZodOptional' } },
                limit: { _def: { typeName: 'ZodOptional' } },
                page: { _def: { typeName: 'ZodOptional' } },
              }
            },
            path: {
              shape: {
                contract_id: {}
              }
            }
          },
          response: {}
        }
      },
      post: {
        '/categories': {
          method: 'POST',
          path: '/categories',
          requestFormat: 'json',
          parameters: {
            body: {
              shape: {
                categoryName: {},
                categoryCode: { _def: { typeName: 'ZodOptional' } }
              }
            },
            path: {
              shape: {
                contract_id: {}
              }
            }
          },
          response: {}
        }
      }
    }
  };
});

describe('ZodApiToolGenerator', () => {
  let generator: ZodApiToolGenerator;
  
  beforeEach(() => {
    generator = new ZodApiToolGenerator();
  });
  
  describe('generateToolsFromZodSchema', () => {
    it('should generate tools from Zod schema', async () => {
      const tools = await generator.generateToolsFromZodSchema();
      
      // 生成されたツール数を確認
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.length).toBe(2); // モックでは2つのエンドポイントを定義
      
      // GETツールの構造を確認
      const getTool = tools.find(tool => tool.method === 'GET');
      expect(getTool).toBeDefined();
      expect(getTool?.name).toBe('pos.listCategories');
      expect(getTool?.path).toBe('/categories');
      
      // POSTツールの構造を確認
      const postTool = tools.find(tool => tool.method === 'POST');
      expect(postTool).toBeDefined();
      expect(postTool?.name).toBe('pos.createCategories');
      expect(postTool?.path).toBe('/categories');
      
      // パラメータの確認
      // セッションIDが含まれているか
      expect(getTool?.parameters.some(p => p.name === 'sessionId')).toBe(true);
      
      // 必須パラメータの確認
      expect(postTool?.parameters.some(p => p.name === 'categoryName' && p.required)).toBe(true);
      
      // オプショナルパラメータの確認
      expect(postTool?.parameters.some(p => p.name === 'categoryCode' && !p.required)).toBe(true);
    });
  });
  
  describe('generateToolName', () => {
    it('should generate proper tool name for GET requests without path params', () => {
      // @ts-ignore - private method access for test
      const toolName = generator.generateToolName('get', '/categories');
      expect(toolName).toBe('pos.listCategories');
    });
    
    it('should generate proper tool name for GET requests with path params', () => {
      // @ts-ignore - private method access for test
      const toolName = generator.generateToolName('get', '/categories/{id}');
      expect(toolName).toBe('pos.getCategories');
    });
    
    it('should generate proper tool name for POST requests', () => {
      // @ts-ignore - private method access for test
      const toolName = generator.generateToolName('post', '/categories');
      expect(toolName).toBe('pos.createCategories');
    });
    
    it('should generate proper tool name for PUT requests', () => {
      // @ts-ignore - private method access for test
      const toolName = generator.generateToolName('put', '/categories/{id}');
      expect(toolName).toBe('pos.updateCategories');
    });
  });
});
