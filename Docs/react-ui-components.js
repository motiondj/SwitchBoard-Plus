// src/components/presets/PresetCard.jsx
import React from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  Paper
} from '@mui/material'
import { 
  PlayArrow, 
  Stop, 
  Edit,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { executePreset, stopPreset } from '../../store/slices/presetsSlice'

const PresetCard = ({ preset }) => {
  const dispatch = useDispatch()
  const clients = useSelector(state => state.clients.items)

  const getClientNames = () => {
    return preset.commands
      ?.map(cmd => clients.find(c => c.id === cmd.clientId)?.name)
      ?.filter(Boolean)
      ?.join(', ') || ''
  }

  const handleExecute = () => {
    dispatch(executePreset(preset.id))
  }

  const handleStop = () => {
    dispatch(stopPreset(preset.id))
  }

  const handleEdit = () => {
    // TODO: 편집 모달 열기
    console.log('Edit preset:', preset.id)
  }

  return (
    <Paper 
      sx={{ 
        p: 2, 
        border: preset.active ? '2px solid #667eea' : '2px solid #e0e0e0',
        backgroundColor: preset.active ? '#f0f4ff' : 'white',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        '&:hover': {
          borderColor: '#667eea',
          backgroundColor: preset.active ? '#f0f4ff' : '#f8f9ff',
        }
      }}
    >
      <Box sx={{ flex: 1, pr: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {preset.name}
          </Typography>
          {preset.active && (
            <Chip 
              label="● 활성" 
              size="small"
              sx={{ 
                color: '#4CAF50',
                backgroundColor: 'transparent',
                fontSize: '12px',
                height: '20px'
              }}
            />
          )}
        </Box>
        
        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
          디스플레이 서버: {getClientNames()}
        </Typography>
        
        <Typography variant="caption" sx={{ color: '#888' }}>
          명령어 {preset.commands?.length || 0}개 설정됨
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {preset.active ? (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Stop />}
            onClick={handleStop}
            sx={{ fontSize: '13px', minWidth: '80px' }}
          >
            중지
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PlayArrow />}
            onClick={handleExecute}
            sx={{ fontSize: '13px', minWidth: '80px' }}
          >
            실행
          </Button>
        )}
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          onClick={handleEdit}
          sx={{ fontSize: '13px', minWidth: '80px' }}
        >
          편집
        </Button>
      </Box>
    </Paper>
  )
}

export default PresetCard

// src/components/presets/PresetModal.jsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../store/slices/uiSlice'
import { createPreset } from '../../store/slices/presetsSlice'

const PresetModal = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(state => state.ui.modals.presetModal)
  const groups = useSelector(state => state.groups.items)
  const clients = useSelector(state => state.clients.items)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedGroups: [],
    commands: {}
  })

  const [selectedClients, setSelectedClients] = useState([])

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 폼 초기화
      setFormData({
        name: '',
        description: '',
        selectedGroups: [],
        commands: {}
      })
      setSelectedClients([])
    }
  }, [isOpen])

  useEffect(() => {
    // 선택된 그룹에서 클라이언트 목록 추출
    const clientIds = [...new Set(
      formData.selectedGroups.flatMap(groupId => {
        const group = groups.find(g => g.id === groupId)
        return group ? group.clients : []
      })
    )]
    setSelectedClients(clientIds)
  }, [formData.selectedGroups, groups])

  const handleClose = () => {
    dispatch(closeModal('presetModal'))
  }

  const handleGroupToggle = (groupId) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }))
  }

  const handleCommandChange = (clientId, command) => {
    setFormData(prev => ({
      ...prev,
      commands: {
        ...prev.commands,
        [clientId]: command
      }
    }))
  }

  const handleSave = () => {
    const commands = selectedClients.map(clientId => ({
      clientId,
      command: formData.commands[clientId] || ''
    })).filter(cmd => cmd.command.trim())

    const presetData = {
      name: formData.name,
      description: formData.description,
      commands
    }

    dispatch(createPreset(presetData))
    handleClose()
  }

  const isValid = formData.name && formData.selectedGroups.length > 0 && 
    selectedClients.every(clientId => formData.commands[clientId]?.trim())

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        새 프리셋 만들기
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* 기본 정보 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 24, height: 24, borderRadius: '50%', 
              backgroundColor: '#667eea', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px'
            }}>
              1
            </Box>
            기본 정보
          </Typography>
          
          <TextField
            fullWidth
            label="프리셋 이름 *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
            placeholder="예: 전시회 모드"
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="이 프리셋이 언제 사용되는지, 어떤 설정인지 설명을 입력하세요"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 그룹 선택 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 24, height: 24, borderRadius: '50%', 
              backgroundColor: '#667eea', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px'
            }}>
              2
            </Box>
            실행할 그룹 선택
            <Typography variant="caption" sx={{ 
              backgroundColor: '#667eea', color: 'white',
              px: 1, py: 0.5, borderRadius: 2, fontSize: '12px'
            }}>
              {formData.selectedGroups.length}개 선택됨
            </Typography>
          </Typography>

          <Grid container spacing={1}>
            {groups.map(group => {
              const onlineClients = group.clients.filter(clientId => {
                const client = clients.find(c => c.id === clientId)
                return client && client.status !== 'offline'
              }).length

              return (
                <Grid item xs={12} sm={6} key={group.id}>
                  <Paper 
                    sx={{ 
                      p: 1.5, 
                      cursor: 'pointer',
                      border: formData.selectedGroups.includes(group.id) 
                        ? '2px solid #667eea' : '2px solid #e0e0e0',
                      backgroundColor: formData.selectedGroups.includes(group.id) 
                        ? '#f0f4ff' : 'white',
                      '&:hover': {
                        borderColor: '#667eea',
                        backgroundColor: '#f8f9ff'
                      }
                    }}
                    onClick={() => handleGroupToggle(group.id)}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.selectedGroups.includes(group.id)}
                          onChange={() => handleGroupToggle(group.id)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2">{group.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {group.clients.length}개 디스플레이 서버 ({onlineClients}개 온라인)
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* 클라이언트별 명령어 설정 */}
        {selectedClients.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  backgroundColor: '#667eea', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  3
                </Box>
                클라이언트별 실행 명령어 설정
                <Typography variant="caption" sx={{ 
                  backgroundColor: '#667eea', color: 'white',
                  px: 1, py: 0.5, borderRadius: 2, fontSize: '12px'
                }}>
                  {selectedClients.length}개 클라이언트
                </Typography>
              </Typography>

              {selectedClients.map(clientId => {
                const client = clients.find(c => c.id === clientId)
                if (!client) return null

                return (
                  <Paper key={clientId} sx={{ p: 2, mb: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1.5,
                      pb: 1,
                      borderBottom: '1px solid #e0e0e0'
                    }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {client.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {client.ip} ({client.node})
                        </Typography>
                      </Box>
                      <Box sx={{
                        width: 8, height: 8, borderRadius: '50%',
                        backgroundColor: client.status === 'offline' ? '#f44336' : '#4CAF50'
                      }} />
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="실행할 전체 명령어를 입력하세요"
                      value={formData.commands[clientId] || ''}
                      onChange={(e) => handleCommandChange(clientId, e.target.value)}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: '14px'
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic', mt: 0.5, display: 'block' }}>
                      이 디스플레이 서버에서 실행할 언리얼엔진 명령어를 입력하세요.
                    </Typography>
                  </Paper>
                )
              })}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="caption" sx={{ color: '#666', flex: 1 }}>
          * 표시는 필수 입력 항목입니다
        </Typography>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!isValid}
        >
          💾 프리셋 저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PresetModal

// src/components/groups/GroupSection.jsx
import React from 'react'
import { Paper, Typography, Button, Box } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { openModal } from '../../store/slices/uiSlice'
import GroupList from './GroupList'
import GroupModal from './GroupModal'

const GroupSection = () => {
  const dispatch = useDispatch()

  const handleAddGroup = () => {
    dispatch(openModal('groupModal'))
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          디스플레이 서버 그룹
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleAddGroup}
          sx={{ fontSize: '13px' }}
        >
          새 그룹
        </Button>
      </Box>
      
      <GroupList />
      <GroupModal />
    </Paper>
  )
}

export default GroupSection

// src/components/groups/GroupList.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import GroupCard from './GroupCard'

const GroupList = () => {
  const groups = useSelector(state => state.groups.items)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {groups.map(group => (
        <GroupCard key={group.id} group={group} />
      ))}
    </Box>
  )
}

export default GroupList

// src/components/groups/GroupCard.jsx
import React from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  Paper
} from '@mui/material'
import { Edit } from '@mui/icons-material'
import { useSelector } from 'react-redux'

const GroupCard = ({ group }) => {
  const clients = useSelector(state => state.clients.items)

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return { bg: '#cce5ff', color: '#004085' }
      case 'online': return { bg: '#d4edda', color: '#155724' }
      case 'offline': return { bg: '#f8d7da', color: '#721c24' }
      default: return { bg: '#e9ecef', color: '#495057' }
    }
  }

  const handleEdit = () => {
    console.log('Edit group:', group.id)
  }

  return (
    <Paper 
      sx={{ 
        p: 2, 
        border: '2px solid #e0e0e0',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        '&:hover': {
          borderColor: '#764ba2',
          backgroundColor: '#faf8ff',
        }
      }}
    >
      <Box sx={{ flex: 1, pr: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {group.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            {group.clients.length}개 디스플레이 서버
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {group.clients.map(clientId => {
            const client = clients.find(c => c.id === clientId)
            if (!client) return null
            
            const statusStyle = getStatusColor(client.status)
            
            return (
              <Chip
                key={clientId}
                label={client.name}
                size="small"
                sx={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  fontSize: '12px',
                  height: '24px'
                }}
              />
            )
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          onClick={handleEdit}
          sx={{ fontSize: '13px', minWidth: '70px' }}
        >
          편집
        </Button>
      </Box>
    </Paper>
  )
}

export default GroupCard

// src/components/groups/GroupModal.jsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../store/slices/uiSlice'
import { createGroup } from '../../store/slices/groupsSlice'

const GroupModal = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(state => state.ui.modals.groupModal)
  const clients = useSelector(state => state.clients.items)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    selectedClients: []
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        color: 'blue',
        selectedClients: []
      })
    }
  }, [isOpen])

  const handleClose = () => {
    dispatch(closeModal('groupModal'))
  }

  const handleClientToggle = (clientId) => {
    setFormData(prev => ({
      ...prev,
      selectedClients: prev.selectedClients.includes(clientId)
        ? prev.selectedClients.filter(id => id !== clientId)
        : [...prev.selectedClients, clientId]
    }))
  }

  const handleSave = () => {
    const groupData = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      clients: formData.selectedClients
    }

    dispatch(createGroup(groupData))
    handleClose()
  }

  const isValid = formData.name && formData.selectedClients.length > 0

  const colorOptions = [
    { value: 'blue', label: '🔵 파란색' },
    { value: 'green', label: '🟢 초록색' },
    { value: 'red', label: '🔴 빨간색' },
    { value: 'yellow', label: '🟡 노란색' },
    { value: 'purple', label: '🟣 보라색' },
    { value: 'gray', label: '⚫ 회색' }
  ]

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        새 그룹 만들기
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* 기본 정보 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 24, height: 24, borderRadius: '50%', 
              backgroundColor: '#667eea', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px'
            }}>
              1
            </Box>
            그룹 정보
          </Typography>
          
          <TextField
            fullWidth
            label="그룹 이름 *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
            placeholder="예: 1층 전시장"
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="이 그룹에 대한 설명을 입력하세요"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth>
            <InputLabel>그룹 색상</InputLabel>
            <Select
              value={formData.color}
              label="그룹 색상"
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            >
              {colorOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 멤버 선택 */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 24, height: 24, borderRadius: '50%', 
              backgroundColor: '#667eea', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px'
            }}>
              2
            </Box>
            그룹 멤버 선택
            <Typography variant="caption" sx={{ 
              backgroundColor: '#667eea', color: 'white',
              px: 1, py: 0.5, borderRadius: 2, fontSize: '12px'
            }}>
              {formData.selectedClients.length}개 선택됨
            </Typography>
          </Typography>

          <Grid container spacing={1}>
            {clients.map(client => (
              <Grid item xs={12} sm={6} key={client.id}>
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    cursor: 'pointer',
                    border: formData.selectedClients.includes(client.id) 
                      ? '2px solid #667eea' : '2px solid #e0e0e0',
                    backgroundColor: formData.selectedClients.includes(client.id) 
                      ? '#f0f4ff' : 'white',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: '#f8f9ff'
                    }
                  }}
                  onClick={() => handleClientToggle(client.id)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.selectedClients.includes(client.id)}
                        onChange={() => handleClientToggle(client.id)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>
                          <Typography variant="subtitle2">{client.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {client.ip}
                          </Typography>
                        </Box>
                        <Box sx={{
                          width: 8, height: 8, borderRadius: '50%',
                          backgroundColor: client.status === 'offline' ? '#f44336' : '#4CAF50'
                        }} />
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="caption" sx={{ color: '#666', flex: 1 }}>
          * 표시는 필수 입력 항목입니다
        </Typography>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!isValid}
        >
          💾 그룹 저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GroupModal

// src/components/clients/ClientMonitor.jsx
import React from 'react'
import { Paper, Typography, Button, Box, Grid } from '@mui/material'
import { Refresh } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClients } from '../../store/slices/clientsSlice'
import ClientCard from './ClientCard'

const ClientMonitor = () => {
  const dispatch = useDispatch()
  const clients = useSelector(state => state.clients.items)

  const handleRefresh = () => {
    dispatch(fetchClients())
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          디스플레이 서버 모니터링
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          sx={{ fontSize: '13px' }}
        >
          새로고침
        </Button>
      </Box>
      
      <Grid container spacing={1}>
        {clients.map(client => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={client.id}>
            <ClientCard client={client} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default ClientMonitor

// src/components/clients/ClientCard.jsx
import React from 'react'
import { Paper, Typography, Box } from '@mui/material'

const ClientCard = ({ client }) => {
  const getIcon = (status) => {
    switch (status) {
      case 'running': return '🟢'
      case 'online': return '🟡'
      case 'offline': return '🔴'
      default: return '🖥️'
    }
  }

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'running': return '#e3f2fd'
      case 'online': return '#e8f5e9'
      case 'offline': return '#ffebee'
      default: return '#f8f9fa'
    }
  }

  return (
    <Paper 
      sx={{ 
        p: 1.5,
        textAlign: 'center',
        backgroundColor: getBackgroundColor(client.status),
        opacity: client.status === 'offline' ? 0.7 : 1,
        position: 'relative',
        borderRadius: 1,
        transition: 'all 0.3s ease'
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontSize: '16px' }}>
        {getIcon(client.status)}
      </Typography>
      
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: 600, 
          fontSize: '13px', 
          mb: 0.5 
        }}
      >
        {client.name}
      </Typography>
      
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#666', 
          fontSize: '10px',
          display: 'block'
        }}
      >
        {client.ip}
      </Typography>

      {client.status === 'running' && (
        <Box sx={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 6,
          height: 6,
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.5, transform: 'scale(1.2)' },
            '100%': { opacity: 1, transform: 'scale(1)' }
          }
        }} />
      )}
    </Paper>
  )
}

export default ClientCard

// src/hooks/useSocket.js
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket, disconnectSocket } from '../store/middleware/socketMiddleware'

export const useSocket = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(connectSocket())

    return () => {
      dispatch(disconnectSocket())
    }
  }, [dispatch])
}

// src/utils/constants.js
export const API_ENDPOINTS = {
  CLIENTS: '/clients',
  PRESETS: '/presets',
  GROUPS: '/groups',
  EXECUTE: '/execute',
  STOP: '/stop',
  RESTART: '/restart',
}

export const SOCKET_EVENTS = {
  CLIENT_STATUS: 'client:status',
  CLIENT_METRICS: 'client:metrics',
  CLIENT_REGISTERED: 'client:registered',
  PRESET_STATUS: 'preset:status',
  EXECUTION_RESULT: 'execution:result',
}

export const CLIENT_STATUS = {
  ONLINE: 'online',
  RUNNING: 'running',
  OFFLINE: 'offline',
}

export const PRESET_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

// README.md
# Switchboard Plus - Web UI

## 개요
Switchboard Plus의 React 기반 웹 사용자 인터페이스입니다. 언리얼엔진 nDisplay 클러스터를 원격으로 제어하고 모니터링할 수 있는 현대적인 웹 애플리케이션입니다.

## 주요 기능
- 🎮 **프리셋 시스템**: 사전 정의된 설정으로 빠른 실행
- 👥 **그룹 관리**: 디스플레이 서버를 논리적으로 그룹화
- 📊 **실시간 모니터링**: 디스플레이 서버 상태 및 메트릭 실시간 확인
- 🔄 **WebSocket 통신**: 실시간 양방향 통신
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 기술 스택
- **Framework**: React 18
- **상태 관리**: Redux Toolkit
- **UI 라이브러리**: Material-UI
- **빌드 도구**: Vite
- **실시간 통신**: Socket.io
- **HTTP 클라이언트**: Axios

## 프로젝트 구조
```
src/
├── components/           # React 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   ├── dashboard/       # 대시보드 컴포넌트
│   ├── presets/         # 프리셋 관련 컴포넌트
│   ├── groups/          # 그룹 관련 컴포넌트
│   └── clients/         # 클라이언트 모니터링 컴포넌트
│
├── store/               # Redux 스토어
│   ├── slices/          # Redux 슬라이스
│   └── middleware/      # 미들웨어 (Socket 등)
│
├── services/            # API 서비스
│   ├── api.js           # Axios 기본 설정
│   ├── clientAPI.js     # 클라이언트 API
│   ├── presetAPI.js     # 프리셋 API
│   └── groupAPI.js      # 그룹 API
│
├── hooks/               # 커스텀 훅
└── utils/               # 유틸리티 함수
```

## 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

### 개발 서버 실행
```bash
npm run dev
```
개발 서버가 http://localhost:5173 에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```

## 환경 변수
```env
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=ws://localhost:8000
```

## API 연동
백엔드 서버가 `http://localhost:8000`에서 실행되어야 합니다. 
다음 엔드포인트들과 연동됩니다:

- `GET /api/clients` - 클라이언트 목록
- `GET /api/presets` - 프리셋 목록  
- `GET /api/groups` - 그룹 목록
- `POST /api/presets` - 프리셋 생성
- `POST /api/presets/:id/execute` - 프리셋 실행

## 컴포넌트 가이드

### 프리셋 시스템
- `PresetCard`: 개별 프리셋 표시 및 제어
- `PresetModal`: 새 프리셋 생성/편집
- `PresetList`: 프리셋 목록 렌더링

### 그룹 관리
- `GroupCard`: 개별 그룹 표시
- `GroupModal`: 새 그룹 생성/편집
- `GroupList`: 그룹 목록 렌더링

### 클라이언트 모니터링
- `ClientCard`: 개별 클라이언트 상태 표시
- `ClientMonitor`: 전체 클라이언트 모니터링 대시보드

## 상태 관리
Redux Toolkit을 사용하여 전역 상태를 관리합니다:

- `clientsSlice`: 디스플레이 서버 상태
- `presetsSlice`: 프리셋 관리
- `groupsSlice`: 그룹 관리
- `uiSlice`: UI 상태 (모달, 토스트 등)

## 실시간 통신
Socket.io를 통한 실시간 이벤트:

- `client:status`: 클라이언트 상태 변경
- `client:metrics`: 클라이언트 메트릭 업데이트
- `preset:status`: 프리셋 상태 변경
- `execution:result`: 명령 실행 결과

## 개발 가이드

### 새 컴포넌트 추가
1. `components/` 폴더에 적절한 위치에 컴포넌트 생성
2. Material-UI 컴포넌트와 스타일링 사용
3. Redux hooks를 통한 상태 관리
4. PropTypes 또는 TypeScript로 타입 정의

### API 서비스 추가
1. `services/` 폴더에 API 서비스 파일 생성
2. 기본 api 인스턴스 사용
3. 에러 처리 및 응답 변환 구현

### Redux 슬라이스 추가
1. `store/slices/` 폴더에 슬라이스 생성
2. 비동기 액션은 `createAsyncThunk` 사용
3. 스토어 index.js에 리듀서 등록

## 배포
Vite로 빌드된 정적 파일을 웹 서버에 배포합니다.

```bash
npm run build
# dist/ 폴더를 웹 서버에 배포
```

## 라이센스
이 프로젝트는 Switchboard Plus 프로젝트의 일부입니다.// src/components/common/Header.jsx
import React from 'react'
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material'
import { useSelector } from 'react-redux'

const Header = () => {
  const clients = useSelector(state => state.clients.items)
  const onlineClients = clients.filter(c => c.status !== 'offline').length

  const currentTime = new Date().toLocaleTimeString('ko-KR')

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ⚡ Switchboard Plus
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">서버 상태:</Typography>
            <Chip 
              label="연결됨" 
              size="small" 
              sx={{ 
                backgroundColor: '#4CAF50', 
                color: 'white',
                fontSize: '12px'
              }}
            />
          </Box>
          <Typography variant="body2">
            시간: {currentTime}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header

// src/components/common/Toast.jsx
import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { hideToast } from '../../store/slices/uiSlice'

const Toast = () => {
  const dispatch = useDispatch()
  const { open, message, severity } = useSelector(state => state.ui.toast)

  const handleClose = () => {
    dispatch(hideToast())
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast

// src/components/dashboard/Dashboard.jsx
import React from 'react'
import { Grid, Box } from '@mui/material'
import StatsBar from './StatsBar'
import PresetSection from '../presets/PresetSection'
import GroupSection from '../groups/GroupSection'
import ClientMonitor from '../clients/ClientMonitor'

const Dashboard = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <StatsBar />
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <PresetSection />
        </Grid>
        <Grid item xs={12} lg={6}>
          <GroupSection />
        </Grid>
      </Grid>
      
      <ClientMonitor />
    </Box>
  )
}

export default Dashboard

// src/components/dashboard/StatsBar.jsx
import React from 'react'
import { Paper, Grid, Typography, Box } from '@mui/material'
import { useSelector } from 'react-redux'

const StatItem = ({ value, label }) => (
  <Box sx={{ textAlign: 'center', py: 1 }}>
    <Typography 
      variant="h4" 
      sx={{ 
        fontWeight: 700, 
        color: '#667eea',
        fontSize: { xs: '24px', sm: '28px' }
      }}
    >
      {value}
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#666', 
        mt: 0.5,
        fontSize: '13px'
      }}
    >
      {label}
    </Typography>
  </Box>
)

const StatsBar = () => {
  const clients = useSelector(state => state.clients.items)
  const presets = useSelector(state => state.presets.items)
  const groups = useSelector(state => state.groups.items)

  const totalClients = clients.length
  const onlineClients = clients.filter(c => c.status !== 'offline').length
  const runningClients = clients.filter(c => c.status === 'running').length
  const activePresets = presets.filter(p => p.active).length

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={2.4}>
          <StatItem value={totalClients} label="전체 디스플레이 서버" />
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <StatItem value={onlineClients} label="온라인" />
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <StatItem value={runningClients} label="실행 중" />
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <StatItem value={activePresets} label="활성 프리셋" />
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <StatItem value={groups.length} label="그룹 수" />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default StatsBar

// src/components/presets/PresetSection.jsx
import React from 'react'
import { Paper, Typography, Button, Box } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { openModal } from '../../store/slices/uiSlice'
import PresetList from './PresetList'
import PresetModal from './PresetModal'

const PresetSection = () => {
  const dispatch = useDispatch()

  const handleAddPreset = () => {
    dispatch(openModal('presetModal'))
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          콘텐츠 프리셋
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleAddPreset}
          sx={{ fontSize: '13px' }}
        >
          새 프리셋
        </Button>
      </Box>
      
      <PresetList />
      <PresetModal />
    </Paper>
  )
}

export default PresetSection

// src/components/presets/PresetList.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import PresetCard from './PresetCard'

const PresetList = () => {
  const presets = useSelector(state => state.presets.items)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {presets.map(preset => (
        <PresetCard key={preset.id} preset={preset} />
      ))}
    </Box>
  )
}

export default PresetList

// src/components/presets/PresetCard.jsx
import React from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  Paper
} from '@mui/material'
import { 
  PlayArrow, 
  Stop, 
  Edit,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { executePreset, stopPreset } from '../../store/slices/presetsSl