const axios = require('axios');
const os = require('os');
const dgram = require('dgram');
const { execSync, exec, spawn } = require('child_process');
const { io } = require('socket.io-client');
const path = require('path');
const fs = require('fs');

// 소켓 연결
const socket = io('http://localhost:4000');

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
    const output = execSync('wmic diskdrive get SerialNumber').toString();
    const lines = output.split('\n');
    for (const line of lines) {
      const serial = line.trim();
      if (serial && serial !== 'SerialNumber') {
        return serial;
      }
    }
  } catch (error) {
    console.error('디스크 시리얼 번호 가져오기 실패:', error);
  }
  return 'unknown';
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

// 클라이언트 등록
async function registerClient() {
  try {
    const res = await axios.post('http://localhost:4000/api/clients', {
      uuid,
      name,
      ip,
      status: 'online'
    });
    console.log('클라이언트 등록 성공:', res.data);
  } catch (err) {
    console.error('클라이언트 등록 실패:', err.message);
  }
}

let isRunning = false;
let runningTimeout = null;
let isExecutingCommand = false;
let currentProcess = null; // 실행 중인 프로세스 객체 저장
let currentPid = null; // 실행 중인 프로세스 PID 저장

function killProcessTree(pid) {
  if (process.platform === 'win32') {
    exec(`taskkill /PID ${pid} /T /F`, (err) => {
      if (err) {
        console.error('taskkill 실패:', err);
      } else {
        console.log('프로세스 트리 강제 종료 완료');
      }
    });
  } else {
    try {
      process.kill(-pid, 'SIGKILL');
    } catch (e) {
      console.error('프로세스 트리 종료 실패:', e);
    }
  }
}

// 서버에서 클라이언트 상태를 running으로 바꾸라는 신호를 받으면 running 상태로 전환
socket.on('client:status', (data) => {
  if (data && data.uuid === uuid && data.status === 'running') {
    console.log('서버에서 running 신호 수신, running 상태로 전환');
    isRunning = true;
    if (runningTimeout) clearTimeout(runningTimeout);
    if (!isExecutingCommand) {
      runningTimeout = setTimeout(() => {
        if (isRunning && !isExecutingCommand) {
          console.log('명령 미수신, running 상태에서 online으로 복귀');
          isRunning = false;
        }
      }, 7000);
    }
  }
});

// 명령 수신 시 타이머 취소
console.log('execution:command 리스너 등록');
socket.on('execution:command', (data) => {
  console.log('명령 수신:', data);
  isExecutingCommand = true;
  if (runningTimeout) {
    clearTimeout(runningTimeout);
    runningTimeout = null;
  }
  if (typeof data === 'object' && data.command) {
    // 실행 중인 프로세스가 있다면 먼저 종료
    if (currentProcess && currentPid) {
      killProcessTree(currentPid);
      currentProcess = null;
      currentPid = null;
    }
    // 명령어 파싱
    const args = data.command.split(' ');
    currentProcess = spawn(args[0], args.slice(1), { shell: true, detached: true });
    currentPid = currentProcess.pid;
    currentProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    currentProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    currentProcess.on('close', (code) => {
      console.log(`프로세스 종료, 코드: ${code}`);
      currentProcess = null;
      currentPid = null;
      isExecutingCommand = false;
      isRunning = false;
      // 프로세스 종료 후 상태를 서버에 즉시 보고
      socket.emit('client:status', {
        uuid,
        status: 'online',
        metrics: {
          cpu: os.loadavg()[0],
          memory: {
            total: os.totalmem(),
            free: os.freemem()
          }
        }
      });
    });
  } else {
    console.error('잘못된 명령어 형식:', data);
    socket.emit('command:error', { error: '잘못된 명령어 형식입니다.' });
  }
});

// === 실행 중지 명령 처리 ===
socket.on('execution:stop', () => {
  console.log('실행 중지 명령 수신!', currentProcess, currentPid);
  if (currentProcess && currentPid) {
    killProcessTree(currentPid);
    currentProcess = null;
    currentPid = null;
    // 프로세스 종료 후 상태를 서버에 즉시 보고
    socket.emit('client:status', {
      uuid,
      status: 'online',
      metrics: {
        cpu: os.loadavg()[0],
        memory: {
          total: os.totalmem(),
          free: os.freemem()
        }
      }
    });
    console.log('프로세스 종료 완료');
  } else {
    console.log('종료할 프로세스가 없습니다.');
  }
  isExecutingCommand = false;
  isRunning = false;
});

// 하트비트 전송 시 running 상태면 running, 아니면 online
function sendHeartbeat() {
  if (socket && socket.connected) {
    socket.emit('client:status', {
      uuid,
      status: isRunning ? 'running' : 'online',
      metrics: {
        cpu: os.loadavg()[0],
        memory: {
          total: os.totalmem(),
          free: os.freemem()
        }
      }
    });
  }
}

// 종료 시 오프라인 상태로 변경
function setOfflineOnExit() {
  async function cleanup() {
    try {
      await axios.post('http://localhost:4000/api/clients/status', {
        uuid,
        status: 'offline'
      });
      console.log('클라이언트 오프라인 상태로 변경됨');
    } catch (err) {
      console.error('오프라인 상태 변경 실패:', err.message);
    }
    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

socket.on('connect', () => {
  console.log('서버에 연결됨');
  registerClient();
});

socket.on('disconnect', () => {
  console.log('서버와 연결 끊김');
});

// 브로드캐스트 주소 자동 감지
function getBroadcastAddress() {
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

// UDP 브로드캐스트 설정
const udpClient = dgram.createSocket('udp4');
const broadcastAddress = getBroadcastAddress();
const broadcastPort = 9999;

// 브로드캐스트 메시지 전송
function sendBroadcast() {
  const message = JSON.stringify({
    type: 'client_discovery',
    uuid,
    name,
    ip
  });

  udpClient.send(message, broadcastPort, broadcastAddress, (err) => {
    if (err) {
      console.error('브로드캐스트 전송 실패:', err);
    }
  });
}

// 주기적으로 브로드캐스트 전송
setInterval(sendBroadcast, 10000);

// 초기화
(async () => {
  await checkDuplicate();
  setInterval(registerClient, 30000);
  registerClient();
  setInterval(sendHeartbeat, 5000);
  setOfflineOnExit();
  process.stdin.resume();
})(); 