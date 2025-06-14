import os
import sys
import shutil
import subprocess
from pathlib import Path

def build_executable():
    # 현재 디렉토리
    current_dir = Path(__file__).parent
    
    # 빌드 디렉토리
    build_dir = current_dir / 'build'
    dist_dir = current_dir / 'dist'
    
    # 이전 빌드 정리
    if build_dir.exists():
        shutil.rmtree(build_dir)
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    
    # PyInstaller 명령어 구성
    cmd = [
        'pyinstaller',
        '--name=switchboard-plus-client',
        '--onefile',
        '--windowed',
        '--icon=assets/icons/default.ico',
        '--add-data=assets/icons;assets/icons',
        '--hidden-import=PyQt5',
        '--hidden-import=psutil',
        'src/main.py'
    ]
    
    try:
        # 빌드 실행
        subprocess.run(cmd, check=True)
        print("빌드가 성공적으로 완료되었습니다.")
        
        # 빌드된 파일 경로
        exe_path = dist_dir / 'switchboard-plus-client.exe'
        if exe_path.exists():
            print(f"실행 파일이 생성되었습니다: {exe_path}")
        else:
            print("실행 파일 생성에 실패했습니다.")
            return False
            
        return True
    except subprocess.CalledProcessError as e:
        print(f"빌드 중 오류가 발생했습니다: {str(e)}")
        return False
    except Exception as e:
        print(f"예상치 못한 오류가 발생했습니다: {str(e)}")
        return False

if __name__ == '__main__':
    if build_executable():
        sys.exit(0)
    else:
        sys.exit(1) 