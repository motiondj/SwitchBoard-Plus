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

### 1. 일반적인 문