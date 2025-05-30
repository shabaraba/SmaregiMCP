/**
 * Cloudflare向けのSchemaConverter
 * 実際のスキーマ生成は行わず、事前生成されたスキーマを使用
 */

// ダミー実装
export class SchemaConverter {
  /**
   * コンバートしたスキーマのJSONを取得
   * @param {string} namespace pos または common
   * @returns {object} スキーマオブジェクト
   */
  convertTypeScriptToJson(namespace) {
    // Cloudflare環境では予め変換されたJSONを使う前提
    console.error(`[WARN] SchemaConverter.convertTypeScriptToJson called in Cloudflare environment - no conversion performed`);
    return { paths: {} };
  }
  
  /**
   * スキーマをJSONとして保存
   * @param {string} namespace pos または common
   * @param {object} schema スキーマオブジェクト
   */
  saveSchemaAsJson(namespace, schema) {
    console.error(`[WARN] SchemaConverter.saveSchemaAsJson called in Cloudflare environment - no saving performed`);
  }
}

export default SchemaConverter;