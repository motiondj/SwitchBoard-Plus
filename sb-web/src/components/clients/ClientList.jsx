import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ClientCard from './ClientCard';

const ClientList = () => {
  const clients = useSelector((state) => state.clients.items);

  if (!clients.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          연결된 클라이언트가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </Box>
  );
};

export default ClientList; 