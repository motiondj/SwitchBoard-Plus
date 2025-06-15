const socketIO = require('socket.io');
const logger = require('../utils/logger');
const { Client, Preset } = require('../models');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`[SOCKET] 클라이언트 연결됨 - socketId: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`[SOCKET] 클라이언트 연결 해제 - socketId: ${socket.id}`);
    });

    // 클라이언트 디스커버리
    socket.on('client_discovery', async (data) => {
      try {
        const { uuid, name, ip } = data;
        logger.info(`[SOCKET] 클라이언트 디스커버리 - uuid: ${uuid}, name: ${name}, ip: ${ip}`);

        const [client, created] = await Client.findOrCreate({
          where: { uuid },
          defaults: {
            name,
            ip,
            status: 'online',
            socketId: socket.id
          }
        });

        if (!created) {
          await client.update({
            name,
            ip,
            status: 'online',
            socketId: socket.id
          });
        }

        socket.emit('client:registered', {
          id: client.id,
          uuid: client.uuid,
          name: client.name,
          status: client.status
        });

        logger.info(`[SOCKET] 클라이언트 디스커버리 처리 완료 - uuid: ${uuid}, socketId: ${socket.id}`);
      } catch (error) {
        logger.error('Error handling client discovery:', error);
        socket.emit('error', { message: 'Failed to handle client discovery' });
      }
    });

    // 클라이언트 등록
    socket.on('client:register', async (data) => {
      try {
        const { uuid, name, ip } = data;
        logger.info(`[SOCKET] 클라이언트 등록 시도 - uuid: ${uuid}, name: ${name}, ip: ${ip}`);

        const [client, created] = await Client.findOrCreate({
          where: { uuid },
          defaults: {
            name,
            ip,
            status: 'online',
            socketId: socket.id
          }
        });

        if (!created) {
          await client.update({
            name,
            ip,
            status: 'online',
            socketId: socket.id
          });
        }

        socket.emit('client:registered', {
          id: client.id,
          uuid: client.uuid,
          name: client.name,
          status: client.status
        });

        logger.info(`[SOCKET] 클라이언트 등록 완료 - uuid: ${uuid}, socketId: ${socket.id}`);
      } catch (error) {
        logger.error('Error registering client:', error);
        socket.emit('error', { message: 'Failed to register client' });
      }
    });

    // 클라이언트 상태 업데이트 (하트비트)
    socket.on('client:status', async (data) => {
      try {
        const { uuid, status, metrics } = data;
        logger.info(`[SOCKET] client:status 수신 - uuid: ${uuid}, socketId: ${socket.id}, status: ${status}`);
        
        const client = await Client.findOne({ where: { uuid } });
        
        if (client) {
          // 1. running 상태는 하트비트로 덮어쓰지 않음
          if (client.status === 'running') {
            logger.info(`[SOCKET] 클라이언트가 running 상태이므로 하트비트 상태(${status}) 무시`);
            // lastSeen은 업데이트
            await client.update({
              lastSeen: new Date()
            });
            return;
          }

          // 2. offline 상태일 때는 online으로 변경 가능
          if (client.status === 'offline' && status === 'online') {
            logger.info(`[SOCKET] 클라이언트 상태를 offline에서 online으로 변경`);
            await client.update({ 
              status: 'online',
              metrics,
              socketId: socket.id,
              lastSeen: new Date()
            });
            io.emit('client:status', { uuid, status: 'online', metrics });
            return;
          }

          // 3. 그 외의 경우에만 하트비트 상태로 업데이트
          logger.info(`[SOCKET] 클라이언트 찾음 - uuid: ${uuid}, 기존 socketId: ${client.socketId}, 새 socketId: ${socket.id}`);
          await client.update({ 
            status, 
            metrics,
            socketId: socket.id,
            lastSeen: new Date()
          });
          io.emit('client:status', { uuid, status, metrics });
          logger.info(`[SOCKET] 클라이언트 상태 업데이트 완료 - uuid: ${uuid}, status: ${status}`);
        } else {
          logger.warn(`[SOCKET] 클라이언트를 찾을 수 없음 - uuid: ${uuid}`);
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

const emitClientRegistered = (client) => {
  if (io) {
    io.emit('client:registered', {
      id: client.id,
      uuid: client.uuid,
      name: client.name,
      status: client.status
    });
  }
};

const emitClientStatus = (data) => {
  if (io) {
    io.emit('client:status', data);
  }
};

const emitPresetStatus = (data) => {
  if (io) {
    io.emit('preset:status', data);
  }
};

const emitExecutionResult = (data) => {
  if (io) {
    io.emit('execution:result', data);
  }
};

const emitExecutionCommand = (client, command) => {
  if (io && client.socketId) {
    io.to(client.socketId).emit('execution:command', {
      command,
      timestamp: new Date().toISOString()
    });
  }
};

const emitExecutionStop = (client) => {
  if (io && client.socketId) {
    io.to(client.socketId).emit('execution:stop');
  }
};

module.exports = {
  initializeSocket,
  emitClientRegistered,
  emitClientStatus,
  emitPresetStatus,
  emitExecutionResult,
  emitExecutionCommand,
  emitExecutionStop
}; 