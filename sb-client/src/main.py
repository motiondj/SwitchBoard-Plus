import sys
import os
import logging
from PyQt5.QtWidgets import QApplication
from config_manager import ConfigManager
from tray_app import TrayApp
from server_comm import ServerComm
from process_manager import ProcessManager

def main():
    try:
        # 로깅 설정
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('client.log'),
                logging.StreamHandler()
            ]
        )
        logger = logging.getLogger(__name__)

        # 설정 로드
        config = ConfigManager()
        logger.info('설정 로드 완료')

        # Qt 애플리케이션 생성
        app = QApplication(sys.argv)
        app.setQuitOnLastWindowClosed(False)

        # 서버 통신 및 프로세스 관리 초기화
        server_comm = ServerComm(config)
        process_manager = ProcessManager(config)

        # 트레이 애플리케이션 시작
        tray = TrayApp(config, server_comm, process_manager)
        logger.info('트레이 애플리케이션 시작됨')

        # 애플리케이션 실행
        sys.exit(app.exec_())

    except Exception as e:
        logger.error(f'애플리케이션 시작 중 오류 발생: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main() 