const { Server } = require('socket.io');
const logger = require('../utils/logger');
const { Client, Preset } = require('../models');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    allowEIO3: true,
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // 에러 핸들링
  io.engine.on('connection_error', (err) => {
    logger.error('Socket.io connection error:', err);
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // 연결 에러 핸들링
    socket.on('error', (error) => {
      logger.error(`Socket error for client ${socket.id}:`, error);
    });

    // 클라이언트 연결 해제
    socket.on('disconnect', async (reason) => {
      logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
      
      try {
        const client = await Client.findOne({ where: { socketId: socket.id } });
        if (client) {
          await client.update({ status: 'offline' });
          io.emit('client:status', {
            uuid: client.uuid,
            status: 'offline',
            metrics: client.metrics
          });
        }
      } catch (error) {
        logger.error('Error updating client status on disconnect:', error);
      }
    });

    // 클라이언트 상태 업데이트
    socket.on('client:status', async (data) => {
      try {
        const { uuid, status, metrics } = data;
        const client = await Client.findOne({ where: { uuid } });
        
        if (client) {
          await client.update({ 
            status, 
            metrics,
            socketId: socket.id
          });
          io.emit('client:status', { uuid, status, metrics });
        }
      } catch (error) {
        logger.error('Error updating client status:', error);
      }
    });

    // 프리셋 상태 업데이트
    socket.on('preset:status', async (data) => {
      try {
        const { presetId, status } = data;
        const preset = await Preset.findByPk(presetId);
        
        if (preset) {
          await preset.update({ status });
          io.emit('preset:status', { presetId, status });
        }
      } catch (error) {
        logger.error('Error updating preset status:', error);
      }
    });

    // 명령 실행 결과
    socket.on('execution:result', (data) => {
      io.emit('execution:result', data);
    });
  });

  return io;
};

// 클라이언트 등록 이벤트 발생
const emitClientRegistered = (client) => {
  if (io) {
    io.emit('client:registered', client);
  }
};

// 클라이언트 상태 업데이트 이벤트 발생
const emitClientStatus = (client) => {
  if (io) {
    io.emit('client:status', {
      uuid: client.uuid,
      status: client.status,
      metrics: client.metrics
    });
  }
};

// 프리셋 상태 업데이트 이벤트 발생
const emitPresetStatus = (preset) => {
  if (io) {
    io.emit('preset:status', {
      presetId: preset.id,
      status: preset.status
    });
  }
};

// 명령 실행 결과 이벤트 발생
const emitExecutionResult = (result) => {
  if (io) {
    io.emit('execution:result', result);
  }
};

module.exports = {
  initializeSocket,
  emitClientRegistered,
  emitClientStatus,
  emitPresetStatus,
  emitExecutionResult
}; 