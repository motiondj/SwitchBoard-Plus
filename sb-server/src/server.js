const express = require('express');
const http = require('http');
const cors = require('cors');
const config = require('../config/default');
console.log('config:', config);
const logger = require('./utils/logger');
const routes = require('./routes');
const { initializeSocket } = require('./services/socketService');
const { initializeUDP } = require('./services/udpService');
const db = require('./models');

// Express 앱 초기화
const app = express();
const server = http.createServer(app);

// CORS 설정
app.use(cors());

// 미들웨어 설정
app.use(express.json());

// API 라우트 설정
app.use('/api', routes);

// 테스트 환경이 아닐 때만 Socket.io와 UDP 서버 초기화
if (process.env.NODE_ENV !== 'test') {
  // 데이터베이스 동기화 및 초기화
  const initializeServer = async () => {
    try {
      // 데이터베이스 동기화
      await db.sequelize.sync({ force: false });
      logger.info('데이터베이스가 성공적으로 동기화되었습니다.');

      // 서버 부팅 시 모든 클라이언트 offline 처리
      const { Client } = db;
      const result = await Client.update(
        { status: 'offline' },
        { where: { status: 'online' } }
      );
      logger.info(`서버 부팅 시 ${result[0]}개의 클라이언트 status를 offline으로 초기화했습니다.`);

      // Socket.io 초기화
      initializeSocket(server);

      // UDP 서버 초기화
      initializeUDP();

      // 서버 시작
      server.listen(config.port, () => {
        logger.info(`Server is running on port ${config.port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
      });
    } catch (error) {
      logger.error('서버 초기화 중 오류 발생:', error);
      process.exit(1);
    }
  };

  initializeServer();

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