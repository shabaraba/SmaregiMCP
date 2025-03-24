const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * ログイン処理
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // この例では簡易的な認証を行っていますが、実際のアプリケーションでは
    // データベースを使用した本格的な認証を実装する必要があります
    if (username === 'admin' && password === 'password') {
      const user = {
        id: 1,
        username: 'admin',
        role: 'admin',
      };

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      logger.info(`ユーザー ${username} がログインしました`);
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } else {
      logger.warn(`ログイン失敗: ${username}`);
      res.status(401).json({
        success: false,
        error: 'ユーザー名またはパスワードが無効です',
      });
    }
  } catch (error) {
    logger.error(`ログインエラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '認証中にエラーが発生しました',
    });
  }
});

/**
 * トークンの検証
 * GET /api/auth/verify
 */
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'トークンがありません',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'トークンが無効です',
        });
      }

      res.json({
        success: true,
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        },
      });
    });
  } catch (error) {
    logger.error(`トークン検証エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'トークンの検証中にエラーが発生しました',
    });
  }
});

module.exports = router;
