import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

const StatsBar = () => {
  const clients = useSelector((state) => state.clients.items) || [];
  const presets = useSelector((state) => state.presets.items) || [];
  const groups = useSelector((state) => state.groups.items) || [];

  const stats = [
    { label: '연결된 클라이언트', value: clients.filter(c => c.status === 'connected').length },
    { label: '프리셋', value: presets.length },
    { label: '그룹', value: groups.length }
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="primary">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default StatsBar; 