import { AuthService } from '../src/auth/auth.service.js';
import { OpenIdAuthService } from '../src/auth/openid-auth.service.js';

// Mock OpenIdAuthService
jest.mock('../src/auth/openid-auth.service.js', () => {
  return {
    OpenIdAuthService: jest.fn().mockImplementation(() => ({
      getAuthorizationUrl: jest.fn().mockResolvedValue({ url: 'mock_url', sessionId: 'mock_session_id' }),
      handleCallback: jest.fn().mockResolvedValue('mock_session_id'),
      refreshToken: jest.fn().mockResolvedValue({
        access_token: 'mock_refreshed_token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock_refreshed_refresh_token',
        scope: 'mock_scope',
      }),
      checkAuthStatus: jest.fn().mockResolvedValue({ isAuthenticated: true, sessionId: 'mock_session_id' }),
      getAccessToken: jest.fn().mockResolvedValue('mock_access_token'),
      revokeToken: jest.fn().mockResolvedValue(true),
    })),
  };
});

describe('AuthService', () => {
  let authService: AuthService;
  let mockOpenIdAuthService: jest.Mocked<OpenIdAuthService>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    // Get the mocked instance
    mockOpenIdAuthService = (authService as any).openIdAuthService;
  });
  
  test('getAuthorizationUrl should delegate to OpenIdAuthService', async () => {
    const result = await authService.getAuthorizationUrl(['scope1', 'scope2']);
    
    expect(mockOpenIdAuthService.getAuthorizationUrl).toHaveBeenCalledWith(['scope1', 'scope2']);
    expect(result).toEqual({ url: 'mock_url', sessionId: 'mock_session_id' });
  });
  
  test('handleCallback should delegate to OpenIdAuthService', async () => {
    const result = await authService.handleCallback('code', 'state');
    
    expect(mockOpenIdAuthService.handleCallback).toHaveBeenCalledWith('code', 'state');
    expect(result).toBe('mock_session_id');
  });
  
  test('refreshToken should delegate to OpenIdAuthService', async () => {
    const result = await authService.refreshToken('session_id');
    
    expect(mockOpenIdAuthService.refreshToken).toHaveBeenCalledWith('session_id');
    expect(result).toEqual({
      access_token: 'mock_refreshed_token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock_refreshed_refresh_token',
      scope: 'mock_scope',
    });
  });
  
  test('checkAuthStatus should delegate to OpenIdAuthService', async () => {
    const result = await authService.checkAuthStatus('session_id');
    
    expect(mockOpenIdAuthService.checkAuthStatus).toHaveBeenCalledWith('session_id');
    expect(result).toEqual({ isAuthenticated: true, sessionId: 'mock_session_id' });
  });
  
  test('getAccessToken should delegate to OpenIdAuthService', async () => {
    const result = await authService.getAccessToken('session_id');
    
    expect(mockOpenIdAuthService.getAccessToken).toHaveBeenCalledWith('session_id');
    expect(result).toBe('mock_access_token');
  });
  
  test('revokeToken should delegate to OpenIdAuthService', async () => {
    const result = await authService.revokeToken('session_id');
    
    expect(mockOpenIdAuthService.revokeToken).toHaveBeenCalledWith('session_id');
    expect(result).toBe(true);
  });
});
