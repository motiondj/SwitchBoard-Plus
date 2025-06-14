import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PresetList from './PresetList';
import PresetModal from './PresetModal';

const PresetSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const presets = useSelector(state => state.presets.items);

  return (
    <div className="section">
      <h2 className="section-title">
        콘텐츠 프리셋
        <button
          className="btn btn-secondary btn-small"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ 새 프리셋
        </button>
      </h2>
      <div className="preset-grid">
        {(!presets || presets.length === 0) ? (
          <div style={{ color: '#888', padding: '20px 0' }}>등록된 프리셋이 없습니다.</div>
        ) : (
          <PresetList presets={presets} />
        )}
      </div>
      <PresetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PresetSection; 