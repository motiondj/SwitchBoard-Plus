import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Stop, Refresh } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { executeCommand, stopClients } from '../../store/slices/clientsSlice';

const ClientCard = ({ client }) => {
  const dispatch = useDispatch();

  const getIcon = (status) => {
    switch (status) {
      case 'connected':
        return '🟢';
      case 'disconnected':
        return '🔴';
      case 'connecting':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'connected':
        return '#e8f5e9';
      case 'disconnected':
        return '#ffebee';
      case 'connecting':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  const handleExecute = () => {
    dispatch(executeCommand({ clientIds: [client.id], commands: ['start'] }));
  };

  const handleStop = () => {
    dispatch(stopClients([client.id]));
  };

  const handleRestart = () => {
    dispatch(stopClients([client.id]));
    setTimeout(() => {
      dispatch(executeCommand({ clientIds: [client.id], commands: ['start'] }));
    }, 1000);
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        backgroundColor: getBackgroundColor(client.status),
        transition: 'background-color 0.3s ease'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="div">
              {getIcon(client.status)}
            </Typography>
            <Box>
              <Typography variant="subtitle1" component="div">
                {client.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {client.uuid}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title="실행">
              <IconButton onClick={handleExecute} disabled={client.status !== 'connected'}>
                <PlayArrow />
              </IconButton>
            </Tooltip>
            <Tooltip title="중지">
              <IconButton onClick={handleStop} disabled={client.status !== 'connected'}>
                <Stop />
              </IconButton>
            </Tooltip>
            <Tooltip title="재시작">
              <IconButton onClick={handleRestart} disabled={client.status !== 'connected'}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {client.metrics && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              CPU: {client.metrics.cpu}% | RAM: {client.metrics.memory}MB
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCard; 