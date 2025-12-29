import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Avatar, Chip, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Psychology, Spa, TrendingUp, Groups, Security, Star, Favorite, CloudUpload } from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/join');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <Psychology />,
      title: "AI Wellness Counselor",
      description: "24/7 AI-powered mental health support with personalized therapy sessions",
      color: "#667eea"
    },
    {
      icon: <Spa />,
      title: "Enhanced Meditation",
      description: "6 guided sessions with custom timer and calming soundscapes",
      color: "#48dbfb"
    },
    {
      icon: <TrendingUp />,
      title: "Advanced Mood Tracking",
      description: "AI-powered emotional wellness analysis with predictive insights",
      color: "#feca57"
    },
    {
      icon: <Groups />,
      title: "Support Community",
      description: "Connect with others on similar wellness journeys",
      color: "#ff9ff3"
    },
    {
      icon: <Favorite />,
      title: "CBT Tools",
      description: "Evidence-based cognitive behavioral therapy exercises",
      color: "#ee5a6f"
    },
    {
      icon: <CloudUpload />,
      title: "Creative Expression",
      description: "Art therapy and journaling for emotional release",
      color: "#00d2d3"
    }
  ];

  const stats = [
    { icon: <Security />, label: "Privacy First", value: "Your Data Stays Yours" }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#0F172A',
      color: '#E2E8F0',
      fontFamily: 'Inter, sans-serif',
      lineHeight: 1.6
    }}>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="lg" sx={{ 
        py: { xs: 4, md: 8 },
        px: { xs: 3, sm: 4, md: 6 },
        position: 'relative',
        zIndex: 1
      }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Column - Main Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  color: '#F8FAFC',
                  mb: 2,
                  fontSize: { xs: '2.8rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                MindfulMe
                <Box component="span" sx={{ 
                  display: 'block',
                  color: '#94A3B8',
                  fontWeight: 800
                }}>
                  Built for Octopus Hack 2025
                </Box>
              </Typography>
              
              <Typography
                variant="h2"
                sx={{
                  color: '#F8FAFC',
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  maxWidth: '800px'
                }}
              >
                Mental Wellness Platform
                <Box component="span" sx={{ 
                  display: 'block',
                  color: '#94A3B8',
                  fontWeight: 800
                }}>
                  Built for Octopus Hack 2025
                </Box>
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 4,
                  maxWidth: { xs: '100%', md: '600px' },
                  lineHeight: 1.8,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  fontWeight: 400
                }}
              >
                MindfulMe revolutionizes mental healthcare by combining evidence-based practices with a supportive community. Our platform offers personalized support, real-time mood tracking, and actionable insights to help you achieve optimal mental wellness—anytime, anywhere.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', md: 'flex-start' }, 
                alignItems: 'center',
                flexWrap: 'wrap',
                mt: 4
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    background: '#3B82F6',
                    color: '#fff',
                    px: 5,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#2563EB',
                    }
                  }}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSignIn}
                  sx={{
                    border: '1px solid #334155',
                    color: '#F8FAFC',
                    px: 5,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#CBD5E0',
                      background: '#1E293B',
                    }
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Features */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {[
                '🏆 Built for Octopus Hack 2025',
                '🤖 Advanced AI Integration',
                '💡 Innovative Mental Health Solution',
                '🚀 Rapid Deployment Ready',
                '🌍 Scalable Global Impact',
                '✨ User-Centric Design'
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      background: '#fff',
                      border: '1px solid #334155',
                      height: '100%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#475569',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ color: '#2D3748', mb: 1, fontWeight: 600 }}>
                        {feature}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Why Choose Us Section */}
          <Box sx={{
            mt: 8,
            mb: 6,
            p: { xs: 3, md: 6 },
            background: '#1E293B',
            borderRadius: 3,
            border: '1px solid #334155',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
          }}>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              mb: 3,
              color: '#F8FAFC',
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textAlign: 'center'
            }}
          >
            Why Choose MindfulMe
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 6, 
              color: '#E2E8F0',
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            A practical approach to mental wellness, built with care and attention to your needs.
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {[
              {
                title: '🏆 Hackathon Ready',
                desc: 'Built from the ground up for Octopus Hack 2025 with a clear focus on the judging criteria: innovation, technical implementation, and potential impact.'
              },
              {
                title: '🤖 AI That Cares',
                desc: 'Leveraging Cohere AI to provide personalized mental health support that adapts to each user\'s unique needs and preferences.'
              },
              {
                title: '🌍 Real Impact',
                desc: 'Addressing the global mental health crisis with an accessible, scalable solution that can help millions.'
              },
              {
                title: '🚀 Technical Excellence',
                desc: 'Built with React, Redux, and modern web technologies for a seamless, responsive experience across all devices.'
              },
              {
                title: '💡 Unique Approach',
                desc: 'Combining evidence-based therapy techniques with cutting-edge AI for a truly innovative mental health solution.'
              },
              {
                title: '✨ Production Ready',
                desc: 'Fully functional with user authentication, data persistence, and a beautiful, intuitive interface.'
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ 
                  p: 3, 
                  height: '100%',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#CBD5E0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }
                }}>
                  <Typography variant="h5" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ 
            mt: 10, 
            textAlign: 'center',
            p: 4,
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: 3,
            border: '1px solid #334155'
          }}>
            <Typography variant="h4" sx={{ color: '#F8FAFC', mb: 3, fontWeight: 600 }}>
              Built for Octopus Hack 2025
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#E2E8F0', 
              maxWidth: '800px', 
              mx: 'auto', 
              mb: 4,
              lineHeight: 1.7
            }}>
              Created for Octopus Hack 2025, MindfulMe showcases practical applications of technology in mental health care.
            </Typography>
            <Button 
              variant="outlined"
              size="large"
              href="https://octopushack.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: '#2D3748',
                color: '#F8FAFC',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#1A202C',
                  background: '#1E293B',
                }
              }}
            >
              View Hackathon Details
            </Button>
          </Box>
          <Box sx={{ 
            mt: 8, 
            p: 4, 
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 3,
            border: '1px solid #334155',
            textAlign: 'center'
          }}>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              background: 'rgba(59, 130, 246, 0.1)'
            }}>
              <Security sx={{ color: '#60A5FA' }} />
              <Typography variant="body1" sx={{ color: '#E2E8F0', fontWeight: 500 }}>
                Your privacy matters. We don't track or sell your data.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
