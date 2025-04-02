import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../api/api.service';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ToolHandlerService {
  private apiSpec: any;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    // APIスペックの読み込み（実際の実装ではより複雑になる可能性あり）
    try {
      const projectRoot = process.cwd();
      const possiblePaths = [
        path.resolve(projectRoot, 'openapi', 'pos', 'openapi.yaml'),
        path.resolve(projectRoot, 'openapi-simple.yaml'),
      ];

      for (const specPath of possiblePaths) {
        if (fs.existsSync(specPath)) {
          const content = fs.readFileSync(specPath, 'utf8');
          this.apiSpec = yaml.load(content);
          break;
        }
      }

      // スペックが見つからない場合は簡易版を用意
      if (!this.apiSpec) {
        this.apiSpec = {
          info: {
            title: "スマレジAPI (Fallback)",
            description: "スマレジAPIの簡易モード",
            version: "1.0.0"
          },
          paths: {},
          tags: [
            { name: "商品", description: "商品に関する操作" },
            { name: "取引", description: "取引に関する操作" },
            { name: "在庫", description: "在庫に関する操作" }
          ]
        };
      }
    } catch (error) {
      console.error('APIスペック読み込みエラー:', error);
      this.apiSpec = {
        info: {
          title: "スマレジAPI (Error)",
          description: "スマレジAPIの定義読み込みに失敗しました",
          version: "1.0.0"
        }
      };
    }
  }

  /**
   * ツール呼び出しを処理
   */
  async handleToolCall(request: any): Promise<any> {
    const toolName = request.params.name;
    const args = request.params.arguments || {};
    
    console.log(`ツール '${toolName}' を呼び出します。引数:`, args);
    
    try {
      switch (toolName) {
        case 'getAuthorizationUrl':
          return this.handleGetAuthorizationUrl(args);
        
        case 'checkAuthStatus':
          return this.handleCheckAuthStatus(args);
        
        case 'executeApiRequest':
          return this.handleExecuteApiRequest(args);
        
        case 'getSmaregiApiOverview':
          return this.handleGetSmaregiApiOverview(args);
        
        case 'getSmaregiApiOperation':
          return this.handleGetSmaregiApiOperation(args);
        
        case 'listSmaregiApiEndpoints':
          return this.handleListSmaregiApiEndpoints(args);
        
        default:
          throw new Error(`未知のツール: ${toolName}`);
      }
    } catch (error) {
      console.error(`ツール '${toolName}' の処理中にエラーが発生しました:`, error);
      throw error;
    }
  }

  /**
   * 認証URL生成を処理
   */
  private async handleGetAuthorizationUrl(args: any): Promise<any> {
    const { scopes } = args;
    
    if (!Array.isArray(scopes) || scopes.length === 0) {
      throw new Error('scopesは空でない配列である必要があります');
    }
    
    const result = await this.authService.generateAuthUrl(scopes);
    
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      metadata: {},
    };
  }

  /**
   * 認証状態確認を処理
   */
  private async handleCheckAuthStatus(args: any): Promise<any> {
    const { sessionId } = args;
    
    if (!sessionId) {
      throw new Error('sessionIdは必須です');
    }
    
    const result = await this.authService.checkAuthStatus(sessionId);
    
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      metadata: {},
    };
  }

  /**
   * API実行リクエストを処理
   */
  private async handleExecuteApiRequest(args: any): Promise<any> {
    const { sessionId, endpoint, method, data } = args;
    
    if (!sessionId || !endpoint || !method) {
      throw new Error('sessionId, endpoint, methodは必須です');
    }
    
    const result = await this.apiService.executeRequest({
      sessionId,
      endpoint,
      method,
      data,
    });
    
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      metadata: {},
    };
  }

  /**
   * スマレジAPI概要取得を処理
   */
  private handleGetSmaregiApiOverview(args: any): any {
    const { category } = args;
    
    let responseContent;
    
    if (category) {
      // 特定カテゴリの情報を取得
      const categoryTag = this.apiSpec.tags?.find((tag: any) => 
        tag.name.toLowerCase() === category.toLowerCase()
      );
      
      if (!categoryTag) {
        throw new Error(`カテゴリが見つかりません: ${category}`);
      }
      
      const paths: Record<string, any> = {};
      
      // 指定されたカテゴリに関連するパスを抽出
      Object.entries(this.apiSpec.paths || {}).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          if (operation.tags?.some((tag: string) => tag.toLowerCase() === category.toLowerCase())) {
            if (!paths[path]) {
              paths[path] = {};
            }
            paths[path][method] = operation;
          }
        });
      });
      
      responseContent = {
        category: categoryTag.name,
        description: categoryTag.description,
        paths
      };
    } else {
      // APIの全体概要を取得
      responseContent = {
        title: this.apiSpec.info.title,
        description: this.apiSpec.info.description,
        version: this.apiSpec.info.version,
        servers: this.apiSpec.servers,
        security: this.apiSpec.components?.securitySchemes,
        categories: this.apiSpec.tags?.map((tag: any) => ({
          name: tag.name,
          description: tag.description
        }))
      };
    }
    
    return {
      content: [{ type: 'text', text: JSON.stringify(responseContent, null, 2) }],
      metadata: {},
    };
  }

  /**
   * 特定のAPIエンドポイント情報を取得
   */
  private handleGetSmaregiApiOperation(args: any): any {
    const { path, method } = args;
    
    if (!path || !method) {
      throw new Error('path と method は必須です');
    }
    
    const methodLower = method.toLowerCase();
    const operation = this.apiSpec.paths?.[path]?.[methodLower];
    
    if (!operation) {
      throw new Error(`エンドポイントが見つかりません: ${method} ${path}`);
    }
    
    const responseContent = {
      path,
      method: method.toUpperCase(),
      ...operation
    };
    
    return {
      content: [{ type: 'text', text: JSON.stringify(responseContent, null, 2) }],
      metadata: {},
    };
  }

  /**
   * エンドポイント一覧を取得
   */
  private handleListSmaregiApiEndpoints(args: any): any {
    const { category } = args;
    
    const endpoints: any[] = [];
    
    Object.entries(this.apiSpec.paths || {}).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, operation]: [string, any]) => {
        // カテゴリが指定されている場合はフィルタリング
        if (category && !operation.tags?.some((tag: string) => 
          tag.toLowerCase() === category.toLowerCase())
        ) {
          return;
        }

        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary || '',
          tags: operation.tags || [],
          operationId: operation.operationId || '',
        });
      });
    });
    
    return {
      content: [{ type: 'text', text: JSON.stringify(endpoints, null, 2) }],
      metadata: {},
    };
  }
}
