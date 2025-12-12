require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 라우트 임포트
const menusRouter = require('./routes/menus');
const optionsRouter = require('./routes/options');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정
const corsOptions = {
  origin: function (origin, callback) {
    // 허용할 도메인 목록
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // origin이 없는 경우 (같은 도메인, Postman 등) 또는 허용된 도메인인 경우
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
      callback(null, true);
    } else {
      // 개발 편의를 위해 render.com과 onrender.com 도메인도 허용
      if (origin.includes('onrender.com') || origin.includes('render.com')) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(null, true); // 일단 모두 허용 (디버깅용)
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// 미들웨어 설정
app.use(cors(corsOptions));
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

