import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const clientAPI = {
  getAll: () => axios.get(`${API_URL}/clients`),
  getById: (id) => axios.get(`${API_URL}/clients/${id}`),
  create: (data) => axios.post(`${API_URL}/clients`, data),
  update: (id, data) => axios.put(`${API_URL}/clients/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/clients/${id}`),
  executeCommand: (clientId, command) => 
    axios.post(`${API_URL}/clients/${clientId}/execute`, { command }),
  stopClients: (clientIds) => 
    axios.post(`${API_URL}/clients/stop`, { clientIds })
};

export default clientAPI; 