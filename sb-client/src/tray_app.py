import os
import sys
import logging
from PyQt5.QtWidgets import (
    QSystemTrayIcon, QMenu, QAction, QWidget,
    QVBoxLayout, QLabel, QPushButton, QDialog, QStyle
)
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import Qt, QTimer
from utils.autostart import set_autostart, is_autostart_enabled

logger = logging.getLogger(__name__)

class TrayApp(QWidget):
    def __init__(self, config=None, server_comm=None, process_manager=None):
        super().__init__()
        self.config = config
        self.server_comm = server_comm
        self.process_manager = process_manager
        self.logger = logger

        # 트레이 아이콘 설정
        self.tray = QSystemTrayIcon(self)
        self.setup_icons()
        
        # 트레이 메뉴 생성
        self.create_tray_menu()
        
        # 상태 업데이트 타이머
        self.status_timer = QTimer()
        self.status_timer.timeout.connect(self.update_status)
        self.status_timer.start(5000)  # 5초마다 업데이트
        
        # 초기 상태 업데이트
        self.update_status()

        self.logger.info('트레이 애플리케이션 초기화 완료')

    def setup_icons(self):
        try:
            # 시스템 기본 아이콘 사용
            style = self.style()
            self.icons = {
                'connected': style.standardIcon(QStyle.SP_ComputerIcon),
                'disconnected': style.standardIcon(QStyle.SP_MessageBoxWarning),
                'error': style.standardIcon(QStyle.SP_MessageBoxCritical)
            }
            
            # 기본 아이콘 설정
            self.tray.setIcon(self.icons['disconnected'])
            self.logger.info("시스템 기본 아이콘 설정 완료")
            
        except Exception as e:
            self.logger.error(f"아이콘 설정 중 오류 발생: {str(e)}")
            # 오류 발생 시 빈 아이콘 사용
            icon = QIcon()
            self.icons = {
                'connected': icon,
                'disconnected': icon,
                'error': icon
            }
            self.tray.setIcon(icon)

    def create_tray_menu(self):
        """트레이 메뉴 생성"""
        menu = QMenu()
        
        # 상태 표시
        self.status_action = QAction('상태: 연결 중...', self)
        self.status_action.setEnabled(False)
        menu.addAction(self.status_action)
        menu.addSeparator()

        # 프로세스 제어
        self.start_action = QAction('nDisplay 시작', self)
        self.start_action.triggered.connect(self.start_process)
        menu.addAction(self.start_action)

        self.stop_action = QAction('nDisplay 중지', self)
        self.stop_action.triggered.connect(self.stop_process)
        menu.addAction(self.stop_action)
        menu.addSeparator()

        # 설정
        settings_action = QAction('설정', self)
        settings_action.triggered.connect(self.show_settings)
        menu.addAction(settings_action)

        # 자동 시작 설정
        self.autostart_action = QAction('자동 시작', self)
        self.autostart_action.setCheckable(True)
        self.autostart_action.setChecked(is_autostart_enabled())
        self.autostart_action.triggered.connect(self.toggle_autostart)
        menu.addAction(self.autostart_action)

        # 로그 뷰어
        log_action = QAction('로그 보기', self)
        log_action.triggered.connect(self.show_logs)
        menu.addAction(log_action)
        menu.addSeparator()

        # 종료
        quit_action = QAction('종료', self)
        quit_action.triggered.connect(self.quit_application)
        menu.addAction(quit_action)

        self.tray.setContextMenu(menu)
        self.tray.show()

    def update_status(self):
        """상태 업데이트"""
        if self.server_comm and self.server_comm.is_connected():
            self.status_action.setText('상태: 서버 연결됨')
            self.tray.setIcon(self.icons['connected'])
        else:
            self.status_action.setText('상태: 서버 연결 끊김')
            self.tray.setIcon(self.icons['disconnected'])

        # 프로세스 상태에 따른 메뉴 활성화/비활성화
        is_running = self.process_manager.is_running()
        self.start_action.setEnabled(not is_running)
        self.stop_action.setEnabled(is_running)

    def start_process(self):
        """nDisplay 프로세스 시작"""
        try:
            self.process_manager.start()
            self.logger.info('nDisplay 프로세스 시작됨')
        except Exception as e:
            self.logger.error(f'프로세스 시작 실패: {e}')

    def stop_process(self):
        """nDisplay 프로세스 중지"""
        try:
            self.process_manager.stop()
            self.logger.info('nDisplay 프로세스 중지됨')
        except Exception as e:
            self.logger.error(f'프로세스 중지 실패: {e}')

    def show_settings(self):
        """설정 대화상자 표시"""
        # TODO: 설정 대화상자 구현
        pass

    def show_logs(self):
        """로그 뷰어 표시"""
        # TODO: 로그 뷰어 구현
        pass

    def toggle_autostart(self, checked):
        """자동 시작 설정을 토글합니다."""
        if set_autostart(checked):
            self.logger.info("자동 시작 설정이 변경되었습니다.")
        else:
            self.logger.error("자동 시작 설정 변경에 실패했습니다.")
            # 실패 시 체크박스 상태 복원
            self.autostart_action.setChecked(not checked)

    def quit_application(self):
        """애플리케이션 종료"""
        try:
            self.process_manager.stop()
            self.server_comm.stop()
            self.logger.info('애플리케이션 종료')
            sys.exit(0)
        except Exception as e:
            self.logger.error(f'종료 중 오류 발생: {e}')
            sys.exit(1) 