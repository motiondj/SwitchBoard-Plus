const express = require('express');
const http = require('http');
const cors = require('cors');
const config = require('../config/default');
const logger = require('./utils/logger');
const routes = require('./routes');
const { initializeSocket } = require('./services/socketService');
const { initializeUDP } = require('./services/udpService');
const db = require('./models');

// Express 앱 초기화
const app = express();
const server = http.createServer(app);

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// API 라우트 설정
app.use('/api', routes);

// 테스트 환경이 아닐 때만 Socket.io와 UDP 서버 초기화
if (process.env.NODE_ENV !== 'test') {
  // 데이터베이스 동기화
  db.sequelize.sync({ force: false })
    .then(() => {
      logger.info('데이터베이스가 성공적으로 동기화되었습니다.');
    })
    .catch((error) => {
      logger.error('데이터베이스 동기화 중 오류 발생:', error);
    });

  // Socket.io 초기화
  initializeSocket(server);

  // UDP 서버 초기화
  initializeUDP();

  // 서버 시작
  server.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });

  // 에러 핸들링
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
  });
}

module.exports = app; 