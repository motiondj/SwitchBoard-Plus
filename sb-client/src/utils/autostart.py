import os
import sys
import winreg
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def get_startup_folder():
    """Windows 시작 프로그램 폴더 경로를 반환합니다."""
    return os.path.join(os.getenv('APPDATA'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')

def get_executable_path():
    """실행 파일의 절대 경로를 반환합니다."""
    if getattr(sys, 'frozen', False):
        # PyInstaller로 패키징된 경우
        return sys.executable
    else:
        # 개발 환경에서 실행 중인 경우
        return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'main.py'))

def set_autostart(enable=True):
    """자동 시작을 설정하거나 해제합니다."""
    try:
        if enable:
            # 시작 프로그램 폴더에 바로가기 생성
            startup_folder = get_startup_folder()
            shortcut_path = os.path.join(startup_folder, 'SwitchBoard-Plus.lnk')
            
            # 바로가기 생성
            import winshell
            from win32com.client import Dispatch
            
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = get_executable_path()
            shortcut.WorkingDirectory = os.path.dirname(get_executable_path())
            shortcut.save()
            
            logger.info(f'자동 시작이 설정되었습니다: {shortcut_path}')
        else:
            # 바로가기 삭제
            shortcut_path = os.path.join(get_startup_folder(), 'SwitchBoard-Plus.lnk')
            if os.path.exists(shortcut_path):
                os.remove(shortcut_path)
                logger.info('자동 시작이 해제되었습니다.')
            
    except Exception as e:
        logger.error(f'자동 시작 설정 중 오류 발생: {str(e)}')
        return False
    
    return True

def is_autostart_enabled():
    """자동 시작이 설정되어 있는지 확인합니다."""
    shortcut_path = os.path.join(get_startup_folder(), 'SwitchBoard-Plus.lnk')
    return os.path.exists(shortcut_path) 