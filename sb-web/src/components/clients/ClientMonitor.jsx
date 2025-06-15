import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClients } from '../../store/slices/clientsSlice';
import ClientCard from './ClientCard';
import { Box, Typography, Button } from '@mui/material';

const ClientMonitor = () => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients.items);
  const status = useSelector(state => state.clients.status);
  const error = useSelector(state => state.clients.error);

  console.log('현재 클라이언트 목록:', clients);
  console.log('현재 상태:', status);
  console.log('에러:', error);

  // 클라이언트 목록 갱신
  const refreshClients = useCallback(async () => {
    try {
      const result = await dispatch(fetchClients()).unwrap();
      console.log('클라이언트 목록 갱신 성공:', result);
    } catch (error) {
      console.error('클라이언트 목록 갱신 실패:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    // 초기 클라이언트 목록 로드
    refreshClients();

    // 60초마다 클라이언트 목록 갱신
    const refreshInterval = setInterval(refreshClients, 60000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshClients]);

  if (status === 'loading') {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="body1" sx={{ color: '#666' }}>
          클라이언트 목록을 불러오는 중...
        </Typography>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="body1" sx={{ color: 'error.main', marginBottom: '10px' }}>
          오류: {error || '클라이언트 목록을 불러오는데 실패했습니다.'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={refreshClients}
          sx={{ mt: 2 }}
        >
          다시 시도
        </Button>
      </Box>
    );
  }

  if (clients && clients.length > 0) {
    console.log('ClientCard로 전달되는 clients:', clients);
  }

  return (
    <Box className="client-monitor">
      <Box className="section-title">
        디스플레이 서버 모니터링
      </Box>
      <div className="client-grid">
        {clients.map(client => (
          <div className={`client-item ${client.status}`} key={client.uuid}>
            <div className="client-icon">
              {client.status === 'running' ? '🟢' : client.status === 'online' ? '🟡' : '🔴'}
            </div>
            <div className="client-name">{client.name}</div>
            <div className="client-ip">{client.ip}</div>
            {client.status === 'running' && <div className="running-indicator"></div>}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ClientMonitor; 