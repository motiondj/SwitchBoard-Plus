import React from 'react';
import { Paper, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { fetchClients } from '../../store/slices/clientsSlice';
import ClientList from './ClientList';

const ClientMonitor = () => {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(fetchClients());
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          클라이언트 모니터링
        </Typography>
        <Tooltip title="새로고침">
          <IconButton onClick={handleRefresh} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <ClientList />
    </Paper>
  );
};

export default ClientMonitor; 