import React from 'react';
import { Box, Typography } from '@mui/material';

const ClientCard = ({ client }) => {
  console.log('ClientCard 렌더링:', client);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'online':
        return {
          icon: '🟢',
          bgColor: '#e8f5e9',
          text: '온라인'
        };
      case 'offline':
        return {
          icon: '🔴',
          bgColor: '#ffebee',
          text: '오프라인'
        };
      case 'running':
        return {
          icon: '🟡',
          bgColor: '#fff3e0',
          text: '실행중'
        };
      case 'error':
        return {
          icon: '⚠️',
          bgColor: '#ffebee',
          text: '오류'
        };
      default:
        return {
          icon: '⚪',
          bgColor: '#f5f5f5',
          text: '알 수 없음'
        };
    }
  };

  const statusInfo = getStatusInfo(client.status);

  return (
    <div className={`client-item ${client.status}`}>
      <div className="client-icon">
        {client.status === 'running' ? '🟢' : client.status === 'online' ? '🟡' : '🔴'}
      </div>
      <div className="client-name">{client.name}</div>
      <div className="client-ip">{client.ip}</div>
      {client.status === 'running' && <div className="running-indicator"></div>}
    </div>
  );
};

export default ClientCard; 