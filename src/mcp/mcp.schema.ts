import { z } from 'zod';

/**
 * リソース一覧リクエストのスキーマ
 */
export const ListResourcesRequestSchema = z.object({
  method: z.literal('resources/list'),
  params: z.object({}),
});

/**
 * プロンプト一覧リクエストのスキーマ
 */
export const ListPromptsRequestSchema = z.object({
  method: z.literal('prompts/list'),
  params: z.object({}),
});

/**
 * プロンプト取得リクエストのスキーマ
 */
export const GetPromptRequestSchema = z.object({
  method: z.literal('prompts/get'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.any()).optional(),
  }),
});
