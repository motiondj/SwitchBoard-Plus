import React, { useState, useEffect, useRef } from 'react';
import PresetList from './PresetList';

const PresetModal = ({ open, onClose }) => {
  const modalRef = useRef(null);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // 외부 클릭으로 닫기
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <span>새 프리셋 만들기</span>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* 샘플 구조에 맞는 입력폼, 섹션 등 구현 (여기서는 간단히) */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="form-section-icon">1</span>
              기본 정보
            </div>
            <div className="form-group">
              <label>프리셋 이름 *</label>
              <input type="text" placeholder="예: 전시회 모드" />
            </div>
            <div className="form-group">
              <label>설명</label>
              <textarea placeholder="설명을 입력하세요" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="form-help">* 표시는 필수 입력 항목입니다</div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>취소</button>
            <button className="btn btn-primary">💾 프리셋 저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PresetSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <h2 className="section-title">
        프리셋
        <button className="btn btn-secondary btn-small" style={{ marginLeft: 10 }} onClick={() => setModalOpen(true)}>
          + 새 프리셋
        </button>
      </h2>
      <div className="preset-list" style={{ marginTop: 10 }}>
        <PresetList />
      </div>
      <PresetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default PresetSection; 