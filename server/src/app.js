require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 라우트 임포트
const menusRouter = require('./routes/menus');
const optionsRouter = require('./routes/options');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// API 라우트 설정
app.use('/api/menus', menusRouter);
app.use('/api/options', optionsRouter);
app.use('/api/orders', ordersRouter);

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '서버 내부 오류가 발생했습니다.'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   COZY Coffee Order API Server         ║
╠════════════════════════════════════════╣
║   Server running on port ${PORT}          ║
║   http://localhost:${PORT}                ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;

