const express = require('express');
const smaregiService = require('../services/smaregiService');
const { authenticateJWT } = require('../auth/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// 全てのルートで認証を要求
router.use(authenticateJWT);

/**
 * 商品一覧の取得
 * GET /api/smaregi/products
 */
router.get('/products', async (req, res) => {
  try {
    const products = await smaregiService.getProducts(req.query);
    res.json(products);
  } catch (error) {
    logger.error(`商品一覧取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '商品情報の取得に失敗しました',
    });
  }
});

/**
 * 商品詳細の取得
 * GET /api/smaregi/products/:productCode
 */
router.get('/products/:productCode', async (req, res) => {
  try {
    const { productCode } = req.params;
    const product = await smaregiService.getProductByCode(productCode);
    res.json(product);
  } catch (error) {
    logger.error(`商品詳細取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '商品詳細の取得に失敗しました',
    });
  }
});

/**
 * 売上一覧の取得
 * GET /api/smaregi/sales
 */
router.get('/sales', async (req, res) => {
  try {
    const sales = await smaregiService.getSales(req.query);
    res.json(sales);
  } catch (error) {
    logger.error(`売上一覧取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '売上情報の取得に失敗しました',
    });
  }
});

/**
 * 売上詳細の取得
 * GET /api/smaregi/sales/:transactionId
 */
router.get('/sales/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const saleDetails = await smaregiService.getSaleDetails(transactionId);
    res.json(saleDetails);
  } catch (error) {
    logger.error(`売上詳細取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '売上詳細の取得に失敗しました',
    });
  }
});

/**
 * 在庫一覧の取得
 * GET /api/smaregi/inventory
 */
router.get('/inventory', async (req, res) => {
  try {
    const inventory = await smaregiService.getInventory(req.query);
    res.json(inventory);
  } catch (error) {
    logger.error(`在庫一覧取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '在庫情報の取得に失敗しました',
    });
  }
});

/**
 * 店舗一覧の取得
 * GET /api/smaregi/stores
 */
router.get('/stores', async (req, res) => {
  try {
    const stores = await smaregiService.getStores();
    res.json(stores);
  } catch (error) {
    logger.error(`店舗一覧取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '店舗情報の取得に失敗しました',
    });
  }
});

/**
 * 従業員一覧の取得
 * GET /api/smaregi/staff
 */
router.get('/staff', async (req, res) => {
  try {
    const staff = await smaregiService.getStaff();
    res.json(staff);
  } catch (error) {
    logger.error(`従業員一覧取得エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '従業員情報の取得に失敗しました',
    });
  }
});

module.exports = router;
