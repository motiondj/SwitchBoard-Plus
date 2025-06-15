import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  config => {
    console.log(`[API 요청] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  error => {
    console.error('[API 요청 에러]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  response => {
    console.log(`[API 응답] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('[API 응답 에러]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const clientAPI = {
  getAll: async () => {
    try {
      console.log('[API] 클라이언트 목록 요청');
      const response = await api.get('/clients');
      console.log('[API] 클라이언트 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] 클라이언트 목록 요청 실패:', error);
      throw error;
    }
  },
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  executeCommand: (clientIds, command) => 
    api.post('/clients/execute', { clientIds, command }),
  stopClients: (clientIds) => 
    api.post('/clients/stop', { clientIds }),
  updateStatus: (id, status) => api.patch(`/clients/${id}/status`, { status })
};

export default clientAPI; 