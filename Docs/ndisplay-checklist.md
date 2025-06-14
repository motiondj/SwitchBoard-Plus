#### 프론트엔드 프리셋 UI
- [ ] 프리셋 카드 컴포넌트
  - [ ] 프리셋 정보 표시
  - [ ] 실행/중지 버튼
  - [# Switchboard Plus (SB+) 개발 체크리스트

## 📋 개발 전 준비사항

### 프로젝트 초기 설정
- [ ] 프로젝트 이름을 Switchboard Plus로 설정
- [ ] Git 저장소 생성 (switchboard-plus)
- [ ] README.md에 SB+ 프로젝트 설명 작성
- [ ] 로고 및 브랜딩 가이드 작성

### Week 7-8: 트레이 클라이언트 개발

#### Python 프로젝트 설정
- [ ] 가상환경 생성 및 활성화
- [ ] requirements.txt 작성
- [ ] 프로젝트 구조 생성
  - [ ] src/ 폴더 구조
  - [ ] assets/icons/ 폴더
  - [ ] config.json 템플릿

#### 핵심 모듈 구현
- [ ] main.py - 진입점
- [ ] tray_app.py - 트레이 애플리케이션
  - [ ] 시스템 트레이 아이콘
  - [ ] 우클릭 메뉴
  - [ ] 상태별 아이콘 변경
- [ ] server_comm.py - 서버 통신
  - [ ] UDP 브로드캐스트
  - [ ] HTTP 명령 수신 서버
  - [ ] 하트비트 전송
- [ ] process_manager.py - 프로세스 관리
  - [ ] 프로세스 실행/중지
  - [ ] PID 관리
  - [ ] 메트릭 수집 (psutil)
- [ ] config_manager.py - 설정 관리

#### UI 및 기능
- [ ] 트레이 메뉴 구현
- [ ] 설정 다이얼로그 (선택사항)
- [ ] 시스템 알림 표시
- [ ] 로그 파일 관리

#### 빌드 및 배포
- [ ] PyInstaller 설정
- [ ] 실행 파일 생성
- [ ] 아이콘 리소스 포함
- [ ] 설치 스크립트 작성

---

## 🌐 Phase 1: 핵심 기능 개발 (Week 1-4)

### Week 1-2: 서버 개발

#### SB+ 프로젝트 구조
- [ ] 프로젝트 폴더 생성
  ```bash
  mkdir switchboard-plus
  cd switchboard-plus
  mkdir sb-server sb-client sb-web docs
  ```
- [ ] 각 폴더에 README 생성
  - [ ] sb-server/README.md - "SB+ Server"
  - [ ] sb-client/README.md - "SB+ Client (Tray)"
  - [ ] sb-web/README.md - "SB+ Web UI"
- [ ] package.json에 프로젝트명 설정
  ```json
  {
    "name": "switchboard-plus-server",
    "description": "Switchboard Plus - Enhanced nDisplay Control"
  }
  ```

#### Express 서버 구축
- [ ] server.js 파일 생성
- [ ] Express 앱 초기화
- [ ] CORS 설정
- [ ] 기본 라우트 설정 (/api/health)
- [ ] 포트 3000에서 서버 실행 확인

#### 데이터베이스 설정
- [ ] Sequelize 초기화
- [ ] models/index.js 생성
- [ ] 데이터베이스 모델 생성
  - [ ] Client 모델 (id, name, ip_address, status)
  - [ ] Preset 모델 (id, name, description, is_active)
  - [ ] PresetCommand 모델 (id, preset_id, client_id, full_command, execution_order)
  - [ ] Group 모델 (id, name, description)
  - [ ] GroupMember 모델 (group_id, client_id)
  - [ ] Schedule 모델
  - [ ] ExecutionLog 모델
- [ ] 모델 관계 설정
  - [ ] Preset hasMany PresetCommand
  - [ ] Client hasMany PresetCommand
  - [ ] Group hasMany GroupMember
- [ ] 마이그레이션 실행

#### RESTful API 구현
- [ ] 클라이언트 관리 API
  - [ ] GET /api/clients
  - [ ] GET /api/clients/:id
  - [ ] POST /api/clients
  - [ ] PUT /api/clients/:id
  - [ ] DELETE /api/clients/:id
- [ ] 실행 제어 API
  - [ ] POST /api/execute
  - [ ] POST /api/stop
  - [ ] POST /api/restart
  - [ ] GET /api/status/:clientId
- [ ] API 에러 핸들링 미들웨어
- [ ] 요청 로깅 미들웨어

#### WebSocket 실시간 통신
- [ ] Socket.io 서버 설정
- [ ] 연결 이벤트 핸들러
- [ ] 클라이언트 상태 이벤트
  - [ ] client:connect
  - [ ] client:disconnect
  - [ ] client:status
  - [ ] client:heartbeat
- [ ] 실행 제어 이벤트
  - [ ] command:execute
  - [ ] command:stop
  - [ ] execution:result
- [ ] 브로드캐스트 기능 구현

#### 자동 검색 시스템
- [ ] UDP 서버 생성 (포트 9999)
- [ ] 브로드캐스트 메시지 파싱
- [ ] 클라이언트 UUID 기반 등록/업데이트
  - [ ] UUID로 기존 클라이언트 조회
  - [ ] 있으면 정보 업데이트 (IP, 상태)
  - [ ] 없으면 새 클라이언트 생성
- [ ] MAC 주소 저장 및 활용
- [ ] 중복 클라이언트 방지 로직
- [ ] 하트비트 타임아웃 (30초)

#### 서버 테스트
- [ ] Postman으로 모든 API 테스트
- [ ] Socket.io 테스트 클라이언트 작성
- [ ] 동시 접속 테스트 (10개 클라이언트)
- [ ] 메모리 사용량 모니터링
- [ ] UUID 기반 클라이언트 등록 테스트
  - [ ] 같은 클라이언트 재등록 시 업데이트 확인
  - [ ] 새 클라이언트 등록 시 생성 확인
  - [ ] UUID로 클라이언트 조회 테스트

### Week 3-4: 웹 UI 개발

#### React 프로젝트 설정
- [ ] Vite로 React 프로젝트 생성
  ```bash
  npm create vite@latest web-ui -- --template react
  ```
- [ ] 필수 패키지 설치
  ```bash
  npm install react-router-dom @reduxjs/toolkit react-redux
  npm install socket.io-client axios @mui/material
  npm install @emotion/react @emotion/styled
  npm install chart.js react-chartjs-2
  ```
- [ ] 프로젝트 구조 설정
  - [ ] /src/components
  - [ ] /src/pages
  - [ ] /src/services
  - [ ] /src/store
  - [ ] /src/utils

#### Redux 상태 관리
- [ ] Store 설정
- [ ] Slice 생성
  - [ ] clientsSlice
  - [ ] presetsSlice
  - [ ] groupsSlice
  - [ ] uiSlice
- [ ] Redux DevTools 연동

#### 기본 레이아웃
- [ ] App.js 라우팅 설정
- [ ] Header 컴포넌트
- [ ] 통계 바 컴포넌트
- [ ] 메인 컨테이너 레이아웃

#### 프리셋 섹션
- [ ] PresetCard 컴포넌트
- [ ] PresetList 컨테이너
- [ ] 프리셋 실행/중지 기능
- [ ] 프리셋 추가/편집 모달
- [ ] 프리셋 상태 표시

#### 그룹 섹션
- [ ] GroupCard 컴포넌트
- [ ] GroupList 컨테이너
- [ ] 그룹 실행/중지 기능
- [ ] 그룹 추가/편집 모달
- [ ] 클라이언트 할당 UI

#### 클라이언트 모니터링
- [ ] ClientMonitor 컴포넌트
- [ ] 클라이언트 상태 카드
- [ ] 실시간 상태 업데이트
- [ ] 상태별 색상 구분

#### API 통신 레이어
- [ ] axios 인스턴스 설정
- [ ] API 서비스 함수들
  - [ ] clientAPI.js
  - [ ] presetAPI.js
  - [ ] groupAPI.js
  - [ ] executionAPI.js
- [ ] 에러 처리 및 재시도 로직

#### Socket.io 통합
- [ ] Socket 연결 관리
- [ ] Redux와 Socket 이벤트 연동
- [ ] 자동 재연결 설정
- [ ] 연결 상태 표시

#### 반응형 디자인
- [ ] 모바일 레이아웃 (< 768px)
- [ ] 태블릿 레이아웃 (768px - 1024px)
- [ ] 데스크톱 레이아웃 (> 1024px)
- [ ] 터치 디바이스 최적화

#### UI 테스트
- [ ] 크롬 개발자 도구로 기능 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 다크모드 지원 (선택사항)

---

## 💎 Phase 2: 고급 기능 개발 (Week 5-7)

### Week 5: 프리셋 시스템

#### 프리셋 시스템 
- [ ] 프리셋 데이터 구조
  - [ ] Preset 모델 (이름, 설명, 활성 상태)
  - [ ] PresetCommand 모델 (전체 명령어, 실행 순서)
  - [ ] 프리셋-명령어 관계 설정
- [ ] 프리셋 API 구현
  - [ ] GET /api/presets (목록 조회)
  - [ ] GET /api/presets/:id/commands (명령어 포함 조회)
  - [ ] POST /api/presets (생성)
  - [ ] PUT /api/presets/:id (수정)
  - [ ] DELETE /api/presets/:id (삭제)
  - [ ] POST /api/presets/:id/apply (실행)
- [ ] 프리셋 실행 로직
  - [ ] 명령어 순서대로 정렬 (execution_order)
  - [ ] 각 클라이언트에 명령어 전송
  - [ ] 실행 결과 수집
  - [ ] 프리셋 활성 상태 업데이트
- [ ] 기본 프리셋 시더 작성
  ```javascript
  // 전시회 모드 예시
  {
    name: "전시회 모드",
    commands: [
      {
        clientId: 1,
        fullCommand: "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node=node_01 -fullscreen",
        executionOrder: 0
      }
    ]
  }
  ```

#### 프론트엔드 프리셋 UI
- [ ] 프리셋 카드 컴포넌트
  - [ ] 프리셋 정보 표시
  - [ ] 실행/중지 버튼
  - [ ] 편집/삭제 기능
- [ ] 프리셋 생성/편집 모달
  - [ ] 클라이언트별 명령어 입력 필드
  - [ ] 명령어 템플릿 기능
  - [ ] 실행 순서 설정
  - [ ] 명령어 유효성 검사
- [ ] 명령어 템플릿 시스템
  ```javascript
  const templates = {
    "풀스크린": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node=node_XX -fullscreen",
    "윈도우": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/test.ndisplay -dc_node=node_XX -windowed",
    "개발": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/dev.ndisplay -dc_node=master -windowed -log"
  }
  ```
- [ ] 프리셋 실행 상태 표시
  - [ ] 활성 프리셋 하이라이트
  - [ ] 실행 중 애니메이션
  - [ ] 오류 상태 표시

#### 프리셋 테스트
- [ ] 프리셋 전환 테스트
- [ ] 동시 프리셋 방지 확인
- [ ] 잘못된 설정 처리
- [ ] 프리셋 백업/복원

### Week 6: 모니터링 및 스케줄링

#### 시스템 모니터링
- [ ] 클라이언트 메트릭 수집
  - [ ] psutil로 CPU/메모리 수집
  - [ ] 30초 주기 전송
  - [ ] 데이터 압축
- [ ] 서버 메트릭 저장
  - [ ] 시계열 데이터 저장
  - [ ] 데이터 보존 정책 (7일)
- [ ] 모니터링 API
  - [ ] GET /api/metrics/:clientId
  - [ ] GET /api/metrics/history

#### 모니터링 대시보드
- [ ] Chart.js 설정
- [ ] 실시간 차트 컴포넌트
- [ ] CPU/메모리 차트
- [ ] 히스토리 뷰
- [ ] 알림 임계값 설정

#### 스케줄링 시스템
- [ ] node-cron 설정
- [ ] 스케줄 CRUD API
- [ ] 스케줄 실행 엔진
- [ ] 충돌 검사 로직
- [ ] 실행 로그 기록

#### 스케줄 UI
- [ ] 스케줄 생성 폼
- [ ] 반복 패턴 설정
- [ ] 캘린더 뷰 (선택사항)
- [ ] 스케줄 히스토리

### Week 7: 그룹 관리 및 최적화

#### 그룹 관리 백엔드
- [ ] 그룹 데이터 모델
- [ ] 그룹 CRUD API
- [ ] 그룹-클라이언트 관계
- [ ] 그룹 실행 로직
- [ ] 중첩 그룹 방지

#### 그룹 관리 UI
- [ ] 그룹 관리 페이지
- [ ] 드래그 앤 드롭 구현
- [ ] 그룹 멤버 표시
- [ ] 그룹 일괄 제어
- [ ] 그룹 통계

#### 성능 최적화
- [ ] 데이터베이스 인덱싱
- [ ] API 응답 캐싱
- [ ] 프론트엔드 메모이제이션
- [ ] 이미지/아이콘 최적화
- [ ] 번들 사이즈 최소화

#### 오류 처리
- [ ] 글로벌 에러 핸들러
- [ ] 사용자 친화적 에러 메시지
- [ ] 에러 로깅 시스템
- [ ] 자동 에러 리포트
- [ ] 복구 가이드

---

## 🧪 Phase 3: 테스트 및 배포 (Week 8-9)

### Week 8: 통합 테스트

#### 기능 테스트 시나리오
- [ ] 시나리오 1: 기본 운영
  - [ ] 5개 클라이언트 등록
  - [ ] 프리셋 생성 및 실행
  - [ ] 그룹 생성 및 제어
  - [ ] 모니터링 확인
- [ ] 시나리오 2: 장애 상황
  - [ ] 네트워크 단절 테스트
  - [ ] 서버 재시작 테스트
  - [ ] 클라이언트 비정상 종료
  - [ ] 자동 복구 확인
- [ ] 시나리오 3: 대규모 운영
  - [ ] 30개 클라이언트 동시 운영
  - [ ] 복잡한 스케줄 설정
  - [ ] 동시 다발 명령 처리

#### 성능 테스트
- [ ] 응답 시간 측정 (< 1초)
- [ ] 메모리 사용량 모니터링
- [ ] CPU 사용률 확인
- [ ] 네트워크 대역폭 측정
- [ ] 24시간 연속 운영 테스트

#### 보안 테스트
- [ ] SQL 인젝션 테스트
- [ ] XSS 공격 방어 확인
- [ ] 인증/인가 테스트
- [ ] API Rate Limiting

### Week 9: 배포 준비

#### 프로덕션 빌드
- [ ] 환경 변수 설정
- [ ] React 프로덕션 빌드
- [ ] 서버 코드 최적화
- [ ] 정적 파일 압축

#### 배포 패키지
- [ ] 서버 배포 스크립트
- [ ] PM2 설정 파일
- [ ] 클라이언트 설치 프로그램
- [ ] 자동 업데이트 시스템

#### 문서화
- [ ] API 문서 (Swagger)
- [ ] 설치 가이드
- [ ] 사용자 매뉴얼
- [ ] 트러블슈팅 가이드
- [ ] 개발자 문서

#### 최종 점검
- [ ] 모든 기능 작동 확인
- [ ] 성능 목표 달성 확인
- [ ] 보안 취약점 제거
- [ ] 문서 완성도 확인
- [ ] 백업/복구 절차 확인 ] 우클릭 메뉴 구현
  - [ ] 아이콘 상태별 색상 변경
- [ ] 언리얼엔진 실행 테스트
  - [ ] subprocess로 프로세스 실행
  - [ ] 명령어 파라미터 전달
  - [ ] 실행 결과 확인

### Week 2: 기초 통신 구현
- [ ] UDP 브로드캐스트 구현
  - [ ] 클라이언트: 브로드캐스트 송신
  - [ ] 서버: 브로드캐스트 수신
  - [ ] 클라이언트 정보 패킷 정의
- [ ] HTTP 서버 기초
  - [ ] Express.js 프로젝트 설정
  - [ ] 기본 라우팅 구조
  - [ ] CORS 설정

---

## 🌐 Phase 2: 핵심 기능 개발 (Week 3-6)

### Week 3-4: 서버 개발

#### 서버 기본 구조
- [ ] Node.js 프로젝트 상세 설정
  - [ ] TypeScript 설정 (선택사항)
  - [ ] ESLint, Prettier 설정
  - [ ] 폴더 구조 확립
- [ ] 데이터베이스 설정
  - [ ] SQLite 설치 및 연결
  - [ ] Sequelize ORM 설정
  - [ ] 마이그레이션 파일 생성
- [ ] 데이터베이스 스키마 구현
  - [ ] clients 테이블
  - [ ] presets 테이블
  - [ ] schedules 테이블
  - [ ] execution_logs 테이블

#### RESTful API 구현
- [ ] 클라이언트 관리 API
  - [ ] GET /api/clients
  - [ ] GET /api/clients/:id
  - [ ] POST /api/clients
  - [ ] PUT /api/clients/:id
  - [ ] DELETE /api/clients/:id
- [ ] 실행 제어 API
  - [ ] POST /api/execute
  - [ ] POST /api/stop
  - [ ] POST /api/restart
  - [ ] GET /api/status/:clientId
- [ ] 미들웨어 구현
  - [ ] 인증 미들웨어
  - [ ] 에러 핸들링
  - [ ] 요청 로깅

#### 실시간 통신
- [ ] Socket.io 설정
  - [ ] 서버 초기화
  - [ ] 네임스페이스 정의
  - [ ] 이벤트 핸들러 구조
- [ ] WebSocket 이벤트 구현
  - [ ] client:status 이벤트
  - [ ] execution:result 이벤트
  - [ ] metrics:update 이벤트
- [ ] 하트비트 시스템
  - [ ] 5초 간격 체크
  - [ ] 타임아웃 처리
  - [ ] 재연결 로직

#### 자동 검색 시스템
- [ ] UDP 리스너 구현
  - [ ] 포트 9999 리스닝
  - [ ] 브로드캐스트 메시지 파싱
  - [ ] 클라이언트 자동 등록
- [ ] 클라이언트 관리자
  - [ ] 메모리 내 클라이언트 목록
  - [ ] 상태 업데이트 로직
  - [ ] 데이터베이스 동기화

### Week 5-6: 웹 UI 개발

#### React 프로젝트 설정
- [ ] Vite로 프로젝트 생성
- [ ] 기본 폴더 구조 설정
  - [ ] components/
  - [ ] pages/
  - [ ] services/
  - [ ] utils/
- [ ] 라우팅 설정 (React Router)
- [ ] Redux Toolkit 설정
  - [ ] Store 구성
  - [ ] 기본 Slice 생성

#### UI 컴포넌트 개발
- [ ] 레이아웃 컴포넌트
  - [ ] Header 컴포넌트
  - [ ] Sidebar (선택사항)
  - [ ] Main Content Area
- [ ] 클라이언트 목록
  - [ ] ClientCard 컴포넌트
  - [ ] ClientList 컨테이너
  - [ ] 상태별 스타일링
- [ ] 제어 패널
  - [ ] 전체 실행/중지 버튼
  - [ ] 새로고침 버튼
  - [ ] 클라이언트 추가 버튼

#### 실시간 기능
- [ ] Socket.io 클라이언트 설정
  - [ ] 연결 관리
  - [ ] 이벤트 리스너
  - [ ] 재연결 처리
- [ ] Redux와 Socket.io 통합
  - [ ] 실시간 상태 업데이트
  - [ ] 액션 디스패치
- [ ] UI 실시간 반영
  - [ ] 클라이언트 상태 변경
  - [ ] 알림 표시
  - [ ] 로딩 상태

#### API 통신
- [ ] Axios 설정
  - [ ] 기본 URL 설정
  - [ ] 인터셉터 구성
- [ ] API 서비스 레이어
  - [ ] clientService.js
  - [ ] executionService.js
  - [ ] presetService.js
- [ ] 에러 처리
  - [ ] 토스트 알림
  - [ ] 에러 바운더리

---

## 💎 Phase 3: 고급 기능 개발 (Week 7-9)

### Week 7: 프리셋 시스템

#### 백엔드 프리셋 기능
- [ ] 프리셋 API 구현
  - [ ] GET /api/presets
  - [ ] GET /api/presets/:id
  - [ ] POST /api/presets
  - [ ] PUT /api/presets/:id
  - [ ] DELETE /api/presets/:id
  - [ ] POST /api/presets/:id/apply
- [ ] 프리셋 적용 로직
  - [ ] 클라이언트 선택
  - [ ] 설정 파일 적용
  - [ ] 파라미터 변환
- [ ] 기본 프리셋 생성
  - [ ] 전시회 모드
  - [ ] 데모 모드
  - [ ] 개발 모드
  - [ ] 유지보수 모드

#### 프론트엔드 프리셋 UI
- [ ] 프리셋 관리 페이지
  - [ ] 프리셋 목록 표시
  - [ ] 프리셋 생성 폼
  - [ ] 프리셋 수정 모달
- [ ] 프리셋 적용 UI
  - [ ] 빠른 실행 버튼
  - [ ] 프리셋 선택 드롭다운
  - [ ] 적용 확인 다이얼로그
- [ ] 프리셋 편집기
  - [ ] 클라이언트 선택 UI
  - [ ] 파라미터 입력 폼
  - [ ] 미리보기 기능

### Week 8: 모니터링 및 스케줄링

#### 시스템 모니터링
- [ ] 메트릭 수집 (클라이언트)
  - [ ] CPU 사용률
  - [ ] 메모리 사용률
  - [ ] GPU 사용률 (가능한 경우)
  - [ ] 프로세스 상태
- [ ] 메트릭 전송
  - [ ] 주기적 전송 (30초)
  - [ ] 변화 감지 시 즉시 전송
- [ ] 모니터링 대시보드
  - [ ] 실시간 차트 (Chart.js)
  - [ ] 리소스 사용 현황
  - [ ] 알림 임계값 설정

#### 스케줄링 시스템
- [ ] 스케줄 API 구현
  - [ ] CRUD 작업
  - [ ] 스케줄 활성화/비활성화
- [ ] 스케줄러 엔진
  - [ ] node-cron 설정
  - [ ] 스케줄 실행 로직
  - [ ] 프리셋 연동
- [ ] 스케줄 UI
  - [ ] 캘린더 뷰 (선택사항)
  - [ ] 스케줄 생성 폼
  - [ ] 반복 설정 옵션

### Week 9: 그룹 관리 및 최적화

#### 그룹 관리 기능
- [ ] 그룹 데이터 모델
  - [ ] groups 테이블 추가
  - [ ] 클라이언트-그룹 관계 설정
- [ ] 그룹 API
  - [ ] 그룹 CRUD
  - [ ] 그룹별 실행 제어
- [ ] 그룹 UI
  - [ ] 그룹 생성/편집
  - [ ] 드래그 앤 드롭 할당
  - [ ] 그룹별 필터링

#### 성능 최적화
- [ ] 백엔드 최적화
  - [ ] 데이터베이스 인덱싱
  - [ ] 쿼리 최적화
  - [ ] 캐싱 전략
- [ ] 프론트엔드 최적화
  - [ ] 컴포넌트 메모이제이션
  - [ ] 가상 스크롤링 (많은 클라이언트)
  - [ ] 번들 크기 최적화
- [ ] 네트워크 최적화
  - [ ] 메시지 배치 처리
  - [ ] 압축 적용
  - [ ] 연결 풀링

#### 오류 처리 강화
- [ ] 백엔드 에러 처리
  - [ ] 글로벌 에러 핸들러
  - [ ] 상세 에러 로깅
  - [ ] 에러 복구 전략
- [ ] 프론트엔드 에러 처리
  - [ ] 에러 바운더리 구현
  - [ ] 사용자 친화적 메시지
  - [ ] 재시도 메커니즘
- [ ] 클라이언트 에러 처리
  - [ ] 프로세스 실패 감지
  - [ ] 자동 재시작 옵션
  - [ ] 에러 리포팅

---

## 🧪 Phase 4: 테스트 및 배포 (Week 10-12)

### Week 10: 통합 테스트

#### 기능 테스트
- [ ] 클라이언트 등록/해제
- [ ] 실행/중지 명령
- [ ] 프리셋 적용
- [ ] 스케줄 실행
- [ ] 그룹 제어
- [ ] 실시간 업데이트

#### 시나리오 테스트
- [ ] 신규 설치 시나리오
- [ ] 일상 운영 시나리오
- [ ] 장애 복구 시나리오
- [ ] 대규모 제어 시나리오

#### 호환성 테스트
- [ ] 다양한 언리얼엔진 버전
- [ ] 다양한 Windows 버전
- [ ] 네트워크 환경 차이
- [ ] 브라우저 호환성

### Week 11: 버그 수정 및 안정화

#### 버그 수정
- [ ] 테스트 중 발견된 버그 목록화
- [ ] 우선순위별 버그 수정
- [ ] 회귀 테스트

#### UI/UX 개선
- [ ] 사용자 피드백 수집
- [ ] UI 일관성 점검
- [ ] 반응 속도 개선
- [ ] 접근성 개선

#### 보안 점검
- [ ] 인증/인가 검증
- [ ] SQL 인젝션 방지
- [ ] XSS 방지
- [ ] 민감 정보 보호

### Week 12: 배포 및 문서화

#### 배포 패키지
- [ ] 서버 배포
  - [ ] PM2 설정
  - [ ] 환경 변수 관리
  - [ ] 배포 스크립트
- [ ] 클라이언트 패키징
  - [ ] PyInstaller 실행 파일
  - [ ] 자동 시작 설정
  - [ ] 설치 마법사 (선택사항)
- [ ] 웹 UI 빌드
  - [ ] 프로덕션 빌드
  - [ ] 정적 파일 최적화

#### 문서화
- [ ] 설치 가이드
  - [ ] 시스템 요구사항
  - [ ] 단계별 설치 과정
  - [ ] 초기 설정
- [ ] 사용자 매뉴얼
  - [ ] 기본 사용법
  - [ ] 고급 기능
  - [ ] 문제 해결
- [ ] API 문서
  - [ ] 엔드포인트 설명
  - [ ] 요청/응답 예시
- [ ] 개발자 문서
  - [ ] 아키텍처 설명
  - [ ] 코드 구조
  - [ ] 확장 가이드

#### 교육 자료
- [ ] 빠른 시작 가이드
- [ ] 비디오 튜토리얼 (선택사항)
- [ ] FAQ 문서
- [ ] 샘플 프리셋 제공

---

## ✅ 최종 점검 사항

### 기능 완성도
- [ ] 모든 핵심 기능 구현 완료
- [ ] 엣지 케이스 처리
- [ ] 성능 목표 달성
- [ ] 안정성 확보

### 품질 보증
- [ ] 코드 리뷰 완료
- [ ] 테스트 커버리지 80% 이상
- [ ] 문서화 완료
- [ ] 사용자 승인

### 배포 준비
- [ ] 프로덕션 환경 준비
- [ ] 백업 계획 수립
- [ ] 모니터링 도구 설정
- [ ] 지원 채널 구축

---

## 📝 추가 메모

### 우선순위 조정
- 핵심 기능부터 구현
- 고급 기능은 단계적 추가
- 사용자 피드백 기반 조정

### 일일 체크
- [ ] 코드 커밋
- [ ] 진행 상황 업데이트
- [ ] 이슈 트래킹
- [ ] 팀 커뮤니케이션