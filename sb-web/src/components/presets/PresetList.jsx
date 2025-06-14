import React from 'react';
import { Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import PresetCard from './PresetCard';

const PresetList = () => {
  const presets = useSelector((state) => state.presets.items) || [];

  return (
    <Box>
      <Grid container spacing={2}>
        {presets.map((preset) => (
          <Grid item xs={12} sm={6} md={4} key={preset.id}>
            <PresetCard preset={preset} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PresetList; 