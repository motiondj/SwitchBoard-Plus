const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const db = require('./models'); // 추가: sequelize 인스턴스 공유 보장

const app = express();

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 미들웨어 설정
app.use(express.json());

// API 라우트 설정
app.use('/api', routes);

// 에러 핸들러
app.use(errorHandler);

module.exports = { app }; 