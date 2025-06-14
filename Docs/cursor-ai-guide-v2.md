# Cursor AI 활용 가이드 v2.0 - Switchboard Plus React 개발

## 📋 개요

이 가이드는 React 기반으로 완전히 재구축된 Switchboard Plus 프로젝트를 Cursor AI를 활용하여 효율적으로 개발하는 방법을 설명합니다.

---

## 📁 업데이트된 프로젝트 구조

### 1. 전체 프로젝트 구조
```
switchboard-plus/
├── docs/                          # 📚 프로젝트 문서
│   ├── development-plan.md        # 개발 계획서 (업데이트됨)
│   ├── dev-checklist.md           # 개발 체크리스트 (업데이트됨)
│   ├── cursor-ai-guide.md         # Cursor AI 가이드 (이 문서)
│   └── samples/
│       └── ui-prototype.html      # UI 프로토타입 (참고용)
│
├── sb-server/                     # 백엔드 서버
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── sb-web/                        # React 웹 애플리케이션 ⭐ 주요 작업 영역
│   ├── src/
│   │   ├── components/            # React 컴포넌트
│   │   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── dashboard/         # 대시보드
│   │   │   ├── presets/           # 프리셋 관리
│   │   │   ├── groups/            # 그룹 관리
│   │   │   └── clients/           # 클라이언트 모니터링
│   │   ├── store/                 # Redux 상태 관리
│   │   │   ├── slices/
│   │   │   └── middleware/
│   │   ├── services/              # API 서비스
│   │   ├── hooks/                 # 커스텀 훅
│   │   └── utils/                 # 유틸리티
│   ├── package.json
│   └── vite.config.js
│
└── sb-client/                     # Python 트레이 클라이언트
    ├── src/
    └── requirements.txt
```

### 2. React 애플리케이션 중점 구조
```
sb-web/src/
├── components/                    # 🎯 주요 개발 영역
│   ├── common/
│   │   ├── Header.jsx            # 헤더 컴포넌트
│   │   └── Toast.jsx             # 알림 시스템
│   ├── dashboard/
│   │   ├── Dashboard.jsx         # 메인 대시보드
│   │   └── StatsBar.jsx          # 통계 바
│   ├── presets/
│   │   ├── PresetSection.jsx     # 프리셋 섹션
│   │   ├── PresetList.jsx        # 프리셋 목록
│   │   ├── PresetCard.jsx        # 프리셋 카드
│   │   └── PresetModal.jsx       # 프리셋 모달
│   ├── groups/
│   │   ├── GroupSection.jsx      # 그룹 섹션
│   │   ├── GroupList.jsx         # 그룹 목록
│   │   ├── GroupCard.jsx         # 그룹 카드
│   │   └── GroupModal.jsx        # 그룹 모달
│   └── clients/
│       ├── ClientMonitor.jsx     # 클라이언트 모니터
│       └── ClientCard.jsx        # 클라이언트 카드
│
├── store/                         # 상태 관리
└── services/                      # API 통신
```

---

## 🚀 Cursor AI 시작하기

### 1. 프로젝트 열기
1. Cursor AI 실행
2. `File > Open Folder` 선택
3. `switchboard-plus` 루트 폴더 선택

### 2. 작업 영역 설정
- **주요 작업**: `sb-web/src/` 폴더에 집중
- **참고 문서**: `docs/` 폴더의 모든 문서
- **백엔드 참조**: 필요시 `sb-server/` 폴더 참조

### 3. 컨텍스트 파일 설정
```
# 항상 참조할 파일들
@docs/development-plan.md
@docs/dev-checklist.md
@sb-web/src/App.jsx
@sb-web/package.json
```

---

## 💡 React 개발을 위한 효과적인 프롬프트

### 1. 컴포넌트 개발 프롬프트

#### 새 컴포넌트 생성
```
@docs/development-plan.md 와 @docs/dev-checklist.md 를 참고해서
src/components/presets/PresetCard.jsx 컴포넌트를 구현해줘.

요구사항:
- Material-UI 사용
- Redux useSelector로 상태 읽기
- 버튼을 카드 오른쪽에 세로로 배치
- 프리셋 실행/중지 기능 포함
- PropTypes 포함
```

#### 컴포넌트 수정
```
@sb-web/src/components/presets/PresetCard.jsx 파일을 수정해줘.
버튼들을 카드 하단에서 오른쪽으로 이동시키고,
세로로 배치하도록 스타일을 변경해줘.
Material-UI의 flexbox 시스템을 사용해줘.
```

### 2. Redux 상태 관리 프롬프트

#### 새 슬라이스 생성
```
@docs/development-plan.md 의 상태 관리 구조를 참고해서
src/store/slices/presetsSlice.js 를 구현해줘.

포함할 기능:
- createAsyncThunk로 비동기 액션
- fetchPresets, createPreset, executePreset 액션
- 프리셋 상태 관리 (active/inactive)
- 에러 처리 포함
```

#### 기존 슬라이스 수정
```
@src/store/slices/presetsSlice.js 파일에 
updatePresetStatus 리듀서를 추가해줘.
활성 프리셋 변경 시 다른 프리셋들을 자동으로 비활성화하는 로직 포함해줘.
```

### 3. API 서비스 프롬프트

#### API 서비스 생성
```
@docs/development-plan.md 의 API 명세를 참고해서
src/services/presetAPI.js 를 구현해줘.

포함할 엔드포인트:
- getPresets()
- createPreset(data)
- executePreset(id)
- stopPreset(id)

@src/services/api.js 의 기본 axios 인스턴스를 사용해줘.
```

### 4. 통합 개발 프롬프트

#### 전체 기능 구현
```
@docs/dev-checklist.md 의 "프리셋 컴포넌트 구현" 섹션을 참고해서
프리셋 관련 모든 컴포넌트와 상태 관리를 구현해줘.

구현할 파일들:
- src/components/presets/PresetSection.jsx
- src/components/presets/PresetList.jsx  
- src/components/presets/PresetCard.jsx
- src/components/presets/PresetModal.jsx
- src/store/slices/presetsSlice.js
- src/services/presetAPI.js

Material-UI와 Redux 패턴을 준수해줘.
```

---

## 🔧 컴포넌트별 개발 가이드

### 1. 프리셋 시스템 개발

#### 프리셋 카드 컴포넌트
```
프리셋 카드 컴포넌트를 구현해줘:

디자인 요구사항:
- Material-UI Paper 컴포넌트 사용
- 카드 내용은 왼쪽, 버튼은 오른쪽 배치
- 실행/중지, 편집 버튼을 세로로 배치
- 활성 프리셋은 파란색 테두리
- 호버 효과 포함

기능 요구사항:
- useSelector로 프리셋 상태 읽기
- useDispatch로 액션 디스패치
- 클라이언트 이름 목록 표시
- 명령어 개수 표시
```

#### 프리셋 모달 컴포넌트
```
프리셋 생성 모달을 구현해줘:

구조:
1. 기본 정보 (이름, 설명)
2. 그룹 선택 (체크박스)
3. 클라이언트별 명령어 설정

Material-UI Dialog 사용하고,
선택된 그룹에 따라 동적으로 클라이언트 목록 생성해줘.
각 클라이언트마다 명령어 입력 텍스트 영역 제공해줘.
```

### 2. 그룹 시스템 개발

#### 그룹 카드 컴포넌트
```
그룹 카드 컴포넌트를 구현해줘:

요구사항:
- 그룹 이름과 설명 표시
- 소속 클라이언트들을 칩으로 표시
- 클라이언트 상태별 색상 (running: 파랑, online: 초록, offline: 빨강)
- 편집 버튼만 오른쪽에 배치 (실행/중지 버튼 없음)
- 그룹 색상 시스템 적용
```

### 3. 클라이언트 모니터링 개발

#### 클라이언트 카드 컴포넌트
```
클라이언트 모니터링 카드를 구현해줘:

요구사항:
- 아이콘만으로 상태 표시 (🟢🟡🔴)
- 상태 텍스트 제거 (아이콘 + 이름 + IP만)
- 실행 중일 때 펄스 애니메이션
- 상태별 배경색 변경
- 그리드 레이아웃으로 반응형 배치
```

---

## 🛠️ 개발 패턴 및 모범 사례

### 1. React 컴포넌트 패턴

#### 기본 컴포넌트 구조
```javascript
// 표준 컴포넌트 구조 예시
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Paper, Typography, Button } from '@mui/material'
import { someAction } from '../../store/slices/someSlice'

const ComponentName = ({ prop1, prop2 }) => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.someSlice.data)

  const handleAction = () => {
    dispatch(someAction(prop1))
  }

  return (
    <Paper sx={{ p: 2 }}>
      {/* 컴포넌트 내용 */}
    </Paper>
  )
}

export default ComponentName
```

### 2. Redux 패턴

#### 슬라이스 생성 패턴
```javascript
// 표준 슬라이스 구조
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import someAPI from '../../services/someAPI'

export const fetchData = createAsyncThunk(
  'slice/fetchData',
  async () => {
    const response = await someAPI.getData()
    return response
  }
)

const someSlice = createSlice({
  name: 'some',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateItem: (state, action) => {
      // 상태 업데이트 로직
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.items = action.payload
      })
  },
})

export const { updateItem } = someSlice.actions
export default someSlice.reducer
```

### 3. API 서비스 패턴

#### API 서비스 구조
```javascript
// 표준 API 서비스 구조
import api from './api'

const resourceAPI = {
  getAll: () => api.get('/resource'),
  getById: (id) => api.get(`/resource/${id}`),
  create: (data) => api.post('/resource', data),
  update: (id, data) => api.put(`/resource/${id}`, data),
  delete: (id) => api.delete(`/resource/${id}`),
}

export default resourceAPI
```

---

## 🐛 디버깅 및 문제 해결

### 1. 일반적인 문제

#### Redux 상태 업데이트 안됨
```
문제: 컴포넌트가 Redux 상태 변경에 반응하지 않음

해결 프롬프트:
@src/store/slices/someSlice.js 와 @src/components/SomeComponent.jsx 파일을 확인해줘.
useSelector가 올바른 상태를 참조하고 있는지, 
리듀서에서 상태를 immutable하게 업데이트하고 있는지 검사해줘.
```

#### Material-UI 스타일링 문제
```
문제: sx prop 스타일링이 적용되지 않음

해결 프롬프트:
@src/components/SomeComponent.jsx 의 Material-UI 스타일링을 수정해줘.
sx prop을 사용해서 flexbox 레이아웃을 올바르게 적용하고,
테마 색상을 사용하도록 변경해줘.
```

#### Socket.io 연결 문제
```
문제: 실시간 업데이트가 작동하지 않음

해결 프롬프트:
@src/store/middleware/socketMiddleware.js 와 @src/services/socket.js 를 확인해줘.
Socket 연결 상태와 이벤트 리스너 등록이 올바른지 검사하고,
Redux 액션 디스패치가 정상적으로 이루어지는지 확인해줘.
```

### 2. 성능 최적화

#### 불필요한 리렌더링 방지
```
@src/components/SomeComponent.jsx 에서 불필요한 리렌더링이 발생해.
React.memo를 사용해서 최적화하고,
useCallback과 useMemo를 적절히 활용해줘.
props 비교 함수도 필요하면 추가해줘.
```

#### 번들 크기 최적화
```
@sb-web/src 폴더의 import 구문들을 확인해서
tree shaking이 제대로 이루어지도록 최적화해줘.
Material-UI 컴포넌트는 named import를 사용하고,
lodash 같은 라이브러리는 개별 함수만 import하도록 수정해줘.
```

---

## 📱 반응형 디자인 개발

### 1. Material-UI 브레이크포인트 활용
```
@src/components/dashboard/Dashboard.jsx 를 반응형으로 만들어줘:

브레이크포인트:
- xs (< 600px): 모바일
- sm (600px - 960px): 태블릿
- md (960px - 1280px): 작은 데스크톱
- lg (1280px+): 큰 데스크톱

Grid 시스템 사용해서 각 화면 크기에 맞게 레이아웃 조정해줘.
```

### 2. 모바일 우선 디자인
```
모바일 화면에서 사용하기 편하도록 컴포넌트를 수정해줘:

요구사항:
- 버튼 크기를 터치 친화적으로 최소 44px
- 카드 간격 줄이기
- 불필요한 텍스트 숨기기
- 스와이프 제스처 지원 고려
```

---

## 🧪 테스트 주도 개발

### 1. 컴포넌트 테스트
```
@src/components/presets/PresetCard.jsx 에 대한 단위 테스트를 작성해줢:

테스트 케이스:
- 프리셋 정보가 올바르게 표시되는지
- 실행/중지 버튼 클릭 시 올바른 액션이 디스패치되는지
- 활성 프리셋일 때 스타일이 변경되는지
- 에러 상태일 때 적절한 메시지가 표시되는지

React Testing Library 사용해줘.
```

### 2. Redux 테스트
```
@src/store/slices/presetsSlice.js 에 대한 테스트를 작성해줘:

테스트 케이스:
- 초기 상태가 올바른지
- fetchPresets 액션이 올바르게 작동하는지
- updatePresetStatus 리듀서가 상태를 올바르게 업데이트하는지
- 에러 처리가 적절히 이루어지는지

Redux Toolkit의 테스트 패턴 사용해줘.
```

---

## 🚀 배포 최적화

### 1. 빌드 최적화
```
@sb-web/vite.config.js 를 프로덕션 빌드에 최적화해줘:

최적화 항목:
- 코드 스플리팅 설정
- 청크 크기 최적화
- 압축 설정
- 소스맵 설정 (프로덕션에서는 제외)
- 환경별 설정 분리
```

### 2. 환경 변수 관리
```
개발/스테이징/프로덕션 환경별 설정을 관리할 수 있도록
환경 변수 시스템을 구축해줘:

파일 구조:
- .env.development
- .env.staging  
- .env.production

API URL, Socket URL 등을 환경별로 분리해줘.
```

---

## 📚 추가 개발 팁

### 1. 코드 품질 관리
```
프로젝트 전체의 코드 품질을 향상시키는 설정을 추가해줘:

설저항목:
- ESLint 규칙 강화
- Prettier 설정 통일
- 커밋 훅으로 린팅 자동화
- VS Code 설정 통일
```

### 2. 개발 생산성 향상
```
개발 효율성을 높이는 도구들을 설정해줘:

도구 목록:
- React DevTools 설정 가이드
- Redux DevTools 활용법
- Hot Reload 최적화
- 자동 import 정리
```

---

## 📝 실제 개발 시나리오

### 시나리오 1: 새로운 기능 추가
```
스케줄링 기능을 추가해야 해:

1단계: Redux 슬라이스 생성
@docs/development-plan.md 를 참고해서 
src/store/slices/schedulesSlice.js 를 만들어줘.

2단계: API 서비스 생성
src/services/scheduleAPI.js 를 구현해줘.

3단계: 컴포넌트 생성
src/components/schedules/ 폴더에 필요한 컴포넌트들을 만들어줘.

4단계: 라우팅 추가
메인 네비게이션에 스케줄링 메뉴를 추가해줘.
```

### 시나리오 2: 기존 기능 수정
```
프리셋 카드에 실행 시간 표시 기능을 추가해야 해:

1단계: 데이터 모델 확장
프리셋 슬라이스에 executionTime 필드를 추가해줘.

2단계: UI 업데이트
@src/components/presets/PresetCard.jsx 에 
실행 시간을 표시하는 영역을 추가해줘.

3단계: 실시간 업데이트
Socket 미들웨어에서 실행 시간 업데이트 이벤트를 처리하도록 수정해줘.
```

### 시나리오 3: 버그 수정
```
프리셋 모달에서 그룹 선택 후 클라이언트 목록이 업데이트 안 되는 문제:

@src/components/presets/PresetModal.jsx 파일을 확인해서
useEffect 의존성 배열과 상태 업데이트 로직을 검사해줘.
선택된 그룹이 변경될 때 클라이언트 목록이 올바르게 필터링되도록 수정해줘.
```

---

## ✨ 고급 활용 팁

### 1. 커스텀 훅 활용
```
반복되는 로직을 커스텀 훅으로 추출해줘:

src/hooks/usePresetActions.js - 프리셋 관련 액션들을 묶은 훅
src/hooks/useClientStatus.js - 클라이언트 상태 관리 훅
src/hooks/useSocket.js - Socket 연결 관리 훅

각 훅에서 관련된 Redux 액션과 상태를 캡슐화해줘.
```

### 2. 컴포넌트 조합 패턴
```
복잡한 컴포넌트를 작은 단위로 분리해서 조합 가능하게 만들어줘:

예시: PresetCard
- PresetCard.jsx (메인 컨테이너)
- PresetCard.Header.jsx (헤더 부분)
- PresetCard.Content.jsx (내용 부분)
- PresetCard.Actions.jsx (액션 버튼들)

각 부분을 독립적으로 테스트하고 재사용할 수 있게 구성해줘.
```

### 3. 상태 정규화
```
복잡한 관계형 데이터를 Redux에서 효율적으로 관리하도록 정규화해줘:

현재: 프리셋에 클라이언트 정보가 중복 저장됨
개선: entities 패턴 사용해서 클라이언트는 별도 관리, 프리셋에서는 ID만 참조

@reduxjs/toolkit의 createEntityAdapter 사용해줘.
```

이 가이드를 활용하여 Cursor AI와 함께 효율적으로 Switchboard Plus를 개발하세요! 🚀