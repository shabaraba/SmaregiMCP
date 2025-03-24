const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

// 環境変数の読み込み
dotenv.config();

// APIルーターのインポート
const smaregiRouter = require('./api/smaregiRoutes');
const claudeRouter = require('./api/claudeRoutes');
const authRouter = require('./api/authRoutes');

// アプリの初期化
const app = express();
const port = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// リクエストのロギング
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ルートの設定
app.use('/api/auth', authRouter);
app.use('/api/smaregi', smaregiRouter);
app.use('/api/claude', claudeRouter);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is running' });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// サーバーの起動
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app;
