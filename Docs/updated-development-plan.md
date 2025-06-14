# Switchboard Plus (SB+) 개발 계획서 - 업데이트 버전

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Switchboard Plus (SB+)
- **설명**: 언리얼엔진 nDisplay를 위한 차세대 웹 기반 원격 제어 시스템
- **버전**: 2.0.0
- **개발 기간**: 2024년 1월 - 2024년 3월 (9주)
- **대상 사용자**: nDisplay 시스템 운영자, 언리얼엔진 Switchboard 사용자
- **아키텍처**: React 기반 모듈화된 웹 애플리케이션

### 1.2 프로젝트 배경
언리얼엔진의 기본 Switchboard는 설치형 프로그램으로 제한적인 기능을 제공합니다. Switchboard Plus는 현대적인 웹 기반 아키텍처로 재구현하여 어디서나 접근 가능하고, 프리셋, 그룹 제어, 실시간 모니터링 등 향상된 기능을 제공하는 것을 목표로 합니다.

### 1.3 주요 개선사항 (v2.0)
- React 기반 컴포넌트 아키텍처로 완전 재구축
- Redux Toolkit을 활용한 체계적인 상태 관리
- Material-UI 기반 전문적인 사용자 인터페이스
- Socket.io를 통한 실시간 양방향 통신
- 모듈화된 서비스 레이어 구조

---

## 2. 시스템 아키텍처

### 2.1 전체 구조
```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   React Web UI     │────▶│   Node.js Server   │────▶│   Python Client     │
│  (Material-UI)     │     │  (Express + Socket) │     │   (Tray Application)│
│  Redux + Socket.io  │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                       │                               │
                                       ▼                               ▼
                              ┌─────────────────────┐     ┌─────────────────────┐
                              │   SQLite Database   │     │  Unreal Engine      │
                              │   (Sequelize ORM)   │     │  (nDisplay)         │
                              └─────────────────────┘     └─────────────────────┘
```

### 2.2 프론트엔드 아키텍처
```
React Application
├── Components (UI Layer)
│   ├── Common Components
│   ├── Dashboard Components  
│   ├── Preset Components
│   ├── Group Components
│   └── Client Components
│
├── Store (State Management)
│   ├── Redux Slices
│   ├── Async Thunks
│   └── Middleware (Socket)
│
├── Services (API Layer)
│   ├── HTTP Client (Axios)
│   ├── WebSocket Client
│   └── API Endpoints
│
└── Hooks & Utils
    ├── Custom Hooks
    └── Helper Functions
```

### 2.3 백엔드 통신 프로토콜
- **웹 UI ↔ 서버**: WebSocket (실시간), REST API (데이터 CRUD)
- **서버 ↔ 클라이언트**: UDP 브로드캐스트 (자동 검색), HTTP (명령/상태)
- **하트비트**: 5초 간격 상태 확인

---

## 3. 프로젝트 구조

### 3.1 전체 폴더 구조
```
switchboard-plus/
├── docs/                          # 📚 프로젝트 문서
│   ├── development-plan.md        # 개발 계획서 (이 문서)
│   ├── dev-checklist.md           # 개발 체크리스트  
│   ├── dev-environment.md         # 개발 환경 가이드
│   ├── web-ui-integration-guide.md # 웹 UI 구성 가이드
│   ├── tray-client-guide.md       # 트레이 클라이언트 가이드
│   ├── cursor-ai-guide.md         # Cursor AI 활용 가이드
│   ├── api-documentation.md       # API 문서
│   ├── architecture/
│   │   ├── system-diagram.md      # 시스템 다이어그램
│   │   └── sequence-diagram.md    # 시퀀스 다이어그램
│   └── samples/
│       └── ui-prototype.html      # UI 프로토타입 (참고용)
│
├── sb-server/                     # 🖥️ Node.js 백엔드 서버
│   ├── src/
│   │   ├── controllers/           # API 컨트롤러
│   │   ├── models/                # 데이터베이스 모델
│   │   ├── routes/                # API 라우트
│   │   ├── middleware/            # 미들웨어
│   │   ├── services/              # 비즈니스 로직
│   │   └── utils/                 # 유틸리티
│   ├── config/                    # 설정 파일
│   ├── migrations/                # DB 마이그레이션
│   ├── package.json
│   ├── server.js                  # 서버 진입점
│   └── README.md
│
├── sb-web/                        # 🌐 React 웹 애플리케이션
│   ├── src/
│   │   ├── components/            # React 컴포넌트
│   │   │   ├── common/            # 공통 컴포넌트
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── dashboard/         # 대시보드
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── StatsBar.jsx
│   │   │   ├── presets/           # 프리셋 관리
│   │   │   │   ├── PresetSection.jsx
│   │   │   │   ├── PresetList.jsx
│   │   │   │   ├── PresetCard.jsx
│   │   │   │   └── PresetModal.jsx
│   │   │   ├── groups/            # 그룹 관리
│   │   │   │   ├── GroupSection.jsx
│   │   │   │   ├── GroupList.jsx
│   │   │   │   ├── GroupCard.jsx
│   │   │   │   └── GroupModal.jsx
│   │   │   └── clients/           # 클라이언트 모니터링
│   │   │       ├── ClientMonitor.jsx
│   │   │       └── ClientCard.jsx
│   │   │
│   │   ├── store/                 # Redux 상태 관리
│   │   │   ├── index.js           # 스토어 설정
│   │   │   ├── slices/            # Redux 슬라이스
│   │   │   │   ├── clientsSlice.js
│   │   │   │   ├── presetsSlice.js
│   │   │   │   ├── groupsSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── middleware/        # 미들웨어
│   │   │       └── socketMiddleware.js
│   │   │
│   │   ├── services/              # API 서비스
│   │   │   ├── api.js             # Axios 기본 설정
│   │   │   ├── clientAPI.js       # 클라이언트 API
│   │   │   ├── presetAPI.js       # 프리셋 API
│   │   │   └── groupAPI.js        # 그룹 API
│   │   │
│   │   ├── hooks/                 # 커스텀 훅
│   │   │   └── useSocket.js
│   │   │
│   │   ├── utils/                 # 유틸리티
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx                # 메인 애플리케이션
│   │   ├── App.css
│   │   ├── main.jsx               # React 진입점
│   │   └── index.css
│   │
│   ├── public/                    # 정적 리소스
│   ├── package.json
│   ├── vite.config.js             # Vite 설정
│   ├── .env                       # 환경 변수
│   └── README.md
│
├── sb-client/                     # 🖱️ Python 트레이 클라이언트
│   ├── src/
│   │   ├── main.py                # 진입점
│   │   ├── tray_app.py            # 트레이 애플리케이션
│   │   ├── server_comm.py         # 서버 통신 모듈
│   │   ├── process_manager.py     # 프로세스 관리
│   │   ├── config_manager.py      # 설정 관리
│   │   └── utils/
│   │       └── logger.py          # 로깅 설정
│   ├── assets/
│   │   └── icons/                 # 트레이 아이콘
│   ├── config.json                # 클라이언트 설정
│   ├── requirements.txt           # Python 의존성
│   ├── build.py                   # 빌드 스크립트
│   └── README.md
│
├── .gitignore                     # Git 제외 파일
├── README.md                      # 프로젝트 메인 README
└── package.json                   # 프로젝트 루트 설정
```

### 3.2 웹 애플리케이션 상세 구조

#### 3.2.1 컴포넌트 계층구조
```
App.jsx
├── Header.jsx (공통)
├── Dashboard.jsx
│   ├── StatsBar.jsx
│   ├── PresetSection.jsx
│   │   ├── PresetList.jsx
│   │   │   └── PresetCard.jsx (여러개)
│   │   └── PresetModal.jsx
│   ├── GroupSection.jsx
│   │   ├── GroupList.jsx
│   │   │   └── GroupCard.jsx (여러개)
│   │   └── GroupModal.jsx
│   └── ClientMonitor.jsx
│       └── ClientCard.jsx (여러개)
└── Toast.jsx (공통)
```

#### 3.2.2 상태 관리 구조
```
Redux Store
├── clients
│   ├── items[]           # 클라이언트 목록
│   ├── status           # 로딩 상태
│   └── error            # 에러 정보
├── presets
│   ├── items[]          # 프리셋 목록
│   ├── activePresetId   # 활성 프리셋 ID
│   └── status
├── groups
│   ├── items[]          # 그룹 목록
│   └── status
└── ui
    ├── toast            # 토스트 알림 상태
    ├── modals           # 모달 상태
    └── loading          # 전역 로딩 상태
```

---

## 4. 기술 스택

### 4.1 프론트엔드 (React)
**핵심 기술:**
- React 18.2.0 - 사용자 인터페이스 라이브러리
- Redux Toolkit 1.9.7 - 상태 관리
- Material-UI 5.14.20 - UI 컴포넌트 라이브러리
- Socket.io Client 4.6.1 - 실시간 통신
- Axios 1.6.2 - HTTP 클라이언트
- Vite 5.0.0 - 빌드 도구

**개발 도구:**
- ESLint - 코드 품질 관리
- React DevTools - 디버깅
- Redux DevTools - 상태 디버깅

### 4.2 백엔드 (Node.js)
**핵심 패키지:**
- Express 4.18.2 - 웹 프레임워크
- Socket.io 4.6.1 - 실시간 양방향 통신
- Sequelize 6.35.0 - ORM
- SQLite3 5.1.6 - 데이터베이스
- Node-cron 3.0.3 - 스케줄링
- Winston 3.11.0 - 로깅

### 4.3 클라이언트 (Python)
**핵심 패키지:**
- PyQt5 5.15.9 - GUI 프레임워크
- Requests 2.31.0 - HTTP 클라이언트
- Psutil 5.9.6 - 시스템 리소스 모니터링
- PyInstaller 6.3.0 - 실행 파일 생성

---

## 5. API 명세서

### 5.1 RESTful API 엔드포인트

#### 5.1.1 클라이언트 관리
```
GET    /api/clients              # 전체 클라이언트 목록
GET    /api/clients/:id          # 특정 클라이언트 정보
POST   /api/clients              # 클라이언트 등록/업데이트
PUT    /api/clients/:id          # 클라이언트 정보 수정
DELETE /api/clients/:id          # 클라이언트 삭제
GET    /api/clients/by-uuid/:uuid # UUID로 클라이언트 조회
```

#### 5.1.2 프리셋 관리
```
GET    /api/presets              # 프리셋 목록
GET    /api/presets/:id          # 프리셋 상세 (명령어 포함)
POST   /api/presets              # 프리셋 생성
PUT    /api/presets/:id          # 프리셋 수정
DELETE /api/presets/:id          # 프리셋 삭제
POST   /api/presets/:id/execute  # 프리셋 실행
POST   /api/presets/:id/stop     # 프리셋 중지
```

#### 5.1.3 그룹 관리
```
GET    /api/groups               # 그룹 목록
GET    /api/groups/:id           # 그룹 상세
POST   /api/groups               # 그룹 생성
PUT    /api/groups/:id           # 그룹 수정
DELETE /api/groups/:id           # 그룹 삭제
```

### 5.2 WebSocket 이벤트

#### 5.2.1 클라이언트 이벤트
```javascript
'client:status'      # 클라이언트 상태 변경
'client:metrics'     # 클라이언트 메트릭 업데이트
'client:registered'  # 새 클라이언트 등록
```

#### 5.2.2 프리셋 이벤트
```javascript
'preset:status'      # 프리셋 상태 변경
'execution:result'   # 명령 실행 결과
```

---

## 6. 개발 일정 (업데이트)

### 6.1 Phase 1: 핵심 인프라 구축 (Week 1-3)

#### Week 1: 백엔드 서버 개발
- Node.js Express 서버 구축
- SQLite 데이터베이스 연동
- RESTful API 구현
- WebSocket 실시간 통신 구현
- UDP 브로드캐스트 리스너 구현

#### Week 2-3: React 웹 애플리케이션 개발
- Vite + React 프로젝트 설정
- Redux Toolkit 상태 관리 구축
- Material-UI 컴포넌트 구성
- Socket.io 클라이언트 연동
- 기본 UI 컴포넌트 구현

### 6.2 Phase 2: 핵심 기능 구현 (Week 4-6)

#### Week 4: 프리셋 시스템
- 프리셋 CRUD 기능 구현
- 클라이언트별 명령어 설정 시스템
- 프리셋 실행/중지 로직
- UI 컴포넌트 완성

#### Week 5: 그룹 관리 시스템
- 그룹 CRUD 기능 구현
- 클라이언트-그룹 관계 관리
- 그룹 기반 프리셋 연동
- 그룹 UI 컴포넌트 완성

#### Week 6: 클라이언트 모니터링
- 실시간 상태 모니터링
- 메트릭 수집 및 표시
- 자동 검색 시스템 통합

### 6.3 Phase 3: 클라이언트 및 고급 기능 (Week 7-8)

#### Week 7: Python 트레이 클라이언트
- PyQt5 기반 시스템 트레이 애플리케이션
- 서버 통신 모듈 구현
- 프로세스 관리 시스템
- 언리얼엔진 실행 제어

#### Week 8: 통합 및 최적화
- 전체 시스템 통합 테스트
- 성능 최적화
- 에러 처리 강화
- 사용자 경험 개선

### 6.4 Phase 4: 테스트 및 배포 (Week 9)

#### Week 9: 배포 준비
- 프로덕션 빌드 최적화
- 배포 스크립트 작성
- 문서화 완성
- 사용자 교육 자료 준비

---

## 7. 품질 보증

### 7.1 코드 품질
- ESLint를 통한 코드 스타일 일관성
- React 컴포넌트 재사용성 최대화
- Redux 상태 관리 패턴 준수
- 명확한 컴포넌트 책임 분리

### 7.2 사용자 경험
- Material-UI 디자인 시스템 활용
- 반응형 디자인으로 모든 기기 지원
- 직관적인 인터페이스 설계
- 실시간 피드백 제공

### 7.3 성능 최적화
- React.memo를 통한 컴포넌트 최적화
- Redux selector 최적화
- 번들 크기 최소화
- 이미지 및 리소스 최적화

---

## 8. 확장 계획

### 8.1 단기 확장 (v2.1)
- 스케줄링 시스템 구현
- 차트 기반 모니터링 대시보드
- 사용자 인증 시스템
- 다국어 지원

### 8.2 중기 확장 (v2.5)
- 플러그인 시스템
- 모바일 애플리케이션
- 클라우드 동기화
- 고급 분석 기능

### 8.3 장기 확장 (v3.0)
- 마이크로서비스 아키텍처 전환
- Kubernetes 지원
- AI 기반 자동화
- 엔터프라이즈 기능

---

## 9. 위험 관리

### 9.1 기술적 위험
- **React 컴포넌트 복잡성**: 명확한 컴포넌트 설계로 해결
- **상태 관리 복잡성**: Redux Toolkit 패턴 준수
- **실시간 통신 안정성**: 재연결 로직 및 에러 처리 강화

### 9.2 성능 위험
- **대용량 데이터 처리**: 가상화 및 페이지네이션 적용
- **메모리 사용량**: React DevTools 프로파일링
- **네트워크 지연**: 로컬 캐싱 및 최적화

---

## 10. 결론

Switchboard Plus v2.0은 React 기반의 현대적인 웹 애플리케이션으로 완전히 재구축되어 확장성, 유지보수성, 사용자 경험이 크게 향상되었습니다. 모듈화된 아키텍처를 통해 향후 기능 확장이 용이하며, 전문적인 UI 라이브러리와 상태 관리 시스템을 활용하여 기업 환경에서도 안정적으로 사용할 수 있는 솔루션을 제공합니다.

체계적인 개발 프로세스와 문서화를 통해 Cursor AI와 같은 개발 도구와의 협업이 최적화되어 있으며, 지속적인 개선과 확장이 가능한 기반을 마련하였습니다.