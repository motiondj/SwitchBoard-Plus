import api from './api';

export const groupAPI = {
  // 모든 그룹 조회
  fetchGroups: async () => {
    const response = await api.get('/api/groups');
    return response.data;
  },

  // 특정 그룹 조회
  fetchGroup: async (id) => {
    const response = await api.get(`/api/groups/${id}`);
    return response.data;
  },

  // 그룹 생성
  createGroup: async (groupData) => {
    const response = await api.post('/api/groups', groupData);
    return response.data;
  },

  // 그룹 수정
  updateGroup: async (id, groupData) => {
    const response = await api.put(`/api/groups/${id}`, groupData);
    return response.data;
  },

  // 그룹 삭제
  deleteGroup: async (id) => {
    const response = await api.delete(`/api/groups/${id}`);
    return response.data;
  },

  // 그룹에 클라이언트 추가
  addClientToGroup: (groupId, clientId) => {
    return api.post(`/groups/${groupId}/clients`, { clientId });
  },

  // 그룹에서 클라이언트 제거
  removeClientFromGroup: (groupId, clientId) => {
    return api.delete(`/groups/${groupId}/clients/${clientId}`);
  },

  // 그룹의 클라이언트 목록 조회
  getGroupClients: (groupId) => {
    return api.get(`/groups/${groupId}/clients`);
  },

  // 그룹 색상 업데이트
  updateGroupColor: (groupId, color) => {
    return api.put(`/groups/${groupId}/color`, { color });
  },
}; 