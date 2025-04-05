import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerResources } from './resources';
import { registerTools } from './tools';
import { registerPrompts } from './prompts';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { SchemaConverter } from '../conversion/schema-converter';
import { ApiToolGenerator } from '../conversion/tool-generator';

// Mock dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('../api/api.service');
jest.mock('../auth/auth.service');
jest.mock('../conversion/schema-converter');
jest.mock('../conversion/tool-generator');

describe('MCP Server Implementation', () => {
  let mockMcpServer: any;
  let mockApiService: any;
  let mockAuthService: any;
  let mockSchemaConverter: any;
  let mockApiToolGenerator: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock implementations
    mockMcpServer = {
      resource: jest.fn(),
      tool: jest.fn(),
      prompt: jest.fn(),
      server: {
        setRequestHandler: jest.fn(),
      },
    };

    mockApiService = {
      getApiCategoryOverview: jest.fn().mockReturnValue('API category overview'),
      getApiPaths: jest.fn().mockReturnValue([
        { name: 'products', description: 'Products API', method: 'GET', path: '/pos/products' },
      ]),
      getApiPathDetails: jest.fn().mockReturnValue({
        name: 'products',
        description: 'Products API',
        method: 'GET',
        path: '/pos/products',
        parameters: [],
        responses: {},
      }),
      getApiOverview: jest.fn().mockReturnValue('API overview'),
      executeRequest: jest.fn().mockResolvedValue({ success: true }),
    };

    mockAuthService = {
      getAuthorizationUrl: jest.fn().mockResolvedValue({ url: 'https://auth.url', sessionId: '12345' }),
      checkAuthStatus: jest.fn().mockResolvedValue({ isAuthenticated: true }),
    };

    mockSchemaConverter = {};

    mockApiToolGenerator = {
      generateTools: jest.fn().mockReturnValue([
        {
          name: 'testTool',
          description: 'Test tool',
          method: 'GET',
          path: '/test',
          parameters: [
            { name: 'param1', description: 'Parameter 1', type: 'query', required: true },
          ],
        },
      ]),
    };

    // Mock constructor
    (McpServer as jest.Mock).mockImplementation(() => mockMcpServer);
    (ApiService as jest.Mock).mockImplementation(() => mockApiService);
    (AuthService as jest.Mock).mockImplementation(() => mockAuthService);
    (SchemaConverter as jest.Mock).mockImplementation(() => mockSchemaConverter);
    (ApiToolGenerator as jest.Mock).mockImplementation(() => mockApiToolGenerator);
  });

  describe('Resources Registration', () => {
    it('should register API category resource template', async () => {
      await registerResources(mockMcpServer, mockApiService, mockSchemaConverter);
      
      // Verify resource template registration
      expect(mockMcpServer.resource).toHaveBeenCalledWith(
        'api-category',
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register API path resource template', async () => {
      await registerResources(mockMcpServer, mockApiService, mockSchemaConverter);
      
      // Verify resource template registration
      expect(mockMcpServer.resource).toHaveBeenCalledWith(
        'api-path',
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register document resources', async () => {
      await registerResources(mockMcpServer, mockApiService, mockSchemaConverter);
      
      // Verify document resources registration
      expect(mockMcpServer.resource).toHaveBeenCalledWith(
        'readme',
        'smaregi://docs/readme',
        expect.any(Function)
      );
      
      expect(mockMcpServer.resource).toHaveBeenCalledWith(
        'api-overview',
        'smaregi://docs/api-overview',
        expect.any(Function)
      );
      
      expect(mockMcpServer.resource).toHaveBeenCalledWith(
        'auth-guide',
        'smaregi://docs/authentication',
        expect.any(Function)
      );
    });
  });

  describe('Tools Registration', () => {
    it('should register authentication tools', async () => {
      await registerTools(mockMcpServer, mockAuthService, mockApiService, mockApiToolGenerator);
      
      // Verify auth tools registration
      expect(mockMcpServer.tool).toHaveBeenCalledWith(
        'getAuthorizationUrl',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
      
      expect(mockMcpServer.tool).toHaveBeenCalledWith(
        'checkAuthStatus',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register API request tools', async () => {
      await registerTools(mockMcpServer, mockAuthService, mockApiService, mockApiToolGenerator);
      
      // Verify API request tools registration
      expect(mockMcpServer.tool).toHaveBeenCalledWith(
        'executeApiRequest',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register generated API tools', async () => {
      await registerTools(mockMcpServer, mockAuthService, mockApiService, mockApiToolGenerator);
      
      // Verify API tools generation
      expect(mockApiToolGenerator.generateTools).toHaveBeenCalled();
      
      // Verify tool registration (for each generated tool)
      const generatedTools = mockApiToolGenerator.generateTools();
      expect(mockMcpServer.tool).toHaveBeenCalledTimes(expect.any(Number));
      
      generatedTools.forEach(tool => {
        expect(mockMcpServer.tool).toHaveBeenCalledWith(
          tool.name,
          expect.any(String),
          expect.any(Object),
          expect.any(Function)
        );
      });
    });
  });

  describe('Prompts Registration', () => {
    it('should register product search prompt', async () => {
      await registerPrompts(mockMcpServer);
      
      // Verify prompt registration
      expect(mockMcpServer.prompt).toHaveBeenCalledWith(
        'search-products',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register sales analysis prompt', async () => {
      await registerPrompts(mockMcpServer);
      
      // Verify prompt registration
      expect(mockMcpServer.prompt).toHaveBeenCalledWith(
        'analyze-sales',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register inventory management prompt', async () => {
      await registerPrompts(mockMcpServer);
      
      // Verify prompt registration
      expect(mockMcpServer.prompt).toHaveBeenCalledWith(
        'manage-inventory',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should register customer analysis prompt', async () => {
      await registerPrompts(mockMcpServer);
      
      // Verify prompt registration
      expect(mockMcpServer.prompt).toHaveBeenCalledWith(
        'analyze-customers',
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
    });
  });
});
