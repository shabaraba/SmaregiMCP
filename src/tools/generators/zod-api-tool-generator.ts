import { z, ZodNever, ZodObject, ZodRawShape } from "zod";
import * as fs from "fs";
import * as path from "path";
import { ApiTool, ApiToolParameter } from "../interfaces/api-tool.interface.js";
import * as zodModule from "../../schema/zod/pos.zod.js";

/**
 * ZodApiToolGenerator - typed-openapiで生成されたZodスキーマからAPIツールを生成するクラス
 */
export class ZodApiToolGenerator {
  private zodSchemaPath: string;

  constructor() {}

  /**
   * EndpointByMethodからAPIツールを生成
   */
  public async generateToolsFromZodSchema(): Promise<ApiTool[]> {
    const tools: ApiTool[] = [];

    try {
      try {
        // EndpointByMethodを動的に取得
        const EndpointByMethod = zodModule.EndpointByMethod;

        if (!EndpointByMethod) {
          console.error("[ERROR] EndpointByMethod not found in Zod schema");
          return tools;
        }

        console.error(
          `[INFO] Successfully loaded EndpointByMethod with ${Object.keys(EndpointByMethod).length} HTTP methods`,
        );

        // HTTP methodごとに処理
        for (const [method, endpoints] of Object.entries(EndpointByMethod)) {
          console.error(
            `[INFO] Processing ${Object.keys(endpoints).length} endpoints for method: ${method}`,
          );

          for (const [path, endpoint] of Object.entries(
            endpoints as Record<string, any>,
          )) {
            try {
              // ツール名を生成
              const toolName = this.generateToolName(method, path);

              // パラメータを抽出・変換
              const parameters = this.convertZodSchemaToParameters( endpoint);

              // 説明文を生成
              const description = `${method.toUpperCase()} ${path} エンドポイントへのアクセス`;

              // APIツールを作成
              const tool: ApiTool = {
                name: toolName,
                description,
                parameters,
                path,
                method: method.toUpperCase(),
                operationId: toolName,
              };

              tools.push(tool);
            } catch (error) {
              console.error(
                `[ERROR] Failed to generate tool for ${method} ${path}:`,
                error,
              );
            }
          }
        }
      } catch (error) {
        console.error("[ERROR] Failed to import EndpointByMethod:", error);
      }
    } catch (error) {
      console.error("[ERROR] Failed to generate tools from Zod schema:", error);
    }

    return tools;
  }

  /**
   * ツール名を生成
   */
  private generateToolName(method: string, path: string): string {
    // resourceとactionを抽出
    const segments = path.split("/").filter(Boolean);
    const resource =
      segments[segments.length - 1].replace(/\{([^}]+)\}/, "$1") || "resource";

    // メソッドに基づいてアクション名を生成
    let action;
    if (method.toLowerCase() === "get") {
      action = path.includes("{") ? "get" : "list";
    } else if (method.toLowerCase() === "post") {
      action = "create";
    } else if (["put", "patch"].includes(method.toLowerCase())) {
      action = "update";
    } else if (method.toLowerCase() === "delete") {
      action = "delete";
    } else {
      action = method.toLowerCase();
    }

    const category = segments[0] || "api";
    const capitalizedResource = this.capitalize(resource).replace(new RegExp(category, "gi"), "");

    return `${category}_${action}${capitalizedResource}`;
  }

  /**
   * 文字列の先頭を大文字に変換
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Zodスキーマからパラメータを抽出
   */
  private convertZodSchemaToParameters( endpoint: object ): ApiToolParameter[] {
    // OAuth認証方式のため、sessionIdパラメータは不要
    const result: ApiToolParameter[] = [];
    if (!("parameters" in endpoint) || endpoint.parameters == null || endpoint.parameters == undefined) {
      return result;
    }
    if (endpoint.parameters instanceof ZodNever) return result;
    const convertedParameters = this.extractParameters(endpoint.parameters as ZodObject<{ [key: string]: ZodObject<ZodRawShape> }>);

    // queryパラメータを処理
    if ("path" in convertedParameters) {
      result.push(...convertedParameters['path']);
    }
    if ("query" in convertedParameters) {
      result.push(...convertedParameters['query']);
    }
    if ("body" in convertedParameters) {
      result.push(...convertedParameters['body']);
    }

    return result;
  }

  private extractParameters(
    parametersSchema: ZodObject<{ [key: string]: ZodObject<ZodRawShape> }>,
  ): { [key: string]: ApiToolParameter[] } {
    const result: { [key: string]: ApiToolParameter[] } = {};

    const parameterTypes = parametersSchema.shape;

    for (const [paramType, schema] of Object.entries(parameterTypes)) {
      if (!(schema instanceof ZodObject)) continue;

      const entries: ApiToolParameter[] = [];

      for (const [name, fieldSchema] of Object.entries(schema.shape)) {
        const isOptional = fieldSchema.isOptional();
        const description = fieldSchema.description;

        entries.push({
          name,
          description,
          required: !isOptional,
          type: paramType as "query" | "path" | "body",
          schema: fieldSchema,
        });
      }

      result[paramType] = entries;
    }

    return result;
  }

  /**
   * Zodスキーマがオプショナルかどうかを判定
   */
  private isOptional(schema: any): boolean {
    if (schema instanceof z.ZodOptional) {
      return true;
    }

    // _defプロパティを持っていればそれを使用
    if (schema?._def?.typeName === "ZodOptional") {
      return true;
    }

    return false;
  }
}
