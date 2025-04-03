export interface ApiRequestInterface {
  endpoint: string;
  method: string;
  data?: any;
  query?: Record<string, any>; // クエリパラメータ用
  path?: Record<string, any>;  // パスパラメータ用
}
