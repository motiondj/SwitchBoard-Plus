# Switchboard Plus (SB+) 개발 환경 설정 가이드

## 📋 목차
1. [필수 소프트웨어 설치](#1-필수-소프트웨어-설치)
2. [개발 도구 설정](#2-개발-도구-설정)
3. [프로젝트 초기 설정](#3-프로젝트-초기-설정)
4. [개발 환경 구성](#4-개발-환경-구성)
5. [디버깅 환경](#5-디버깅-환경)
6. [테스트 환경](#6-테스트-환경)
7. [문제 해결](#7-문제-해결)

---

## 1. 필수 소프트웨어 설치

### 1.1 런타임 환경

#### Node.js (백엔드/프론트엔드)
- **버전**: 18.x LTS 이상
- **다운로드**: https://nodejs.org/
- **확인 방법**:
  ```bash
  node --version  # v18.0.0 이상
  npm --version   # 9.0.0 이상
  ```

#### Python (클라이언트 트레이)
- **버전**: 3.9 이상
- **다운로드**: https://www.python.org/
- **설치 시 주의사항**:
  - ✅ "Add Python to PATH" 체크
  - ✅ pip 포함 설치
  - ✅ py launcher 설치
- **확인 방법**:
  ```bash
  python --version  # Python 3.9.0 이상
  pip --version     # pip 21.0 이상
  ```
- **추가 도구**:
  ```bash
  # PyQt5 테스트
  python -c "from PyQt5.QtWidgets import QApplication; print('PyQt5 OK')"
  
  # 가상환경 도구
  pip install virtualenv
  ```

### 1.2 버전 관리
#### Git
- **다운로드**: https://git-scm.com/
- **초기 설정**:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 1.3 개발 환경 요구사항
#### 하드웨어
- **최소 해상도**: 1920x1080
- **권장**: 듀얼 모니터 (개발용 + 테스트용)
- **RAM**: 8GB 이상 권장

#### 브라우저
- **권장**: Chrome, Edge (최신 버전)
- **최소**: Chrome 90+, Edge 90+

### 1.3 데이터베이스 도구
#### SQLite Browser
- **다운로드**: https://sqlitebrowser.org/
- **용도**: 데이터베이스 직접 확인 및 수정
- **대안**: DBeaver (https://dbeaver.io/)

---

## 2. 개발 도구 설정

### 2.1 Visual Studio Code

#### 기본 설치
- **다운로드**: https://code.visualstudio.com/
- **권장 테마**: Dark+ (기본) 또는 One Dark Pro

#### 필수 확장 프로그램

**JavaScript/Node.js 개발**:
```
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- JavaScript (ES6) code snippets
- npm Intellisense
- Path Intellisense
```

**React 개발**:
```
- ES7+ React/Redux/React-Native snippets
- Simple React Snippets
- Auto Rename Tag
- Bracket Pair Colorizer
```

**Python 개발**:
```
- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Python Indent
- autoDocstring
```

**유용한 도구**:
```
- Thunder Client (API 테스트)
- SQLite Viewer
- GitLens
- Live Share (협업)
- Material Icon Theme (파일 아이콘)
```

#### VS Code 설정 파일

**.vscode/settings.json** (프로젝트 루트):
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.tabSize": 4
  },
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true,
    "**/node_modules": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

### 2.2 API 테스트 도구

#### Postman
- **다운로드**: https://www.postman.com/downloads/
- **컬렉션 구성**:
  ```
  Switchboard Plus API/
  ├── Client Management/
  │   ├── Get Clients
  │   ├── Register Client
  │   └── Update Status
  ├── Preset Control/
  │   ├── Get Presets
  │   ├── Create Preset
  │   └── Execute Preset
  └── Monitoring/
      └── Get Metrics
  ```

#### 환경 변수 설정 (Postman):
```json
{
  "baseUrl": "http://localhost:3000",
  "apiVersion": "v1",
  "authToken": "optional-token"
}
```

---

## 3. 프로젝트 초기 설정

### 3.1 프로젝트 구조 생성

```bash
# 루트 디렉토리 생성
mkdir switchboard-plus
cd switchboard-plus

# 하위 프로젝트 생성
mkdir sb-server sb-client sb-web docs

# Git 초기화
git init
echo "node_modules/\n*.pyc\n__pycache__/\n.env\n.vscode/\n*.log" > .gitignore
```

### 3.2 프로젝트별 초기화

#### SB+ Server (Node.js)
```bash
cd sb-server
npm init -y

# package.json 수정
npm pkg set name="switchboard-plus-server"
npm pkg set description="Switchboard Plus Server - Enhanced nDisplay Control"
npm pkg set scripts.dev="nodemon server.js"
npm pkg set scripts.start="node server.js"
npm pkg set scripts.test="jest"

# 의존성 설치
npm install express@^4.18.2 socket.io@^4.6.1 cors@^2.8.5 sqlite3@^5.1.6 sequelize@^6.35.0 dotenv@^16.3.1 winston@^3.11.0 node-cron@^3.0.3

# 개발 의존성
npm install -D nodemon@^3.0.2 eslint@^8.55.0 jest@^29.7.0

# ESLint 초기화
npx eslint --init
```

#### SB+ Web (React + Vite)
```bash
cd ../sb-web
npm create vite@latest . -- --template react

# 의존성 설치
npm install
npm install react-router-dom@^6.20.0 @reduxjs/toolkit@^1.9.7 react-redux@^8.1.3 socket.io-client@^4.6.1 axios@^1.6.2 @mui/material@^5.14.20 @emotion/react@^11.11.1 @emotion/styled@^11.11.0 chart.js@^4.4.1 react-chartjs-2@^5.2.0

# 개발 의존성
npm install -D @types/react@^18.2.0 @types/react-dom@^18.2.0
```

#### SB+ Client (Python)
```bash
cd ../sb-client

# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (Windows)
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# requirements.txt 생성
cat > requirements.txt << EOF
PyQt5==5.15.9
pystray==0.19.5
Pillow==10.1.0
requests==2.31.0
psutil==5.9.6
python-dotenv==1.0.0
pyinstaller==6.3.0
EOF

# 패키지 설치
pip install -r requirements.txt
```

---

## 4. 개발 환경 구성

### 4.1 환경 변수 설정

#### sb-server/.env
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
DB_PATH=./database.sqlite

# Socket.io
SOCKET_PORT=3001

# UDP Discovery
UDP_PORT=9999

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/server.log

# Security (Optional)
API_KEY=your-secret-key-here
```

#### sb-client/config.json
```json
{
  "server": {
    "url": "http://localhost:3000",
    "socket_url": "ws://localhost:3001"
  },
  "client": {
    "name": "Display_01",
    "heartbeat_interval": 5,
    "broadcast_interval": 10
  },
  "logging": {
    "level": "INFO",
    "file": "logs/client.log"
  }
}
```

### 4.2 개발 서버 실행 스크립트

**프로젝트 루트에 start-dev.bat (Windows)**:
```batch
@echo off
echo Starting Switchboard Plus Development Environment...

:: Start Server
start "SB+ Server" cmd /k "cd sb-server && npm run dev"

:: Wait for server to start
timeout /t 5

:: Start Web UI
start "SB+ Web" cmd /k "cd sb-web && npm run dev"

:: Start Client (Optional)
:: start "SB+ Client" cmd /k "cd sb-client && venv\Scripts\activate && python main.py"

echo All services started!
echo Server: http://localhost:8000
echo Web UI: http://localhost:5173
pause
```

**start-dev.sh (Mac/Linux)**:
```bash
#!/bin/bash
echo "Starting Switchboard Plus Development Environment..."

# Start Server
gnome-terminal --tab --title="SB+ Server" -- bash -c "cd sb-server && npm run dev; exec bash"

# Wait for server
sleep 5

# Start Web UI
gnome-terminal --tab --title="SB+ Web" -- bash -c "cd sb-web && npm run dev; exec bash"

echo "All services started!"
echo "Server: http://localhost:8000"
echo "Web UI: http://localhost:5173"
```

---

## 5. 디버깅 환경

### 5.1 VS Code 디버깅 설정

**.vscode/launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug SB+ Server",
      "program": "${workspaceFolder}/sb-server/server.js",
      "envFile": "${workspaceFolder}/sb-server/.env",
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug SB+ Web",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/sb-web/src",
      "sourceMaps": true
    },
    {
      "type": "python",
      "request": "launch",
      "name": "Debug SB+ Client",
      "program": "${workspaceFolder}/sb-client/main.py",
      "console": "integratedTerminal",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/sb-client"
      }
    }
  ],
  "compounds": [
    {
      "name": "Debug All",
      "configurations": ["Debug SB+ Server", "Debug SB+ Web"]
    }
  ]
}
```

### 5.2 로깅 설정

#### Winston (Node.js) 설정
```javascript
// sb-server/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;
```

#### Python Logging 설정
```python
# sb-client/utils/logger.py
import logging
import os
from datetime import datetime

def setup_logger():
    log_dir = 'logs'
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    log_file = os.path.join(log_dir, f'client_{datetime.now():%Y%m%d}.log')
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    
    return logging.getLogger('SB+Client')
```

### 5.3 네트워크 디버깅

#### UDP 브로드캐스트 테스트
```python
# test_udp.py
import socket
import json

def test_broadcast():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    
    message = json.dumps({
        "type": "client_announce",
        "name": "Test_Client",
        "ip": "192.168.1.100"
    })
    
    sock.sendto(message.encode(), ('255.255.255.255', 9999))
    print(f"Broadcast sent: {message}")

if __name__ == "__main__":
    test_broadcast()
```

---

## 6. 테스트 환경

### 6.1 단위 테스트 설정

#### Jest (Node.js)
```javascript
// sb-server/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ]
};
```

#### pytest (Python)
```ini
# sb-client/pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --cov=src --cov-report=html
```

### 6.2 통합 테스트 환경

#### Docker Compose (선택사항)
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  sb-server:
    build: ./sb-server
    ports:
      - "3000:3000"
      - "3001:3001"
      - "9999:9999/udp"
    environment:
      - NODE_ENV=development
    volumes:
      - ./sb-server:/app
      - /app/node_modules

  sb-web:
    build: ./sb-web
    ports:
      - "5173:5173"
    volumes:
      - ./sb-web:/app
      - /app/node_modules
```

---

## 7. 문제 해결

### 7.1 일반적인 문제

#### Node.js 관련
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 권한 문제 (Mac/Linux)
sudo npm install -g nodemon
```

#### Python 관련
```bash
# pip 업그레이드
python -m pip install --upgrade pip

# PyQt5 설치 실패 시
pip install PyQt5 --no-cache-dir

# Windows에서 가상환경 실행 정책
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 7.2 네트워크 문제

#### Windows 방화벽 설정
```powershell
# 관리자 권한으로 실행
New-NetFirewallRule -DisplayName "SB+ Server" -Direction Inbound -LocalPort 3000,3001,9999 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "SB+ UDP" -Direction Inbound -LocalPort 9999 -Protocol UDP -Action Allow
```

#### 포트 사용 확인
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### 7.3 개발 도구 팁

#### VS Code 단축키
- `Ctrl+Shift+P`: 명령 팔레트
- `Ctrl+P`: 빠른 파일 열기
- `Ctrl+Shift+F`: 전체 검색
- `Alt+Shift+F`: 코드 포맷팅
- `F5`: 디버깅 시작

#### Git 유용한 명령어
```bash
# 브랜치 생성 및 전환
git checkout -b feature/preset-system

# 변경사항 확인
git status
git diff

# 커밋
git add .
git commit -m "feat: Add preset command system"

# 원격 저장소 푸시
git push origin feature/preset-system
```

---

## 📚 추가 리소스

### 공식 문서
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Python Documentation](https://docs.python.org/3/)
- [Socket.io Documentation](https://socket.io/docs/)

### 학습 자료
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [Real Python](https://realpython.com/)

### 커뮤니티
- [Stack Overflow](https://stackoverflow.com/)
- [Reddit r/webdev](https://www.reddit.com/r/webdev/)
- [Discord - Reactiflux](https://www.reactiflux.com/)

---

## ✅ 개발 환경 체크리스트

- [ ] Node.js 18+ 설치
- [ ] Python 3.9+ 설치
- [ ] Git 설치 및 설정
- [ ] VS Code 설치
- [ ] VS Code 확장 프로그램 설치
- [ ] SQLite Browser 설치
- [ ] Postman 설치
- [ ] 프로젝트 구조 생성
- [ ] 각 프로젝트 초기화
- [ ] 환경 변수 설정
- [ ] 개발 서버 실행 테스트
- [ ] 디버깅 환경 설정
- [ ] Git 저장소 초기화

모든 항목을 완료하면 Switchboard Plus 개발을 시작할 준비가 완료됩니다! 🚀