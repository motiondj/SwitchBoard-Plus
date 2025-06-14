import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Toast from './Toast';
import LoadingOverlay from './LoadingOverlay';
import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children }) => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Container 
            component="main" 
            maxWidth="xl" 
            sx={{ 
              flexGrow: 1, 
              py: 3,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {children}
          </Container>
        </Box>
        <Toast />
        <LoadingOverlay />
      </Box>
    </ErrorBoundary>
  );
};

export default Layout; 