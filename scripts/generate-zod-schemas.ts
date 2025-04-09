import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { z } from 'zod';
import { generate } from 'ts-to-zod'; // ts-to-zod をインポート
import * as path from 'path';

// schema.d.ts のファイルパス
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const schemaFilePath = path.join(projectRoot, 'src', 'schema', 'pos.d.ts');
const zodFilePath = path.join(projectRoot, 'src', 'schema', 'zod', 'pos.zod.ts');

// schema.d.ts を読み込む
const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');

// d.ts 全体を Zod スキーマに変換する関数
const convertDtsToZod = (sourceText: string): void => {
  // ts-to-zod を使って型定義を Zod スキーマに変換
  const {getZodSchemasFile} = generate({ sourceText });
  const zodSchemaCode = getZodSchemasFile(zodFilePath);
  fs.writeFileSync(zodFilePath, zodSchemaCode, 'utf8');
};

// Zod スキーマに変換した後、POST メソッドのエンドポイントを抽出する関数
const extractPostEndpointsFromZod = (zodObject: any): Record<string, z.ZodObject<any>> => {
  const postEndpoints: Record<string, z.ZodObject<any>> = {};

  // Zod オブジェクト内で POST メソッドのエンドポイントをチェック
  for (const path in zodObject) {
    const methodDefinition = zodObject[path];
    
    // POST メソッドの定義が含まれているか確認
    if (methodDefinition && methodDefinition.method === 'POST') {
      postEndpoints[path] = methodDefinition.body;  // body はリクエストボディの Zod スキーマ
    }
  }

  return postEndpoints;
};

convertDtsToZod(schemaContent);
