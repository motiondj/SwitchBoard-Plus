# Switchboard Plus Server

Switchboard Plus의 백엔드 서버입니다. nDisplay 클라이언트들을 관리하고 프리셋을 실행하는 기능을 제공합니다.

## 기능

- 클라이언트 자동 검색 및 등록
- 실시간 클라이언트 상태 모니터링
- 프리셋 관리 및 실행
- 그룹 관리
- WebSocket을 통한 실시간 통신
- UDP 브로드캐스트를 통한 클라이언트 검색

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/your-username/switchboard-plus.git
cd switchboard-plus/sb-server
```

2. 의존성 설치
```bash
npm install
```

3. 환경 설정
```bash
# .env.example 파일을 .env로 복사
cp .env.example .env

# .env 파일을 열어 필요한 설정 수정
# - PORT: 서버 포트 (기본값: 4000)
# - NODE_ENV: 실행 환경 (development/production)
# - DB_PATH: SQLite 데이터베이스 파일 경로
# - LOG_LEVEL: 로그 레벨 (debug/info/warn/error)
# - CLIENT_HEARTBEAT_INTERVAL: 클라이언트 하트비트 간격 (ms)
# - UDP_PORT: UDP 브로드캐스트 포트
```

4. 데이터베이스 초기화
```bash
npm run migrate
```

## 실행 방법

### 개발 모드
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## API 문서

### 클라이언트 API
- `GET /api/clients` - 전체 클라이언트 목록
- `GET /api/clients/:id` - 특정 클라이언트 정보
- `POST /api/clients` - 클라이언트 등록/업데이트
- `PUT /api/clients/:id` - 클라이언트 정보 수정
- `DELETE /api/clients/:id` - 클라이언트 삭제

### 프리셋 API
- `GET /api/presets` - 프리셋 목록
- `GET /api/presets/:id` - 프리셋 상세
- `POST /api/presets` - 프리셋 생성
- `PUT /api/presets/:id` - 프리셋 수정
- `DELETE /api/presets/:id` - 프리셋 삭제
- `POST /api/presets/:id/execute` - 프리셋 실행
- `POST /api/presets/:id/stop` - 프리셋 중지

### 그룹 API
- `GET /api/groups` - 그룹 목록
- `GET /api/groups/:id` - 그룹 상세
- `POST /api/groups` - 그룹 생성
- `PUT /api/groups/:id` - 그룹 수정
- `DELETE /api/groups/:id` - 그룹 삭제

## WebSocket 이벤트

### 클라이언트 이벤트
- `client:status` - 클라이언트 상태 변경
- `client:metrics` - 클라이언트 메트릭 업데이트
- `client:registered` - 새 클라이언트 등록

### 프리셋 이벤트
- `preset:status` - 프리셋 상태 변경
- `execution:result` - 명령 실행 결과

## 개발

### 스크립트
- `npm run dev` - 개발 서버 실행
- `npm start` - 프로덕션 서버 실행
- `npm test` - 테스트 실행
- `npm run lint` - 코드 린트 검사
- `npm run migrate` - 데이터베이스 마이그레이션

### 폴더 구조
```
sb-server/
├── src/
│   ├── controllers/    # API 컨트롤러
│   ├── models/         # 데이터베이스 모델
│   ├── routes/         # API 라우트
│   ├── middleware/     # 미들웨어
│   ├── services/       # 비즈니스 로직
│   └── utils/          # 유틸리티
├── config/             # 설정 파일
├── migrations/         # DB 마이그레이션
└── logs/              # 로그 파일
```

## 라이선스

ISC 