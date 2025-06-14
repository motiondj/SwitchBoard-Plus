import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

const LoadingOverlay = () => {
  const loading = useSelector((state) => state.ui.loading);
  const loadingMessage = useSelector((state) => state.ui.loadingMessage);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }}
      open={loading}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="white">
          {loadingMessage || '로딩 중...'}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay; 