import { OpenIdAuthService } from '../src/auth/openid-auth.service.js';
import { Client } from 'openid-client';
import * as fs from 'fs';
import * as path from 'path';

// Mock openid-client
jest.mock('openid-client', () => {
  const actualOpenidClient = jest.requireActual('openid-client');
  
  return {
    ...actualOpenidClient,
    Issuer: jest.fn().mockImplementation(() => ({
      Client: jest.fn().mockImplementation(() => ({
        authorizationUrl: jest.fn().mockReturnValue('https://mocked-auth-url.com'),
        callback: jest.fn().mockResolvedValue({
          access_token: 'mocked_access_token',
          token_type: 'Bearer',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          scope: 'test_scope',
          refresh_token: 'mocked_refresh_token',
        }),
        refresh: jest.fn().mockResolvedValue({
          access_token: 'mocked_refreshed_token',
          token_type: 'Bearer',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          scope: 'test_scope',
          refresh_token: 'mocked_refreshed_refresh_token',
        }),
      })),
    })),
    generators: {
      codeVerifier: jest.fn().mockReturnValue('test_verifier'),
      codeChallenge: jest.fn().mockReturnValue('test_challenge'),
      state: jest.fn().mockReturnValue('test_state'),
    },
  };
});

// Mock database connection
jest.mock('sqlite3', () => {
  const dbMock = {
    run: jest.fn((sql, params, callback) => {
      if (callback) callback(null, { changes: 1 });
    }),
    all: jest.fn((sql, params, callback) => {
      if (callback) callback(null, []);
    }),
    get: jest.fn((sql, params, callback) => {
      // Simulate different behavior based on the query
      if (sql.includes('WHERE state = ?')) {
        if (params[0] === 'test_state') {
          callback(null, {
            id: 'test_session_id',
            scopes: JSON.stringify(['scope1', 'scope2']),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            redirect_uri: 'http://localhost:3000/callback',
            verifier: 'test_verifier',
            code_challenge: 'test_challenge',
            state: 'test_state',
            is_authenticated: 0,
          });
        } else {
          callback(null, null);
        }
      } else if (sql.includes('WHERE id = ?')) {
        if (params[0] === 'test_session_id') {
          callback(null, {
            id: 'test_session_id',
            scopes: JSON.stringify(['scope1', 'scope2']),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            redirect_uri: 'http://localhost:3000/callback',
            verifier: 'test_verifier',
            code_challenge: 'test_challenge',
            state: 'test_state',
            is_authenticated: 1,
          });
        } else {
          callback(null, null);
        }
      } else {
        callback(null, null);
      }
    }),
    close: jest.fn((callback) => {
      if (callback) callback(null);
    }),
  };
  
  return {
    Database: jest.fn(() => dbMock),
  };
});

// Mock fs and path
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
}));

// Mock TokenManager
jest.mock('../src/auth/token-manager.js', () => {
  return {
    TokenManager: jest.fn().mockImplementation(() => ({
      saveToken: jest.fn().mockResolvedValue(undefined),
      getToken: jest.fn().mockResolvedValue({
        id: 'test_session_id',
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token',
        token_type: 'Bearer',
        expires_at: new Date(Date.now() + 3600 * 1000),
        scope: 'test_scope',
        contract_id: 'test_contract_id',
        created_at: new Date(),
        updated_at: new Date(),
      }),
      deleteToken: jest.fn().mockResolvedValue(undefined),
      isTokenNearExpiry: jest.fn().mockReturnValue(false),
    })),
  };
});

describe('OpenIdAuthService', () => {
  let authService: OpenIdAuthService;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create the service
    authService = new OpenIdAuthService();
  });
  
  test('getAuthorizationUrl should return URL and session ID', async () => {
    const result = await authService.getAuthorizationUrl(['scope1', 'scope2']);
    
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('sessionId');
    expect(result.url).toBe('https://mocked-auth-url.com');
  });
  
  test('handleCallback should exchange code for token', async () => {
    const sessionId = await authService.handleCallback('test_code', 'test_state');
    
    expect(sessionId).toBe('test_session_id');
  });
  
  test('handleCallback should throw error for invalid state', async () => {
    await expect(authService.handleCallback('test_code', 'invalid_state'))
      .rejects.toThrow('Invalid state parameter. Session not found.');
  });
  
  test('getAccessToken should return token', async () => {
    const token = await authService.getAccessToken('test_session_id');
    
    expect(token).toBe('test_access_token');
  });
  
  test('checkAuthStatus should return authentication status', async () => {
    const status = await authService.checkAuthStatus('test_session_id');
    
    expect(status).toEqual({
      isAuthenticated: true,
      sessionId: 'test_session_id',
    });
  });
  
  test('revokeToken should revoke token and session', async () => {
    const result = await authService.revokeToken('test_session_id');
    
    expect(result).toBe(true);
  });
});
