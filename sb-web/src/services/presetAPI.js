import api from './api';

export const presetAPI = {
  // 모든 프리셋 조회
  fetchPresets: async () => {
    const response = await api.get('/api/presets');
    return response.data;
  },

  // 특정 프리셋 조회
  fetchPreset: async (id) => {
    const response = await api.get(`/api/presets/${id}`);
    return response.data;
  },

  // 프리셋 생성
  createPreset: async (presetData) => {
    const response = await api.post('/api/presets', presetData);
    return response.data;
  },

  // 프리셋 수정
  updatePreset: async (id, presetData) => {
    const response = await api.put(`/api/presets/${id}`, presetData);
    return response.data;
  },

  // 프리셋 삭제
  deletePreset: async (id) => {
    const response = await api.delete(`/api/presets/${id}`);
    return response.data;
  },

  // 프리셋 실행
  executePreset: async (id) => {
    const response = await api.post(`/api/presets/${id}/execute`);
    return response.data;
  },

  // 프리셋 중지
  stopPreset: async (id) => {
    const response = await api.post(`/api/presets/${id}/stop`);
    return response.data;
  },

  // 프리셋 상태 업데이트
  updatePresetStatus: (id, status) => {
    return api.put(`/presets/${id}/status`, { status });
  },

  // 프리셋 명령어 추가
  addCommand: (presetId, commandData) => {
    return api.post(`/presets/${presetId}/commands`, commandData);
  },

  // 프리셋 명령어 수정
  updateCommand: (presetId, commandId, commandData) => {
    return api.put(`/presets/${presetId}/commands/${commandId}`, commandData);
  },

  // 프리셋 명령어 삭제
  deleteCommand: (presetId, commandId) => {
    return api.delete(`/presets/${presetId}/commands/${commandId}`);
  },
}; 