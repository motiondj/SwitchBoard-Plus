# 웹 UI 구성 및 연결 가이드 - Switchboard Plus

## 📋 개요

이 가이드는 Switchboard Plus의 웹 UI를 React로 구성하고 백엔드 서버와 연결하는 상세한 과정을 설명합니다.

---

## 🏗️ Part 1: React 프로젝트 구성

### 1.1 프로젝트 생성 및 초기 설정

```bash
# sb-web 폴더로 이동
cd sb-web

# Vite를 사용한 React 프로젝트 생성
npm create vite@latest . -- --template react

# 의존성 설치
npm install

# 추가 패키지 설치 (한 번에)
npm install react-router-dom @reduxjs/toolkit react-redux socket.io-client axios @mui/material @emotion/react @emotion/styled
```

### 1.2 프로젝트 구조 설정

```
sb-web/
├── src/
│   ├── components/          # UI 컴포넌트
│   │   ├── common/         # 공통 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   └── Toast.jsx
│   │   ├── dashboard/      # 대시보드 컴포넌트
│   │   │   ├── StatsBar.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── presets/        # 프리셋 관련
│   │   │   ├── PresetCard.jsx
│   │   │   ├── PresetList.jsx
│   │   │   └── PresetModal.jsx
│   │   ├── groups/         # 그룹 관련
│   │   │   ├── GroupCard.jsx
│   │   │   └── GroupList.jsx
│   │   └── clients/        # 클라이언트 모니터링
│   │       ├── ClientCard.jsx
│   │       └── ClientGrid.jsx
│   │
│   ├── store/              # Redux 스토어
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── clientsSlice.js
│   │   │   ├── presetsSlice.js
│   │   │   └── groupsSlice.js
│   │   └── middleware/
│   │       └── socketMiddleware.js
│   │
│   ├── services/           # API 및 Socket 서비스
│   │   ├── api.js          # Axios 설정
│   │   ├── clientAPI.js
│   │   ├── presetAPI.js
│   │   └── socket.js       # Socket.io 연결
│   │
│   ├── hooks/              # 커스텀 훅
│   │   ├── useSocket.js
│   │   └── useToast.js
│   │
│   ├── utils/              # 유틸리티 함수
│   │   └── constants.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
```

### 1.3 폴더 생성 스크립트

```bash
# src 내부 폴더 구조 생성
cd src
mkdir -p components/{common,dashboard,presets,groups,clients}
mkdir -p store/slices store/middleware
mkdir -p services hooks utils
```

---

## 🔌 Part 2: 서버 연결 설정

### 2.1 환경 변수 설정

**.env** (sb-web 루트):
```env
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=ws://localhost:8000
VITE_MIN_WIDTH=1920
VITE_MIN_HEIGHT=1080
```

### 2.2 Axios 설정

**src/services/api.js**:
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 추가 (선택사항)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('API Error:', error.response.data);
      
      // 전역 에러 처리
      if (error.response.status === 401) {
        // 인증 에러 처리
        window.location.href = '/login';
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 2.3 Socket.io 연결 설정

**src/services/socket.js**:
```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    
    this.socket.on(event, callback);
    
    // 리스너 추적 (정리를 위해)
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    
    this.socket.off(event, callback);
    
    // 리스너 목록에서 제거
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot emit:', event);
      return;
    }
    
    this.socket.emit(event, data);
  }

  // 모든 리스너 정리
  removeAllListeners() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket.off(event, callback);
      });
    });
    this.listeners.clear();
  }
}

export default new SocketService();
```

---

## 🏪 Part 3: Redux 스토어 구성

### 3.1 스토어 설정

**src/store/index.js**:
```javascript
import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import presetsReducer from './slices/presetsSlice';
import groupsReducer from './slices/groupsSlice';
import socketMiddleware from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    presets: presetsReducer,
    groups: groupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Socket 인스턴스는 직렬화 체크에서 제외
        ignoredActions: ['socket/connect', 'socket/disconnect'],
      },
    }).concat(socketMiddleware),
});
```

### 3.2 Socket 미들웨어

**src/store/middleware/socketMiddleware.js**:
```javascript
import socketService from '../../services/socket';
import { updateClientStatus, updateClientMetrics } from '../slices/clientsSlice';
import { updatePresetStatus } from '../slices/presetsSlice';

const socketMiddleware = (store) => {
  return (next) => (action) => {
    const { dispatch } = store;

    // Socket 연결 액션 처리
    if (action.type === 'socket/connect') {
      socketService.connect();

      // Socket 이벤트 리스너 등록
      socketService.on('client:status', (data) => {
        dispatch(updateClientStatus(data));
      });

      socketService.on('client:metrics', (data) => {
        dispatch(updateClientMetrics(data));
      });

      socketService.on('preset:status', (data) => {
        dispatch(updatePresetStatus(data));
      });

      socketService.on('execution:result', (data) => {
        // 실행 결과 처리
        console.log('Execution result:', data);
      });
    }

    // Socket 연결 해제 액션 처리
    if (action.type === 'socket/disconnect') {
      socketService.disconnect();
    }

    return next(action);
  };
};

export default socketMiddleware;
```

### 3.3 Clients Slice 예시

**src/store/slices/clientsSlice.js**:
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clientAPI from '../../services/clientAPI';

// 비동기 액션
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await clientAPI.getClients();
    return response;
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateClientStatus: (state, action) => {
      const { uuid, status } = action.payload;
      const client = state.items.find(c => c.uuid === uuid);
      if (client) {
        client.status = status;
        client.last_heartbeat = new Date().toISOString();
      }
    },
    updateClientMetrics: (state, action) => {
      const { uuid, metrics } = action.payload;
      const client = state.items.find(c => c.uuid === uuid);
      if (client) {
        client.metrics = metrics;
      }
    },
    upsertClient: (state, action) => {
      const clientData = action.payload;
      const existingIndex = state.items.findIndex(c => c.uuid === clientData.uuid);
      
      if (existingIndex >= 0) {
        // 기존 클라이언트 업데이트
        state.items[existingIndex] = { ...state.items[existingIndex], ...clientData };
      } else {
        // 새 클라이언트 추가
        state.items.push(clientData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateClientStatus, updateClientMetrics } = clientsSlice.actions;
export default clientsSlice.reducer;
```

---

## 🎨 Part 4: UI 컴포넌트 구성

### 4.1 메인 App 컴포넌트

**src/App.jsx**:
```javascript
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import { fetchClients } from './store/slices/clientsSlice';
import { fetchPresets } from './store/slices/presetsSlice';
import { fetchGroups } from './store/slices/groupsSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Socket 연결
    dispatch({ type: 'socket/connect' });

    // 초기 데이터 로드
    dispatch(fetchClients());
    dispatch(fetchPresets());
    dispatch(fetchGroups());

    // 클린업
    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="xl">
        <Dashboard />
      </Container>
    </ThemeProvider>
  );
}

export default App;
```

### 4.2 API 서비스 예시

**src/services/clientAPI.js**:
```javascript
import api from './api';

const clientAPI = {
  // 클라이언트 목록 조회
  getClients: () => api.get('/clients'),

  // 클라이언트 상세 조회
  getClient: (id) => api.get(`/clients/${id}`),

  // 클라이언트 등록
  registerClient: (data) => api.post('/clients', data),

  // 클라이언트 업데이트
  updateClient: (id, data) => api.put(`/clients/${id}`, data),

  // 클라이언트 삭제
  deleteClient: (id) => api.delete(`/clients/${id}`),

  // 클라이언트 상태 조회
  getClientStatus: (id) => api.get(`/status/${id}`),
};

export default clientAPI;
```

---

## 🔧 Part 5: 개발 및 디버깅

### 5.1 개발 서버 실행

```bash
# 터미널 1: 백엔드 서버
cd sb-server
npm run dev

# 터미널 2: 웹 UI
cd sb-web
npm run dev
```

### 5.2 CORS 설정 (서버측)

**sb-server/server.js**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
```

### 5.3 프록시 설정 (선택사항)

**sb-web/vite.config.js**:
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
};
```

---

## 🐛 Part 6: 일반적인 문제 해결

### 6.1 연결 문제

**CORS 에러:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/clients' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**해결:** 서버의 CORS 설정 확인

**Socket 연결 실패:**
```
WebSocket connection to 'ws://localhost:3000/socket.io/?EIO=4&transport=websocket' failed
```
**해결:** 
- 서버가 실행 중인지 확인
- 방화벽 설정 확인
- Socket.io 버전 호환성 확인

### 6.2 상태 관리 문제

**Redux DevTools 설치:**
```javascript
// store/index.js에 추가
export const store = configureStore({
  // ... 기존 설정
  devTools: process.env.NODE_ENV !== 'production',
});
```

**상태 업데이트 안됨:**
- Redux DevTools에서 액션 발생 확인
- 리듀서에서 상태 직접 수정하지 않고 새 객체 반환하는지 확인

### 6.3 성능 최적화

**React.memo 사용:**
```javascript
export default React.memo(ClientCard, (prevProps, nextProps) => {
  return prevProps.client.id === nextProps.client.id &&
         prevProps.client.status === nextProps.client.status;
});
```

**디바운싱:**
```javascript
import { debounce } from 'lodash';

const debouncedSearch = debounce((searchTerm) => {
  dispatch(searchClients(searchTerm));
}, 300);
```

---

## 📋 통합 체크리스트

### 초기 설정
- [ ] React 프로젝트 생성
- [ ] 필요한 패키지 설치
- [ ] 폴더 구조 생성
- [ ] 환경 변수 설정

### 서버 연결
- [ ] Axios 인스턴스 설정
- [ ] API 서비스 함수 작성
- [ ] Socket.io 연결 설정
- [ ] CORS 설정 확인

### 상태 관리
- [ ] Redux 스토어 설정
- [ ] Slice 생성
- [ ] Socket 미들웨어 구현
- [ ] 비동기 액션 처리

### UI 구현
- [ ] 기본 레이아웃 구성
- [ ] 컴포넌트 분리
- [ ] Material-UI 테마 설정
- [ ] 반응형 디자인 적용

### 테스트
- [ ] API 연결 테스트
- [ ] Socket 이벤트 테스트
- [ ] 상태 업데이트 확인
- [ ] 에러 처리 테스트

---

## 🚀 다음 단계

1. **기본 기능 구현 완료**
2. **고급 기능 추가** (차트, 스케줄링 등)
3. **성능 최적화**
4. **프로덕션 빌드 및 배포**

이 가이드를 따라 웹 UI를 구성하고 서버와 연결하면 Switchboard Plus의 프론트엔드가 완성됩니다! 🎉