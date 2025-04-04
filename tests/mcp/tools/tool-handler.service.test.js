import { ToolHandlerService } from '../../../src/mcp/tools/tool-handler.service.js';
import { ApiService } from '../../../src/api/api.service.js';
import { AuthService } from '../../../src/auth/auth.service.js';

// モックのセットアップ
jest.mock('../../../src/api/api.service.js');
jest.mock('../../../src/auth/auth.service.js');
jest.mock('fs');
jest.mock('js-yaml');

describe('ToolHandlerService', () => {
  let toolHandlerService;
  let mockApiService;
  let mockAuthService;

  beforeEach(() => {
    // モックのクリア
    jest.clearAllMocks();

    // モックサービスのセットアップ
    mockApiService = new ApiService();
    mockAuthService = new AuthService();

    // テスト対象サービスの作成
    toolHandlerService = new ToolHandlerService(mockAuthService, mockApiService);
  });

  describe('handleExecuteApiRequest', () => {
    it('基本的なAPIリクエストを正常に処理できること', async () => {
      // モックの設定
      const mockResult = { data: 'test data' };
      mockApiService.executeRequest.mockResolvedValue(mockResult);

      // テスト対象メソッドを呼び出し
      const result = await toolHandlerService.handleExecuteApiRequest({
        sessionId: 'test-session',
        endpoint: '/test-endpoint',
        method: 'GET',
        data: { test: 'data' }
      });

      // 検証
      expect(mockApiService.executeRequest).toHaveBeenCalledWith({
        sessionId: 'test-session',
        endpoint: '/test-endpoint',
        method: 'GET',
        data: { test: 'data' }
      });

      expect(result).toEqual({
        content: [{ type: 'text', text: JSON.stringify(mockResult, null, 2) }],
        metadata: {}
      });
    });

    it('パスパラメータを正しく処理できること', async () => {
      // モックの設定
      const mockResult = { data: 'test data with path params' };
      mockApiService.executeRequest.mockResolvedValue(mockResult);

      // テスト対象メソッドを呼び出し
      const result = await toolHandlerService.handleExecuteApiRequest({
        sessionId: 'test-session',
        endpoint: '/products/{productId}',
        method: 'GET',
        path: { productId: '123' }
      });

      // 検証
      expect(mockApiService.executeRequest).toHaveBeenCalledWith({
        sessionId: 'test-session',
        endpoint: '/products/{productId}',
        method: 'GET',
        path: { productId: '123' }
      });

      expect(result).toEqual({
        content: [{ type: 'text', text: JSON.stringify(mockResult, null, 2) }],
        metadata: {}
      });
    });

    it('クエリパラメータを正しく処理できること', async () => {
      // モックの設定
      const mockResult = { data: 'test data with query params' };
      mockApiService.executeRequest.mockResolvedValue(mockResult);

      // テスト対象メソッドを呼び出し
      const result = await toolHandlerService.handleExecuteApiRequest({
        sessionId: 'test-session',
        endpoint: '/products',
        method: 'GET',
        query: { limit: 10, offset: 20 }
      });

      // 検証
      expect(mockApiService.executeRequest).toHaveBeenCalledWith({
        sessionId: 'test-session',
        endpoint: '/products',
        method: 'GET',
        query: { limit: 10, offset: 20 }
      });

      expect(result).toEqual({
        content: [{ type: 'text', text: JSON.stringify(mockResult, null, 2) }],
        metadata: {}
      });
    });

    it('パスパラメータとクエリパラメータを組み合わせて処理できること', async () => {
      // モックの設定
      const mockResult = { data: 'test data with path and query params' };
      mockApiService.executeRequest.mockResolvedValue(mockResult);

      // テスト対象メソッドを呼び出し
      const result = await toolHandlerService.handleExecuteApiRequest({
        sessionId: 'test-session',
        endpoint: '/products/{productId}/variants',
        method: 'GET',
        path: { productId: '123' },
        query: { active: true }
      });

      // 検証
      expect(mockApiService.executeRequest).toHaveBeenCalledWith({
        sessionId: 'test-session',
        endpoint: '/products/{productId}/variants',
        method: 'GET',
        path: { productId: '123' },
        query: { active: true }
      });

      expect(result).toEqual({
        content: [{ type: 'text', text: JSON.stringify(mockResult, null, 2) }],
        metadata: {}
      });
    });

    it('必須パラメータが不足している場合はエラーをスローすること', async () => {
      // テスト対象メソッドを呼び出し＆検証
      await expect(toolHandlerService.handleExecuteApiRequest({
        // sessionIdを省略
        endpoint: '/test-endpoint',
        method: 'GET'
      })).rejects.toThrow('sessionId, endpoint, methodは必須です');

      await expect(toolHandlerService.handleExecuteApiRequest({
        sessionId: 'test-session',
        // endpointを省略
        method: 'GET'
      })).rejects.toThrow('sessionId, endpoint, methodは必須です');

      await expect(toolHandlerService.handleExecuteApiRequest({
        sessionId: 'test-session',
        endpoint: '/test-endpoint'
        // methodを省略
      })).rejects.toThrow('sessionId, endpoint, methodは必須です');
    });
  });
});
