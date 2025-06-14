import React from 'react';
import GroupList from './GroupList';

const GroupSection = () => {
  return (
    <>
      <h2 className="section-title">
        그룹
        <button className="btn btn-secondary btn-small" style={{ marginLeft: 10 }}>+ 새 그룹</button>
      </h2>
      <div className="group-list" style={{ marginTop: 10 }}>
        <GroupList />
      </div>
    </>
  );
};

export default GroupSection; 