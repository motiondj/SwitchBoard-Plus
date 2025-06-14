#!/bin/bash

# 배포 스크립트
echo "Switchboard Plus 배포 시작..."

# 1. 웹 UI 빌드
echo "웹 UI 빌드 중..."
cd sb-web
npm install
npm run build
cd ..

# 2. 서버 배포
echo "서버 배포 중..."
cd sb-server
npm install
npm run build
pm2 reload ecosystem.config.js --env production
cd ..

# 3. 클라이언트 빌드
echo "클라이언트 빌드 중..."
cd sb-client
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python build.py
cd ..

echo "배포 완료!" 