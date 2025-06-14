import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import GroupList from './GroupList';

const GroupSection = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        그룹
      </Typography>
      <Box sx={{ mt: 2 }}>
        <GroupList />
      </Box>
    </Paper>
  );
};

export default GroupSection; 