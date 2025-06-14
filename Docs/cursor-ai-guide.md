# Cursor AI 활용 가이드 - Switchboard Plus

## 📋 개요

이 가이드는 Switchboard Plus 프로젝트를 Cursor AI를 활용하여 효율적으로 개발하는 방법을 설명합니다.

---

## 📁 프로젝트 구조 설정

### 1. 권장 폴더 구조
```
switchboard-plus/
├── docs/                        # 📚 모든 문서
│   ├── development-plan.md      # 개발 계획서
│   ├── dev-checklist.md         # 개발 체크리스트  
│   ├── dev-environment.md       # 개발 환경 가이드
│   ├── web-ui-integration.md    # 웹 UI 구성 가이드
│   ├── tray-client-guide.md     # 트레이 클라이언트 가이드
│   ├── cursor-ai-guide.md       # Cursor AI 활용 가이드 (이 문서)
│   ├── architecture/
│   │   ├── system-diagram.md    # 시스템 다이어그램
│   │   └── sequence-diagram.md  # 시퀀스 다이어그램
│   └── samples/
│       └── web-ui-sample.html   # 웹 UI HTML 샘플
│
├── sb-server/                   # 백엔드 서버
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── sb-client/                   # Python 트레이 클라이언트
│   ├── src/
│   │   ├── main.py
│   │   ├── tray_app.py
│   │   ├── server_comm.py
│   │   ├── process_manager.py
│   │   └── config_manager.py
│   ├── assets/
│   ├── requirements.txt
│   └── README.md
│
├── sb-web/                      # React 웹 UI
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md                    # 프로젝트 메인 README
```

### 2. 프로젝트 초기화
```bash
# 프로젝트 생성
mkdir switchboard-plus
cd switchboard-plus

# Git 초기화
git init

# 문서 폴더 생성
mkdir -p docs/architecture docs/samples

# 각 프로젝트 폴더 생성
mkdir sb-server sb-client sb-web
```

---

## 🚀 Cursor AI 시작하기

### 1. 프로젝트 열기
1. Cursor AI 실행
2. `File > Open Folder` 선택
3. `switchboard-plus` 폴더 선택

### 2. 문서 컨텍스트 설정
1. `docs` 폴더의 모든 `.md` 파일을 열기
2. Cursor AI가 프로젝트 구조를 이해하도록 함
3. 특히 다음 파일들은 항상 참조:
   - `development-plan.md`
   - `dev-checklist.md`
   - `web-ui-sample.html`

---

## 💡 효과적인 프롬프트 작성법

### 1. 문서 참조 방식
```
@docs/development-plan.md 를 참고해서 구현해줘
```

### 2. 단계별 개발 프롬프트 예시

#### Phase 1: 서버 개발

**프로젝트 초기화:**
```
@docs/dev-checklist.md 의 "Week 1-2: 서버 개발" 섹션을 보고
sb-server 폴더에 Express 서버를 초기화해줘.
package.json과 기본 폴더 구조를 만들어줘.
```

**데이터베이스 모델링:**
```
@docs/development-plan.md 의 "3.3 데이터베이스 스키마"를 참고해서
Sequelize 모델을 만들어줘. 
clients, presets, preset_commands, groups, group_members 테이블을 포함해줘.
```

**API 구현:**
```
@docs/development-plan.md 의 "5.1 RESTful API" 섹션을 보고
클라이언트 관리 API를 구현해줘.
GET, POST, PUT, DELETE 모든 엔드포인트를 포함해줘.
```

**WebSocket 구현:**
```
Socket.io를 사용해서 실시간 통신을 구현해줘.
@docs/development-plan.md 의 "5.2 WebSocket 이벤트"를 참고해서
모든 이벤트 핸들러를 만들어줘.
```

#### Phase 2: 웹 UI 개발

**React 프로젝트 설정:**
```
sb-web 폴더에 Vite + React 프로젝트를 생성하고
@docs/dev-checklist.md 의 "React 프로젝트 설정" 부분에 있는
모든 패키지를 설치해줘.
```

**UI 컴포넌트 변환:**
```
@docs/samples/web-ui-sample.html 파일을 React 컴포넌트로 변환해줘.
Material-UI를 사용하고, 각 섹션을 별도 컴포넌트로 분리해줘.
```

**Redux 상태 관리:**
```
Redux Toolkit을 사용해서 상태 관리를 구현해줘.
clients, presets, groups를 위한 slice를 만들고
@docs/samples/web-ui-sample.html 의 JavaScript 로직을 
Redux actions로 변환해줘.
```

#### Phase 3: 클라이언트 개발

**Python 트레이 프로그램 구조:**
```
@docs/tray-client-guide.md 의 "Part 2: 핵심 구현"을 참고해서
PyQt5 기반 시스템 트레이 애플리케이션을 구현해줘.
트레이 메뉴와 아이콘 상태 변경 기능을 포함해줘.
```

**서버 통신 구현:**
```
@docs/tray-client-guide.md 의 "서버 통신 모듈"을 보고
UDP 브로드캐스트와 HTTP 서버를 구현해줘.
자동 등록과 하트비트 기능도 포함해줘.
```

**프로세스 관리:**
```
@docs/tray-client-guide.md 의 "프로세스 관리자"를 참고해서
언리얼엔진 프로세스를 실행하고 관리하는 모듈을 만들어줘.
psutil을 사용한 메트릭 수집도 포함해줘.
```

---

## 🔧 개발 팁

### 1. 체크리스트 활용
- 체크리스트를 순서대로 따라가며 개발
- 각 항목 완료 후 다음 단계로 진행
- 막히는 부분은 관련 문서 참조

### 2. 반복적인 테스트
```
각 기능 구현 후 즉시 테스트하는 코드도 같이 만들어줘.
예: API 엔드포인트 구현 후 Postman 컬렉션도 생성해줘.
```

### 3. 문서 업데이트
```
구현하면서 발견한 추가 정보나 변경사항을
관련 문서에 업데이트하는 내용도 알려줘.
```

---

## 📝 자주 사용하는 프롬프트 템플릿

### 기능 구현
```
@docs/development-plan.md 와 @docs/dev-checklist.md 를 참고해서
[기능명]을 구현해줘. 
에러 처리와 로깅도 포함하고, 
관련 테스트 코드도 만들어줘.
```

### 버그 수정
```
[에러 내용]이 발생했어.
@docs/development-plan.md 의 문제 해결 가이드를 참고해서
원인을 분석하고 수정 방법을 제안해줘.
```

### 코드 리팩토링
```
현재 코드를 @docs/development-plan.md 의 
"4. 기술 스택" 섹션에 있는 베스트 프랙티스에 맞춰
리팩토링해줘.
```

### UI 개선
```
@docs/samples/web-ui-sample.html 의 디자인을 유지하면서
[특정 기능]을 추가해줘. 
반응형 디자인도 고려해줘.
```

---

## 🎯 프로젝트 완성도 체크

### Phase별 완료 기준

#### Phase 1 (서버) 완료:
- [ ] 모든 API 엔드포인트 작동
- [ ] WebSocket 실시간 통신 확인
- [ ] 자동 검색 기능 테스트
- [ ] 데이터베이스 CRUD 정상 작동

#### Phase 2 (웹 UI) 완료:
- [ ] 모든 UI 컴포넌트 구현
- [ ] Redux 상태 관리 연동
- [ ] 실시간 업데이트 확인
- [ ] 반응형 디자인 테스트

#### Phase 3 (클라이언트) 완료:
- [ ] 트레이 아이콘 정상 작동
- [ ] 명령어 실행 성공
- [ ] 서버와 통신 확인
- [ ] 리소스 모니터링 작동

---

## 🆘 도움말

### Cursor AI 단축키
- `Ctrl+K`: AI 명령 입력
- `Ctrl+L`: 채팅 창 열기
- `Ctrl+Shift+L`: 컨텍스트 추가

### 유용한 설정
1. `.cursorignore` 파일 생성:
```
node_modules/
*.pyc
__pycache__/
dist/
build/
*.log
```

2. 프로젝트별 컨텍스트 설정:
- 서버 작업 시: `@sb-server` 폴더 집중
- UI 작업 시: `@sb-web` 폴더 집중
- 문서는 항상 참조 가능하도록 유지

---

## 📚 추가 리소스

### 관련 문서
- [개발 계획서](development-plan.md) - 전체 프로젝트 구조
- [개발 체크리스트](dev-checklist.md) - 단계별 작업 목록
- [개발 환경 가이드](dev-environment.md) - 도구 설치 및 설정
- [웹 UI 구성 가이드](web-ui-integration.md) - React 개발 가이드
- [트레이 클라이언트 가이드](tray-client-guide.md) - Python 클라이언트 개발
- [웹 UI 샘플](samples/web-ui-sample.html) - UI 레퍼런스

### 외부 참고 자료
- [Cursor AI 공식 문서](https://cursor.sh/docs)
- [Express.js 문서](https://expressjs.com/)
- [React 문서](https://react.dev/)
- [Socket.io 문서](https://socket.io/docs/)

---

## ✅ 시작 체크리스트

- [ ] 프로젝트 폴더 구조 생성
- [ ] 모든 문서 파일 저장
- [ ] Cursor AI에서 프로젝트 열기
- [ ] 개발 환경 설정 완료
- [ ] 첫 번째 프롬프트 실행

준비가 완료되면 개발을 시작하세요! 🚀