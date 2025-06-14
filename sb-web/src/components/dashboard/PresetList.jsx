import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { executePreset, stopPreset } from '../../store/slices/presetSlice';

const PresetList = () => {
    const dispatch = useDispatch();
    const presets = useSelector((state) => state.presets.items);
    const clients = useSelector((state) => state.clients.items);

    const handleExecutePreset = (presetId) => {
        dispatch(executePreset(presetId));
    };

    const handleStopPreset = (presetId) => {
        dispatch(stopPreset(presetId));
    };

    return (
        <div className="preset-grid">
            {presets.map(preset => {
                const clientNames = preset.commands
                    .map(cmd => clients.find(c => c.id === cmd.clientId)?.name || '')
                    .filter(name => name)
                    .join(', ');

                return (
                    <div key={preset.id} className={`preset-card ${preset.status === 'active' ? 'active' : ''}`}>
                        <div className="preset-content">
                            <div className="preset-header">
                                <div className="preset-name">{preset.name}</div>
                                {preset.status === 'active' && <span className="preset-status">● 활성</span>}
                            </div>
                            <div className="preset-info">
                                <div>디스플레이 서버: {clientNames}</div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                    명령어 {preset.commands.length}개 설정됨
                                </div>
                            </div>
                        </div>
                        <div className="preset-actions">
                            {preset.status === 'active' ? (
                                <button 
                                    className="btn btn-danger btn-small"
                                    onClick={() => handleStopPreset(preset.id)}
                                >
                                    ⏹️ 중지
                                </button>
                            ) : (
                                <button 
                                    className="btn btn-primary btn-small"
                                    onClick={() => handleExecutePreset(preset.id)}
                                >
                                    ▶️ 실행
                                </button>
                            )}
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

export default PresetList; 