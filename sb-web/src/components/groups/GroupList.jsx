import React from 'react';
import { useSelector } from 'react-redux';
import GroupCard from './GroupCard';

const GroupList = ({ onEdit }) => {
  const groups = useSelector(state => state.groups.items);

  if (!groups || groups.length === 0) {
    return <div style={{ color: '#888', padding: '20px 0' }}>등록된 그룹이 없습니다.</div>;
  }

  return (
    <div className="group-grid">
      {groups.map(group => (
        <GroupCard key={group.id} group={group} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default GroupList; 