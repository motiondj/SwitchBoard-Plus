import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createPreset, updatePreset } from '../../store/slices/presetsSlice';
import { closePresetModal } from '../../store/slices/uiSlice';

const PresetModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups.items);
  const clients = useSelector(state => state.clients.items);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedGroups: [],
    commands: {}
  });

  const [selectedGroupCount, setSelectedGroupCount] = useState(0);
  const [commandClientCount, setCommandClientCount] = useState(0);

  // 선택된 그룹의 클라이언트들 수집
  const selectedClients = React.useMemo(() => {
    const clientIds = new Set();
    formData.selectedGroups.forEach(groupId => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        group.clients.forEach(clientId => clientIds.add(clientId));
      }
    });
    return Array.from(clientIds);
  }, [formData.selectedGroups, groups]);

  // 그룹 선택 토글
  const toggleGroup = (groupId) => {
    setFormData(prev => {
      const newSelectedGroups = prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId];
      
      return {
        ...prev,
        selectedGroups: newSelectedGroups
      };
    });
  };

  // 선택된 그룹 수 업데이트
  useEffect(() => {
    setSelectedGroupCount(formData.selectedGroups.length);
  }, [formData.selectedGroups]);

  // 선택된 클라이언트 수 업데이트
  useEffect(() => {
    setCommandClientCount(selectedClients.length);
  }, [selectedClients]);

  // 명령어 템플릿
  const commandTemplates = {
    "풀스크린": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/wall.ndisplay -dc_node={node} -fullscreen",
    "윈도우": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/test.ndisplay -dc_node={node} -windowed",
    "개발": "C:/Displays/MyProject.exe -messaging -dc_cluster -dc_cfg=Config/dev.ndisplay -dc_node=master -windowed -log"
  };

  // 템플릿 적용
  const applyTemplate = (templateName, clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    let command = commandTemplates[templateName];
    if (command) {
      command = command.replace('{node}', client.node);
      setFormData(prev => ({
        ...prev,
        commands: {
          ...prev.commands,
          [clientId]: command
        }
      }));
    }
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      // TODO: 토스트 메시지 표시
      return;
    }

    if (formData.selectedGroups.length === 0) {
      // TODO: 토스트 메시지 표시
      return;
    }

    // 모든 클라이언트의 명령어가 입력되었는지 확인
    const hasEmptyCommand = selectedClients.some(clientId => !formData.commands[clientId]);
    if (hasEmptyCommand) {
      // TODO: 토스트 메시지 표시
      return;
    }

    // 프리셋 생성
    const newPreset = {
      name: formData.name,
      description: formData.description,
      commands: selectedClients.map(clientId => ({
        clientId,
        command: formData.commands[clientId]
      }))
    };

    dispatch(createPreset(newPreset));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <span>새 프리셋 만들기</span>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* 기본 정보 섹션 */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="form-section-icon">1</span>
                기본 정보
              </div>

              <div className="form-group">
                <label>프리셋 이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 전시회 모드"
                />
                <div className="form-help">이 프리셋을 쉽게 구분할 수 있는 이름을 입력하세요</div>
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="이 프리셋이 언제 사용되는지, 어떤 설정인지 설명을 입력하세요"
                />
              </div>
            </div>

            {/* 그룹 선택 섹션 */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="form-section-icon">2</span>
                실행할 그룹 선택
                <span className="badge">{selectedGroupCount}개 선택됨</span>
              </div>

              <div className="form-group">
                <label>그룹 목록</label>
                <div className="client-select-grid">
                  {groups.map(group => {
                    const totalClients = group.clients.length;
                    const onlineClients = group.clients.filter(clientId => {
                      const client = clients.find(c => c.id === clientId);
                      return client && client.status !== 'offline';
                    }).length;

                    return (
                      <div
                        key={group.id}
                        className={`client-select-item ${formData.selectedGroups.includes(group.id) ? 'selected' : ''}`}
                        onClick={() => toggleGroup(group.id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedGroups.includes(group.id)}
                          onChange={() => {}}
                        />
                        <div className="client-info">
                          <div className="client-name">{group.name}</div>
                          <div className="client-ip">
                            {totalClients}개 디스플레이 서버 ({onlineClients}개 온라인)
                          </div>
                        </div>
                        <div className={`client-status ${onlineClients > 0 ? 'online' : 'offline'}`} />
                      </div>
                    );
                  })}
                </div>
                <div className="form-help">
                  이 프리셋을 실행할 그룹을 선택하세요. 여러 그룹을 선택할 수 있습니다.
                </div>
              </div>
            </div>

            {/* 클라이언트별 명령어 설정 섹션 */}
            {selectedClients.length > 0 && (
              <div className="form-section">
                <div className="form-section-title">
                  <span className="form-section-icon">3</span>
                  클라이언트별 실행 명령어 설정
                  <span className="badge">{commandClientCount}개 클라이언트</span>
                </div>

                {selectedClients.map(clientId => {
                  const client = clients.find(c => c.id === clientId);
                  if (!client) return null;

                  return (
                    <div key={clientId} className="client-command-container">
                      <div className="client-command-header">
                        <div className="client-command-info">
                          <div className="client-command-name">{client.name}</div>
                          <div className="client-command-ip">
                            {client.ip} ({client.node})
                          </div>
                        </div>
                        <div className={`client-status ${client.status === 'offline' ? 'offline' : 'online'}`} />
                      </div>
                      <div className="command-input-group">
                        <textarea
                          className="command-textarea"
                          value={formData.commands[clientId] || ''}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            commands: {
                              ...prev.commands,
                              [clientId]: e.target.value
                            }
                          }))}
                          placeholder="실행할 전체 명령어를 입력하세요"
                        />
                        <div className="command-templates">
                          {Object.keys(commandTemplates).map(templateName => (
                            <button
                              key={templateName}
                              type="button"
                              className="template-btn"
                              onClick={() => applyTemplate(templateName, clientId)}
                            >
                              {templateName}
                            </button>
                          ))}
                        </div>
                        <div className="form-help">
                          이 디스플레이 서버에서 실행할 언리얼엔진 명령어를 입력하세요.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <div className="form-help">* 표시는 필수 입력 항목입니다</div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="btn btn-primary">
                💾 프리셋 저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresetModal; 