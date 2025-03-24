const axios = require('axios');
const logger = require('../utils/logger');

class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.apiUrl = process.env.CLAUDE_API_URL;
    this.model = 'claude-3-5-sonnet-20240620'; // デフォルトのモデル
  }

  /**
   * Claudeの設定を更新する
   * @param {Object} config - 設定オブジェクト
   */
  updateConfig(config = {}) {
    if (config.model) {
      this.model = config.model;
    }
  }

  /**
   * ClaudeにAPIリクエストを送信する
   * @param {Array} messages - メッセージの配列
   * @param {Object} options - API設定オプション
   * @returns {Promise<Object>} Claude APIレスポンス
   */
  async sendRequest(messages, options = {}) {
    try {
      const defaultOptions = {
        model: this.model,
        temperature: 0.7,
        max_tokens: 4000,
      };

      const requestOptions = { ...defaultOptions, ...options };
      
      const response = await axios.post(
        `${this.apiUrl}/messages`,
        {
          model: requestOptions.model,
          messages,
          temperature: requestOptions.temperature,
          max_tokens: requestOptions.max_tokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      logger.info('Claude APIリクエストを送信しました');
      return response.data;
    } catch (error) {
      logger.error(`Claude APIエラー: ${error.message}`);
      throw new Error('Claude APIリクエストに失敗しました');
    }
  }

  /**
   * テキストプロンプトを送信し、生成された応答を取得する
   * @param {string} prompt - 送信するプロンプト
   * @param {Object} options - APIオプション
   * @returns {Promise<string>} 生成されたテキスト
   */
  async generateText(prompt, options = {}) {
    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.sendRequest(messages, options);
    return response.content[0].text;
  }

  /**
   * 会話形式でClaudeとのやり取りを行う
   * @param {Array} messages - メッセージの配列 [{role: 'user'|'assistant', content: string}]
   * @param {Object} options - APIオプション
   * @returns {Promise<string>} 生成されたテキスト
   */
  async chat(messages, options = {}) {
    const response = await this.sendRequest(messages, options);
    return response.content[0].text;
  }

  /**
   * スマレジのデータを整形してClaudeに送信する
   * @param {string} query - ユーザーからの質問
   * @param {Object} smaregiData - スマレジから取得したデータ
   * @param {Object} options - APIオプション
   * @returns {Promise<string>} Claudeの応答
   */
  async analyzeSmaregiData(query, smaregiData, options = {}) {
    try {
      // データの種類に基づいて適切なプロンプトを構築
      let systemPrompt = `あなたは小売店の分析アシスタントです。以下のスマレジPOSシステムから取得したデータに基づいて、質問に答えてください。`;
      
      // データの種類に応じたコンテキスト情報を追加
      if (smaregiData.products) {
        systemPrompt += `\n\n商品データ:\n${JSON.stringify(smaregiData.products, null, 2)}`;
      }
      
      if (smaregiData.sales) {
        systemPrompt += `\n\n売上データ:\n${JSON.stringify(smaregiData.sales, null, 2)}`;
      }
      
      if (smaregiData.inventory) {
        systemPrompt += `\n\n在庫データ:\n${JSON.stringify(smaregiData.inventory, null, 2)}`;
      }
      
      if (smaregiData.stores) {
        systemPrompt += `\n\n店舗データ:\n${JSON.stringify(smaregiData.stores, null, 2)}`;
      }

      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: query,
        },
      ];

      logger.info('スマレジデータをClaudeに送信します');
      const response = await this.sendRequest(messages, options);
      return response.content[0].text;
    } catch (error) {
      logger.error(`スマレジデータ分析エラー: ${error.message}`);
      throw new Error('スマレジデータの分析に失敗しました');
    }
  }
}

module.exports = new ClaudeService();
