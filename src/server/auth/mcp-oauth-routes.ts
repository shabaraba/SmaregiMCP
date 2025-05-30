import express from 'express';
import { AuthService } from '../../auth/auth.service.js';
import { packageInfo } from '../../utils/package-info.js';

/**
 * MCP OAuth 2.1準拠の認証ルートを設定
 * RFC 8414 (OAuth Authorization Server Metadata) および
 * RFC 9728 (OAuth Protected Resource Metadata) に準拠
 */
export function setupMcpOAuthRoutes(app: express.Express) {
  const authService = new AuthService();
  
  // OAuth Authorization Server Metadata (RFC 8414)
  app.get('/.well-known/oauth-authorization-server', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code'],
      code_challenge_methods_supported: ['S256'],
      scopes_supported: [
        'pos.transactions:read',
        'pos.products:read', 
        'pos.customers:read',
        'pos.stores:read'
      ]
    });
  });

  // OAuth Protected Resource Metadata (RFC 9728)
  app.get('/.well-known/oauth-protected-resource', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      resource: baseUrl,
      authorization_servers: [baseUrl],
      scopes_supported: [
        'pos.transactions:read',
        'pos.products:read',
        'pos.customers:read', 
        'pos.stores:read'
      ],
      bearer_methods_supported: ['header'],
      resource_documentation: 'https://developer.smaregi.jp/docs/'
    });
  });

  // OAuth Authorization エンドポイント
  app.get('/oauth/authorize', async (req, res) => {
    try {
      const {
        response_type,
        client_id,
        redirect_uri,
        scope,
        state,
        code_challenge,
        code_challenge_method
      } = req.query;

      // パラメータ検証
      if (response_type !== 'code') {
        return res.status(400).json({
          error: 'unsupported_response_type',
          error_description: 'Only authorization code flow is supported'
        });
      }

      if (!client_id || !redirect_uri || !code_challenge || code_challenge_method !== 'S256') {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters or unsupported code challenge method'
        });
      }

      // スマレジの認証URLを生成
      const authUrl = await authService.generateAuthUrl(
        String(redirect_uri),
        String(state || ''),
        String(code_challenge)
      );
      
      // スマレジの認証ページにリダイレクト
      res.redirect(authUrl);
    } catch (error) {
      console.error('[ERROR] OAuth authorization error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error'
      });
    }
  });

  // OAuth Token エンドポイント
  app.post('/oauth/token', async (req, res) => {
    try {
      const {
        grant_type,
        code,
        redirect_uri,
        client_id,
        code_verifier
      } = req.body;

      // パラメータ検証
      if (grant_type !== 'authorization_code') {
        return res.status(400).json({
          error: 'unsupported_grant_type',
          error_description: 'Only authorization code grant is supported'
        });
      }

      if (!code || !redirect_uri || !client_id || !code_verifier) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters'
        });
      }

      // 認証コードを検証してトークンを取得
      const tokenResponse = await authService.exchangeCodeForToken(
        String(code),
        String(redirect_uri),
        String(code_verifier)
      );

      res.json({
        access_token: tokenResponse.accessToken,
        token_type: 'Bearer',
        expires_in: tokenResponse.expiresIn,
        scope: tokenResponse.scope || 'pos.transactions:read'
      });
    } catch (error) {
      console.error('[ERROR] OAuth token exchange error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('invalid_code')) {
          return res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Invalid authorization code'
          });
        }
        
        if (error.message.includes('contract_id_missing')) {
          return res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Contract ID not available. Please ensure your Smaregi account has proper access permissions.'
          });
        }
      }
      
      res.status(500).json({
        error: 'server_error',
        error_description: 'Internal server error'
      });
    }
  });

  // コールバック処理（スマレジからのリダイレクト）
  app.get('/oauth/callback', async (req, res) => {
    try {
      const { code, state, error, error_description } = req.query;
      
      if (error) {
        console.error(`[ERROR] OAuth callback error: ${error} - ${error_description}`);
        return res.status(400).json({
          error: String(error),
          error_description: String(error_description || 'Authorization failed')
        });
      }

      if (!code || !state) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing authorization code or state'
        });
      }

      // 認証コードを処理（一時保存など）
      await authService.handleCallback(String(code), String(state));
      
      // 成功レスポンス
      res.json({
        message: 'Authorization successful',
        state: String(state)
      });
    } catch (error) {
      console.error('[ERROR] OAuth callback processing error:', error);
      res.status(500).json({
        error: 'server_error',
        error_description: 'Failed to process authorization callback'
      });
    }
  });
}