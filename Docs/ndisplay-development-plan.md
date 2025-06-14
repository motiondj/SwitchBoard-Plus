## 6. 개발 일정

### 6.1 Phase 1: 핵심 기능 개발 (Week 1-5)

#### Week 1-2: 서버 개발
- Node.js 서버 구축
- RESTful API 구현
- WebSocket 실시간 통신 구현
- SQLite 데이터베이스 연동
- UDP 브로드캐스트 리스너 구현
- 클라이언트 자동 검색 시스템

#### Week 3-4: 웹 UI 개발
- React 프로젝트 설정
- Redux Toolkit 상태 관리 구축
- Material-UI 컴포넌트 구성
- Socket.io 클라이언트 연동
- 반응형 레이아웃 구현
- 실시간 상태 업데이트 구현

#### Week 5: 트레이 클라이언트 개발
- Python/PyQt5 프로젝트 설정
- 시스템 트레이 애플리케이션 구현
- 서버 통신 모듈 개발
- 프로세스 관리 기능 구현
- 설정 관리 시스템

### 6.2 Phase 2: 고급 기능 개발 (Week 6-8)

#### Week 5: 프리셋 시스템
- 프리셋 데이터 모델 설계
- 프리셋 CRUD API 구현
- 프리셋 적용 로직 개발
- 프리셋 UI 컴포넌트 개발
- 기본 프리셋 템플릿 생성

#### Week 6: 모니터링 및 스케줄링
- 시스템 리소스 수집 모듈 개발
- Chart.js 실시간 차트 구현
- node-cron 기반 스케줄러 구현
- 스케줄 관리 UI 개발
- 알림 시스템 구현

#### Week 7: 그룹 관리 및 최적화
- 그룹 데이터 모델 추가
- 그룹 관리 API 구현
- 드래그 앤 드롭 UI 구현
- 성능 최적화 (캐싱, 쿼리 최적화)
- 에러 핸들링 강화

### 6.3 Phase 3: 테스트 및 배포 (Week 9-10)

#### Week 8: 통합 테스트
- 기능 테스트
- 성능 테스트
- 안정성 테스트
- 사용자 시나리오 테스트

#### Week 9: 배포 준비
- 프로덕션 빌드 생성
- 배포 스크립트 작성
- 문서화 작성
- 사용자 교육 자료 준비# Switchboard Plus (SB+) 개발 계획서

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Switchboard Plus (SB+)
- **설명**: 언리얼엔진 nDisplay를 위한 차세대 웹 기반 원격 제어 시스템
- **버전**: 1.0.0
- **개발 기간**: 2024년 1월 - 2024년 3월 (9주)
- **대상 사용자**: nDisplay 시스템 운영자, 언리얼엔진 Switchboard 사용자

### 1.2 프로젝트 배경
언리얼엔진의 기본 Switchboard는 설치형 프로그램으로 제한적인 기능을 제공합니다. Switchboard Plus는 웹 기반으로 재구현하여 어디서나 접근 가능하고, 프리셋, 그룹 제어, 실시간 모니터링 등 향상된 기능을 제공하는 것을 목표로 합니다.

### 1.3 프로젝트 목표
- 기존 Switchboard의 모든 기능을 웹 기반으로 구현
- 프리셋 시스템을 통한 빠른 설정 전환
- 그룹 기반 제어로 효율적인 다중 디스플레이 관리
- 실시간 모니터링 및 스케줄링 기능 추가

---

## 2. 시스템 요구사항

### 2.1 기능적 요구사항

#### 2.1.1 클라이언트 관리
- **자동 검색**: 네트워크 내 클라이언트 자동 발견
- **수동 등록**: IP 주소를 통한 수동 추가
- **상태 모니터링**: 실시간 온라인/오프라인 상태 확인
- **그룹 관리**: 논리적 그룹으로 클라이언트 조직화

#### 2.1.2 실행 제어
- **개별 제어**: 특정 클라이언트 실행/중지
- **그룹 제어**: 그룹 단위 일괄 실행/중지
- **전체 제어**: 모든 클라이언트 동시 제어
- **동기화 실행**: nDisplay 노드 간 동기화된 시작

#### 2.1.3 프리셋 시스템
- **기본 프리셋**: 전시회, 데모, 개발, 유지보수 모드
- **사용자 정의 프리셋**: 커스텀 명령어 저장 및 관리
- **프리셋 구성요소**:
  - 프리셋 이름 및 설명
  - 클라이언트별 전체 실행 명령어
  - 실행 순서 (마스터 노드 우선)
  - 활성화 상태 관리

**프리셋 예시:**
```json
{
  "name": "전시회 모드",
  "commands": [
    {
      "client": "Display 1",
      "command": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node=node_01 -fullscreen",
      "order": 0
    },
    {
      "client": "Display 2", 
      "command": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node=node_02 -fullscreen",
      "order": 1
    }
  ]
}
```

#### 2.1.4 모니터링
- **시스템 리소스**: CPU, 메모리, GPU 사용률
- **프로세스 상태**: 언리얼엔진 실행 상태
- **네트워크 상태**: 연결 품질, 지연시간
- **로그 수집**: 중앙 집중식 로그 관리

#### 2.1.5 스케줄링
- **시간 기반 스케줄**: 특정 시간 자동 실행/종료
- **반복 스케줄**: 일일, 주간, 월간 반복
- **프리셋 연동**: 시간대별 다른 프리셋 적용

### 2.2 비기능적 요구사항

#### 2.2.1 성능
- 명령 전달 지연시간: 1초 이내
- 동시 관리 가능 클라이언트: 최대 50대
- 웹 UI 응답시간: 200ms 이내

#### 2.2.2 가용성
- 시스템 가용성: 99% 이상
- 자동 재연결 기능
- 장애 복구 시간: 30초 이내

#### 2.2.3 보안
- 기본 인증 시스템 (ID/Password)
- 역할 기반 접근 제어 (관리자/운영자)
- 감사 로그 기록

#### 2.2.4 사용성
- 직관적인 웹 인터페이스
- 최소 해상도: 1920x1080
- 권장 브라우저: Chrome, Edge (최신 버전)
- 다국어 지원 (한국어/영어)

---

## 3. 시스템 아키텍처

### 3.1 전체 구조
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   웹 UI     │────▶│  웹 서버    │────▶│ 클라이언트  │
│ (React)     │     │ (Node.js)   │     │ (트레이앱)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Database   │     │ 언리얼엔진  │
                    │  (SQLite)   │     │ (nDisplay)  │
                    └─────────────┘     └─────────────┘
```

### 3.2 통신 프로토콜
- **웹 UI ↔ 서버**: WebSocket (실시간), REST API (데이터 CRUD)
- **서버 ↔ 클라이언트**: UDP 브로드캐스트 (자동 검색), HTTP (명령/상태)
- **하트비트**: 5초 간격 상태 확인

### 3.3 클라이언트 고유 식별 시스템

#### 3.3.1 UUID 생성 방식
- MAC 주소 기반 UUID 사용으로 각 PC를 고유하게 식별
- Python에서 `uuid.getnode()`로 MAC 주소를 읽어 UUID 생성
- 동일 PC는 항상 동일한 UUID를 가짐

#### 3.3.2 클라이언트 등록 프로세스
1. 클라이언트 시작 시 MAC 기반 UUID 생성
2. 서버에 등록 요청 (UUID, MAC, IP, 호스트명 포함)
3. 서버는 UUID로 기존 클라이언트 확인
   - 존재하면: 정보 업데이트 (IP, 상태 등)
   - 없으면: 새 클라이언트로 등록

#### 3.3.3 장점
- **중복 방지**: 같은 PC를 여러 번 등록해도 DB에 중복 생성 안됨
- **자동 정리**: 오프라인 클라이언트가 무한정 쌓이지 않음
- **WOL 지원**: MAC 주소로 Wake-on-LAN 기능 구현 가능
- **자산 관리**: 네트워크 관리 및 PC 자산 추적 용이

### 3.4 데이터베이스 스키마

#### 3.3.1 clients 테이블
```sql
CREATE TABLE clients (
    id INTEGER PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    mac_address VARCHAR(17),
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(15) NOT NULL,
    hostname VARCHAR(255),
    port INTEGER DEFAULT 8081,
    status VARCHAR(20) DEFAULT 'offline',
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- UUID로 빠른 조회를 위한 인덱스
CREATE INDEX idx_clients_uuid ON clients(uuid);
```

#### 3.3.2 presets 테이블
```sql
CREATE TABLE presets (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 3.3.3 preset_commands 테이블
```sql
CREATE TABLE preset_commands (
    id INTEGER PRIMARY KEY,
    preset_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    full_command TEXT NOT NULL,
    execution_order INTEGER DEFAULT 0,
    FOREIGN KEY (preset_id) REFERENCES presets(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

#### 3.3.4 groups 테이블
```sql
CREATE TABLE groups (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 3.3.5 group_members 테이블
```sql
CREATE TABLE group_members (
    id INTEGER PRIMARY KEY,
    group_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

#### 3.3.6 schedules 테이블
```sql
CREATE TABLE schedules (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    preset_id INTEGER,
    action VARCHAR(20),
    time TIME,
    days_of_week VARCHAR(20),
    is_active BOOLEAN,
    created_at TIMESTAMP,
    FOREIGN KEY (preset_id) REFERENCES presets(id)
);
```

#### 3.3.7 execution_logs 테이블
```sql
CREATE TABLE execution_logs (
    id INTEGER PRIMARY KEY,
    client_id INTEGER,
    command TEXT,
    status VARCHAR(20),
    error_message TEXT,
    executed_at TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

---

## 4. 기술 스택 및 필수 패키지

### 4.1 백엔드 (Node.js)
**핵심 패키지:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "sequelize": "^6.35.0",
    "dotenv": "^16.3.1",
    "node-cron": "^3.0.3",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "nodemon": "^3.0.2",
    "eslint": "^8.55.0",
    "jest": "^29.7.0"
  }
}
```

**패키지 설명:**
- `express`: 웹 서버 프레임워크
- `socket.io`: 실시간 양방향 통신
- `cors`: Cross-Origin 요청 처리
- `sqlite3` & `sequelize`: 데이터베이스 및 ORM
- `node-cron`: 스케줄링 기능
- `winston`: 로깅 시스템
- `dotenv`: 환경 변수 관리

### 4.2 프론트엔드 (React)
**핵심 패키지:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "socket.io-client": "^4.6.1",
    "axios": "^1.6.2",
    "@mui/material": "^5.14.20",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "eslint-plugin-react": "^7.33.2",
    "@types/react": "^18.2.0"
  }
}
```

**패키지 설명:**
- `react` & `react-dom`: React 코어
- `react-router-dom`: 라우팅
- `@reduxjs/toolkit`: 상태 관리
- `socket.io-client`: 서버와 실시간 통신
- `axios`: HTTP 통신
- `@mui/material`: UI 컴포넌트 라이브러리
- `chart.js`: 모니터링 차트

### 4.3 클라이언트 트레이 프로그램 (Python)
**필수 패키지 (requirements.txt):**
```
PyQt5==5.15.9
pystray==0.19.5
Pillow==10.1.0
requests==2.31.0
psutil==5.9.6
python-dotenv==1.0.0
pyinstaller==6.3.0
```

**패키지 설명:**
- `PyQt5`: GUI 프레임워크
- `pystray`: 시스템 트레이 아이콘
- `Pillow`: 아이콘 이미지 처리
- `requests`: HTTP 통신
- `psutil`: 시스템 리소스 모니터링
- `pyinstaller`: 실행 파일 생성

### 4.4 개발/배포 도구
- **버전 관리**: Git
- **Node.js**: 18.x LTS 이상
- **Python**: 3.9 이상
- **에디터**: VS Code (권장)
- **API 테스트**: Postman 또는 Thunder Client

---

## 5. API 명세

### 5.1 RESTful API

#### 5.1.1 클라이언트 관리
```
GET    /api/clients              # 전체 클라이언트 목록
GET    /api/clients/:id          # 특정 클라이언트 정보
POST   /api/clients              # 클라이언트 등록/업데이트
PUT    /api/clients/:id          # 클라이언트 정보 수정
DELETE /api/clients/:id          # 클라이언트 삭제
GET    /api/clients/by-uuid/:uuid # UUID로 클라이언트 조회
```

**클라이언트 등록 요청 예시:**
```json
POST /api/clients
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "mac": "00:11:22:33:44:55",
  "name": "Display_01",
  "ip_address": "192.168.1.101",
  "hostname": "WORKSTATION-01",
  "port": 8081
}
```

#### 5.1.2 실행 제어
```
POST   /api/execute              # 실행 명령
POST   /api/stop                 # 중지 명령
POST   /api/restart              # 재시작 명령
GET    /api/status/:clientId     # 상태 조회
```

#### 5.1.3 프리셋 관리
```
GET    /api/presets              # 프리셋 목록
GET    /api/presets/:id          # 프리셋 상세 (명령어 포함)
POST   /api/presets              # 프리셋 생성
PUT    /api/presets/:id          # 프리셋 수정
DELETE /api/presets/:id          # 프리셋 삭제
POST   /api/presets/:id/apply    # 프리셋 적용 (실행)
```

**프리셋 생성 요청 예시:**
```json
POST /api/presets
{
  "name": "전시회 모드",
  "description": "4면 벽면 전체 화면 모드",
  "commands": [
    {
      "clientId": 1,
      "fullCommand": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node=node_01 -fullscreen",
      "executionOrder": 0
    },
    {
      "clientId": 2,
      "fullCommand": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node=node_02 -fullscreen",
      "executionOrder": 1
    }
  ]
}
```

#### 5.1.4 스케줄 관리
```
GET    /api/schedules            # 스케줄 목록
POST   /api/schedules            # 스케줄 생성
PUT    /api/schedules/:id        # 스케줄 수정
DELETE /api/schedules/:id        # 스케줄 삭제
```

### 5.2 WebSocket 이벤트

#### 5.2.1 서버 → 클라이언트
```javascript
// 클라이언트 상태 변경
socket.emit('client:status', { clientId, status, timestamp })

// 실행 결과
socket.emit('execution:result', { clientId, success, message })

// 시스템 메트릭
socket.emit('metrics:update', { clientId, cpu, memory, gpu })
```

#### 5.2.2 클라이언트 → 서버
```javascript
// 명령 요청
socket.emit('command:execute', { clientIds, command, params })

// 상태 구독
socket.emit('subscribe:status', { clientIds })
```

---

## 6. 개발 일정

### 6.1 Phase 1: 기초 구축 (Week 1-2)

#### Week 1: 환경 설정 및 프로토타입
- 개발 환경 구축
- 프로젝트 구조 설정
- 기본 트레이 프로그램 개발
- 언리얼엔진 실행 테스트

#### Week 2: 기초 통신 구현
- UDP 브로드캐스트 구현
- HTTP 서버 기본 구조
- 클라이언트-서버 통신 테스트

### 6.2 Phase 2: 핵심 기능 개발 (Week 3-6)

#### Week 3-4: 서버 개발
- RESTful API 구현
- WebSocket 실시간 통신
- 데이터베이스 연동
- 자동 검색 시스템

#### Week 5-6: 웹 UI 개발
- React 프로젝트 설정
- 기본 레이아웃 구현
- 클라이언트 목록 및 제어
- 실시간 상태 업데이트

### 6.3 Phase 3: 고급 기능 개발 (Week 7-9)

#### Week 7: 프리셋 시스템
- 프리셋 CRUD 구현
- 프리셋 적용 로직
- UI 통합

#### Week 8: 모니터링 및 스케줄링
- 시스템 메트릭 수집
- 모니터링 대시보드
- 스케줄러 구현

#### Week 9: 그룹 관리 및 최적화
- 그룹 관리 기능
- 성능 최적화
- 오류 처리 강화

### 6.4 Phase 4: 테스트 및 배포 (Week 10-12)

#### Week 10: 통합 테스트
- 기능 테스트
- 성능 테스트
- 부하 테스트

#### Week 11: 버그 수정 및 안정화
- 버그 수정
- UI/UX 개선
- 보안 점검

#### Week 12: 배포 및 문서화
- 배포 패키지 생성
- 사용자 매뉴얼 작성
- 관리자 가이드 작성
- 교육 자료 준비

---

## 7. 리스크 관리

### 7.1 기술적 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 네트워크 지연 | 높음 | 로컬 캐싱, 비동기 처리, 재시도 로직 |
| nDisplay 동기화 실패 | 높음 | 순차 실행 옵션, 마스터 노드 우선 실행 |
| 대량 클라이언트 성능 저하 | 중간 | 페이지네이션, 가상 스크롤, 메시지 배칭 |
| 메모리 누수 | 중간 | 정기적 메모리 프로파일링, 리소스 정리 |
| 브라우저 호환성 | 낮음 | 폴리필 사용, 기능 감지 |

### 7.2 운영적 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 클라이언트 자동 검색 실패 | 중간 | 수동 등록 옵션, IP 스캔 기능 |
| 프리셋 설정 오류 | 중간 | 설정 검증, 프리셋 테스트 모드 |
| 동시 명령 충돌 | 높음 | 명령 큐잉, 상태 잠금 |
| 로그 파일 과다 | 낮음 | 로그 로테이션, 자동 정리 |

---

## 8. 테스트 계획

### 8.1 단위 테스트
- API 엔드포인트 테스트 (Jest)
- React 컴포넌트 테스트
- 유틸리티 함수 테스트
- 목표 커버리지: 70% 이상

### 8.2 통합 테스트
- 서버-클라이언트 통신 테스트
- 프리셋 적용 시나리오
- 그룹 제어 시나리오
- 스케줄 실행 테스트

### 8.3 성능 테스트
- 동시 접속: 50개 클라이언트
- 응답 시간: 평균 500ms 이하
- 메모리 사용: 500MB 이하
- CPU 사용률: 30% 이하

### 8.4 사용성 테스트
- 실제 운영자 대상 테스트
- 작업 완료 시간 측정
- UI/UX 개선사항 수집

---

## 9. 부록

### 9.1 용어 정의
- **nDisplay**: 언리얼엔진의 멀티 디스플레이 렌더링 시스템
- **노드(Node)**: nDisplay 클러스터의 개별 렌더링 단위
- **프리셋**: 사전 정의된 실행 설정 모음
- **하트비트**: 클라이언트 생존 확인 신호
- **브로드캐스트**: 네트워크 전체에 메시지 전송

### 9.2 참고 문서
- 언리얼엔진 nDisplay 공식 문서
- React 공식 문서
- Node.js 베스트 프랙티스
- Socket.io 가이드
- Material-UI 문서

### 9.3 실행 명령어 예시

**패키지 빌드 실행:**
```bash
# 기본 실행
C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/single.ndisplay -dc_node=node_01

# 전체 화면 실행
C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall_4x4.ndisplay -dc_node=node_01 -fullscreen -nosplash

# 윈도우 모드 + 로그
C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/test.ndisplay -dc_node=master -windowed -ResX=1920 -ResY=1080 -log

# 렌더링 동기화 옵션
C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/sync.ndisplay -dc_node=node_01 -dc_sync=1
```

**프리셋별 명령어 구성:**
- **전시회 모드**: 모든 노드 풀스크린, 스플래시 제거
- **개발 모드**: 마스터 노드만 윈도우 모드, 로그 활성화
- **데모 모드**: 특정 해상도, 일부 노드만 실행
- **유지보수 모드**: 최소 리소스, 단일 노드

### 9.4 문제 해결 가이드

**클라이언트가 자동으로 검색되지 않을 때:**
1. 방화벽에서 UDP 9999 포트 허용 확인
2. 서버와 클라이언트가 같은 서브넷에 있는지 확인
3. 클라이언트 트레이 프로그램이 실행 중인지 확인
4. 클라이언트 로그에서 UUID 생성 오류 확인

**같은 PC가 여러 개로 표시될 때:**
1. 서버 DB에서 해당 MAC 주소 중복 확인
2. 클라이언트 UUID가 정상적으로 생성되는지 확인
3. 네트워크 어댑터가 여러 개인 경우 주 어댑터 MAC 사용 확인

**클라이언트 UUID/MAC 관련 문제:**
1. 가상머신의 경우 MAC 주소가 변경될 수 있음
2. 네트워크 어댑터 변경 시 UUID도 변경됨
3. 필요시 config.json에 고정 UUID 설정 가능

**프리셋 실행이 실패할 때:**
1. nDisplay 설정 파일 경로 확인
2. 언리얼엔진 실행 파일 경로 확인
3. 클라이언트 PC의 관리자 권한 확인

**실시간 업데이트가 되지 않을 때:**
1. WebSocket 연결 상태 확인
2. 브라우저 콘솔에서 에러 확인
3. 서버 로그에서 Socket.io 에러 확인

### 9.4 확장 가능성
- 클라우드 지원 (AWS, Azure)
- 모바일 앱 개발
- REST API를 GraphQL로 전환
- Docker 컨테이너화
- Kubernetes 오케스트레이션
- 다국어 지원
- 플러그인 시스템