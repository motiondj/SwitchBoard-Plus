import React from 'react';
import { useSelector } from 'react-redux';

const GroupList = () => {
    const groups = useSelector((state) => state.groups.items);
    const clients = useSelector((state) => state.clients.items);

    return (
        <div className="group-grid">
            {groups.map(group => {
                const clientNames = group.clientIds
                    .map(id => clients.find(c => c.id === id)?.name || '')
                    .filter(name => name)
                    .join(', ');

                return (
                    <div key={group.id} className="group-card">
                        <div className="group-content">
                            <div className="group-header">
                                <div className="group-name">{group.name}</div>
                            </div>
                            <div className="group-info">
                                <div>디스플레이 서버: {clientNames}</div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                    {group.clientIds.length}개의 서버 포함
                                </div>
                            </div>
                        </div>
                        <div className="group-actions">
                            <button className="btn btn-secondary btn-small">
                                ✏️ 편집
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GroupList; 