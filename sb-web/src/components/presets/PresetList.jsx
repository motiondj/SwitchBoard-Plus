import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PresetCard from './PresetCard';
import { fetchPresets } from '../../store/slices/presetsSlice';

const PresetList = ({ onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { items: presets, status, error } = useSelector(state => state.presets);

  useEffect(() => {
    const loadPresets = async () => {
      try {
        console.log('프리셋 목록 로드 시작');
        await dispatch(fetchPresets()).unwrap();
        console.log('프리셋 목록 로드 완료:', presets);
      } catch (error) {
        console.error('프리셋 목록 로드 실패:', error);
      }
    };
    loadPresets();
  }, [dispatch]);

  // 디버깅용 콘솔 출력
  console.log('PresetList 렌더링:', { presets, status, error });

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div style={{ color: '#888', padding: '20px 0' }}>프리셋 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="error-container">
        <div style={{ color: '#ff4444', padding: '20px 0' }}>
          프리셋 목록을 불러오는데 실패했습니다.
          {error && <div style={{ fontSize: '12px', marginTop: '5px' }}>{error}</div>}
        </div>
        <button 
          className="btn btn-secondary btn-small"
          onClick={() => dispatch(fetchPresets())}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 프리셋이 배열이 아니거나 undefined/null인 경우 방어
  if (!Array.isArray(presets) || presets.length === 0) {
    return (
      <div className="empty-container">
        <div style={{ color: '#888', padding: '20px 0' }}>등록된 프리셋이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="preset-grid">
      {presets.map(preset => (
        <PresetCard key={preset.id} preset={preset} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PresetList; 