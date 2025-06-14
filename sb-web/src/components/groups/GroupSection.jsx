import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GroupList from './GroupList';

const GroupSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const groups = useSelector(state => state.groups.items);

  return (
    <div className="section">
      <h2 className="section-title">
        디스플레이 서버 그룹
        <button
          className="btn btn-secondary btn-small"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ 새 그룹
        </button>
      </h2>
      <div className="group-grid">
        {(!groups || groups.length === 0) ? (
          <div style={{ color: '#888', padding: '20px 0' }}>등록된 그룹이 없습니다.</div>
        ) : (
          <GroupList groups={groups} />
        )}
      </div>
      {/* 그룹 생성 모달 컴포넌트는 추후 연결 */}
    </div>
  );
};

export default GroupSection; 