import React from 'react';
import StatsBar from './StatsBar';
import PresetSection from '../presets/PresetSection';
import GroupSection from '../groups/GroupSection';
import ClientMonitor from '../clients/ClientMonitor';

const Dashboard = () => {
  return (
    <div className="container">
      <StatsBar />
      <div className="main-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="section">
          <PresetSection />
        </div>
        <div className="section">
          <GroupSection />
        </div>
      </div>
      <div className="client-monitor">
        <ClientMonitor />
      </div>
    </div>
  );
};

export default Dashboard; 