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

const PresetModal = () => {
  const dispatch = useDispatch();
  const { open, presetId } = useSelector((state) => state.ui.presetModal);
  const presets = useSelector((state) => state.presets.items);
  const clients = useSelector((state) => state.clients.items);
  const groups = useSelector((state) => state.groups.items);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    commands: []
  });

  useEffect(() => {
    if (presetId) {
      const preset = presets.find(p => p.id === presetId);
      if (preset) {
        setFormData({
          name: preset.name,
          description: preset.description,
          commands: preset.commands
        });
      }
    } else {
      setFormData({
        name: '',
        description: '',
        commands: []
      });
    }
  }, [presetId, presets]);

  const handleClose = () => {
    dispatch(closePresetModal());
  };

  const handleSubmit = () => {
    if (presetId) {
      dispatch(updatePreset({ id: presetId, ...formData }));
    } else {
      dispatch(createPreset(formData));
    }
    handleClose();
  };

  const handleAddCommand = () => {
    setFormData(prev => ({
      ...prev,
      commands: [...prev.commands, { client: '', command: '' }]
    }));
  };

  const handleRemoveCommand = (index) => {
    setFormData(prev => ({
      ...prev,
      commands: prev.commands.filter((_, i) => i !== index)
    }));
  };

  const handleCommandChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      commands: prev.commands.map((cmd, i) => 
        i === index ? { ...cmd, [field]: value } : cmd
      )
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {presetId ? '프리셋 편집' : '새 프리셋'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="프리셋 이름"
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

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">명령어</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddCommand}
                size="small"
              >
                명령어 추가
              </Button>
            </Box>

            {formData.commands.map((command, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Autocomplete
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  value={clients.find(c => c.name === command.client) || null}
                  onChange={(_, newValue) => handleCommandChange(index, 'client', newValue?.name || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="클라이언트"
                      size="small"
                      sx={{ flex: 1 }}
                    />
                  )}
                />
                <TextField
                  label="명령어"
                  value={command.command}
                  onChange={(e) => handleCommandChange(index, 'command', e.target.value)}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <IconButton
                  onClick={() => handleRemoveCommand(index)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || formData.commands.length === 0}
        >
          {presetId ? '저장' : '생성'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PresetModal; 