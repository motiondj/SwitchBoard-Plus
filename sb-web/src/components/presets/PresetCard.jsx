import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executePreset, stopPreset } from '../../store/slices/presetsSlice';

const PresetCard = ({ preset }) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients.items);

  const getClientNames = () => {
    return preset.commands
      ?.map(cmd => clients.find(c => c.id === cmd.clientId)?.name)
      ?.filter(Boolean)
      ?.join(', ') || '';
  };

  const handleExecute = () => {
    dispatch(executePreset(preset.id));
  };

  const handleStop = () => {
    dispatch(stopPreset(preset.id));
  };

  const handleEdit = () => {
    // TODO: 편집 모달 열기
    console.log('Edit preset:', preset.id);
  };

  return (
    <div
      className={`preset-card${preset.active ? ' active' : ''}`}
      style={{
        border: preset.active ? '2px solid #667eea' : '2px solid #e0e0e0',
        borderRadius: 8,
        padding: 15,
        background: preset.active ? '#f0f4ff' : 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        marginBottom: 10
      }}
    >
      <div className="preset-content" style={{ flex: 1, paddingRight: 15 }}>
        <div className="preset-header" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div className="preset-name" style={{ fontSize: 16, fontWeight: 600 }}>{preset.name}</div>
          {preset.active && <span className="preset-status" style={{ color: '#4CAF50', fontSize: 14 }}>● 활성</span>}
        </div>
        <div className="preset-info" style={{ fontSize: 13, color: '#666' }}>
          <div>디스플레이 서버: {getClientNames()}</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 5 }}>명령어 {preset.commands?.length || 0}개 설정됨</div>
        </div>
      </div>
      <div className="preset-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        {preset.active ? (
          <button
            className="btn btn-danger btn-small"
            style={{ marginBottom: 5 }}
            onClick={handleStop}
          >⏹️ 중지</button>
        ) : (
          <button
            className="btn btn-primary btn-small"
            style={{ marginBottom: 5 }}
            onClick={handleExecute}
          >▶️ 실행</button>
        )}
        <button
          className="btn btn-secondary btn-small"
          onClick={handleEdit}
        >✏️ 편집</button>
      </div>
    </div>
  );
};

export default PresetCard; 