import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executePreset, stopPreset } from '../../store/slices/presetsSlice';
import { FaPlay, FaStop, FaEdit, FaTrash } from 'react-icons/fa';

const PresetCard = ({ preset, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients.items);
  const groups = useSelector(state => state.groups.items);

  const commandList = preset.PresetCommands || preset.commands || [];

  const getClientNames = () => {
    return commandList
      ?.map(cmd => {
        const clientId = cmd.clientId || (cmd.Client && cmd.Client.id);
        return clients.find(c => c.id === clientId)?.name;
      })
      ?.filter(Boolean)
      ?.join(', ') || '';
  };

  const getGroupNames = () => {
    if (!preset.selectedGroups || !Array.isArray(preset.selectedGroups)) return '';
    return preset.selectedGroups
      .map(groupId => groups.find(g => g.id === groupId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleExecute = (e) => {
    e.stopPropagation();
    dispatch(executePreset(preset.id));
  };

  const handleStop = (e) => {
    e.stopPropagation();
    dispatch(stopPreset(preset.id));
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(preset);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(preset);
  };

  return (
    <div className={`preset-card${preset.active ? ' active' : ''}`}>
      <div className="preset-content">
        <div className="preset-header">
          <div className="preset-name">{preset.name}</div>
          {preset.active && <span className="preset-status">● 활성</span>}
        </div>
        <div className="preset-commands">명령어 {commandList.length}개 설정됨</div>
        <div className="preset-groups">그룹: {getGroupNames()}</div>
      </div>
      <div className="preset-actions">
        {preset.active ? (
          <button className="btn btn-danger btn-small" title="중지" onClick={handleStop}><FaStop size={16} /></button>
        ) : (
          <button className="btn btn-primary btn-small" title="실행" onClick={handleExecute}><FaPlay size={16} /></button>
        )}
        <button className="btn btn-secondary btn-small" title="편집" onClick={handleEdit}><FaEdit size={16} /></button>
        <button className="btn btn-danger btn-small" title="삭제" onClick={handleDelete}><FaTrash size={16} /></button>
      </div>
    </div>
  );
};

export default PresetCard; 