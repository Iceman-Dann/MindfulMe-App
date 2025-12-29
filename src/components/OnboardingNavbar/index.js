import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton } from '@mui/material';
import { Psychology } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OnboardingNavbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar sx={{ minHeight: { xs: '60px', sm: '70px' } }}>
        {/* App Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: 'white',
              width: 40,
              height: 40,
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Psychology sx={{ color: '#667eea' }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: 'white',
                lineHeight: 1.2
              }}
            >
              MindfulMe Setup
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Complete your profile
            </Typography>
          </Box>
        </Box>

        {/* Progress indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              mr: 2
            }}
          >
            Almost there!
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default OnboardingNavbar;
