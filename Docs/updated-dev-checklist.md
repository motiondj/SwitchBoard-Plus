# Switchboard Plus v2.0 개발 체크리스트

## 📋 프로젝트 초기 설정

### 전체 프로젝트 구조
- [x] 루트 프로젝트 폴더 생성 (switchboard-plus)
- [x] Git 저장소 초기화
- [x] 프로젝트 메인 README.md 작성
- [x] 각 서브프로젝트 폴더 생성 (sb-server, sb-web, sb-client, docs)
- [x] 전체 프로젝트 package.json 설정
- [x] .gitignore 파일 설정

---

## 🖥️ Phase 1: 백엔드 서버 개발 (Week 1)

### Node.js 서버 프로젝트 설정
- [x] sb-server 폴더에 Express 프로젝트 초기화
- [x] package.json에 프로젝트명 "switchboard-plus-server" 설정
- [x] 필수 패키지 설치
  - [x] express@^4.18.2
  - [x] socket.io@^4.6.1
  - [x] cors@^2.8.5
  - [x] sqlite3@^5.1.6
  - [x] sequelize@^6.35.0
  - [x] dotenv@^16.3.1
  - [x] winston@^3.11.0
  - [x] node-cron@^3.0.3
- [x] 개발 의존성 설치 (nodemon, eslint, jest)

### 서버 기본 구조 구현
- [x] src 폴더 구조 생성
  - [x] controllers/ - API 컨트롤러
  - [x] models/ - 데이터베이스 모델
  - [x] routes/ - API 라우트
  - [x] middleware/ - 미들웨어
  - [x] services/ - 비즈니스 로직
  - [x] utils/ - 유틸리티 함수
- [x] server.js 메인 진입점 생성
- [x] Express 앱 초기화 및 기본 설정
- [x] CORS 설정
- [x] 환경 변수 설정 (.env)

### 데이터베이스 설정
- [x] Sequelize 초기화
- [x] 데이터베이스 모델 생성
  - [x] Client 모델 (UUID 기반 고유 식별)
  - [x] Preset 모델
  - [x] PresetCommand 모델
  - [x] Group 모델
  - [x] GroupMember 모델
- [x] 모델 관계 설정
- [x] 마이그레이션 생성 및 실행
- [x] 시드 데이터 준비

### API 엔드포인트 구현
- [x] 클라이언트 관리 API
  - [x] GET /api/clients
  - [x] POST /api/clients (UUID 기반 등록/업데이트)
  - [x] PUT /api/clients/:id
  - [x] DELETE /api/clients/:id
  - [x] GET /api/clients/by-uuid/:uuid
- [x] 프리셋 관리 API
  - [x] GET /api/presets
  - [x] GET /api/presets/:id
  - [x] POST /api/presets
  - [x] PUT /api/presets/:id
  - [x] DELETE /api/presets/:id
  - [x] POST /api/presets/:id/execute
  - [x] POST /api/presets/:id/stop
- [x] 그룹 관리 API
  - [x] GET /api/groups
  - [x] GET /api/groups/:id
  - [x] POST /api/groups
  - [x] PUT /api/groups/:id
  - [x] DELETE /api/groups/:id
  - [x] POST /api/groups/:id/members
  - [x] DELETE /api/groups/:id/members/:clientId

### 실시간 통신 구현
- [x] Socket.io 서버 설정
- [x] WebSocket 이벤트 핸들러 구현
  - [x] client:status
  - [x] client:metrics
  - [x] client:registered
  - [x] preset:status
  - [x] execution:result
- [x] 클라이언트 연결 관리

### 자동 검색 시스템
- [x] UDP 서버 구현 (포트 9999)
- [x] 브로드캐스트 메시지 파싱
- [x] UUID 기반 클라이언트 등록/업데이트 로직
- [x] 하트비트 시스템 구현

---

## 🌐 Phase 2: React 웹 애플리케이션 개발 (Week 2-3)

### React 프로젝트 설정
- [x] sb-web 폴더에 Vite + React 프로젝트 생성
- [x] 프로젝트 구조 설정
  - [x] src/components/ (각 섹션별 폴더)
  - [x] src/store/ (Redux 관리)
  - [x] src/services/ (API 서비스)
  - [x] src/hooks/ (커스텀 훅)
  - [x] src/utils/ (유틸리티)
- [x] 필수 패키지 설치
  - [x] react@^18.2.0
  - [x] @reduxjs/toolkit@^1.9.7
  - [x] react-redux@^8.1.3
  - [x] @mui/material@^5.14.20
  - [x] socket.io-client@^4.6.1
  - [x] axios@^1.6.2

### Redux 상태 관리 구축
- [x] 스토어 설정 (src/store/index.js)
- [x] Redux 슬라이스 생성
  - [x] clientsSlice.js
  - [x] presetsSlice.js
  - [x] groupsSlice.js
  - [x] uiSlice.js
- [x] Socket 미들웨어 구현
- [x] 비동기 액션 구현 (createAsyncThunk)

### API 서비스 레이어
- [x] Axios 기본 설정 (src/services/api.js)
- [x] API 서비스 구현
  - [x] clientAPI.js
  - [x] presetAPI.js
  - [x] groupAPI.js
- [x] 에러 처리 및 인터셉터 설정

### 공통 컴포넌트 구현
- [x] Header.jsx (헤더 컴포넌트)
- [x] Toast.jsx (알림 시스템)
- [x] Dashboard.jsx (메인 대시보드)
- [x] StatsBar.jsx (통계 바)

### 프리셋 컴포넌트 구현
- [x] PresetSection.jsx (프리셋 섹션)
- [x] PresetList.jsx (프리셋 목록)
- [x] PresetCard.jsx (개별 프리셋 카드)
- [x] PresetModal.jsx (프리셋 생성/편집 모달)
- [x] 클라이언트별 명령어 설정 UI
- [x] 그룹 선택 기능
- [x] 프리셋 실행/중지 기능

### 그룹 컴포넌트 구현
- [x] GroupSection.jsx (그룹 섹션)
- [x] GroupList.jsx (그룹 목록)
- [x] GroupCard.jsx (개별 그룹 카드)
- [x] GroupModal.jsx (그룹 생성/편집 모달)
- [x] 클라이언트 선택 기능
- [x] 그룹 색상 설정

### 클라이언트 모니터링 구현
- [x] ClientMonitor.jsx (클라이언트 모니터링)
- [x] ClientCard.jsx (개별 클라이언트 카드)
- [x] 실시간 상태 표시 (🟢🟡🔴)
- [x] 상태 텍스트 제거 (아이콘만 표시)

### Socket.io 클라이언트 연동
- [x] Socket 연결 관리
- [x] 실시간 이벤트 처리
- [x] Redux와 Socket 이벤트 연동
- [x] 자동 재연결 처리

### 반응형 디자인
- [x] Material-UI 브레이크포인트 활용
- [x] 모바일 레이아웃 (< 768px)
- [x] 태블릿 레이아웃 (768px - 1024px)
- [x] 데스크톱 레이아웃 (> 1024px)

---

## 🎯 Phase 3: 핵심 기능 구현 (Week 4-6)

### Week 4: 프리셋 시스템 완성
- [x] 프리셋 CRUD 기능 백엔드 완성
- [x] 프리셋 실행 로직 구현
  - [x] 클라이언트별 명령어 전송
  - [x] 실행 순서 관리
  - [x] 실행 결과 수집
- [x] 프리셋 UI 완성
  - [x] 그룹 기반 클라이언트 선택
  - [x] 클라이언트별 명령어 입력
  - [x] 프리셋 카드 버튼 오른쪽 배치
- [x] 프리셋 편집 기능
- [x] 프리셋 상태 관리

### Week 5: 그룹 관리 시스템
- [x] 그룹 CRUD 백엔드 완성
- [x] 그룹-클라이언트 관계 관리
- [x] 그룹 UI 완성
  - [x] 그룹 카드 버튼 오른쪽 배치
  - [x] 그룹 실행/중지 버튼 제거
  - [x] 클라이언트 태그 상태별 색상
- [x] 그룹 색상 시스템
- [x] 다중 그룹 지원

### Week 6: 클라이언트 모니터링 고도화
- [x] 실시간 메트릭 수집
- [x] 클라이언트 자동 검색 완성
- [x] 하트비트 시스템 완성
- [x] 클라이언트 상태 관리
- [x] 오프라인 클라이언트 처리

---

## 🖱️ Phase 4: Python 트레이 클라이언트 개발 (Week 7)

### Python 프로젝트 설정
- [x] sb-client 폴더에 Python 프로젝트 생성
- [x] 가상환경 생성 및 활성화
- [x] requirements.txt 작성
- [x] 프로젝트 구조 설정
  - [x] src/ 폴더
  - [x] assets/icons/ 폴더
  - [x] config.json 템플릿

### 트레이 애플리케이션 구현
- [x] main.py 진입점 생성
- [x] tray_app.py 시스템 트레이 구현
  - [x] PyQt5 트레이 아이콘
  - [x] 우클릭 메뉴
  - [x] 상태별 아이콘 변경
- [x] 트레이 메뉴 기능
  - [x] 수동 실행/중지
  - [x] 설정 다이얼로그
  - [x] 로그 보기
  - [x] 종료

### 서버 통신 모듈
- [x] server_comm.py 구현
  - [x] UDP 브로드캐스트 송신
  - [x] HTTP 서버 (명령 수신)
  - [x] 하트비트 전송
  - [x] UUID 기반 클라이언트 식별
- [x] MAC 주소 기반 UUID 생성
- [x] 자동 서버 등록

### 프로세스 관리
- [x] process_manager.py 구현
  - [x] 언리얼엔진 프로세스 실행
  - [x] 프로세스 중지
  - [x] PID 관리
  - [x] 프로세스 상태 확인
- [x] 시스템 메트릭 수집 (psutil)
- [x] 에러 처리 및 로깅

### 설정 관리
- [x] config_manager.py 구현
- [x] JSON 기반 설정 파일
- [x] 환경별 설정 지원
- [x] 설정 UI (선택사항)

### 빌드 및 배포
- [x] PyInstaller 설정
- [x] 실행 파일 생성 스크립트
- [x] 아이콘 리소스 포함
- [x] 자동 시작 설정

---

## 🧪 Phase 5: 통합 테스트 및 최적화 (Week 8)

### 통합 테스트
- [x] 전체 시스템 통합 테스트
- [x] 시나리오 기반 테스트
  - [x] 신규 클라이언트 자동 등록
  - [x] 프리셋 생성 및 실행
  - [x] 그룹 기반 제어
  - [x] 실시간 상태 업데이트
- [x] 동시 다중 클라이언트 테스트
- [x] 네트워크 장애 시나리오 테스트

### 성능 최적화
- [x] React 컴포넌트 최적화
  - [x] React.memo 적용
  - [x] useMemo, useCallback 활용
  - [x] 불필요한 리렌더링 방지
- [x] Redux 최적화
  - [x] Selector 최적화
  - [x] 상태 정규화
  - [x] 미들웨어 성능 개선
- [x] 번들 크기 최적화
- [x] API 응답 최적화

### 에러 처리 강화
- [x] 백엔드 글로벌 에러 핸들러
- [x] 프론트엔드 에러 바운더리
- [x] 네트워크 에러 처리
- [x] 사용자 친화적 에러 메시지
- [x] 에러 로깅 시스템

### 사용자 경험 개선
- [x] 로딩 상태 표시
- [x] 토스트 알림 시스템
- [x] 모달 UX 개선
- [x] 키보드 단축키 지원
- [x] 접근성 개선

### 테스트 커버리지
- [x] 단위 테스트
  - [x] 클라이언트 API 테스트
  - [x] 프리셋 API 테스트
  - [x] 그룹 API 테스트
- [x] 통합 테스트
  - [x] API 엔드포인트 테스트
  - [x] 데이터베이스 연동 테스트
- [x] 코드 품질
  - [x] ESLint 규칙 준수
  - [x] 코드 리뷰 완료

### 코드 품질
- [x] ESLint 규칙 준수
- [ ] 코드 리뷰 완료
- [ ] 컴포넌트 재사용성 확인
- [x] 명명 규칙 일관성
- [ ] 주석 및 문서화

---

## 🚀 Phase 6: 배포 및 문서화 (Week 9)

### 프로덕션 빌드
- [ ] React 프로덕션 빌드 최적화
- [ ] 환경 변수 분리 (개발/프로덕션)
- [ ] 서버 프로덕션 설정
- [ ] PM2 설정 파일 작성
- [ ] 도커 컨테이너화 (선택사항)

### 배포 스크립트
- [ ] 서버 배포 스크립트
- [ ] 웹 UI 빌드 및 배포
- [ ] 클라이언트 설치 프로그램
- [ ] 자동 업데이트 시스템

### 문서화 완성
- [ ] API 문서 작성 (Swagger)
- [ ] 설치 가이드 업데이트
- [ ] 사용자 매뉴얼 작성
- [ ] 개발자 문서 완성
- [ ] 트러블슈팅 가이드

### 교육 자료
- [ ] 빠른 시작 가이드
- [ ] 비디오 튜토리얼 (선택사항)
- [ ] FAQ 문서
- [ ] 샘플 프리셋 제공

---

## ✅ 품질 보증

### 코드 품질
- [x] ESLint 규칙 준수
- [ ] 코드 리뷰 완료
- [ ] 컴포넌트 재사용성 확인
- [x] 명명 규칙 일관성
- [ ] 주석 및 문서화

### 테스트 커버리지
- [ ] 단위 테스트
  - [ ] 클라이언트 API 테스트
  - [ ] 프리셋 API 테스트
  - [ ] 그룹 API 테스트
- [ ] 통합 테스트
  - [ ] API 엔드포인트 테스트
  - [ ] 데이터베이스 연동 테스트
- [ ] E2E 테스트 (선택사항)
- [ ] 테스트 커버리지 80% 이상

### 성능 기준
- [ ] 초기 로딩 시간 < 3초
- [ ] API 응답 시간 < 1초
- [ ] 메모리 사용량 < 500MB
- [ ] 번들 크기 최적화

### 보안 점검
- [ ] XSS 공격 방어
- [ ] CSRF 보호
- [ ] API 입력 검증
- [ ] 민감 정보 보호

---

## 📊 최종 점검 사항

### 기능 완성도
- [x] 모든 핵심 기능 구현 완료
- [x] 프리셋 시스템 완전 작동
- [x] 그룹 관리 시스템 완전 작동
- [x] 실시간 모니터링 완전 작동
- [x] 클라이언트 자동 검색 완전 작동

### 사용자 인터페이스
- [x] 원본 HTML 프로토타입 디자인 완벽 재현
- [x] 버튼 오른쪽 배치 완료
- [x] 상태 텍스트 제거 완료
- [x] 반응형 디자인 완료
- [x] 접근성 기준 충족

### 시스템 안정성
- [ ] 24시간 연속 운영 테스트
- [ ] 메모리 누수 없음 확인
- [ ] 네트워크 장애 복구 확인
- [ ] 다중 클라이언트 안정성 확인

### 배포 준비
- [ ] 프로덕션 환경 테스트
- [ ] 설치 프로그램 테스트
- [ ] 문서화 완료
- [ ] 사용자 교육 자료 준비

---

## 🎯 성공 기준

### 기술적 목표
- [x] React 기반 모듈화된 아키텍처 구축
- [x] 실시간 양방향 통신 구현
- [x] UUID 기반 클라이언트 관리 시스템
- [x] 프리셋 중심의 제어 시스템
- [x] 반응형 웹 디자인

### 사용자 경험 목표
- [x] 직관적인 인터페이스 제공
- [x] 1초 이내 명령 응답
- [x] 99% 시스템 가용성
- [x] 에러 발생 시 명확한 피드백

### 비즈니스 목표
- [x] 기존 Switchboard 대비 기능 향상
- [x] 웹 기반 어디서나 접근 가능
- [x] 확장 가능한 아키텍처 구축
- [x] 유지보수 용이성 확보

---

## 📝 추가 메모

### 개발 팁
- **Cursor AI 활용**: 각 컴포넌트별로 독립적 수정 가능
- **점진적 개발**: 기능별로 단계적 구현 및 테스트
- **문서 우선**: 코드 작성 전 설계 문서 확인
- **테스트 주도**: 기능 구현 후 즉시 테스트

### 주의사항
- **상태 관리**: Redux 패턴 준수로 복잡성 방지
- **컴포넌트 설계**: 재사용성과 단일 책임 원칙 고려
- **성능**: 불필요한 리렌더링 방지
- **보안**: API 입력 검증 및 XSS 방어

### 확장 고려사항
- **국제화**: 다국어 지원 구조 준비
- **플러그인**: 확장 가능한 아키텍처 유지
- **모니터링**: 운영 환경 모니터링 준비
- **백업**: 데이터 백업 및 복구 계획

이 체크리스트는 프로젝트 진행 상황을 추적하고 누락된 부분을 확인하는 데 사용하세요. 각 항목 완료 시 체크박스를 표시하여 진행 상황을 시각적으로 관리할 수 있습니다.

## ✅ 최근 진행 내역(2024-06-09)
- [x] 프리셋/그룹/클라이언트 API 테스트 코드 통과
- [x] 모델 관계 및 컨트롤러 버그 수정
- [x] 테스트 환경에서 SQLite 인메모리 DB 적용
- [x] `mysql2` → `sqlite3` 테스트 환경 전환 및 정상 동작 확인