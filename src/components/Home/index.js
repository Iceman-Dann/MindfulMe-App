import React from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Fade,
  Slide,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  Psychology,
  Favorite,
  TrendingUp,
  CloudUpload,
  EmojiEvents,
  Spa,
  Star,
  ArrowForward,
  AutoAwesome,
  HealthAndSafety,
  Groups,
  SelfImprovement,
  Timeline,
  Lightbulb,
  Security,
  Speed,
  AccessTime,
  Chat,
  Logout
} from "@mui/icons-material";
import { logout } from "../../store/features/auth/authSlice.js";

const Home = () => {
  const darkMode = useSelector((state) => state.darkMode?.darkMode) ?? false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const features = [
    {
      icon: <Psychology />,
      title: "AI Mental Health Companion",
      description: "24/7 AI-powered support using advanced Cohere AI technology",
      path: "/chatbot",
      color: "#667eea",
      stats: "95% User Satisfaction",
      premium: true
    },
    {
      icon: <TrendingUp />,
      title: "Advanced Mood Tracking",
      description: "Track your emotional patterns with AI-powered insights",
      path: "/habit-tracker",
      color: "#f093fb",
      stats: "Real-time Analysis"
    },
    {
      icon: <Spa />,
      title: "Guided Meditation",
      description: "Personalized meditation sessions with calming exercises",
      path: "/guided-meditation",
      color: "#4facfe",
      stats: "50+ Sessions"
    },
    {
      icon: <EmojiEvents />,
      title: "CBT Tools & Exercises",
      description: "Evidence-based cognitive behavioral therapy techniques",
      path: "/cbt",
      color: "#43e97b",
      stats: "Clinically Proven"
    },
    {
      icon: <Groups />,
      title: "Support Communities",
      description: "Connect with others on similar wellness journeys",
      path: "/support-groups",
      color: "#fa709a",
      stats: "10K+ Members"
    },
    {
      icon: <Timeline />,
      title: "Wellness Journey",
      description: "Comprehensive dashboard tracking your mental health progress",
      path: "/wellness-journey",
      color: "#feca57",
      stats: "Personal Analytics"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: <Groups /> },
    { label: "AI Conversations", value: "1M+", icon: <Chat /> },
    { label: "Success Rate", value: "94%", icon: <TrendingUp /> },
    { label: "Expert Support", value: "24/7", icon: <AccessTime /> }
  ];

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Student",
      content: "MindfulMe's AI companion helped me through my toughest times. It's like having a therapist in my pocket.",
      rating: 5
    },
    {
      name: "Michael R.",
      role: "Professional",
      content: "The mood tracking and CBT tools have transformed how I manage my anxiety. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma L.",
      role: "Creative",
      content: "The meditation sessions are incredibly calming. I use them every day to stay centered.",
      rating: 5
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: darkMode ? "#0a0a0a" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Header */}
      <AppBar position="static" sx={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)',
        border: 'none',
        boxShadow: 'none'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            MindfulMe
          </Typography>
          <IconButton 
            onClick={handleLogout}
            sx={{ color: 'white' }}
            title="Logout"
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: 4
                }}
              >
                <Psychology sx={{ fontSize: 40, color: '#667eea' }} />
              </Avatar>
            </motion.div>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: 'white',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              MindfulMe
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 3,
                fontWeight: 300,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Your AI-Powered Mental Wellness Companion
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Experience the future of mental health support with cutting-edge AI technology, 
              personalized wellness tracking, and evidence-based therapeutic tools.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/real-ai-chatbot"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                endIcon={<ArrowForward />}
              >
                Start Chatting with AI
              </Button>
              
              <Button
                component={Link}
                to="/wellness-journey"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                View Dashboard
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
          <Box sx={{ mb: 8 }}>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card
                    sx={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ color: 'white', mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Features Grid */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Powerful Features for Your Wellness Journey
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 8,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    {feature.premium && (
                      <Chip
                        label="AI Powered"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          color: 'white',
                          fontWeight: 600,
                          zIndex: 1
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mb: 2,
                          background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                          boxShadow: 2
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                        {feature.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="caption" sx={{ color: feature.color, fontWeight: 600 }}>
                          {feature.stats}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={85}
                          sx={{
                            width: 60,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: feature.color
                            }
                          }}
                        />
                      </Box>
                      
                      <Button
                        component={Link}
                        to={feature.path}
                        variant="contained"
                        fullWidth
                        sx={{
                          background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                          color: 'white',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            background: feature.color,
                            transform: 'translateY(-1px)'
                          }
                        }}
                        endIcon={<ArrowForward />}
                      >
                        Explore Feature
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              textAlign: 'center',
              mb: 6,
              fontWeight: 700
            }}
          >
            Trusted by Thousands
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ p: 3, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#ffd700', fontSize: 16 }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card
            sx={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 4,
              p: 6,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Start Your Wellness Journey Today
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}>
              Join thousands who have transformed their mental health with MindfulMe's 
              AI-powered companion and evidence-based tools.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/real-ai-chatbot"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 600
                }}
                startIcon={<Psychology />}
              >
                Try AI Companion
              </Button>
              
              <Button
                component={Link}
                to="/join"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600
                }}
              >
                Create Account
              </Button>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;