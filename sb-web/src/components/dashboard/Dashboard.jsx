import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import StatsBar from './StatsBar';
import PresetSection from '../presets/PresetSection';
import GroupSection from '../groups/GroupSection';
import ClientMonitor from '../clients/ClientMonitor';

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatsBar />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PresetSection />
            <GroupSection />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <ClientMonitor />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 