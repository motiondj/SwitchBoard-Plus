import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups } from '../../store/slices/groupSlice';
import GroupList from './GroupList';
import GroupModal from '../clients/GroupModal';

const GroupSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const groups = useSelector(state => state.groups.items);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleEdit = (group) => {
    setEditGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditGroup(null);
  };

  return (
    <div className="section">
      <h2 className="section-title">
        디스플레이 서버 그룹
        <button
          className="btn btn-secondary btn-small"
          onClick={() => { setEditGroup(null); setIsModalOpen(true); }}
        >
          ➕ 새 그룹
        </button>
      </h2>
      <div className="group-grid">
        {(!groups || groups.length === 0) ? (
          <div style={{ color: '#888', padding: '20px 0' }}>등록된 그룹이 없습니다.</div>
        ) : (
          <GroupList onEdit={handleEdit} />
        )}
      </div>
      <GroupModal open={isModalOpen} group={editGroup} onClose={handleCloseModal} />
    </div>
  );
};

export default GroupSection; 