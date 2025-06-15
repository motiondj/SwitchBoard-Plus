import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PresetList from './PresetList';
import PresetModal from './PresetModal';
import { deletePreset, fetchPresets } from '../../store/slices/presetsSlice';

const PresetSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const presets = useSelector(state => state.presets.items);
  const dispatch = useDispatch();

  const handleEditPreset = (preset) => {
    setSelectedPreset(preset);
    setIsModalOpen(true);
  };

  const handleDeletePreset = async (preset) => {
    if (window.confirm('이 프리셋을 삭제하시겠습니까?')) {
      await dispatch(deletePreset(preset.id));
      dispatch(fetchPresets());
    }
  };

  const handleNewPreset = () => {
    setSelectedPreset(null);
    setIsModalOpen(true);
  };

  return (
    <div className="section">
      <h2 className="section-title">
        콘텐츠 프리셋
        <button
          className="btn btn-secondary btn-small"
          onClick={handleNewPreset}
        >
          ➕ 새 프리셋
        </button>
      </h2>
      <div className="preset-grid">
        <PresetList onEdit={handleEditPreset} onDelete={handleDeletePreset} />
      </div>
      <PresetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preset={selectedPreset}
      />
    </div>
  );
};

export default PresetSection; 