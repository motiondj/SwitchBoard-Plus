const axios = require('axios');
const os = require('os');
const dgram = require('dgram');
const { execSync } = require('child_process');

function getMacAddress() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (!iface.internal && iface.mac && iface.mac !== '00:00:00:00:00:00') {
        return iface.mac;
      }
    }
  }
  return null;
}

function getDiskSerial() {
  try {
    // Windows 환경 기준
    const output = execSync('wmic diskdrive get SerialNumber').toString();
    const lines = output.split('\n').map(line => line.trim()).filter(Boolean);
    // 첫 번째 시리얼 넘버만 사용
    return lines[1] || '';
  } catch (e) {
    return '';
  }
}

const mac = getMacAddress();
const diskSerial = getDiskSerial();
const uuid = `${mac}_${diskSerial}`;
const name = 'Display 1';
const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i.family === 'IPv4' && !i.internal)?.address || '127.0.0.1';

// 한 PC에서 여러 개 실행 방지
async function checkDuplicate() {
  try {
    const res = await axios.get(`http://localhost:4000/api/clients/by-uuid/${uuid}`);
    if (res.data && res.data.status === 'online') {
      console.error('이미 이 PC에서 클라이언트가 실행 중입니다. 종료합니다.');
      process.exit(1);
    }
  } catch (err) {
    // 등록된 클라이언트가 없으면 계속 진행
  }
}

async function registerClient() {
  try {
    const res = await axios.post('http://localhost:4000/api/clients', {
      uuid,
      name,
      ip
    });
    console.log('클라이언트 등록/업데이트 성공:', res.data);
  } catch (err) {
    console.error('에러:', err.response?.data || err.message);
  }
}

// UDP 하트비트 전송
const udpClient = dgram.createSocket('udp4');
const UDP_PORT = 9999;
const UDP_HOST = 'localhost';

function sendHeartbeat() {
  const heartbeatMsg = JSON.stringify({
    type: 'HEARTBEAT',
    uuid: uuid
  });
  udpClient.send(heartbeatMsg, UDP_PORT, UDP_HOST, (err) => {
    if (err) {
      console.error('하트비트 전송 에러:', err);
    }
  });
}

function setOfflineOnExit() {
  async function setOffline() {
    try {
      await axios.put(`http://localhost:4000/api/clients/${uuid}/status`, { 
        status: 'offline',
        lastSeen: new Date()
      });
      console.log('클라이언트 offline 상태로 전송 완료');
    } catch (e) {
      console.error('offline 상태 전송 실패:', e);
    }
  }

  // 정상 종료 시그널 처리
  process.on('SIGINT', async () => {
    await setOffline();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await setOffline();
    process.exit(0);
  });

  // 비정상 종료 시그널 처리
  process.on('SIGHUP', async () => {
    await setOffline();
    process.exit(1);
  });
  process.on('SIGBREAK', async () => {
    await setOffline();
    process.exit(1);
  });

  // 프로세스 종료 시 처리
  process.on('exit', async () => {
    await setOffline();
  });

  // 예기치 않은 에러 처리
  process.on('uncaughtException', async (error) => {
    console.error('예기치 않은 에러 발생:', error);
    await setOffline();
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error('처리되지 않은 Promise 거부:', reason);
    await setOffline();
    process.exit(1);
  });
}

console.log('SwitchBoard Plus 클라이언트가 실행되었습니다.');

(async () => {
  await checkDuplicate();
  setInterval(registerClient, 10000);
  registerClient();
  setInterval(sendHeartbeat, 5000);
  setOfflineOnExit();
  process.stdin.resume();
})();

// TODO: 서버 연결, 메시지 송수신 등 클라이언트 로직을 여기에 추가 