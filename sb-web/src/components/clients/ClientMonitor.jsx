import React from 'react';
import { useSelector } from 'react-redux';
import ClientCard from './ClientCard';

const ClientMonitor = () => {
  const clients = useSelector(state => state.clients.items);

  return (
    <div>
      <h2 className="section-title">
        디스플레이 서버 모니터링
        <button className="btn btn-secondary btn-small" style={{ marginLeft: 10 }}>🔄 새로고침</button>
      </h2>
      {(!clients || clients.length === 0) ? (
        <div style={{ color: '#888', padding: '20px 0' }}>등록된 디스플레이 서버가 없습니다.</div>
      ) : (
        <div className="client-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
          {clients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientMonitor; 