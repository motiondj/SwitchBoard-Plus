import subprocess
import os
import signal
import logging
import psutil
import time
import threading
from typing import Optional, List

class ProcessManager:
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.process: Optional[subprocess.Popen] = None
        self.monitor_thread: Optional[threading.Thread] = None
        self.running = False

    def start(self) -> bool:
        """nDisplay 프로세스 시작"""
        if self.is_running():
            self.logger.warning('이미 실행 중인 프로세스가 있습니다')
            return False

        try:
            # 실행 파일 경로 설정
            exe_path = self.config.get('unreal.engine_path')
            if not exe_path or not os.path.exists(exe_path):
                raise FileNotFoundError('Unreal Engine 실행 파일을 찾을 수 없습니다')

            # 명령줄 인자 설정
            args = [
                exe_path,
                self.config.get('unreal.project_path', ''),
                '-ndisplay',
                f'-node={self.config.get("unreal.node_name", "node1")}',
                f'-config={self.config.get("unreal.config_path", "")}'
            ]

            # 프로세스 시작
            self.process = subprocess.Popen(
                args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            self.running = True

            # 모니터링 스레드 시작
            self.monitor_thread = threading.Thread(target=self._monitor_process)
            self.monitor_thread.daemon = True
            self.monitor_thread.start()

            self.logger.info('nDisplay 프로세스 시작됨')
            return True

        except Exception as e:
            self.logger.error(f'프로세스 시작 실패: {e}')
            self.running = False
            return False

    def stop(self) -> bool:
        """nDisplay 프로세스 중지"""
        if not self.is_running():
            self.logger.warning('실행 중인 프로세스가 없습니다')
            return False

        try:
            # 프로세스 종료
            if self.process:
                self.process.terminate()
                self.process.wait(timeout=5)
                self.process = None

            self.running = False
            self.logger.info('nDisplay 프로세스 중지됨')
            return True

        except Exception as e:
            self.logger.error(f'프로세스 중지 실패: {e}')
            return False

    def is_running(self) -> bool:
        """프로세스 실행 상태 확인"""
        if not self.process:
            return False

        try:
            return self.process.poll() is None
        except:
            return False

    def get_process_info(self) -> dict:
        """프로세스 정보 조회"""
        if not self.is_running():
            return {
                'status': 'stopped',
                'pid': None,
                'cpu_percent': 0,
                'memory_percent': 0
            }

        try:
            process = psutil.Process(self.process.pid)
            return {
                'status': 'running',
                'pid': process.pid,
                'cpu_percent': process.cpu_percent(),
                'memory_percent': process.memory_percent()
            }
        except:
            return {
                'status': 'error',
                'pid': None,
                'cpu_percent': 0,
                'memory_percent': 0
            }

    def _monitor_process(self):
        """프로세스 모니터링"""
        while self.running and self.process:
            try:
                # 프로세스 상태 확인
                if self.process.poll() is not None:
                    self.logger.warning('프로세스가 예기치 않게 종료됨')
                    self.running = False
                    break

                # 로그 출력 확인
                stdout = self.process.stdout.readline()
                if stdout:
                    self.logger.debug(f'nDisplay: {stdout.strip()}')

                stderr = self.process.stderr.readline()
                if stderr:
                    self.logger.error(f'nDisplay Error: {stderr.strip()}')

                time.sleep(0.1)

            except Exception as e:
                self.logger.error(f'모니터링 중 오류 발생: {e}')
                self.running = False
                break

    def get_logs(self, lines: int = 100) -> List[str]:
        """프로세스 로그 조회"""
        if not self.process:
            return []

        try:
            logs = []
            while len(logs) < lines:
                line = self.process.stdout.readline()
                if not line:
                    break
                logs.append(line.strip())
            return logs[-lines:]
        except:
            return []

    def _get_environment(self):
        env = os.environ.copy()
        env.update(self.config['process'].get('environment', {}))
        return env

    def _cleanup(self):
        self.process = None
        self.running = False
        self.monitor_thread = None 