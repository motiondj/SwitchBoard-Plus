const dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { Client } = require('../models');
const { emitClientStatus } = require('./socketService');

class UDPService {
  constructor() {
    this.server = dgram.createSocket('udp4');
    this.PORT = 9999;
    this.BROADCAST_ADDR = '255.255.255.255';
    this.HEARTBEAT_INTERVAL = 5000; // 5초
    this.HEARTBEAT_TIMEOUT = 6000; // 6초
    this.startHeartbeatMonitor();
  }

  startHeartbeatMonitor() {
    setInterval(async () => {
      try {
        const now = new Date();
        const clients = await Client.findAll({ where: { status: 'online' } });
        for (const client of clients) {
          if (client.lastSeen && (now - new Date(client.lastSeen) > this.HEARTBEAT_TIMEOUT)) {
            await client.update({ 
              status: 'offline',
              lastSeen: now
            });
            logger.info(`하트비트 타임아웃: ${client.ip} ${client.uuid} offline 처리됨`);
            emitClientStatus(client);
          }
        }
      } catch (e) {
        logger.error('하트비트 타임아웃 검사 중 오류:', e);
      }
    }, 5000); // 5초마다 검사
  }

  async start() {
    try {
      // UDP 서버 시작
      this.server.bind(this.PORT, () => {
        logger.info(`UDP 서버가 포트 ${this.PORT}에서 시작되었습니다.`);
        this.server.setBroadcast(true);
      });

      // 메시지 수신 처리
      this.server.on('message', async (msg, rinfo) => {
        try {
          const message = JSON.parse(msg.toString());
          logger.info(`UDP 메시지 수신: ${JSON.stringify(message)}`);

          switch (message.type) {
            case 'REGISTER':
              await this.handleRegistration(message, rinfo);
              break;
            case 'HEARTBEAT':
              await this.handleHeartbeat(message, rinfo);
              break;
            default:
              logger.warn(`알 수 없는 메시지 타입: ${message.type}`);
          }
        } catch (error) {
          logger.error('UDP 메시지 처리 중 오류:', error);
        }
      });

      // 에러 처리
      this.server.on('error', (err) => {
        logger.error('UDP 서버 에러:', err);
      });

    } catch (error) {
      logger.error('UDP 서버 시작 중 오류:', error);
      throw error;
    }
  }

  async handleRegistration(message, rinfo) {
    try {
      const { name, uuid, version } = message;
      
      // 클라이언트 등록 또는 업데이트
      const [client, created] = await Client.findOrCreate({
        where: { uuid },
        defaults: {
          name,
          version,
          ip: rinfo.address,
          port: rinfo.port,
          status: 'online',
          lastSeen: new Date()
        }
      });

      if (!created) {
        // 기존 클라이언트 업데이트
        await client.update({
          name,
          version,
          ip: rinfo.address,
          port: rinfo.port,
          status: 'online',
          lastSeen: new Date()
        });
      }

      // 등록 확인 메시지 전송
      const response = {
        type: 'REGISTER_ACK',
        status: 'success',
        message: '클라이언트가 성공적으로 등록되었습니다.'
      };

      this.server.send(
        JSON.stringify(response),
        rinfo.port,
        rinfo.address,
        (err) => {
          if (err) logger.error('등록 확인 메시지 전송 실패:', err);
        }
      );

      logger.info(`클라이언트 등록/업데이트 완료: ${name} (${uuid})`);
    } catch (error) {
      logger.error('클라이언트 등록 처리 중 오류:', error);
    }
  }

  async handleHeartbeat(message, rinfo) {
    try {
      const { uuid } = message;
      
      // 클라이언트 상태 업데이트
      const client = await Client.findOne({ where: { uuid } });
      if (client) {
        await client.update({
          status: 'online',
          lastSeen: new Date(),
          ip: rinfo.address,
          port: rinfo.port
        });
        logger.debug(`${rinfo.address} ${uuid}`);
        emitClientStatus(client);
      }
    } catch (error) {
      logger.error('하트비트 처리 중 오류:', error);
    }
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        logger.info('UDP 서버가 종료되었습니다.');
      });
    }
  }
}

const udpService = new UDPService();

module.exports = {
  initializeUDP: () => udpService.start(),
  stopUDP: () => udpService.stop()
}; 