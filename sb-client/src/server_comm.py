import socket
import json
import threading
import time
import logging
from typing import Optional, Dict, Any

class ServerComm:
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.socket: Optional[socket.socket] = None
        self.connected = False
        self.last_heartbeat = 0
        self.heartbeat_thread: Optional[threading.Thread] = None
        self.receive_thread: Optional[threading.Thread] = None
        self.running = False

    def connect(self) -> bool:
        """서버에 연결"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((
                self.config.get('server.host', 'localhost'),
                self.config.get('server.port', 3000)
            ))
            self.connected = True
            self.running = True
            
            # 하트비트 스레드 시작
            self.heartbeat_thread = threading.Thread(target=self._heartbeat_loop)
            self.heartbeat_thread.daemon = True
            self.heartbeat_thread.start()

            # 수신 스레드 시작
            self.receive_thread = threading.Thread(target=self._receive_loop)
            self.receive_thread.daemon = True
            self.receive_thread.start()

            self.logger.info('서버 연결 성공')
            return True

        except Exception as e:
            self.logger.error(f'서버 연결 실패: {e}')
            self.connected = False
            return False

    def disconnect(self):
        """서버 연결 해제"""
        self.running = False
        if self.socket:
            try:
                self.socket.close()
            except:
                pass
        self.connected = False
        self.logger.info('서버 연결 해제')

    def is_connected(self) -> bool:
        """연결 상태 확인"""
        return self.connected

    def send_command(self, command: str, params: Dict[str, Any] = None) -> bool:
        """명령 전송"""
        if not self.connected:
            self.logger.error('서버에 연결되어 있지 않음')
            return False

        try:
            message = {
                'type': 'command',
                'command': command,
                'params': params or {}
            }
            self.socket.sendall(json.dumps(message).encode() + b'\n')
            self.logger.debug(f'명령 전송: {command}')
            return True

        except Exception as e:
            self.logger.error(f'명령 전송 실패: {e}')
            self.connected = False
            return False

    def _heartbeat_loop(self):
        """하트비트 전송 루프"""
        while self.running:
            try:
                if self.connected:
                    self.socket.sendall(b'{"type":"heartbeat"}\n')
                    self.last_heartbeat = time.time()
                time.sleep(5)  # 5초마다 하트비트 전송
            except:
                self.connected = False
                time.sleep(1)  # 연결 끊김 시 1초 대기 후 재시도

    def _receive_loop(self):
        """메시지 수신 루프"""
        buffer = b''
        while self.running:
            try:
                if not self.connected:
                    time.sleep(1)
                    continue

                data = self.socket.recv(4096)
                if not data:
                    self.connected = False
                    continue

                buffer += data
                while b'\n' in buffer:
                    message, buffer = buffer.split(b'\n', 1)
                    self._handle_message(json.loads(message.decode()))

            except json.JSONDecodeError:
                self.logger.error('잘못된 JSON 메시지 수신')
            except Exception as e:
                self.logger.error(f'메시지 수신 중 오류: {e}')
                self.connected = False

    def _handle_message(self, message: Dict[str, Any]):
        """수신된 메시지 처리"""
        try:
            msg_type = message.get('type')
            if msg_type == 'command':
                self._handle_command(message)
            elif msg_type == 'heartbeat_ack':
                self.last_heartbeat = time.time()
            else:
                self.logger.warning(f'알 수 없는 메시지 타입: {msg_type}')

        except Exception as e:
            self.logger.error(f'메시지 처리 중 오류: {e}')

    def _handle_command(self, message: Dict[str, Any]):
        """명령 메시지 처리"""
        command = message.get('command')
        params = message.get('params', {})

        if command == 'start':
            # TODO: nDisplay 시작 명령 처리
            pass
        elif command == 'stop':
            # TODO: nDisplay 중지 명령 처리
            pass
        else:
            self.logger.warning(f'알 수 없는 명령: {command}')

    def stop(self):
        """통신 중지"""
        self.running = False
        self.disconnect()
        if self.heartbeat_thread:
            self.heartbeat_thread.join(timeout=1)
        if self.receive_thread:
            self.receive_thread.join(timeout=1) 