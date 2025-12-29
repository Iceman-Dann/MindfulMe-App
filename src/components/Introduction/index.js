import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Chip,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Psychology, 
  Spa, 
  TrendingUp, 
  Groups, 
  Security, 
  Star,
  Person,
  Favorite,
  CloudUpload,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { updateProfile } from '../../store/features/auth/authSlice';

const Introduction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    interests: [],
    goals: '',
    experience: ''
  });

  const steps = ['Welcome', 'Personalize', 'Goals', 'Complete'];

  const interests = [
    { icon: <Psychology />, label: "AI Therapy", color: "#667eea" },
    { icon: <Spa />, label: "Meditation", color: "#48dbfb" },
    { icon: <TrendingUp />, label: "Mood Tracking", color: "#feca57" },
    { icon: <Groups />, label: "Community", color: "#ff9ff3" },
    { icon: <Favorite />, label: "Self-Care", color: "#ee5a6f" },
    { icon: <CloudUpload />, label: "Journaling", color: "#00d2d3" }
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Complete onboarding and save profile data
      const userProfile = {
        ...profileData,
        onboardingCompleted: true,
        onboardingDate: new Date().toISOString()
      };
      
      // Save to Redux store
      dispatch(updateProfile(userProfile));
      
      // Save to localStorage for persistence
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      navigate('/home');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const toggleInterest = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 3
              }}>
                <Psychology sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                Welcome to MindfulMe
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Your personalized mental wellness journey starts here. Let's set up your profile to customize your experience.
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: '#667eea', mx: 'auto', mb: 2 }}>
                      <Psychology />
                    </Avatar>
                    <Typography variant="h6" sx={{ mb: 1 }}>AI-Powered Support</Typography>
                    <Typography variant="body2" color="text.secondary">
                      24/7 AI companion for mental health guidance
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: '#48dbfb', mx: 'auto', mb: 2 }}>
                      <Spa />
                    </Avatar>
                    <Typography variant="h6" sx={{ mb: 1 }}>Mindfulness Tools</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Guided meditation and wellness exercises
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: '#feca57', mx: 'auto', mb: 2 }}>
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h6" sx={{ mb: 1 }}>Progress Tracking</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor your wellness journey over time
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ py: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                What's your name?
              </Typography>
              <TextField
                fullWidth
                label="Your Name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 4, maxWidth: 400, mx: 'block', ml: 'auto', mr: 'auto' }}
                variant="outlined"
                size="large"
              />

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                What interests you most?
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
                Select all that apply to personalize your experience
              </Typography>
              
              <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
                {interests.map((interest, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: profileData.interests.includes(interest.label) 
                          ? `2px solid ${interest.color}` 
                          : '2px solid transparent',
                        backgroundColor: profileData.interests.includes(interest.label)
                          ? `${interest.color}10`
                          : 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        }
                      }}
                      onClick={() => toggleInterest(interest.label)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Avatar sx={{ bgcolor: interest.color, mx: 'auto', mb: 1 }}>
                          {interest.icon}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {interest.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ py: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                What are your wellness goals?
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
                Help us understand what you'd like to achieve
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Goals"
                placeholder="e.g., Reduce anxiety, improve sleep, build healthy habits, practice mindfulness..."
                value={profileData.goals}
                onChange={(e) => setProfileData(prev => ({ ...prev, goals: e.target.value }))}
                sx={{ mb: 4, maxWidth: 600, mx: 'block', ml: 'auto', mr: 'auto' }}
                variant="outlined"
              />

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                Previous Experience
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                Have you tried mental wellness apps before?
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Experience (Optional)"
                placeholder="Tell us about any previous experience with meditation, therapy, or wellness apps..."
                value={profileData.experience}
                onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                sx={{ mb: 4, maxWidth: 600, mx: 'block', ml: 'auto', mr: 'auto' }}
                variant="outlined"
              />
            </Box>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'success.main',
                mx: 'auto',
                mb: 3
              }}>
                <CheckCircle sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
                You're All Set!
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                Welcome to your personalized wellness journey, {profileData.name || 'Friend'}!
              </Typography>
              
              <Paper sx={{ p: 3, mb: 4, maxWidth: 500, mx: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Your Profile Summary:
                </Typography>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {profileData.name || 'Not specified'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Interests:</strong> {profileData.interests.join(', ') || 'None selected'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Goals:</strong> {profileData.goals || 'Not specified'}
                  </Typography>
                </Box>
              </Paper>

              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Your dashboard is ready with personalized recommendations based on your interests.
              </Typography>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForward />}
            sx={{ minWidth: 120 }}
            disabled={activeStep === 1 && !profileData.name}
          >
            {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Introduction;
