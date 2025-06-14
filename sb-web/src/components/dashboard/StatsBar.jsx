import React from 'react';
import { useSelector } from 'react-redux';

const StatsBar = () => {
  const clients = useSelector((state) => state.clients.items) || [];
  const presets = useSelector((state) => state.presets.items) || [];
  const groups = useSelector((state) => state.groups.items) || [];

  const totalClients = clients.length;
  const onlineClients = clients.filter(c => c.status === 'online').length;
  const runningClients = clients.filter(c => c.status === 'running').length;
  const activePresets = presets.filter(p => p.active).length;
  const totalGroups = groups.length;

  return (
    <div className="stats-bar">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{totalClients}</div>
          <div className="stat-label">전체 디스플레이 서버</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{onlineClients}</div>
          <div className="stat-label">온라인</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{runningClients}</div>
          <div className="stat-label">실행 중</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{activePresets}</div>
          <div className="stat-label">활성 프리셋</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalGroups}</div>
          <div className="stat-label">그룹 수</div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar; 