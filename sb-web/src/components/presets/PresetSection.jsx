import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PresetList from './PresetList';

const PresetSection = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        프리셋
      </Typography>
      <Box sx={{ mt: 2 }}>
        <PresetList />
      </Box>
    </Paper>
  );
};

export default PresetSection; 