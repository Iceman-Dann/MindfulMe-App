import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestGoalSetting = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Goal Setting Test Component
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is a simple test to verify routing works.
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
};

export default TestGoalSetting;
