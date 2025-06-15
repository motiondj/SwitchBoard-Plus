import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { executePreset, stopPreset } from '../redux/presetsSlice';

const PresetCard = ({ preset }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(preset.active);

  const handleExecute = async () => {
    try {
      if (preset.active) {
        await dispatch(stopPreset(preset.id)).unwrap();
      } else {
        await dispatch(executePreset(preset.id)).unwrap();
      }
    } catch (error) {
      console.error('프리셋 실행/정지 실패:', error);
    }
  };

  useEffect(() => {
    setActive(preset.active);
  }, [preset.active]);

  return (
    <div className="preset-card">
      <div className="preset-header">
        <h3>{preset.name}</h3>
        <div className="preset-actions">
          <button
            className={`preset-button ${preset.active ? 'stop' : 'execute'}`}
            onClick={handleExecute}
          >
            {preset.active ? '정지' : '실행'}
          </button>
        </div>
      </div>
      <div className="preset-info">
        <p>명령어 수: {preset.commands.length}</p>
        <p>그룹: {preset.group}</p>
      </div>
    </div>
  );
};

export default PresetCard; 