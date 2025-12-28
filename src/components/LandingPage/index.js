import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fade,
  Slide,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Psychology,
  Spa,
  TrendingUp,
  ArrowForward,
  Star,
  AccessTime,
  Security,
  Groups
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Clear any existing user data for demo purposes
    localStorage.removeItem('currentUser');
    
    // Check if user is already logged in (shouldn't happen after clearing)
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/home');
    }
  }, [navigate]);

  const features = [
    {
      icon: <Psychology />,
      title: "AI Wellness Counselor",
      description: "24/7 AI-powered mental health support",
      color: "#667eea"
    },
    {
      icon: <Spa />,
      title: "Enhanced Meditation",
      description: "6 guided sessions with custom timer",
      color: "#48dbfb"
    },
    {
      icon: <TrendingUp />,
      title: "Mood Tracking",
      description: "Track your emotional wellness journey",
      color: "#feca57"
    },
    {
      icon: <Groups />,
      title: "Support Community",
      description: "Connect with others on similar journeys",
      color: "#ff9ff3"
    }
  ];

  const stats = [
    { icon: <Star />, label: "4.9/5 Rating", value: "Excellent" },
    { icon: <AccessTime />, label: "24/7 Support", value: "Always Available" },
    { icon: <Security />, label: "Private & Secure", value: "Your Data Safe" }
  ];

  if (showAuth) {
    navigate('/join');
    return null;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                color: 'white',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              MindfulMe
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Your Complete Mental Wellness Companion
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 6,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Experience AI-powered therapy, guided meditation, mood tracking, and personalized wellness plans - all in one beautiful app.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowAuth(true)}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Get Started Free
                <ArrowForward sx={{ ml: 1 }} />
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.8)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  py: 3
                }}>
                  <CardContent>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      mx: 'auto', 
                      mb: 2,
                      width: 56,
                      height: 56
                    }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              color: 'white',
              mb: 6,
              fontWeight: 600
            }}
          >
            Everything You Need for Mental Wellness
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card sx={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Avatar sx={{ 
                        bgcolor: feature.color, 
                        mb: 2,
                        width: 48,
                        height: 48
                      }}>
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LandingPage;
