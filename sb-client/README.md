# SwitchBoard Plus Client

SwitchBoard Plus의 클라이언트 애플리케이션입니다. 시스템 트레이에서 실행되며, 서버와 통신하여 nDisplay 프로세스를 관리합니다.

## 기능

- 시스템 트레이 아이콘으로 실행
- 서버와의 실시간 통신
- nDisplay 프로세스 시작/중지
- 프로세스 상태 모니터링
- 설정 관리
- 로그 기록

## 설치 방법

1. Python 3.8 이상이 필요합니다.
2. 필요한 패키지 설치:
   ```bash
   pip install -r requirements.txt
   ```

## 실행 방법

```bash
python src/main.py
```

## 설정

설정 파일은 `%USERPROFILE%\.switchboard-plus\config.json`에 저장됩니다. 기본 설정:

```json
{
    "server": {
        "host": "localhost",
        "port": 3000,
        "heartbeat_interval": 5
    },
    "process": {
        "command": "nDisplay.exe",
        "working_dir": ".",
        "environment": {
            "DISPLAY_CONFIG": "config.xml"
        }
    },
    "logging": {
        "level": "INFO",
        "file": "switchboard-plus.log",
        "max_size": 1048576,
        "backup_count": 5
    }
}
```

## 빌드 방법

PyInstaller를 사용하여 실행 파일 생성:

```bash
pyinstaller --onefile --windowed --icon=assets/icons/default.ico src/main.py
```

## 라이선스

MIT License 