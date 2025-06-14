import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { executePreset, stopPreset } from '../../store/slices/presetsSlice';

const PresetCard = ({ preset }) => {
  const dispatch = useDispatch();

  const handleExecute = () => {
    dispatch(executePreset(preset.id));
  };

  const handleStop = () => {
    dispatch(stopPreset(preset.id));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {preset.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {preset.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            클라이언트: {preset.clients?.length || 0}개
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={handleExecute}
          disabled={preset.status === 'running'}
        >
          실행
        </Button>
        <Button
          size="small"
          color="error"
          onClick={handleStop}
          disabled={preset.status !== 'running'}
        >
          중지
        </Button>
      </CardActions>
    </Card>
  );
};

export default PresetCard; 