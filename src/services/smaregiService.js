const axios = require('axios');
const logger = require('../utils/logger');

class SmaregiService {
  constructor() {
    this.clientId = process.env.SMAREGI_CLIENT_ID;
    this.clientSecret = process.env.SMAREGI_CLIENT_SECRET;
    this.contractId = process.env.SMAREGI_CONTRACT_ID;
    this.accessTokenUrl = process.env.SMAREGI_ACCESS_TOKEN_URL;
    this.apiBaseUrl = process.env.SMAREGI_API_BASE_URL;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * アクセストークンを取得する
   * @returns {Promise<string>} アクセストークン
   */
  async getAccessToken() {
    try {
      // トークンが有効期限内であれば再利用
      if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await axios.post(
        this.accessTokenUrl,
        {
          grant_type: 'client_credentials',
          scope: 'pos.products:read pos.sales:read',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
        }
      );

      this.accessToken = response.data.access_token;
      
      // トークンの有効期限を設定（通常は1時間）
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
      
      logger.info('スマレジAPIのアクセストークンを取得しました');
      return this.accessToken;
    } catch (error) {
      logger.error(`アクセストークン取得エラー: ${error.message}`);
      throw new Error('スマレジAPIのアクセストークン取得に失敗しました');
    }
  }

  /**
   * スマレジAPIにリクエストを送信する
   * @param {string} endpoint - APIエンドポイント
   * @param {string} method - HTTPメソッド（GET, POST, PUT, DELETE）
   * @param {Object} data - リクエストボディのデータ
   * @returns {Promise<Object>} APIレスポンス
   */
  async request(endpoint, method = 'GET', data = null) {
    try {
      const token = await this.getAccessToken();
      
      const config = {
        method,
        url: `${this.apiBaseUrl}/${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Contract-Id': this.contractId,
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.data = data;
      }

      logger.info(`スマレジAPI ${method} リクエスト: ${endpoint}`);
      const response = await axios(config);
      
      return response.data;
    } catch (error) {
      logger.error(`スマレジAPI リクエストエラー: ${error.message}`);
      throw new Error(`スマレジAPI ${endpoint} への ${method} リクエストに失敗しました`);
    }
  }

  /**
   * 商品情報を取得する
   * @param {Object} params - クエリパラメータ
   * @returns {Promise<Array>} 商品リスト
   */
  async getProducts(params = {}) {
    const defaultParams = {
      limit: 100,
      page: 1,
    };
    
    const queryParams = { ...defaultParams, ...params };
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    return this.request(`pos/products?${queryString}`);
  }

  /**
   * 商品情報を取得する（商品コードで検索）
   * @param {string} productCode - 商品コード
   * @returns {Promise<Object>} 商品情報
   */
  async getProductByCode(productCode) {
    return this.request(`pos/products?product_code=${encodeURIComponent(productCode)}`);
  }

  /**
   * 売上情報を取得する
   * @param {Object} params - クエリパラメータ
   * @returns {Promise<Array>} 売上リスト
   */
  async getSales(params = {}) {
    const defaultParams = {
      limit: 100,
      page: 1,
    };
    
    const queryParams = { ...defaultParams, ...params };
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    return this.request(`pos/sales?${queryString}`);
  }

  /**
   * 売上詳細情報を取得する
   * @param {string} transactionId - 取引ID
   * @returns {Promise<Object>} 売上詳細情報
   */
  async getSaleDetails(transactionId) {
    return this.request(`pos/sales/${transactionId}`);
  }

  /**
   * 在庫情報を取得する
   * @param {Object} params - クエリパラメータ
   * @returns {Promise<Array>} 在庫リスト
   */
  async getInventory(params = {}) {
    const defaultParams = {
      limit: 100,
      page: 1,
    };
    
    const queryParams = { ...defaultParams, ...params };
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    return this.request(`pos/inventories?${queryString}`);
  }

  /**
   * 店舗情報を取得する
   * @returns {Promise<Array>} 店舗リスト
   */
  async getStores() {
    return this.request('pos/stores');
  }

  /**
   * 従業員情報を取得する
   * @returns {Promise<Array>} 従業員リスト
   */
  async getStaff() {
    return this.request('pos/staffs');
  }
}

module.exports = new SmaregiService();
