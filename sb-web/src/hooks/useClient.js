import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClients,
  updateClientStatus,
  updateClientMetrics,
} from '../store/slices/clientsSlice';
import { showToast } from '../store/slices/uiSlice';

export const useClient = () => {
  const dispatch = useDispatch();
  const { items: clients, status, error } = useSelector((state) => state.clients);

  const loadClients = useCallback(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleStatusUpdate = useCallback((clientId, status) => {
    try {
      dispatch(updateClientStatus({ id: clientId, status }));
    } catch (error) {
      dispatch(showToast({ message: '클라이언트 상태 업데이트에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleMetricsUpdate = useCallback((clientId, metrics) => {
    try {
      dispatch(updateClientMetrics({ id: clientId, metrics }));
    } catch (error) {
      dispatch(showToast({ message: '클라이언트 메트릭 업데이트에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const getClientStatus = useCallback((clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.status : 'offline';
  }, [clients]);

  const getClientMetrics = useCallback((clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.metrics : null;
  }, [clients]);

  const getOnlineClients = useCallback(() => {
    return clients.filter(client => client.status !== 'offline');
  }, [clients]);

  const getRunningClients = useCallback(() => {
    return clients.filter(client => client.status === 'running');
  }, [clients]);

  return {
    clients,
    status,
    error,
    loadClients,
    updateStatus: handleStatusUpdate,
    updateMetrics: handleMetricsUpdate,
    getClientStatus,
    getClientMetrics,
    getOnlineClients,
    getRunningClients,
  };
}; 