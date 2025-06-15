import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createGroup, updateGroup, fetchGroups } from '../../store/slices/groupSlice';

const GROUP_COLORS = [
  { value: 'blue', label: '🔵 파란색' },
  { value: 'green', label: '🟢 초록색' },
  { value: 'red', label: '🔴 빨간색' },
  { value: 'yellow', label: '🟡 노란색' },
  { value: 'purple', label: '🟣 보라색' },
  { value: 'gray', label: '⚫ 회색' },
];

const GroupModal = ({ open, group, onClose }) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients.items);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [selectedClients, setSelectedClients] = useState([]);

  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setDescription(group.description || '');
      setColor(group.color || 'blue');
      setSelectedClients((group.Clients || group.clients || []).map(c => c.id));
    } else {
      setName('');
      setDescription('');
      setColor('blue');
      setSelectedClients([]);
    }
  }, [group, open]);

  if (!open) return null;

  const handleClientToggle = (id) => {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('그룹 이름을 입력하세요.');
      return;
    }
    if (selectedClients.length === 0) {
      alert('최소 하나의 디스플레이 서버를 선택하세요.');
      return;
    }
    if (group) {
      await dispatch(updateGroup({
        id: group.id,
        data: { name, description, color, clientIds: selectedClients }
      }));
    } else {
      await dispatch(createGroup({ name, description, color, clientIds: selectedClients }));
    }
    await dispatch(fetchGroups());
    onClose();
    setName('');
    setDescription('');
    setColor('blue');
    setSelectedClients([]);
  };

  const handleClose = () => {
    onClose();
    setName('');
    setDescription('');
    setColor('blue');
    setSelectedClients([]);
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <span>{group ? '그룹 편집' : '새 그룹 만들기'}</span>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-section">
            <div className="form-section-title">
              <span className="form-section-icon">1</span>
              그룹 정보
            </div>
            <div className="form-group">
              <label>그룹 이름 *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="예: 1층 전시장" />
            </div>
            <div className="form-group">
              <label>설명</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="이 그룹에 대한 설명을 입력하세요" />
            </div>
            <div className="form-group">
              <label>그룹 색상</label>
              <select value={color} onChange={e => setColor(e.target.value)}>
                {GROUP_COLORS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-title">
              <span className="form-section-icon">2</span>
              그룹 멤버 선택
              <span className="badge">{selectedClients.length}개 선택됨</span>
            </div>
            <div className="client-select-grid">
              {clients.map(client => (
                <div
                  key={client.uuid}
                  className={`client-select-item${selectedClients.includes(client.id) ? ' selected' : ''}`}
                  onClick={() => handleClientToggle(client.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    readOnly
                  />
                  <div className="client-info">
                    <div className="client-ip">{client.ip}</div>
                  </div>
                  <div className={`client-status ${client.status === 'offline' ? 'offline' : 'online'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="form-help">* 표시는 필수 입력 항목입니다</div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleClose}>취소</button>
            <button className="btn btn-primary" onClick={handleSave}>{group ? '저장' : '💾 그룹 저장'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal; 