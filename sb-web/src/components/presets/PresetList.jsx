import React from 'react';
import { useSelector } from 'react-redux';
import PresetCard from './PresetCard';

const PresetList = () => {
  const presets = useSelector(state => state.presets.items);

  if (!presets || presets.length === 0) {
    return <div style={{ color: '#888', padding: '20px 0' }}>등록된 프리셋이 없습니다.</div>;
  }

  return (
    <div className="preset-grid" style={{ display: 'grid', gap: 15, gridTemplateColumns: '1fr 1fr' }}>
      {presets.map(preset => (
        <PresetCard key={preset.id} preset={preset} />
      ))}
    </div>
  );
};

export default PresetList; 