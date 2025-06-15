import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executePreset, stopPreset } from '../../store/slices/presetsSlice';
import { setClientsRunningByPreset, setClientsOnlineByPreset } from '../../store/slices/clientsSlice';
import { FaPlay, FaStop, FaEdit, FaTrash } from 'react-icons/fa';
import { showToast } from '../../store/slices/uiSlice';

const PresetCard = ({ preset, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups.items);
  const clients = useSelector(state => state.clients.items);

  // 프리셋에 포함된 clientId 목록 추출
  function getClientIds() {
    const commandList = Array.isArray(preset.PresetCommands) && preset.PresetCommands.length > 0
      ? preset.PresetCommands
      : (Array.isArray(preset.commands) ? preset.commands : []);
    return commandList
      .map(cmd => cmd.clientId || (cmd.Client && cmd.Client.id))
      .filter(id => id !== undefined && id !== null)
      .map(String);
  }

  // 프리셋에 포함된 모든 클라이언트가 running 상태인지 확인
  const allRunning = getClientIds().length > 0 && getClientIds().every(id => {
    const client = clients.find(c => String(c.id) === String(id));
    return client && client.status === 'running';
  });

  // 실행 버튼 클릭
  const handleExecute = async () => {
    try {
      const result = await dispatch(executePreset(preset.id)).unwrap();
      console.log('실행 전체 응답:', result);
      
      // 서버 응답이 성공이면 성공 토스트 표시
      if (result && result.message === 'Preset execution started') {
        dispatch(showToast({ message: '프리셋이 실행되었습니다', severity: 'success' }));
      } else {
        dispatch(showToast({ message: '프리셋 실행 실패', severity: 'error' }));
      }
    } catch (error) {
      console.error('실행 에러:', error);
      dispatch(showToast({ message: '프리셋 실행 실패', severity: 'error' }));
    }
  };

  // 정지 버튼 클릭
  const handleStop = async () => {
    try {
      const result = await dispatch(stopPreset(preset.id)).unwrap();
      console.log('정지 전체 응답:', result);
      
      // 서버 응답이 성공이면 성공 토스트 표시
      if (result && result.message === 'Preset stopped') {
        dispatch(showToast({ message: '프리셋이 정지되었습니다', severity: 'success' }));
      } else {
        dispatch(showToast({ message: '프리셋 정지 실패', severity: 'error' }));
      }
    } catch (error) {
      console.error('정지 에러:', error);
      dispatch(showToast({ message: '프리셋 정지 실패', severity: 'error' }));
    }
  };

  // 그룹명 추출
  const getGroupNames = () => {
    if (!preset.selectedGroups || !Array.isArray(preset.selectedGroups)) return '';
    return preset.selectedGroups
      .map(groupId => {
        if (typeof groupId === 'object' && groupId.name) return groupId.name;
        return groups.find(g => g.id === groupId)?.name;
      })
      .filter(Boolean)
      .join(', ');
  };

  // 명령어 리스트
  const commandList = Array.isArray(preset.PresetCommands) && preset.PresetCommands.length > 0
    ? preset.PresetCommands
    : (Array.isArray(preset.commands) ? preset.commands : []);

  return (
    <div className={`preset-card ${allRunning ? 'active' : ''}`}>
      <div className="preset-content">
        <div className="preset-header">
          <div className="preset-name">{preset.name}</div>
          {allRunning && <span className="preset-status">● 활성</span>}
        </div>
        <div className="preset-commands">명령어 {commandList.length}개 설정됨</div>
        <div className="preset-groups">그룹: {getGroupNames()}</div>
      </div>
      <div className="preset-actions">
        {allRunning ? (
          <button 
            className="btn btn-danger btn-small"
            onClick={handleStop}
          >
            <FaStop />
          </button>
        ) : (
          <button 
            className="btn btn-primary btn-small"
            onClick={handleExecute}
          >
            <FaPlay />
          </button>
        )}
        <button 
          className="btn btn-secondary btn-small"
          onClick={() => onEdit(preset)}
        >
          <FaEdit size={16} />
        </button>
        <button 
          className="btn btn-danger btn-small"
          onClick={() => onDelete(preset.id)}
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default PresetCard; 