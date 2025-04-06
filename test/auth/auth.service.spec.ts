import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { AuthService } from './auth.service';
import { TokenManager } from './token-manager';
import { SessionManager } from './session-manager';
import axios from 'axios';
import { config } from '../utils/config';

// モックの型定義
type MockedClass<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? Mock<any, any>
    : T[K];
};

// TokenManagerとSessionManagerをモック化
vi.mock('./token-manager', () => {
  return {
    TokenManager: vi.fn().mockImplementation(() => ({
      saveToken: vi.fn(),
      getToken: vi.fn(),
      deleteToken: vi.fn(),
      isTokenExpired: vi.fn(),
      isTokenNearExpiry: vi.fn(),
    })),
  };
});

vi.mock('./session-manager', () => {
  return {
    SessionManager: vi.fn().mockImplementation(() => ({
      createSession: vi.fn(),
      getSession: vi.fn(),
      getSessionByState: vi.fn(),
      updateSessionAuthStatus: vi.fn(),
      deleteSession: vi.fn(),
      cleanupExpiredSessions: vi.fn(),
    })),
  };
});

// axiosをモック化
vi.mock('axios');

describe('AuthService', () => {
  let authService: AuthService;
  let mockTokenManager: MockedClass<TokenManager>;
  let mockSessionManager: MockedClass<SessionManager>;
  const originalConfig = { ...config };

  beforeEach(() => {
    // 設定をモックデータで上書き
    Object.assign(config, {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      contractId: 'test-contract-id',
      smaregiAuthUrl: 'https://test-auth.example.com',
      smaregiTokenEndpoint: 'https://test-token.example.com',
      redirectUri: 'https://test-redirect.example.com/callback',
    });

    // モックをリセット
    vi.clearAllMocks();

    // AuthServiceのインスタンスを作成
    authService = new AuthService();
    
    // モックを取得
    mockTokenManager = (authService as any).tokenManager;
    mockSessionManager = (authService as any).sessionManager;
  });

  afterEach(() => {
    // 設定を元に戻す
    Object.assign(config, originalConfig);
  });

  describe('getAuthorizationUrl', () => {
    it('正しくauthorization URLを生成する', async () => {
      // createSessionのモック
      const mockSession = {
        id: 'test-session-id',
        state: 'test-state',
        code_challenge: 'test-code-challenge',
        redirect_uri: 'https://test-redirect.example.com/callback',
      };
      mockSessionManager.createSession.mockResolvedValue(mockSession);

      // 実行
      const result = await authService.getAuthorizationUrl(['scope1', 'scope2']);

      // 検証
      expect(mockSessionManager.createSession).toHaveBeenCalledWith(['scope1', 'scope2']);
      expect(result).toEqual({
        url: expect.stringContaining('https://test-auth.example.com'),
        sessionId: 'test-session-id',
      });
      expect(result.url).toContain('response_type=code');
      expect(result.url).toContain('client_id=test-client-id');
      expect(result.url).toContain('scope=scope1%20scope2');
      expect(result.url).toContain('state=test-state');
      expect(result.url).toContain('code_challenge=test-code-challenge');
    });

    it('client IDがない場合はエラーを投げる', async () => {
      Object.assign(config, { clientId: '' });
      await expect(authService.getAuthorizationUrl(['scope1'])).rejects.toThrow('Missing client ID');
    });
  });

  describe('handleCallback', () => {
    it('コールバックを正しく処理し、セッションIDを返す', async () => {
      // モックの設定
      const mockSession = {
        id: 'test-session-id',
        verifier: 'test-verifier',
        redirect_uri: 'https://test-redirect.example.com/callback',
      };
      mockSessionManager.getSessionByState.mockResolvedValue(mockSession);

      const mockTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        scope: 'scope1 scope2',
      };
      (axios.post as Mock).mockResolvedValue({ data: mockTokenResponse });

      // 実行
      const result = await authService.handleCallback('test-code', 'test-state');

      // 検証
      expect(mockSessionManager.getSessionByState).toHaveBeenCalledWith('test-state');
      expect(axios.post).toHaveBeenCalledWith(
        'https://test-token.example.com',
        expect.stringContaining('code=test-code'),
        expect.any(Object)
      );
      expect(mockTokenManager.saveToken).toHaveBeenCalledWith(
        'test-session-id',
        mockTokenResponse,
        'test-contract-id'
      );
      expect(mockSessionManager.updateSessionAuthStatus).toHaveBeenCalledWith(
        'test-session-id',
        true
      );
      expect(result).toBe('test-session-id');
    });

    it('セッションが見つからない場合はエラーを投げる', async () => {
      mockSessionManager.getSessionByState.mockResolvedValue(null);
      await expect(authService.handleCallback('test-code', 'test-state')).rejects.toThrow('Invalid state parameter');
    });

    it('トークン交換に失敗した場合はエラーを投げる', async () => {
      // モックの設定
      mockSessionManager.getSessionByState.mockResolvedValue({
        id: 'test-session-id',
        verifier: 'test-verifier',
        redirect_uri: 'https://test-redirect.example.com/callback',
      });
      
      (axios.post as Mock).mockRejectedValue(new Error('Token exchange failed'));

      // 実行と検証
      await expect(authService.handleCallback('test-code', 'test-state')).rejects.toThrow('Authentication failed');
    });
  });

  describe('refreshToken', () => {
    it('トークンを正しくリフレッシュする', async () => {
      // モックの設定
      const mockToken = {
        id: 'test-session-id',
        access_token: 'old-access-token',
        refresh_token: 'test-refresh-token',
        contract_id: 'test-contract-id',
      };
      mockTokenManager.getToken.mockResolvedValue(mockToken);

      const mockTokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
        scope: 'scope1 scope2',
      };
      (axios.post as Mock).mockResolvedValue({ data: mockTokenResponse });

      // 実行
      const result = await authService.refreshToken('test-session-id');

      // 検証
      expect(mockTokenManager.getToken).toHaveBeenCalledWith('test-session-id');
      expect(axios.post).toHaveBeenCalledWith(
        'https://test-token.example.com',
        expect.stringContaining('refresh_token=test-refresh-token'),
        expect.any(Object)
      );
      expect(mockTokenManager.saveToken).toHaveBeenCalledWith(
        'test-session-id',
        mockTokenResponse,
        'test-contract-id'
      );
      expect(result).toEqual(mockTokenResponse);
    });

    it('リフレッシュトークンがない場合はnullを返す', async () => {
      mockTokenManager.getToken.mockResolvedValue({
        id: 'test-session-id',
        access_token: 'test-access-token',
        refresh_token: null,
      });

      const result = await authService.refreshToken('test-session-id');
      expect(result).toBeNull();
    });
  });

  describe('checkAuthStatus', () => {
    it('認証済みの有効なトークンがある場合はtrueを返す', async () => {
      // モックの設定
      mockSessionManager.getSession.mockResolvedValue({
        id: 'test-session-id',
        is_authenticated: true,
      });
      
      mockTokenManager.getToken.mockResolvedValue({
        id: 'test-session-id',
        access_token: 'test-access-token',
      });
      
      mockTokenManager.isTokenNearExpiry.mockReturnValue(false);

      // 実行
      const result = await authService.checkAuthStatus('test-session-id');

      // 検証
      expect(result).toEqual({
        isAuthenticated: true,
        sessionId: 'test-session-id',
      });
    });

    it('トークンが期限切れでリフレッシュに成功した場合はtrueを返す', async () => {
      // モックの設定
      mockSessionManager.getSession.mockResolvedValue({
        id: 'test-session-id',
        is_authenticated: true,
      });
      
      mockTokenManager.getToken.mockResolvedValue({
        id: 'test-session-id',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      });
      
      mockTokenManager.isTokenNearExpiry.mockReturnValue(true);
      
      const mockRefreshToken = vi.spyOn(authService, 'refreshToken');
      mockRefreshToken.mockResolvedValue({
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'scope1 scope2',
      });

      // 実行
      const result = await authService.checkAuthStatus('test-session-id');

      // 検証
      expect(mockRefreshToken).toHaveBeenCalledWith('test-session-id');
      expect(result).toEqual({
        isAuthenticated: true,
        sessionId: 'test-session-id',
      });
    });

    it('トークンが期限切れでリフレッシュに失敗した場合はfalseを返す', async () => {
      // モックの設定
      mockSessionManager.getSession.mockResolvedValue({
        id: 'test-session-id',
        is_authenticated: true,
      });
      
      mockTokenManager.getToken.mockResolvedValue({
        id: 'test-session-id',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      });
      
      mockTokenManager.isTokenNearExpiry.mockReturnValue(true);
      
      const mockRefreshToken = vi.spyOn(authService, 'refreshToken');
      mockRefreshToken.mockResolvedValue(null);

      // 実行
      const result = await authService.checkAuthStatus('test-session-id');

      // 検証
      expect(result).toEqual({
        isAuthenticated: false,
        sessionId: 'test-session-id',
      });
    });

    it('セッションが見つからない場合はfalseを返す', async () => {
      mockSessionManager.getSession.mockResolvedValue(null);

      const result = await authService.checkAuthStatus('test-session-id');
      expect(result).toEqual({
        isAuthenticated: false,
        sessionId: 'test-session-id',
      });
    });
  });

  describe('getAccessToken', () => {
    it('有効なトークンがある場合はアクセストークンを返す', async () => {
      mockTokenManager.getToken.mockResolvedValue({
        id: 'test-session-id',
        access_token: 'test-access-token',
      });
      
      mockTokenManager.isTokenNearExpiry.mockReturnValue(false);

      const result = await authService.getAccessToken('test-session-id');
      expect(result).toBe('test-access-token');
    });

    it('トークンが期限切れでリフレッシュに成功した場合は新しいアクセストークンを返す', async () => {
      // モックの設定
      mockTokenManager.getToken.mockResolvedValueOnce({
        id: 'test-session-id',
        access_token: 'old-access-token',
        refresh_token: 'test-refresh-token',
      }).mockResolvedValueOnce({
        id: 'test-session-id',
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      });
      
      mockTokenManager.isTokenNearExpiry.mockReturnValue(true);
      
      const mockRefreshToken = vi.spyOn(authService, 'refreshToken');
      mockRefreshToken.mockResolvedValue({
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
        scope: 'scope1 scope2',
      });

      // 実行
      const result = await authService.getAccessToken('test-session-id');

      // 検証
      expect(mockRefreshToken).toHaveBeenCalledWith('test-session-id');
      expect(result).toBe('new-access-token');
    });

    it('トークンが見つからない場合はnullを返す', async () => {
      mockTokenManager.getToken.mockResolvedValue(null);

      const result = await authService.getAccessToken('test-session-id');
      expect(result).toBeNull();
    });
  });

  describe('revokeToken', () => {
    it('トークンとセッションを正しく削除する', async () => {
      mockTokenManager.deleteToken.mockResolvedValue(undefined);
      mockSessionManager.deleteSession.mockResolvedValue(undefined);

      const result = await authService.revokeToken('test-session-id');
      
      expect(mockTokenManager.deleteToken).toHaveBeenCalledWith('test-session-id');
      expect(mockSessionManager.deleteSession).toHaveBeenCalledWith('test-session-id');
      expect(result).toBe(true);
    });

    it('削除中にエラーが発生した場合はfalseを返す', async () => {
      mockTokenManager.deleteToken.mockRejectedValue(new Error('Delete failed'));

      const result = await authService.revokeToken('test-session-id');
      expect(result).toBe(false);
    });
  });
});
