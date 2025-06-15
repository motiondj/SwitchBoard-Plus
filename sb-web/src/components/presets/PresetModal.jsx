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
import { createPreset, updatePreset, fetchPresets } from '../../store/slices/presetsSlice';
import { closePresetModal } from '../../store/slices/uiSlice';

const PresetModal = ({ isOpen, onClose, preset }) => {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups.items) || [];
  const clients = useSelector(state => state.clients.items) || [];

  const initialFormData = {
    name: '',
    description: '',
    selectedGroups: [],
    commands: {}
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedGroupCount, setSelectedGroupCount] = useState(0);
  const [commandClientCount, setCommandClientCount] = useState(0);
  const [error, setError] = useState('');

  // 모달이 열릴 때마다 폼 초기화 (편집 모드 지원)
  useEffect(() => {
    if (isOpen) {
      if (preset) {
        setFormData({
          name: preset.name || '',
          description: preset.description || '',
          selectedGroups: Array.isArray(preset.selectedGroups) ? preset.selectedGroups : [],
          commands: (preset.commands || preset.PresetCommands || []).reduce((acc, cmd) => {
            acc[cmd.clientId || (cmd.Client && cmd.Client.id)] = cmd.command;
            return acc;
          }, {})
        });
      } else {
        setFormData(initialFormData);
      }
      setError('');
    }
  }, [isOpen, preset]);

  // 선택된 그룹의 클라이언트들 수집
  const selectedClients = React.useMemo(() => {
    const clientIds = new Set();
    formData.selectedGroups.forEach(groupId => {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;
      
      // group.clients가 배열인 경우
      if (Array.isArray(group.clients)) {
        group.clients.forEach(clientId => {
          if (typeof clientId === 'object' && clientId.id) {
            clientIds.add(clientId.id);
          } else {
            clientIds.add(clientId);
          }
        });
      }
      
      // group.Clients가 배열인 경우
      if (Array.isArray(group.Clients)) {
        group.Clients.forEach(client => {
          if (client && client.id) {
            clientIds.add(client.id);
          }
        });
      }
    });
    
    const result = Array.from(clientIds);
    console.log('selectedClients 계산 결과:', result);
    return result;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('프리셋 이름을 입력해주세요.');
      return;
    }

    if (formData.selectedGroups.length === 0) {
      setError('최소 하나 이상의 그룹을 선택해주세요.');
      return;
    }

    try {
      // 선택된 클라이언트들의 실제 정보 가져오기
      const selectedClientDetails = clients.filter(client => 
        selectedClients.includes(client.id)
      );

      if (selectedClientDetails.length === 0) {
        setError('선택된 클라이언트가 없습니다.');
        return;
      }

      // 각 클라이언트별로 명령어 매핑
      const commands = selectedClientDetails.map(client => ({
        clientId: client.id,
        command: formData.commands[client.id] || '', // 각 클라이언트별 명령어
        clientName: client.name // 클라이언트 이름 추가
      }));

      // 빈 명령어가 있는지 확인
      const emptyCommands = commands.filter(cmd => !cmd.command.trim());
      if (emptyCommands.length > 0) {
        setError(`${emptyCommands.map(cmd => cmd.clientName).join(', ')}의 명령어가 비어있습니다.`);
        return;
      }

      const presetData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        commands: commands,
        selectedGroups: formData.selectedGroups,
        timestamp: new Date().toISOString()
      };

      console.log('프리셋 생성 데이터:', presetData);
      
      // Redux action 사용
      if (preset) {
        // 편집 모드: updatePreset 호출 (id, data 형태로 전달)
        await dispatch(updatePreset({ id: preset.id, data: presetData })).unwrap();
      } else {
        // 새로 만들기: createPreset 호출
        await dispatch(createPreset(presetData)).unwrap();
      }
      // 성공 시 모달 닫기
      onClose();
      // 프리셋 목록 새로고침
      dispatch(fetchPresets());
      
    } catch (error) {
      console.error('프리셋 생성 중 오류:', error);
      setError(error.message || '프리셋 생성에 실패했습니다.');
    }
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
                    const clientIds = Array.isArray(group.clients) && group.clients.length > 0
                      ? group.clients.map(c => (typeof c === 'object' ? c.id : c))
                      : (Array.isArray(group.Clients) ? group.Clients.map(c => c.id) : []);
                    const totalClients = clientIds.length;

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
                          <div className="client-name">그룹 : {group.name}</div>
                          <div className="client-ip">디스플레이 서버 : {totalClients}개</div>
                        </div>
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

                <div className="client-command-list">
                  {selectedClients.map(clientId => {
                    const client = clients.find(c => c.id === clientId);
                    if (!client) return null;

                    return (
                      <div key={clientId} className="client-command-container">
                        <div className="client-command-header">
                          <div className="client-command-info">
                            <div className="client-name">{client.ip}</div>
                          </div>
                          <div className={`client-status ${client.status === 'offline' ? 'offline' : 'online'}`}/>
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
                          <div className="form-help">
                            이 디스플레이 서버에서 실행할 언리얼엔진 명령어를 입력하세요.
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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