import React from 'react';
import { Box } from '@mui/material';
import Header from '../common/Header';
import Toast from '../common/Toast';
import LoadingOverlay from '../common/LoadingOverlay';
import { ErrorBoundaryWrapper } from '../common/ErrorBoundary';

const Layout = ({ children }) => {
  return (
    <ErrorBoundaryWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            py: 3,
            px: 3,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Box>
        <Toast />
        <LoadingOverlay />
      </Box>
    </ErrorBoundaryWrapper>
  );
};

export default Layout; 