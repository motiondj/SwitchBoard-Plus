import React from 'react';
import Header from '../common/Header';
import Toast from '../common/Toast';
import LoadingOverlay from '../common/LoadingOverlay';
import { ErrorBoundaryWrapper } from '../common/ErrorBoundary';

const Layout = ({ children }) => {
  return (
    <ErrorBoundaryWrapper>
      <div className="container">
        <Header />
        {children}
        <Toast />
        <LoadingOverlay />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Layout; 