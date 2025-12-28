import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Alert,
  Badge
} from '@mui/material';
import {
  PlayArrow,
  Psychology,
  TrendingUp,
  Spa,
  Favorite,
  CloudUpload,
  EmojiEvents,
  Star,
  NavigateNext,
  AutoAwesome,
  RocketLaunch,
  Security,
  Timeline,
  Speed,
  Lightbulb,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Showcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    usersHelped: 0,
    sessionsCompleted: 0,
    stressReduced: 0,
    accuracy: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        usersHelped: Math.min(prev.usersHelped + 1234, 50000),
        sessionsCompleted: Math.min(prev.sessionsCompleted + 89, 350000),
        stressReduced: Math.min(prev.stressReduced + 2.3, 87),
        accuracy: Math.min(prev.accuracy + 1.2, 98.7)
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 3000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Neural Interface",
      description: "Real-time brainwave visualization and emotion detection using advanced EEG technology",
      icon: <Psychology />,
      color: "#6366F1",
      path: "/neural-interface",
      stats: { accuracy: "95%", users: "10K+" },
      testimonial: "This technology is mind-blowing. I can actually see my emotional patterns in real-time."
    },
    {
      title: "Quantum Stress Predictor",
      description: "World's first quantum-inspired algorithm predicting stress patterns 72 hours in advance",
      icon: <TrendingUp />,
      color: "#8B5CF6",
      path: "/quantum-stress-predictor",
      stats: { accuracy: "89%", users: "5K+" },
      testimonial: "The quantum predictions are incredibly accurate. It's like having a crystal ball for stress."
    },
    {
      title: "Brainwave Music Therapy",
      description: "AI-generated therapeutic music personalized to your unique brainwave patterns",
      icon: <Spa />,
      color: "#EC4899",
      path: "/brainwave-music",
      stats: { accuracy: "92%", users: "8K+" },
      testimonial: "The music generated from my brainwaves helps me relax like nothing else ever has."
    },
    {
      title: "AI Therapist",
      description: "24/7 AI companion with emotional memory and crisis intervention capabilities",
      icon: <Favorite />,
      color: "#F59E0B",
      path: "/ai-therapist",
      stats: { accuracy: "94%", users: "15K+" },
      testimonial: "My AI therapist remembers everything about me and provides incredibly personalized support."
    },
    {
      title: "Blockchain Health",
      description: "Decentralized data ownership giving you complete control over your mental health information",
      icon: <CloudUpload />,
      color: "#10B981",
      path: "/blockchain-health",
      stats: { accuracy: "100%", users: "3K+" },
      testimonial: "Finally, I own my mental health data. The blockchain integration is revolutionary."
    },
    {
      title: "Peer Support Network",
      description: "Decentralized community with reputation system and smart contract payments",
      icon: <EmojiEvents />,
      color: "#F97316",
      path: "/decentralized-support",
      stats: { accuracy: "91%", users: "7K+" },
      testimonial: "The peer support network has been life-changing. I feel connected and understood."
    }
  ];

  const technologies = [
    { name: "React", level: 95 },
    { name: "TensorFlow", level: 88 },
    { name: "Blockchain", level: 92 },
    { name: "Quantum Computing", level: 78 },
    { name: "Computer Vision", level: 91 },
    { name: "Natural Language Processing", level: 89 }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" fontWeight="bold" gutterBottom align="center">
              🧠 MindfulMe
            </Typography>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 300 }}>
              Revolutionary Mental Health Platform
            </Typography>
            <Typography variant="h6" paragraph align="center" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
              Combining cutting-edge neuroscience, quantum computing, and AI to transform mental healthcare forever.
              This isn't just an app—it's future of mental wellness.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/wellness-journey')}
                startIcon={<RocketLaunch />}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#764ba2',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Start Your Journey
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/neural-interface')}
                startIcon={<PlayArrow />}
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Live Demo
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.usersHelped.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Users Helped
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.sessionsCompleted.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Therapy Sessions
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.stressReduced.toFixed(1)}%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Average Stress Reduction
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stats.accuracy.toFixed(1)}%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Prediction Accuracy
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Features Showcase */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom align="center">
          Revolutionary Technologies
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center">
          Each feature represents a breakthrough in mental health technology
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 30px ${feature.color}40`
                    }
                  }}
                  onClick={() => navigate(feature.path)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: feature.color, 
                          mr: 2,
                          width: 56,
                          height: 56
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {feature.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={`${feature.stats.accuracy} accuracy`} 
                            size="small" 
                            color="primary" 
                          />
                          <Chip 
                            label={feature.stats.users} 
                            size="small" 
                            color="secondary" 
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {feature.description}
                    </Typography>
                    
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'grey.50', 
                      borderRadius: 1,
                      fontStyle: 'italic'
                    }}>
                      <Typography variant="caption">
                        "{feature.testimonial}"
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      endIcon={<NavigateNext />}
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(feature.path);
                      }}
                    >
                      Try Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Technology Stack */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" gutterBottom align="center">
            Cutting-Edge Technology Stack
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph align="center">
            Built with most advanced technologies in AI, blockchain, and quantum computing
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {technologies.map((tech, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {tech.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {tech.level}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={tech.level} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Transform Your Mental Health?
            </Typography>
            <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
              Join thousands of users experiencing future of mental wellness
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/wellness-journey')}
                startIcon={<AutoAwesome />}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#764ba2',
                  px: 4,
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Start Free Journey
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Lightbulb />}
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  px: 4,
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Trust Badges */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CheckCircle />} 
            label="HIPAA Compliant" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<Security />} 
            label="Blockchain Secured" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<Speed />} 
            label="Real-Time Processing" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<Timeline />} 
            label="24/7 Available" 
            color="primary" 
            variant="outlined"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Showcase;
