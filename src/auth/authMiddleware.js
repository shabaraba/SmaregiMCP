const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * JWT認証ミドルウェア
 * リクエストヘッダーからトークンを取得し、検証する
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: '認証トークンがありません' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error(`認証エラー: ${err.message}`);
      return res.status(403).json({ error: 'トークンが無効です' });
    }

    req.user = user;
    next();
  });
};

/**
 * 管理者権限のチェック
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: '管理者権限が必要です' });
  }
};

/**
 * APIキーの検証
 * 特定のAPIエンドポイント用（例：外部からの簡易アクセス）
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // 本番環境では、データベースや安全な保存場所からAPIキーを検証するべき
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'APIキーが無効です' });
  }

  next();
};

module.exports = {
  authenticateJWT,
  isAdmin,
  validateApiKey,
};
