import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service.js';

/**
 * OAuth Bearer token認証ミドルウェア
 * Authorization ヘッダーからトークンを抽出し、認証状態を確認
 */
export class OAuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Bearer token認証を検証するミドルウェア
   */
  public authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return this.sendUnauthorizedResponse(res, 'missing_token');
      }

      // "Bearer " プレフィックスを確認
      if (!authHeader.startsWith('Bearer ')) {
        return this.sendUnauthorizedResponse(res, 'invalid_token_format');
      }

      // トークンを抽出
      const token = authHeader.substring(7); // "Bearer ".length

      if (!token) {
        return this.sendUnauthorizedResponse(res, 'missing_token');
      }

      // トークンの検証
      const isValid = await this.authService.validateAccessToken(token);
      
      if (!isValid) {
        return this.sendUnauthorizedResponse(res, 'invalid_token');
      }

      // contractIdの存在確認
      const hasContractId = this.authService.hasValidContractId(token);
      
      if (!hasContractId) {
        return this.sendUnauthorizedResponse(res, 'missing_contract_id');
      }

      // contractIdを取得
      const contractId = this.authService.getContractIdFromToken(token);

      // トークンが有効な場合、リクエストに認証情報を追加
      (req as any).accessToken = token;
      (req as any).contractId = contractId;
      (req as any).isAuthenticated = true;
      
      next();
    } catch (error) {
      console.error('[ERROR] OAuth middleware error:', error);
      return this.sendUnauthorizedResponse(res, 'server_error');
    }
  };

  /**
   * 401 Unauthorized レスポンスを送信
   * RFC 6750 (OAuth 2.0 Bearer Token Usage) に準拠
   */
  private sendUnauthorizedResponse(res: Response, errorType: string) {
    const baseUrl = `${res.req.protocol}://${res.req.get('host')}`;
    let wwwAuthenticate = `Bearer realm="${baseUrl}"`;
    
    switch (errorType) {
      case 'missing_token':
        wwwAuthenticate += ', error="invalid_request", error_description="Missing access token"';
        break;
      case 'invalid_token_format':
        wwwAuthenticate += ', error="invalid_request", error_description="Invalid token format. Use Bearer <token>"';
        break;
      case 'invalid_token':
        wwwAuthenticate += ', error="invalid_token", error_description="The access token is invalid or expired"';
        break;
      case 'missing_contract_id':
        wwwAuthenticate += ', error="invalid_token", error_description="Contract ID is missing or invalid. Please re-authenticate."';
        break;
      case 'server_error':
        wwwAuthenticate += ', error="server_error", error_description="Internal authentication error"';
        break;
      default:
        wwwAuthenticate += ', error="invalid_token"';
    }

    res.set('WWW-Authenticate', wwwAuthenticate);
    res.status(401).json({
      error: errorType === 'server_error' ? 'server_error' : 'unauthorized',
      error_description: 'Authentication required',
      authorization_endpoint: `${baseUrl}/oauth/authorize`
    });
  }

  /**
   * オプションの認証ミドルウェア
   * 認証が失敗してもリクエストを続行し、認証状態のみを設定
   */
  public optionalAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        (req as any).isAuthenticated = false;
        return next();
      }

      const token = authHeader.substring(7);
      const isValid = await this.authService.validateAccessToken(token);
      
      (req as any).accessToken = token;
      (req as any).isAuthenticated = isValid;
      
      next();
    } catch (error) {
      console.error('[ERROR] Optional OAuth middleware error:', error);
      (req as any).isAuthenticated = false;
      next();
    }
  };
}