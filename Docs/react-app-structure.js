// package.json
{
  "name": "switchboard-plus-web",
  "version": "1.0.0",
  "private": true,
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
    "@mui/icons-material": "^5.14.19",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "@types/react": "^18.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx"
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
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
})

// .env
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=ws://localhost:8000

// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.jsx'
import { store } from './store/index.js'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)

// src/App.jsx
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from '@mui/material'
import Header from './components/common/Header'
import Dashboard from './components/dashboard/Dashboard'
import Toast from './components/common/Toast'
import { connectSocket } from './store/middleware/socketMiddleware'
import { fetchClients } from './store/slices/clientsSlice'
import { fetchPresets } from './store/slices/presetsSlice'
import { fetchGroups } from './store/slices/groupsSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Socket 연결 초기화
    dispatch(connectSocket())

    // 초기 데이터 로드
    dispatch(fetchClients())
    dispatch(fetchPresets())
    dispatch(fetchGroups())

    // 컴포넌트 언마운트 시 정리
    return () => {
      dispatch({ type: 'socket/disconnect' })
    }
  }, [dispatch])

  return (
    <div className="app">
      <Header />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Dashboard />
      </Container>
      <Toast />
    </div>
  )
}

export default App

// src/App.css
.app {
  min-height: 100vh;
  background-color: #f5f7fa;
}

// src/index.css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import clientsReducer from './slices/clientsSlice'
import presetsReducer from './slices/presetsSlice'
import groupsReducer from './slices/groupsSlice'
import uiReducer from './slices/uiSlice'
import socketMiddleware from './middleware/socketMiddleware'

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    presets: presetsReducer,
    groups: groupsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connect', 'socket/disconnect'],
      },
    }).concat(socketMiddleware),
})

// src/store/slices/clientsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import clientAPI from '../../services/clientAPI'

// 비동기 액션
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await clientAPI.getClients()
    return response
  }
)

export const executeCommand = createAsyncThunk(
  'clients/executeCommand',
  async ({ clientIds, commands }) => {
    const response = await clientAPI.executeCommand({ clientIds, commands })
    return response
  }
)

export const stopClients = createAsyncThunk(
  'clients/stopClients',
  async (clientIds) => {
    const response = await clientAPI.stopClients(clientIds)
    return response
  }
)

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateClientStatus: (state, action) => {
      const { uuid, status } = action.payload
      const client = state.items.find(c => c.uuid === uuid)
      if (client) {
        client.status = status
        client.last_heartbeat = new Date().toISOString()
      }
    },
    updateClientMetrics: (state, action) => {
      const { uuid, metrics } = action.payload
      const client = state.items.find(c => c.uuid === uuid)
      if (client) {
        client.metrics = metrics
      }
    },
    upsertClient: (state, action) => {
      const clientData = action.payload
      const existingIndex = state.items.findIndex(c => c.uuid === clientData.uuid)
      
      if (existingIndex >= 0) {
        state.items[existingIndex] = { ...state.items[existingIndex], ...clientData }
      } else {
        state.items.push(clientData)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { updateClientStatus, updateClientMetrics, upsertClient } = clientsSlice.actions
export default clientsSlice.reducer

// src/store/slices/presetsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import presetAPI from '../../services/presetAPI'

export const fetchPresets = createAsyncThunk(
  'presets/fetchPresets',
  async () => {
    const response = await presetAPI.getPresets()
    return response
  }
)

export const createPreset = createAsyncThunk(
  'presets/createPreset',
  async (presetData) => {
    const response = await presetAPI.createPreset(presetData)
    return response
  }
)

export const executePreset = createAsyncThunk(
  'presets/executePreset',
  async (presetId) => {
    const response = await presetAPI.executePreset(presetId)
    return response
  }
)

export const stopPreset = createAsyncThunk(
  'presets/stopPreset',
  async (presetId) => {
    const response = await presetAPI.stopPreset(presetId)
    return response
  }
)

const presetsSlice = createSlice({
  name: 'presets',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    activePresetId: null,
  },
  reducers: {
    updatePresetStatus: (state, action) => {
      const { presetId, active } = action.payload
      const preset = state.items.find(p => p.id === presetId)
      if (preset) {
        preset.active = active
      }
      if (active) {
        state.activePresetId = presetId
        // 다른 프리셋들 비활성화
        state.items.forEach(p => {
          if (p.id !== presetId) p.active = false
        })
      } else if (state.activePresetId === presetId) {
        state.activePresetId = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresets.fulfilled, (state, action) => {
        state.items = action.payload
        const activePreset = action.payload.find(p => p.active)
        state.activePresetId = activePreset?.id || null
      })
      .addCase(createPreset.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(executePreset.fulfilled, (state, action) => {
        const { presetId } = action.payload
        state.items.forEach(p => p.active = p.id === presetId)
        state.activePresetId = presetId
      })
      .addCase(stopPreset.fulfilled, (state, action) => {
        const { presetId } = action.payload
        const preset = state.items.find(p => p.id === presetId)
        if (preset) preset.active = false
        if (state.activePresetId === presetId) {
          state.activePresetId = null
        }
      })
  },
})

export const { updatePresetStatus } = presetsSlice.actions
export default presetsSlice.reducer

// src/store/slices/groupsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import groupAPI from '../../services/groupAPI'

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async () => {
    const response = await groupAPI.getGroups()
    return response
  }
)

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData) => {
    const response = await groupAPI.createGroup(groupData)
    return response
  }
)

export const updateGroup = createAsyncThunk(
  'groups/updateGroup',
  async ({ id, data }) => {
    const response = await groupAPI.updateGroup(id, data)
    return response
  }
)

export const deleteGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId) => {
    await groupAPI.deleteGroup(groupId)
    return groupId
  }
)

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.items.findIndex(g => g.id === action.payload.id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.items = state.items.filter(g => g.id !== action.payload)
      })
  },
})

export default groupsSlice.reducer

// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: {
      open: false,
      message: '',
      severity: 'info',
    },
    modals: {
      presetModal: false,
      groupModal: false,
    },
    loading: false,
  },
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      }
    },
    hideToast: (state) => {
      state.toast.open = false
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { showToast, hideToast, openModal, closeModal, setLoading } = uiSlice.actions
export default uiSlice.reducer

// src/store/middleware/socketMiddleware.js
import { io } from 'socket.io-client'
import { updateClientStatus, updateClientMetrics, upsertClient } from '../slices/clientsSlice'
import { updatePresetStatus } from '../slices/presetsSlice'
import { showToast } from '../slices/uiSlice'

let socket = null

const socketMiddleware = (store) => {
  return (next) => (action) => {
    const { dispatch } = store

    if (action.type === 'socket/connect') {
      if (!socket) {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000'
        socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        })

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id)
          dispatch(showToast({ 
            message: '서버에 연결되었습니다.', 
            severity: 'success' 
          }))
        })

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason)
          dispatch(showToast({ 
            message: '서버 연결이 끊어졌습니다.', 
            severity: 'warning' 
          }))
        })

        socket.on('error', (error) => {
          console.error('Socket error:', error)
          dispatch(showToast({ 
            message: '연결 오류가 발생했습니다.', 
            severity: 'error' 
          }))
        })

        // 클라이언트 이벤트
        socket.on('client:status', (data) => {
          dispatch(updateClientStatus(data))
        })

        socket.on('client:metrics', (data) => {
          dispatch(updateClientMetrics(data))
        })

        socket.on('client:registered', (data) => {
          dispatch(upsertClient(data))
          dispatch(showToast({ 
            message: `${data.name}이(가) 등록되었습니다.`, 
            severity: 'info' 
          }))
        })

        // 프리셋 이벤트
        socket.on('preset:status', (data) => {
          dispatch(updatePresetStatus(data))
        })

        socket.on('execution:result', (data) => {
          const { success, message, clientName } = data
          dispatch(showToast({ 
            message: `${clientName}: ${message}`, 
            severity: success ? 'success' : 'error' 
          }))
        })
      }
    }

    if (action.type === 'socket/disconnect') {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }

    return next(action)
  }
}

export const connectSocket = () => ({ type: 'socket/connect' })
export const disconnectSocket = () => ({ type: 'socket/disconnect' })

export default socketMiddleware

// src/services/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
      
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } else if (error.request) {
      console.error('Network Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api

// src/services/clientAPI.js
import api from './api'

const clientAPI = {
  getClients: () => api.get('/clients'),
  
  getClient: (id) => api.get(`/clients/${id}`),
  
  registerClient: (data) => api.post('/clients', data),
  
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  
  deleteClient: (id) => api.delete(`/clients/${id}`),
  
  getClientStatus: (id) => api.get(`/status/${id}`),
  
  executeCommand: (data) => api.post('/execute', data),
  
  stopClients: (clientIds) => api.post('/stop', { clientIds }),
  
  restartClients: (clientIds) => api.post('/restart', { clientIds }),
}

export default clientAPI

// src/services/presetAPI.js
import api from './api'

const presetAPI = {
  getPresets: () => api.get('/presets'),
  
  getPreset: (id) => api.get(`/presets/${id}`),
  
  createPreset: (data) => api.post('/presets', data),
  
  updatePreset: (id, data) => api.put(`/presets/${id}`, data),
  
  deletePreset: (id) => api.delete(`/presets/${id}`),
  
  executePreset: (id) => api.post(`/presets/${id}/execute`),
  
  stopPreset: (id) => api.post(`/presets/${id}/stop`),
}

export default presetAPI

// src/services/groupAPI.js
import api from './api'

const groupAPI = {
  getGroups: () => api.get('/groups'),
  
  getGroup: (id) => api.get(`/groups/${id}`),
  
  createGroup: (data) => api.post('/groups', data),
  
  updateGroup: (id, data) => api.put(`/groups/${id}`, data),
  
  deleteGroup: (id) => api.delete(`/groups/${id}`),
}

export default groupAPI