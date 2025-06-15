import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteGroup } from '../../store/slices/groupsSlice';
import { openGroupModal, showToast } from '../../store/slices/uiSlice';

const GroupCard = ({ group, onEdit }) => {
  const dispatch = useDispatch();
  const clients = useSelector(state => state.clients.items);
  const clientList = group.Clients || group.clients || [];

  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch(openGroupModal(group.id));
    if (onEdit) onEdit(group);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('이 그룹을 삭제하시겠습니까?')) {
      dispatch(deleteGroup(group.id))
        .unwrap()
        .then(() => {
          dispatch(showToast({
            message: '그룹이 삭제되었습니다.',
            severity: 'success'
          }));
        })
        .catch((error) => {
          dispatch(showToast({
            message: error.message || '그룹 삭제 중 오류가 발생했습니다.',
            severity: 'error'
          }));
        });
    }
  };

  const getClientStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="group-card" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div className="group-content">
        <div className="group-header">
          <div className="group-name">{group.name}</div>
          <span style={{ fontSize: 12, color: '#666' }}>
            {clientList.length}개 디스플레이 서버
          </span>
        </div>
        <div className="group-clients">
          {clientList.map(client => {
            const ip = client.ip || (typeof client === 'object' ? client.ip : undefined);
            return (
              <span key={client.id} className={`client-tag ${client.status}`}>
                {ip}
              </span>
            );
          })}
        </div>
      </div>
      <div className="group-actions" style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 }}>
        <button
          className="btn btn-secondary btn-small"
          title="편집"
          onClick={handleEdit}
          style={{ padding: 8, minWidth: 36, minHeight: 36, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FaEdit size={16} />
        </button>
        <button
          className="btn btn-danger btn-small"
          title="삭제"
          onClick={handleDelete}
          style={{ padding: 8, minWidth: 36, minHeight: 36, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default GroupCard; 