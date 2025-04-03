import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join, dirname, isAbsolute, resolve } from 'path';
import { fileURLToPath } from 'url';
import { McpModule } from './mcp/mcp.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ApiModule } from './api/api.module.js';
import { DatabaseModule } from './database/database.module.js';
import { TypeOrmCustomLogger } from './database/typeorm-custom-logger.js';

// ESM環境で__dirnameを再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// プロジェクトのルートディレクトリを取得
const projectRoot = resolve(dirname(dirname(__filename)));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // データベースのパスを取得
        const dbPath = configService.get('DATABASE_PATH', 'smaregi-mcp.sqlite');
        
        // 絶対パスかどうか確認し、相対パスの場合はプロジェクトルートからの絶対パスに変換
        const absoluteDbPath = isAbsolute(dbPath) 
          ? dbPath 
          : resolve(projectRoot, dbPath.replace(/^\.\//, ''));
        
        // 標準エラー出力に出力（MCPと競合しない）
        process.stderr.write(`[INFO] [Database] Database path resolved to: ${absoluteDbPath}\n`);
        
        // 環境に基づいてデバッグモードを設定
        const debugMode = configService.get('NODE_ENV') !== 'production';
        
        return {
          type: 'sqlite',
          database: absoluteDbPath,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: debugMode,
          // カスタムロガーを設定してSQLiteのログをstderrに出力
          logging: debugMode,
          logger: new TypeOrmCustomLogger(debugMode),
        };
      },
    }),
    McpModule,
    AuthModule,
    ApiModule,
    DatabaseModule,
  ],
})
export class AppModule {}
