# 트레이 클라이언트 개발 가이드 - Switchboard Plus

## 📋 개요

이 가이드는 Switchboard Plus의 Python 기반 시스템 트레이 클라이언트를 개발하는 상세한 과정을 설명합니다.

## 🔑 Part 10: 클라이언트 고유 식별

### 10.1 MAC 주소 기반 UUID 시스템

**왜 MAC 주소 기반 UUID를 사용하는가?**
- 동일 PC는 항상 동일한 식별자를 가짐
- DB에 중복 클라이언트가 생기지 않음
- PC 재부팅, 프로그램 재시작해도 동일한 ID 유지
- Wake-on-LAN 등 네트워크 관리 기능 활용 가능

### 10.2 구현 세부사항

**UUID 생성 및 관리:**
```python
import uuid
import platform

class ClientIdentity:
    """클라이언트 고유 식별 관리"""
    
    @staticmethod
    def get_mac_address():
        """MAC 주소를 문자열로 반환"""
        mac = uuid.getnode()
        mac_str = ':'.join(('%012X' % mac)[i:i+2] for i in range(0, 12, 2))
        return mac_str
    
    @staticmethod
    def get_client_uuid():
        """MAC 기반 고유 UUID 생성"""
        mac = uuid.getnode()
        return str(uuid.UUID(int=mac))
    
    @staticmethod
    def get_hostname():
        """컴퓨터 호스트명 반환"""
        return platform.node()
    
    @staticmethod
    def get_primary_ip():
        """주 IP 주소 반환"""
        import socket
        try:
            # 외부 연결을 통해 실제 사용 중인 IP 확인
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return socket.gethostbyname(socket.gethostname())
```

### 10.3 서버 등록 프로세스

**자동 등록/업데이트 플로우:**
1. 클라이언트 시작
2. MAC 주소에서 UUID 생성
3. 서버에 등록 요청 전송
4. 서버는 UUID로 조회:
   - 기존 클라이언트면 정보만 업데이트
   - 새 클라이언트면 신규 등록
5. 이후 모든 통신에 UUID 사용

### 10.4 특수 상황 처리

**가상머신/컨테이너:**
```python
def get_stable_uuid(config):
    """안정적인 UUID 확보"""
    # 1. 설정 파일에 고정 UUID가 있으면 사용
    if config.get("fixed_uuid"):
        return config.get("fixed_uuid")
    
    # 2. MAC 기반 UUID 시도
    try:
        return ClientIdentity.get_client_uuid()
    except:
        # 3. 실패 시 랜덤 UUID 생성 후 저장
        new_uuid = str(uuid.uuid4())
        config.set("fixed_uuid", new_uuid)
        return new_uuid
```

**다중 네트워크 어댑터:**
```python
def get_primary_mac():
    """주 네트워크 어댑터의 MAC 주소 획득"""
    import psutil
    
    # 활성 네트워크 인터페이스 찾기
    for interface, addrs in psutil.net_if_addrs().items():
        for addr in addrs:
            if addr.family == psutil.AF_LINK:  # MAC 주소
                # lo, localhost 등 제외
                if not interface.startswith(('lo', 'vir', 'docker')):
                    return addr.address
    
    # 못 찾으면 기본값 사용
    return uuid.getnode()
```

### 10.5 운영 모드

**프로덕션 모드:**
- MAC 기반 UUID 자동 사용
- 클라이언트당 하나의 고유 ID
- 자동 중복 제거

**개발/테스트 모드:**
```python
# config.json
{
    "development_mode": true,
    "test_uuid": "test-client-001",
    "allow_multiple_instances": true
}
```

### 10.6 보안 고려사항

- UUID와 MAC 주소는 민감정보가 아니지만, 네트워크 구조 파악에 사용될 수 있음
- HTTPS 사용 시 전송 중 암호화
- 필요시 UUID를 해시하여 사용 가능

### 10.7 장점 정리

1. **자동화**: 사용자가 별도 설정 없이 자동으로 고유 ID 생성
2. **중복 방지**: 같은 PC를 여러 번 등록해도 DB에 하나만 존재
3. **추적성**: PC 변경 이력 추적 가능
4. **관리 편의**: MAC 주소로 Wake-on-LAN, 자산 관리 등 가능
5. **안정성**: 재부팅, 재설치해도 동일 ID 유지

---

## 🏗️ Part 1: 프로젝트 구조

### 1.1 폴더 구조
```
sb-client/
├── src/
│   ├── main.py              # 메인 진입점
│   ├── tray_app.py          # 트레이 애플리케이션
│   ├── server_comm.py       # 서버 통신 모듈
│   ├── process_manager.py   # 프로세스 관리
│   ├── config_manager.py    # 설정 관리
│   └── utils/
│       ├── logger.py        # 로깅 설정
│       └── constants.py     # 상수 정의
│
├── assets/
│   └── icons/               # 트레이 아이콘
│       ├── icon_idle.png    # 대기 상태
│       ├── icon_running.png # 실행 중
│       └── icon_error.png   # 오류 상태
│
├── config.json              # 기본 설정 파일
├── requirements.txt         # 의존성 목록
└── build.py                # 빌드 스크립트
```

### 1.2 프로젝트 초기화
```bash
cd sb-client

# 가상환경 생성 및 활성화
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

---

## 🎯 Part 2: 핵심 구현

### 2.1 메인 진입점

**src/main.py**:
```python
import sys
import os
from PyQt5.QtWidgets import QApplication
from tray_app import TrayApplication
from utils.logger import setup_logger

def main():
    """메인 진입점"""
    # 로거 설정
    logger = setup_logger()
    logger.info("SB+ Client starting...")
    
    # Qt 애플리케이션 생성
    app = QApplication(sys.argv)
    app.setQuitOnLastWindowClosed(False)  # 트레이만 사용
    
    # 트레이 애플리케이션 시작
    tray_app = TrayApplication()
    tray_app.show()
    
    # 이벤트 루프 실행
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
```

### 2.2 시스템 트레이 구현

**src/tray_app.py**:
```python
import os
import json
from PyQt5.QtWidgets import QSystemTrayIcon, QMenu, QAction, QMessageBox
from PyQt5.QtCore import QTimer, pyqtSignal, QObject
from PyQt5.QtGui import QIcon
from server_comm import ServerCommunicator
from process_manager import ProcessManager
from config_manager import ConfigManager

class TrayApplication(QObject):
    """시스템 트레이 애플리케이션"""
    
    # 시그널 정의
    status_changed = pyqtSignal(str)
    
    def __init__(self):
        super().__init__()
        self.config = ConfigManager()
        self.server_comm = ServerCommunicator(self.config)
        self.process_manager = ProcessManager()
        
        # 트레이 아이콘 설정
        self.tray_icon = QSystemTrayIcon(self)
        self.set_icon("idle")
        
        # 메뉴 생성
        self.create_menu()
        
        # 서버 통신 시작
        self.server_comm.command_received.connect(self.handle_command)
        self.server_comm.start()
        
        # 하트비트 타이머
        self.heartbeat_timer = QTimer()
        self.heartbeat_timer.timeout.connect(self.send_heartbeat)
        self.heartbeat_timer.start(5000)  # 5초마다
        
    def create_menu(self):
        """트레이 메뉴 생성"""
        menu = QMenu()
        
        # 상태 표시
        self.status_action = QAction("상태: 대기 중", self)
        self.status_action.setEnabled(False)
        menu.addAction(self.status_action)
        
        menu.addSeparator()
        
        # 수동 실행/중지
        self.execute_action = QAction("프로그램 실행", self)
        self.execute_action.triggered.connect(self.manual_execute)
        menu.addAction(self.execute_action)
        
        self.stop_action = QAction("프로그램 중지", self)
        self.stop_action.triggered.connect(self.manual_stop)
        self.stop_action.setEnabled(False)
        menu.addAction(self.stop_action)
        
        menu.addSeparator()
        
        # 설정
        settings_action = QAction("설정", self)
        settings_action.triggered.connect(self.show_settings)
        menu.addAction(settings_action)
        
        # 로그 보기
        log_action = QAction("로그 보기", self)
        log_action.triggered.connect(self.show_logs)
        menu.addAction(log_action)
        
        menu.addSeparator()
        
        # 종료
        quit_action = QAction("종료", self)
        quit_action.triggered.connect(self.quit_application)
        menu.addAction(quit_action)
        
        self.tray_icon.setContextMenu(menu)
        
    def set_icon(self, status):
        """상태에 따른 아이콘 변경"""
        icon_map = {
            "idle": "icon_idle.png",
            "running": "icon_running.png",
            "error": "icon_error.png"
        }
        
        icon_path = os.path.join("assets", "icons", icon_map.get(status, "icon_idle.png"))
        self.tray_icon.setIcon(QIcon(icon_path))
        
        # 툴팁 업데이트
        tooltips = {
            "idle": "SB+ Client - 대기 중",
            "running": "SB+ Client - 실행 중",
            "error": "SB+ Client - 오류"
        }
        self.tray_icon.setToolTip(tooltips.get(status, "SB+ Client"))
        
    def handle_command(self, command_data):
        """서버로부터 받은 명령 처리"""
        command = command_data.get("command")
        
        if command == "execute":
            full_command = command_data.get("fullCommand")
            if full_command:
                success = self.process_manager.execute(full_command)
                if success:
                    self.set_icon("running")
                    self.status_action.setText("상태: 실행 중")
                    self.execute_action.setEnabled(False)
                    self.stop_action.setEnabled(True)
                else:
                    self.set_icon("error")
                    self.show_notification("실행 실패", "프로그램을 실행할 수 없습니다.")
                    
        elif command == "stop":
            success = self.process_manager.stop()
            if success:
                self.set_icon("idle")
                self.status_action.setText("상태: 대기 중")
                self.execute_action.setEnabled(True)
                self.stop_action.setEnabled(False)
                
    def send_heartbeat(self):
        """하트비트 전송"""
        status = "idle"
        if self.process_manager.is_running():
            status = "running"
            
        metrics = self.process_manager.get_metrics()
        self.server_comm.send_heartbeat(status, metrics)
        
    def manual_execute(self):
        """수동 실행 (테스트용)"""
        # 설정에서 기본 명령어 읽기
        default_command = self.config.get("default_command", "")
        if default_command:
            self.handle_command({
                "command": "execute",
                "fullCommand": default_command
            })
            
    def manual_stop(self):
        """수동 중지"""
        self.handle_command({"command": "stop"})
        
    def show_notification(self, title, message):
        """시스템 알림 표시"""
        self.tray_icon.showMessage(title, message, QSystemTrayIcon.Information, 3000)
        
    def show_settings(self):
        """설정 다이얼로그 표시"""
        # TODO: 설정 다이얼로그 구현
        QMessageBox.information(None, "설정", "설정 기능은 준비 중입니다.")
        
    def show_logs(self):
        """로그 폴더 열기"""
        import subprocess
        import platform
        
        log_dir = os.path.join(os.getcwd(), "logs")
        if platform.system() == "Windows":
            subprocess.Popen(f'explorer "{log_dir}"')
        elif platform.system() == "Darwin":  # macOS
            subprocess.Popen(["open", log_dir])
        else:  # Linux
            subprocess.Popen(["xdg-open", log_dir])
            
    def show(self):
        """트레이 아이콘 표시"""
        self.tray_icon.show()
        self.show_notification("SB+ Client", "클라이언트가 시작되었습니다.")
        
    def quit_application(self):
        """애플리케이션 종료"""
        # 실행 중인 프로세스 정리
        if self.process_manager.is_running():
            self.process_manager.stop()
            
        # 서버 연결 종료
        self.server_comm.stop()
        
        # Qt 애플리케이션 종료
        QApplication.quit()
```

### 2.3 서버 통신 모듈

**src/server_comm.py**:
```python
import json
import socket
import threading
import requests
import uuid
from PyQt5.QtCore import QObject, pyqtSignal
import logging

logger = logging.getLogger(__name__)

class ServerCommunicator(QObject):
    """서버와의 통신 담당"""
    
    # 시그널 정의
    command_received = pyqtSignal(dict)
    connection_status_changed = pyqtSignal(bool)
    
    def __init__(self, config):
        super().__init__()
        self.config = config
        self.server_url = config.get("server_url", "http://localhost:8000")
        self.client_name = config.get("client_name", "Unknown")
        self.client_uuid = self._get_client_uuid()
        self.client_mac = self._get_mac_address()
        self.running = False
        
        # UDP 브로드캐스트 설정
        self.broadcast_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.broadcast_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        
        # HTTP 수신 서버
        self.http_port = config.get("client_port", 8081)
        
    def _get_client_uuid(self):
        """MAC 주소 기반 고유 UUID 생성"""
        mac = uuid.getnode()
        return str(uuid.UUID(int=mac))
        
    def _get_mac_address(self):
        """MAC 주소를 문자열로 반환"""
        mac = uuid.getnode()
        mac_str = ':'.join(('%012X' % mac)[i:i+2] for i in range(0, 12, 2))
        return mac_str
        
    def start(self):
        """통신 시작"""
        self.running = True
        
        # 브로드캐스트 스레드 시작
        self.broadcast_thread = threading.Thread(target=self._broadcast_loop)
        self.broadcast_thread.daemon = True
        self.broadcast_thread.start()
        
        # HTTP 서버 스레드 시작
        self.http_thread = threading.Thread(target=self._start_http_server)
        self.http_thread.daemon = True
        self.http_thread.start()
        
        # 초기 등록
        self._register_to_server()
        
    def stop(self):
        """통신 중지"""
        self.running = False
        self.broadcast_socket.close()
        
    def _broadcast_loop(self):
        """UDP 브로드캐스트 루프"""
        while self.running:
            try:
                # 브로드캐스트 메시지 생성
                message = json.dumps({
                    "type": "client_announce",
                    "name": self.client_name,
                    "uuid": self.client_uuid,
                    "mac": self.client_mac,
                    "port": self.http_port,
                    "version": "1.0.0"
                })
                
                # 브로드캐스트 전송 (포트 9999)
                self.broadcast_socket.sendto(
                    message.encode('utf-8'),
                    ('255.255.255.255', 9999)
                )
                
                # 10초 대기
                threading.Event().wait(10)
                
            except Exception as e:
                logger.error(f"Broadcast error: {e}")
                
    def _start_http_server(self):
        """간단한 HTTP 서버로 명령 수신"""
        from http.server import HTTPServer, BaseHTTPRequestHandler
        import json
        
        parent = self
        
        class CommandHandler(BaseHTTPRequestHandler):
            def do_POST(self):
                if self.path == '/command':
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    
                    try:
                        command_data = json.loads(post_data.decode('utf-8'))
                        parent.command_received.emit(command_data)
                        
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "ok"}).encode())
                        
                    except Exception as e:
                        logger.error(f"Command handling error: {e}")
                        self.send_response(500)
                        self.end_headers()
                        
            def log_message(self, format, *args):
                # HTTP 서버 로그 억제
                pass
                
        try:
            server = HTTPServer(('0.0.0.0', self.http_port), CommandHandler)
            logger.info(f"HTTP server started on port {self.http_port}")
            server.serve_forever()
        except Exception as e:
            logger.error(f"HTTP server error: {e}")
            
    def _register_to_server(self):
        """서버에 직접 등록 (UUID 포함)"""
        try:
            # 현재 IP 주소 가져오기
            hostname = socket.gethostname()
            ip_address = socket.gethostbyname(hostname)
            
            response = requests.post(
                f"{self.server_url}/api/clients",
                json={
                    "name": self.client_name,
                    "uuid": self.client_uuid,
                    "mac": self.client_mac,
                    "ip_address": ip_address,
                    "port": self.http_port,
                    "hostname": hostname
                },
                timeout=5
            )
            
            if response.status_code == 200:
                logger.info(f"Successfully registered to server (UUID: {self.client_uuid})")
                self.connection_status_changed.emit(True)
            else:
                logger.error(f"Registration failed: {response.status_code}")
                self.connection_status_changed.emit(False)
                
        except Exception as e:
            logger.error(f"Registration error: {e}")
            self.connection_status_changed.emit(False)
            
    def send_heartbeat(self, status, metrics):
        """하트비트 전송 (UUID 포함)"""
        try:
            response = requests.post(
                f"{self.server_url}/api/heartbeat",
                json={
                    "uuid": self.client_uuid,
                    "name": self.client_name,
                    "status": status,
                    "metrics": metrics
                },
                timeout=2
            )
            
            if response.status_code != 200:
                logger.warning(f"Heartbeat failed: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Heartbeat error: {e}")
            
    def send_execution_result(self, success, error_message=None):
        """실행 결과 전송 (UUID 포함)"""
        try:
            response = requests.post(
                f"{self.server_url}/api/execution-result",
                json={
                    "uuid": self.client_uuid,
                    "name": self.client_name,
                    "success": success,
                    "error": error_message
                },
                timeout=2
            )
        except Exception as e:
            logger.error(f"Result sending error: {e}")
```
```

### 2.4 프로세스 관리자

**src/process_manager.py**:
```python
import subprocess
import psutil
import logging
import os
import time
from threading import Lock

logger = logging.getLogger(__name__)

class ProcessManager:
    """언리얼엔진 프로세스 관리"""
    
    def __init__(self):
        self.current_process = None
        self.process_pid = None
        self.lock = Lock()
        
    def execute(self, full_command):
        """프로세스 실행"""
        with self.lock:
            # 이미 실행 중인지 확인
            if self.is_running():
                logger.warning("Process is already running")
                return False
                
            try:
                # 작업 디렉토리 추출 (실행 파일의 디렉토리)
                parts = full_command.split()
                if parts:
                    exe_path = parts[0]
                    working_dir = os.path.dirname(exe_path)
                else:
                    logger.error("Invalid command")
                    return False
                    
                # 프로세스 실행
                logger.info(f"Executing: {full_command}")
                self.current_process = subprocess.Popen(
                    full_command,
                    shell=True,
                    cwd=working_dir,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                
                self.process_pid = self.current_process.pid
                logger.info(f"Process started with PID: {self.process_pid}")
                
                # 프로세스가 정상적으로 시작되었는지 확인 (1초 대기)
                time.sleep(1)
                if self.current_process.poll() is not None:
                    # 프로세스가 즉시 종료됨
                    stdout, stderr = self.current_process.communicate()
                    logger.error(f"Process terminated immediately. Error: {stderr.decode()}")
                    return False
                    
                return True
                
            except Exception as e:
                logger.error(f"Execution error: {e}")
                return False
                
    def stop(self):
        """프로세스 중지"""
        with self.lock:
            if not self.is_running():
                logger.warning("No process is running")
                return True
                
            try:
                # psutil로 프로세스 트리 종료
                if self.process_pid:
                    parent = psutil.Process(self.process_pid)
                    children = parent.children(recursive=True)
                    
                    # 자식 프로세스들 먼저 종료
                    for child in children:
                        try:
                            child.terminate()
                        except psutil.NoSuchProcess:
                            pass
                            
                    # 부모 프로세스 종료
                    try:
                        parent.terminate()
                    except psutil.NoSuchProcess:
                        pass
                        
                    # 종료 대기 (최대 5초)
                    gone, alive = psutil.wait_procs(children + [parent], timeout=5)
                    
                    # 강제 종료가 필요한 경우
                    for p in alive:
                        try:
                            p.kill()
                        except psutil.NoSuchProcess:
                            pass
                            
                self.current_process = None
                self.process_pid = None
                logger.info("Process stopped successfully")
                return True
                
            except Exception as e:
                logger.error(f"Stop error: {e}")
                return False
                
    def is_running(self):
        """프로세스 실행 중 확인"""
        if self.current_process is None:
            return False
            
        # poll()이 None이면 아직 실행 중
        if self.current_process.poll() is None:
            return True
            
        # 프로세스가 종료됨
        self.current_process = None
        self.process_pid = None
        return False
        
    def get_metrics(self):
        """프로세스 메트릭 수집"""
        metrics = {
            "cpu_percent": 0,
            "memory_percent": 0,
            "memory_mb": 0
        }
        
        try:
            if self.process_pid and self.is_running():
                process = psutil.Process(self.process_pid)
                
                # CPU 사용률 (0.1초 간격으로 측정)
                metrics["cpu_percent"] = process.cpu_percent(interval=0.1)
                
                # 메모리 사용량
                memory_info = process.memory_info()
                metrics["memory_mb"] = memory_info.rss / 1024 / 1024  # MB 단위
                metrics["memory_percent"] = process.memory_percent()
                
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
            
        # 시스템 전체 메트릭도 추가
        metrics["system_cpu"] = psutil.cpu_percent(interval=0.1)
        metrics["system_memory"] = psutil.virtual_memory().percent
        
        return metrics
```

### 2.5 설정 관리자

**src/config_manager.py**:
```python
import json
import os
import logging

logger = logging.getLogger(__name__)

class ConfigManager:
    """설정 관리"""
    
    def __init__(self, config_file="config.json"):
        self.config_file = config_file
        self.config = self._load_config()
        
    def _load_config(self):
        """설정 파일 로드"""
        default_config = {
            "server_url": "http://localhost:8000",
            "client_name": f"Display_{os.environ.get('COMPUTERNAME', 'Unknown')}",
            "client_port": 8081,
            "heartbeat_interval": 5,
            "log_level": "INFO",
            "default_command": "",
            "fixed_uuid": None,  # 고정 UUID (선택사항)
            "development_mode": False,  # 개발 모드
            "allow_multiple_instances": False  # 다중 인스턴스 허용
        }
        
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    loaded_config = json.load(f)
                    # 기본값과 병합
                    default_config.update(loaded_config)
                    logger.info(f"Config loaded from {self.config_file}")
            else:
                # 기본 설정 파일 생성
                self._save_config(default_config)
                logger.info(f"Default config created at {self.config_file}")
                
        except Exception as e:
            logger.error(f"Config loading error: {e}")
            
        return default_config
        
    def _save_config(self, config=None):
        """설정 파일 저장"""
        if config is None:
            config = self.config
            
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            logger.info(f"Config saved to {self.config_file}")
        except Exception as e:
            logger.error(f"Config saving error: {e}")
            
    def get(self, key, default=None):
        """설정 값 가져오기"""
        return self.config.get(key, default)
        
    def set(self, key, value):
        """설정 값 설정"""
        self.config[key] = value
        self._save_config()
        
    def update(self, updates):
        """여러 설정 업데이트"""
        self.config.update(updates)
        self._save_config()
```

### 2.6 로깅 설정

**src/utils/logger.py**:
```python
import logging
import os
from datetime import datetime

def setup_logger():
    """로거 설정"""
    # 로그 디렉토리 생성
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
        
    # 로그 파일명 (날짜별)
    log_file = os.path.join(log_dir, f"sb_client_{datetime.now():%Y%m%d}.log")
    
    # 로거 설정
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8'),
            logging.StreamHandler()  # 콘솔 출력
        ]
    )
    
    return logging.getLogger('SB+Client')
```

---

## 🎨 Part 3: 아이콘 및 리소스

### 3.1 아이콘 생성 스크립트

**create_icons.py**:
```python
from PIL import Image, ImageDraw

def create_icon(color, filename):
    """간단한 원형 아이콘 생성"""
    size = (64, 64)
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 원 그리기
    margin = 8
    draw.ellipse([margin, margin, size[0]-margin, size[1]-margin], 
                 fill=color, outline=(0, 0, 0, 255))
    
    # 저장
    img.save(f"assets/icons/{filename}")

# 아이콘 생성
create_icon((128, 128, 128, 255), "icon_idle.png")    # 회색
create_icon((0, 255, 0, 255), "icon_running.png")     # 초록색
create_icon((255, 0, 0, 255), "icon_error.png")       # 빨간색
```

---

## 🚀 Part 4: 빌드 및 배포

### 4.1 실행 파일 생성

**build.py**:
```python
import PyInstaller.__main__
import os
import shutil

def build():
    """실행 파일 빌드"""
    
    # 빌드 옵션
    PyInstaller.__main__.run([
        'src/main.py',
        '--name=SBPlusClient',
        '--onefile',
        '--windowed',  # 콘솔 창 숨김
        '--icon=assets/icons/icon_idle.ico',  # .ico 파일 필요
        '--add-data=assets;assets',
        '--add-data=config.json;.',
        '--hidden-import=PyQt5',
        '--hidden-import=psutil',
        '--hidden-import=requests',
    ])
    
    # 빌드 결과 정리
    if os.path.exists('dist/SBPlusClient.exe'):
        print("Build successful!")
        print("Executable: dist/SBPlusClient.exe")
    else:
        print("Build failed!")

if __name__ == "__main__":
    build()
```

### 4.2 설치 스크립트

**install.bat** (Windows):
```batch
@echo off
echo Installing SB+ Client...

:: 설치 디렉토리 생성
set INSTALL_DIR=%ProgramFiles%\SBPlusClient
mkdir "%INSTALL_DIR%" 2>nul

:: 파일 복사
copy /Y dist\SBPlusClient.exe "%INSTALL_DIR%\"
copy /Y config.json "%INSTALL_DIR%\"
xcopy /Y /E assets "%INSTALL_DIR%\assets\" >nul

:: 시작 메뉴 바로가기 생성
powershell -Command "$WS = New-Object -ComObject WScript.Shell; $SC = $WS.CreateShortcut('%APPDATA%\Microsoft\Windows\Start Menu\Programs\SB+ Client.lnk'); $SC.TargetPath = '%INSTALL_DIR%\SBPlusClient.exe'; $SC.Save()"

:: 자동 시작 등록 (선택사항)
echo Would you like to start SB+ Client automatically at startup? (Y/N)
choice /C YN /N
if %ERRORLEVEL%==1 (
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "SBPlusClient" /t REG_SZ /d "%INSTALL_DIR%\SBPlusClient.exe" /f
)

echo Installation complete!
pause
```

---

## 🐛 Part 5: 디버깅 및 테스트

### 5.1 테스트 스크립트

**test_client.py**:
```python
import unittest
from src.process_manager import ProcessManager
import time

class TestProcessManager(unittest.TestCase):
    def setUp(self):
        self.pm = ProcessManager()
        
    def test_execute_notepad(self):
        """메모장 실행 테스트"""
        # Windows 메모장 실행
        success = self.pm.execute("notepad.exe")
        self.assertTrue(success)
        
        # 실행 확인
        time.sleep(1)
        self.assertTrue(self.pm.is_running())
        
        # 종료
        self.pm.stop()
        time.sleep(1)
        self.assertFalse(self.pm.is_running())

if __name__ == '__main__':
    unittest.main()
```

### 5.2 수동 테스트 방법

1. **기본 실행 테스트**:
```bash
python src/main.py
```

2. **서버 연결 테스트**:
```python
# 서버가 실행 중이어야 함
import requests
response = requests.get("http://localhost:8000/api/health")
print(f"Server status: {response.status_code}")
```

3. **명령어 실행 테스트**:
```python
# 테스트용 명령어 전송
import requests
import json

command_data = {
    "command": "execute",
    "fullCommand": "notepad.exe"
}

response = requests.post(
    "http://localhost:8081/command",
    json=command_data
)
print(f"Command sent: {response.status_code}")
```

---

## 📋 Part 6: 문제 해결

### 6.1 일반적인 문제

**1. 트레이 아이콘이 표시되지 않음**
```python
# 해결방법: 절대 경로 사용
import sys
import os

def get_resource_path(relative_path):
    """리소스 파일의 절대 경로 반환"""
    if hasattr(sys, '_MEIPASS'):
        # PyInstaller 실행 파일
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

# 사용
icon_path = get_resource_path("assets/icons/icon_idle.png")
```

**2. 프로세스가 종료되지 않음**
```python
# 강제 종료 추가
def force_kill(self):
    """강제 종료"""
    if self.process_pid:
        os.system(f"taskkill /F /PID {self.process_pid} /T")
```

**3. 한글 경로 문제**
```python
# UTF-8 인코딩 처리
full_command = full_command.encode('utf-8').decode('utf-8')
```

### 6.2 네트워크 문제

**1. 방화벽 설정**
```powershell
# Windows 방화벽 규칙 추가 (관리자 권한)
netsh advfirewall firewall add rule name="SB+ Client" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="SB+ UDP" dir=out action=allow protocol=UDP localport=9999
```

**2. 포트 충돌**
```python
# 사용 가능한 포트 찾기
def find_free_port():
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port
```

### 6.3 디버깅 팁

**1. 상세 로깅 활성화**
```python
# config.json
{
    "log_level": "DEBUG"
}
```

**2. 콘솔 모드로 실행**
```bash
# 콘솔 출력 보기
python src/main.py --console
```

**3. 프로세스 모니터링**
```python
# 실시간 메트릭 출력
def monitor_process(self):
    while self.is_running():
        metrics = self.get_metrics()
        print(f"CPU: {metrics['cpu_percent']}%, "
              f"Memory: {metrics['memory_mb']:.1f}MB")
        time.sleep(1)
```

---

## 🎯 Part 7: 고급 기능

### 7.1 설정 다이얼로그

**src/settings_dialog.py**:
```python
from PyQt5.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, 
                           QLabel, QLineEdit, QPushButton, 
                           QFormLayout, QSpinBox)

class SettingsDialog(QDialog):
    """설정 다이얼로그"""
    
    def __init__(self, config_manager, parent=None):
        super().__init__(parent)
        self.config_manager = config_manager
        self.setWindowTitle("SB+ Client 설정")
        self.setModal(True)
        self.setup_ui()
        
    def setup_ui(self):
        layout = QVBoxLayout()
        
        # 폼 레이아웃
        form = QFormLayout()
        
        # 서버 URL
        self.server_url_edit = QLineEdit(
            self.config_manager.get("server_url", "")
        )
        form.addRow("서버 URL:", self.server_url_edit)
        
        # 클라이언트 이름
        self.client_name_edit = QLineEdit(
            self.config_manager.get("client_name", "")
        )
        form.addRow("클라이언트 이름:", self.client_name_edit)
        
        # 포트
        self.port_spin = QSpinBox()
        self.port_spin.setRange(1024, 65535)
        self.port_spin.setValue(
            self.config_manager.get("client_port", 8081)
        )
        form.addRow("클라이언트 포트:", self.port_spin)
        
        # 기본 명령어
        self.default_command_edit = QLineEdit(
            self.config_manager.get("default_command", "")
        )
        self.default_command_edit.setPlaceholderText(
            "예: C:/Displays/MyProject.exe -messaging..."
        )
        form.addRow("기본 실행 명령어:", self.default_command_edit)
        
        layout.addLayout(form)
        
        # 버튼
        buttons_layout = QHBoxLayout()
        
        save_button = QPushButton("저장")
        save_button.clicked.connect(self.save_settings)
        
        cancel_button = QPushButton("취소")
        cancel_button.clicked.connect(self.reject)
        
        buttons_layout.addWidget(save_button)
        buttons_layout.addWidget(cancel_button)
        
        layout.addLayout(buttons_layout)
        self.setLayout(layout)
        
    def save_settings(self):
        """설정 저장"""
        self.config_manager.update({
            "server_url": self.server_url_edit.text(),
            "client_name": self.client_name_edit.text(),
            "client_port": self.port_spin.value(),
            "default_command": self.default_command_edit.text()
        })
        self.accept()
```

### 7.2 자동 업데이트

**src/auto_updater.py**:
```python
import requests
import os
import subprocess
import json

class AutoUpdater:
    """자동 업데이트 기능"""
    
    def __init__(self, current_version, update_url):
        self.current_version = current_version
        self.update_url = update_url
        
    def check_update(self):
        """업데이트 확인"""
        try:
            response = requests.get(f"{self.update_url}/version.json")
            data = response.json()
            
            latest_version = data.get("version")
            download_url = data.get("download_url")
            
            if self._compare_versions(latest_version, self.current_version) > 0:
                return True, latest_version, download_url
                
        except Exception as e:
            print(f"Update check failed: {e}")
            
        return False, None, None
        
    def _compare_versions(self, v1, v2):
        """버전 비교"""
        v1_parts = [int(x) for x in v1.split('.')]
        v2_parts = [int(x) for x in v2.split('.')]
        
        for i in range(max(len(v1_parts), len(v2_parts))):
            v1_part = v1_parts[i] if i < len(v1_parts) else 0
            v2_part = v2_parts[i] if i < len(v2_parts) else 0
            
            if v1_part > v2_part:
                return 1
            elif v1_part < v2_part:
                return -1
                
        return 0
```

---

## 🚦 Part 8: 통합 테스트

### 8.1 전체 시스템 테스트

**integration_test.py**:
```python
import time
import subprocess
import requests

def test_full_system():
    """전체 시스템 통합 테스트"""
    
    print("1. Starting SB+ Server...")
    # 서버 시작 (별도 터미널에서 실행 중이어야 함)
    
    print("2. Starting SB+ Client...")
    client_process = subprocess.Popen(["python", "src/main.py"])
    time.sleep(3)
    
    print("3. Checking client registration...")
    response = requests.get("http://localhost:8000/api/clients")
    clients = response.json()
    print(f"   Registered clients: {len(clients)}")
    
    print("4. Sending execute command...")
    if clients:
        client_id = clients[0]['id']
        response = requests.post(
            "http://localhost:8000/api/execute",
            json={
                "clientIds": [client_id],
                "commands": [{
                    "clientId": client_id,
                    "fullCommand": "notepad.exe"
                }]
            }
        )
        print(f"   Command sent: {response.status_code}")
        
    print("5. Waiting for execution...")
    time.sleep(5)
    
    print("6. Sending stop command...")
    response = requests.post(
        "http://localhost:8000/api/stop",
        json={"clientIds": [client_id]}
    )
    print(f"   Stop command sent: {response.status_code}")
    
    print("7. Cleaning up...")
    client_process.terminate()
    
    print("Test completed!")

if __name__ == "__main__":
    test_full_system()
```

---

## 📦 Part 9: 배포 준비

### 9.1 최종 체크리스트

**배포 전 확인사항:**
- [ ] 모든 설정이 config.json에서 로드되는지 확인
- [ ] 로그 파일이 정상적으로 생성되는지 확인
- [ ] 아이콘 파일이 포함되었는지 확인
- [ ] 한글 경로에서 정상 작동하는지 확인
- [ ] Windows Defender에서 차단되지 않는지 확인
- [ ] 네트워크 연결이 끊겨도 로컬 기능은 작동하는지 확인

### 9.2 사용자 가이드

**quick_start.md**:
```markdown
# SB+ Client 빠른 시작 가이드

## 설치
1. SBPlusClient.exe 실행
2. Windows 방화벽 허용
3. 시스템 트레이에서 아이콘 확인

## 초기 설정
1. 트레이 아이콘 우클릭 → 설정
2. 서버 URL 입력 (예: http://서버IP:8000)
3. 클라이언트 이름 설정
4. 저장

## 사용법
- 아이콘 색상:
  - 회색: 대기 중
  - 초록색: 실행 중
  - 빨간색: 오류
  
- 서버에서 명령을 받으면 자동으로 실행됩니다.
```

### 10.8 트러블슈팅

**문제: 클라이언트가 재시작할 때마다 새로 등록됨**
- 원인: MAC 주소가 변경되거나 읽기 실패
- 해결:
  ```python
  # config.json에 고정 UUID 설정
  {
    "fixed_uuid": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

**문제: 가상머신에서 UUID가 계속 변경됨**
- 원인: 가상 네트워크 어댑터의 MAC이 동적 할당
- 해결: VM 설정에서 MAC 주소 고정 또는 fixed_uuid 사용

**문제: "No valid MAC address found" 오류**
- 원인: 네트워크 어댑터 감지 실패
- 해결:
  ```python
  # fallback UUID 생성
  import os
  fallback_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, os.environ.get('COMPUTERNAME', 'unknown')))
  ```

### 10.9 서버 측 구현 가이드

**클라이언트 등록/업데이트 로직:**
```javascript
// Node.js 서버 예시
async function registerClient(clientData) {
  const { uuid, mac, name, ip_address, hostname, port } = clientData;
  
  // UUID로 기존 클라이언트 조회
  let client = await Client.findOne({ where: { uuid } });
  
  if (client) {
    // 기존 클라이언트 업데이트
    await client.update({
      name,
      ip_address,
      hostname,
      mac_address: mac,
      port,
      status: 'online',
      last_heartbeat: new Date()
    });
    console.log(`Client updated: ${uuid}`);
  } else {
    // 새 클라이언트 생성
    client = await Client.create({
      uuid,
      mac_address: mac,
      name,
      ip_address,
      hostname,
      port,
      status: 'online',
      last_heartbeat: new Date()
    });
    console.log(`New client registered: ${uuid}`);
  }
  
  return client;
}
```

**오래된 클라이언트 정리:**
```javascript
// 30일 이상 오프라인인 클라이언트 자동 정리
async function cleanupOldClients() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const deleted = await Client.destroy({
    where: {
      status: 'offline',
      last_heartbeat: {
        [Op.lt]: thirtyDaysAgo
      }
    }
  });
  
  console.log(`Cleaned up ${deleted} old clients`);
}

// 매일 실행
setInterval(cleanupOldClients, 24 * 60 * 60 * 1000);
```

### 10.10 웹 UI 표시 개선

**클라이언트 카드에 추가 정보:**
```javascript
// React 컴포넌트 예시
function ClientCard({ client }) {
  return (
    <div className="client-card">
      <h3>{client.name}</h3>
      <div className="client-details">
        <p>IP: {client.ip_address}</p>
        <p>Host: {client.hostname}</p>
        <p>MAC: {client.mac_address}</p>
        <p>UUID: {client.uuid.substring(0, 8)}...</p>
      </div>
      <div className="client-actions">
        <button onClick={() => wakeOnLAN(client.mac_address)}>
          Wake On LAN
        </button>
      </div>
    </div>
  );
}
```

### 10.11 추가 활용 방안

**1. Wake-on-LAN 구현:**
```python
import socket
import struct

def wake_on_lan(mac_address):
    """MAC 주소로 WOL 매직 패킷 전송"""
    # MAC 주소에서 ':' 제거
    mac = mac_address.replace(':', '')
    
    # 매직 패킷 생성: FF FF FF FF FF FF + MAC * 16
    data = b'FF' * 6 + (mac * 16).encode()
    send_data = b''
    
    for i in range(0, len(data), 2):
        send_data += struct.pack('B', int(data[i:i+2], 16))
    
    # 브로드캐스트로 전송
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.sendto(send_data, ('255.255.255.255', 9))
    sock.close()
```

**2. 클라이언트 그룹 자동 할당:**
```python
def auto_assign_group(hostname, ip_address):
    """호스트명이나 IP 패턴으로 자동 그룹 할당"""
    if hostname.startswith('DISPLAY-1F-'):
        return '1층 전시장'
    elif hostname.startswith('DISPLAY-2F-'):
        return '2층 전시장'
    elif ip_address.startswith('192.168.1.'):
        return '메인 홀'
    else:
        return '미분류'
```

**3. 클라이언트 상태 히스토리:**
```sql
-- 상태 변경 이력 테이블
CREATE TABLE client_history (
    id INTEGER PRIMARY KEY,
    client_uuid VARCHAR(36),
    status VARCHAR(20),
    ip_address VARCHAR(15),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_uuid) REFERENCES clients(uuid)
);
```

---

## 🎉 완성!

이제 Switchboard Plus의 클라이언트 고유 식별 시스템이 완벽하게 문서화되었습니다:

1. ✅ MAC 주소 기반 UUID 생성
2. ✅ 자동 중복 제거
3. ✅ 서버 측 구현 가이드
4. ✅ 특수 상황 처리
5. ✅ WOL 등 추가 기능 활용
6. ✅ 트러블슈팅 가이드

이 시스템으로 클라이언트 관리가 훨씬 효율적이고 안정적이 될 것입니다! 🚀