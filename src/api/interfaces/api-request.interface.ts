/**
 * Interface for API service
 * Defines the methods of the API service for type checking
 */
export interface ApiServiceInterface {
  /**
   * Execute API request
   */
  executeRequest(params: ApiRequestInterface): Promise<any>;
  
  /**
   * Get API overview information
   */
  getApiOverview(category?: string): string;
  
  /**
   * Get API category overview information
   */
  getApiCategoryOverview(category: string): string;
  
  /**
   * Get API paths for a category
   */
  getApiPaths(category: string): Array<{ name: string; description: string; method: string; path: string }>;
  
  /**
   * Get API path details
   */
  getApiPathDetails(category: string, path: string): any;
}

export interface ApiRequestInterface {
  endpoint: string;
  method: string;
  data?: any;
  query?: Record<string, any>; // クエリパラメータ用
  path?: Record<string, any>;  // パスパラメータ用
}
