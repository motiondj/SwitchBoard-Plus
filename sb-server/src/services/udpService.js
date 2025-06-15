const dgram = require('dgram');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { Client } = require('../models');
const { emitClientStatus } = require('./socketService');

class UDPService {
  constructor() {
    this.server = dgram.createSocket('udp4');
    this.PORT = 9999;
    this.BROADCAST_ADDR = this.getBroadcastAddress();
    this.HEARTBEAT_INTERVAL = 5000; // 5초
    this.HEARTBEAT_TIMEOUT = 20000; // 20초로 증가
    this.startHeartbeatMonitor();
  }

  getBroadcastAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // IPv4이고 내부 인터페이스가 아닌 경우
        if (iface.family === 'IPv4' && !iface.internal) {
          // IP 주소와 넷마스크를 기반으로 브로드캐스트 주소 계산
          const ipParts = iface.address.split('.');
          const maskParts = iface.netmask.split('.');
          const broadcastParts = ipParts.map((part, i) => {
            return (parseInt(part) | (~parseInt(maskParts[i]) & 255)).toString();
          });
          return broadcastParts.join('.');
        }
      }
    }
    // 기본값으로 255.255.255.255 반환
    return '255.255.255.255';
  }

  startHeartbeatMonitor() {
    setInterval(async () => {
      try {
        const now = new Date();
        const clients = await Client.findAll({ where: { status: 'online' } });
        for (const client of clients) {
          if (client.lastSeen && (now - new Date(client.lastSeen) > this.HEARTBEAT_TIMEOUT)) {
            const lastSeen = new Date(client.lastSeen);
            const diff = now - lastSeen;
            logger.warn(`[DEBUG] 오프라인 판정 직전: now=${now.toISOString()}, lastSeen=${lastSeen.toISOString()}, 차이=${diff}ms`);
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
    }, 6000); // 6초마다 검사
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
            case 'client_discovery':
              await this.handleClientDiscovery(message, rinfo);
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

      logger.info(`하트비트 타임아웃: ${client.ip} ${client.uuid} offline 처리됨`);
      emitClientStatus(client);
    } catch (error) {
      logger.error('UDP 등록 처리 중 오류:', error);
      throw error;
    }
  }

  async handleHeartbeat(message, rinfo) {
    // Implementation of handleHeartbeat method
  }

  async handleClientDiscovery(message, rinfo) {
    try {
      const { uuid, name, ip } = message;
      logger.info(`[UDP] client_discovery - uuid: ${uuid}, name: ${name}, ip: ${ip}`);
      const [client, created] = await Client.findOrCreate({
        where: { uuid },
        defaults: {
          name,
          ip: ip || rinfo.address,
          status: 'online',
          lastSeen: new Date()
        }
      });
      if (!created) {
        await client.update({
          name,
          ip: ip || rinfo.address,
          status: 'online',
          lastSeen: new Date()
        });
      }
      logger.info(`[UDP] client_discovery 처리 완료 - uuid: ${uuid}`);
    } catch (error) {
      logger.error('[UDP] client_discovery 처리 중 오류:', error);
    }
  }
}

const udpService = new UDPService();
module.exports = {
  initializeUDP: () => udpService.start()
};