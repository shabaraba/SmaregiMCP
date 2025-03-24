const express = require('express');
const claudeService = require('../services/claudeService');
const smaregiService = require('../services/smaregiService');
const { authenticateJWT } = require('../auth/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// 全てのルートで認証を要求
router.use(authenticateJWT);

/**
 * Claude APIにテキストプロンプトを送信する
 * POST /api/claude/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'プロンプトが必要です',
      });
    }

    const response = await claudeService.generateText(prompt, options);
    
    res.json({
      success: true,
      response,
    });
  } catch (error) {
    logger.error(`テキスト生成エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'テキスト生成に失敗しました',
    });
  }
});

/**
 * Claudeとチャットする
 * POST /api/claude/chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages, options } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'メッセージが必要です',
      });
    }

    const response = await claudeService.chat(messages, options);
    
    res.json({
      success: true,
      response,
    });
  } catch (error) {
    logger.error(`チャットエラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'チャットに失敗しました',
    });
  }
});

/**
 * スマレジデータを分析する
 * POST /api/claude/analyze-smaregi
 */
router.post('/analyze-smaregi', async (req, res) => {
  try {
    const { query, dataTypes, params, options } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: '質問が必要です',
      });
    }

    if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'データタイプが必要です',
      });
    }

    // スマレジからデータを取得
    const smaregiData = {};
    
    for (const dataType of dataTypes) {
      switch (dataType) {
        case 'products':
          smaregiData.products = await smaregiService.getProducts(params?.products || {});
          break;
        case 'sales':
          smaregiData.sales = await smaregiService.getSales(params?.sales || {});
          break;
        case 'inventory':
          smaregiData.inventory = await smaregiService.getInventory(params?.inventory || {});
          break;
        case 'stores':
          smaregiData.stores = await smaregiService.getStores();
          break;
        default:
          logger.warn(`不明なデータタイプ: ${dataType}`);
      }
    }

    // Claudeに分析させる
    const response = await claudeService.analyzeSmaregiData(query, smaregiData, options);
    
    res.json({
      success: true,
      response,
    });
  } catch (error) {
    logger.error(`データ分析エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'データ分析に失敗しました',
    });
  }
});

/**
 * Claudeの設定を更新する
 * PUT /api/claude/config
 */
router.put('/config', async (req, res) => {
  try {
    const { config } = req.body;

    if (!config) {
      return res.status(400).json({
        success: false,
        error: '設定が必要です',
      });
    }

    claudeService.updateConfig(config);
    
    res.json({
      success: true,
      message: 'Claudeの設定を更新しました',
    });
  } catch (error) {
    logger.error(`設定更新エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '設定の更新に失敗しました',
    });
  }
});

module.exports = router;
