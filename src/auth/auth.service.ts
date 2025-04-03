import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { lastValueFrom } from 'rxjs';
import { SessionEntity } from '../database/entities/session.entity.js';
import { TokenEntity } from '../database/entities/token.entity.js';
import { AuthUrlDto } from './dto/auth-url.dto.js';
import { TokenResponseDto } from './dto/token-response.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * 認証URLを生成する
   */
  async generateAuthUrl(scopes: string[]): Promise<AuthUrlDto> {
    // セッション生成
    const sessionId = uuidv4();
    const state = uuidv4();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    // セッション保存
    const session = this.sessionRepository.create({
      id: sessionId,
      state,
      codeVerifier,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30分間有効
    });

    await this.sessionRepository.save(session);

    // 認証URL生成
    const authUrl = new URL(this.configService.get('SMAREGI_AUTH_URL', 'https://id.smaregi.dev/authorize'));
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', this.configService.get('CLIENT_ID', ''));
    authUrl.searchParams.append('scope', scopes.join(' '));
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('redirect_uri', this.configService.get('REDIRECT_URI', 'http://127.0.0.1:3000/auth/callback'));
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    return {
      authUrl: authUrl.toString(),
      sessionId,
      message: 'このURLをブラウザで開いて認証を完了してください。認証後、セッションIDを使って操作を続行できます。',
    };
  }

  /**
   * 認証コードとステートからアクセストークンを取得
   */
  async handleCallback(code: string, state: string): Promise<string> {
    // ステートからセッションを検索
    const session = await this.sessionRepository.findOne({ where: { state } });

    if (!session) {
      throw new NotFoundException('無効なステートパラメータです');
    }

    // 有効期限チェック
    if (session.expiresAt < new Date()) {
      throw new BadRequestException('セッションの有効期限が切れています');
    }

    // アクセストークン取得
    const tokenResponse = await this.getAccessToken(code, session.codeVerifier);

    // トークン保存
    const token = this.tokenRepository.create({
      sessionId: session.id,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token || null, // refresh_tokenがない場合はnullを設定
      scope: tokenResponse.scope,
      expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.tokenRepository.save(token);

    return session.id;
  }

  /**
   * セッションIDから認証状態を確認
   */
  async checkAuthStatus(sessionId: string): Promise<any> {
    const session = await this.sessionRepository.findOne({ 
      where: { id: sessionId },
      relations: ['token'],
    });

    if (!session) {
      return {
        isAuthenticated: false,
        message: 'セッションが見つかりません',
      };
    }

    if (!session.token) {
      return {
        isAuthenticated: false,
        message: 'まだ認証が完了していません。ブラウザで認証URLにアクセスして認証を完了してください。',
      };
    }

    return {
      isAuthenticated: true,
      sessionId,
      scopes: session.token.scope.split(' '),
      expiresAt: session.token.expiresAt.toISOString(),
    };
  }

  /**
   * セッションIDから有効なアクセストークンを取得
   */
  async getValidAccessToken(sessionId: string): Promise<string> {
    const token = await this.tokenRepository.findOne({ where: { sessionId } });

    if (!token) {
      throw new NotFoundException('アクセストークンが見つかりません。認証が必要です。');
    }

    // 有効期限チェック（10分以上残っている場合はそのまま使用）
    if (token.expiresAt.getTime() > Date.now() + 10 * 60 * 1000) {
      return token.accessToken;
    }

    // トークン更新
    try {
      // リフレッシュトークンがなければ再認証が必要
      if (!token.refreshToken) {
        throw new BadRequestException('リフレッシュトークンがありません。再認証が必要です。');
      }
      
      const refreshedToken = await this.refreshAccessToken(token.refreshToken);
      
      // 更新されたトークンを保存
      token.accessToken = refreshedToken.access_token;
      if (refreshedToken.refresh_token) {
        token.refreshToken = refreshedToken.refresh_token;
      }
      token.expiresAt = new Date(Date.now() + refreshedToken.expires_in * 1000);
      token.updatedAt = new Date();
      
      await this.tokenRepository.save(token);
      
      return token.accessToken;
    } catch (error) {
      console.error('トークン更新エラー:', error);
      throw new BadRequestException('アクセストークンの更新に失敗しました。再認証が必要です。');
    }
  }

  /**
   * 認証コードからアクセストークンを取得
   */
  private async getAccessToken(code: string, codeVerifier: string): Promise<TokenResponseDto> {
    const tokenEndpoint = this.configService.get('SMAREGI_TOKEN_ENDPOINT', 'https://id.smaregi.dev/authorize/token');
    const clientId = this.configService.get('CLIENT_ID', '');
    const clientSecret = this.configService.get('CLIENT_SECRET', '');
    const redirectUri = this.configService.get('REDIRECT_URI', 'http://localhost:3000/auth/callback');

    // Basic認証用のクレデンシャル
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          tokenEndpoint,
          new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${auth}`,
            },
          },
        ),
      );
      
      return response.data;
    } catch (error) {
      console.error('アクセストークン取得エラー:', error);
      throw new BadRequestException('アクセストークンの取得に失敗しました');
    }
  }

  /**
   * リフレッシュトークンを使ってアクセストークンを更新
   */
  private async refreshAccessToken(refreshToken: string | null): Promise<TokenResponseDto> {
    const tokenEndpoint = this.configService.get('SMAREGI_TOKEN_ENDPOINT', 'https://id.smaregi.dev/authorize/token');
    const clientId = this.configService.get('CLIENT_ID', '');
    const clientSecret = this.configService.get('CLIENT_SECRET', '');

    // Basic認証用のクレデンシャル
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          tokenEndpoint,
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${auth}`,
            },
          },
        ),
      );
      
      return response.data;
    } catch (error) {
      console.error('トークン更新エラー:', error);
      throw new BadRequestException('トークンの更新に失敗しました');
    }
  }

  /**
   * PKCEのcode_verifierを生成
   */
  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * PKCEのcode_challengeを生成
   */
  private generateCodeChallenge(verifier: string): string {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
  }
}
