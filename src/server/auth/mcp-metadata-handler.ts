import express, { RequestHandler } from 'express';
import { metadataHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/metadata.js';
import { InvalidTokenError, ServerError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { AuthService } from '../../auth/auth.service.js';

/**
 * MCP SDK準拠のメタデータハンドラーを作成
 * 参考: https://github.com/modelcontextprotocol/typescript-sdk
 */
export function setupMcpMetadataEndpoints(app: express.Express): void {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';

  console.error('[INFO] Setting up MCP OAuth metadata endpoints...');

  // OAuth Authorization Server Metadata (RFC 8414) - MCP SDK版
  app.get('/.well-known/oauth-authorization-server', metadataHandler({
    issuer: baseUrl,
    
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    
    response_types_supported: ['code'],
    code_challenge_methods_supported: ['S256'],
    
    token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
    grant_types_supported: ['authorization_code'],
    
    scopes_supported: [
      'pos.transactions:read',
      'pos.products:read',
      'pos.customers:read',
      'pos.stores:read'
    ]
  }));

  console.error('[INFO] MCP OAuth metadata endpoints configured successfully');
}

/**
 * MCP認証ミドルウェア
 * Bearer トークンを検証し、必要に応じて認証エラーを返す
 */
export function createMcpAuthMiddleware(): RequestHandler {
  const authService = new AuthService();
  
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      
      if (!header) {
        throw new InvalidTokenError('Missing Authorization header');
      }

      const [type, token] = header.split(' ');
      if (type.toLowerCase() !== 'bearer' || !token) {
        throw new InvalidTokenError('Invalid Authorization header format, expected "Bearer TOKEN"');
      }

      // トークンの検証
      const isValid = await authService.validateAccessToken(token);
      if (!isValid) {
        throw new InvalidTokenError('Invalid or expired access token');
      }

      // contractIdの存在確認
      const hasContractId = authService.hasValidContractId(token);
      if (!hasContractId) {
        throw new InvalidTokenError('Contract ID is missing or invalid. Please re-authenticate.');
      }

      // リクエストに認証情報を追加
      (req as any).accessToken = token;
      (req as any).contractId = authService.getContractIdFromToken(token);
      (req as any).isAuthenticated = true;

      next();
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        res.set('WWW-Authenticate', `Bearer error="${error.errorCode}", error_description="${error.message}"`);
        res.status(401).json(error.toResponseObject());
      } else {
        console.error('[ERROR] Unexpected error authenticating bearer token:', error);
        res.status(500).json(new ServerError('Internal Server Error').toResponseObject());
      }
    }
  };
}