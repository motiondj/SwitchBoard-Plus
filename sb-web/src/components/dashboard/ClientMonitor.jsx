import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { refreshClients } from '../../store/slices/clientSlice';

const ClientMonitor = () => {
    const dispatch = useDispatch();
    const clients = useSelector((state) => state.clients.items);

    const handleRefresh = () => {
        dispatch(refreshClients());
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return '#4CAF50';
            case 'offline':
                return '#F44336';
            case 'running':
                return '#2196F3';
            default:
                return '#9E9E9E';
        }
    };

    return (
        <div className="client-monitor">
            <div className="client-grid">
                {clients.map(client => (
                    <div key={client.id} className="client-card">
                        <div className="client-status" style={{ backgroundColor: getStatusColor(client.status) }} />
                        <div className="client-content">
                            <div className="client-name">{client.name}</div>
                            <div className="client-info">
                                <div>IP: {client.ip}</div>
                                <div>포트: {client.port}</div>
                            </div>
                        </div>
                        <div className="client-actions">
                            <button className="btn btn-secondary btn-small">
                                ⚙️ 설정
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-primary refresh-btn" onClick={handleRefresh}>
                🔄 새로고침
            </button>
        </div>
    );
};

export default ClientMonitor; 