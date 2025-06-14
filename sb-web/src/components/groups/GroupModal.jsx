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
  Autocomplete,
  Chip
} from '@mui/material';
import { createGroup, updateGroup } from '../../store/slices/groupsSlice';
import { closeGroupModal } from '../../store/slices/uiSlice';

const GroupModal = () => {
  const dispatch = useDispatch();
  const { open, groupId } = useSelector((state) => state.ui.groupModal);
  const groups = useSelector((state) => state.groups.items);
  const clients = useSelector((state) => state.clients.items);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientIds: []
  });

  useEffect(() => {
    if (groupId) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setFormData({
          name: group.name,
          description: group.description || '',
          clientIds: group.clients.map(c => c.id)
        });
      }
    } else {
      setFormData({
        name: '',
        description: '',
        clientIds: []
      });
    }
  }, [groupId, groups]);

  const handleClose = () => {
    dispatch(closeGroupModal());
  };

  const handleSubmit = () => {
    if (groupId) {
      dispatch(updateGroup({ id: groupId, ...formData }));
    } else {
      dispatch(createGroup(formData));
    }
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {groupId ? '그룹 편집' : '새 그룹'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="그룹 이름"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
          />

          <TextField
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />

          <Autocomplete
            multiple
            options={clients}
            getOptionLabel={(option) => option.name}
            value={clients.filter(client => formData.clientIds.includes(client.id))}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                clientIds: newValue.map(client => client.id)
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="클라이언트"
                placeholder="클라이언트 선택"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  color={option.status === 'online' ? 'success' : 'default'}
                />
              ))
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || formData.clientIds.length === 0}
        >
          {groupId ? '저장' : '생성'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupModal; 