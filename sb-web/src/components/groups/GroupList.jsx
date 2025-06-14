import React from 'react';
import { Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import GroupCard from './GroupCard';

const GroupList = () => {
  const groups = useSelector((state) => state.groups.items) || [];

  return (
    <Box>
      <Grid container spacing={2}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <GroupCard group={group} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GroupList; 