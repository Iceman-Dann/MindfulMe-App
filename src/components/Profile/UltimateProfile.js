import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  Container,
  Fab,
  Badge,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Psychology,
  TrendingUp,
  Favorite,
  Work,
  School,
  FitnessCenter,
  Audiotrack,
  Book,
  Camera,
  Flight,
  Restaurant,
  Movie,
  Sports,
  Edit,
  Add,
  Star,
  Timeline,
  EmojiEvents,
  AutoAwesome,
  Lightbulb,
  Insights,
  Assessment,
  CalendarToday,
  AccessTime,
  LocalFireDepartment,
  Heart,
  Spa,
  SelfImprovement,
  Logout
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import cohereAPI from '../../utils/cohereAI';

const UltimateProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    interests: [],
    goals: [],
    moodHistory: [],
    achievements: [],
    personalityTraits: [],
    lifeEvents: [],
    preferences: {
      meditation: true,
      exercise: false,
      reading: true,
      music: true,
      social: false
    },
    wellnessScore: 0,
    streakDays: 0,
    totalSessions: 0
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItem, setNewItem] = useState('');
  const darkMode = useSelector((state) => state.darkMode?.darkMode) ?? false;

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('ultimateProfile') || '{}');
    if (savedProfile.name) {
      setProfile(savedProfile);
      // Clear any old error messages
      setAiInsight('');
      // Generate fresh insight
      setTimeout(() => generateAIInsight(), 1000);
    } else {
      // First time setup
      setOpenDialog(true);
      setDialogType('setup');
    }
  }, []);

  const saveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('ultimateProfile', JSON.stringify(updatedProfile));
  };

  const generateAIInsight = async () => {
    setIsGenerating(true);
    setAiInsight(''); // Clear previous insight
    try {
      const prompt = `As an AI mental wellness expert, analyze this user's profile and provide personalized insights:
      
      Name: ${profile.name}
      Interests: ${profile.interests.join(', ')}
      Goals: ${profile.goals.join(', ')}
      Wellness Score: ${profile.wellnessScore}
      Streak: ${profile.streakDays} days
      
      Provide:
      1. Personalized wellness recommendations
      2. Strengths to build upon
      3. Areas for growth
      4. Specific activities they might enjoy
      5. Motivational message
      
      Format as a warm, encouraging response.`;
      
      const response = await cohereAPI.generateWellnessAdvice(prompt, {
        profileData: profile,
        analysisType: 'personality'
      });
      
      if (response) {
        setAiInsight(response);
      } else {
        // Provide a meaningful fallback when API fails
        const fallbackInsight = `Hi ${profile.name || 'there'}! Based on your profile, I can see you're committed to your wellness journey with a ${profile.wellnessScore}% wellness score and ${profile.streakDays} day streak! 

Your interests in ${profile.interests.join(', ')} show you're dedicated to personal growth. 

Strengths to build upon: Your consistency and commitment to wellness
Areas for growth: Exploring new mindfulness practices and building healthy routines
Activities you might enjoy: Daily meditation, journaling, and gentle exercise

Keep up the amazing work - every small step counts toward your wellbeing!`;
        setAiInsight(fallbackInsight);
      }
    } catch (error) {
      console.error('Error generating AI insight:', error);
      // Provide a meaningful fallback
      const fallbackInsight = `Hi ${profile.name || 'there'}! I'm here to support your wellness journey. With your dedication and ${profile.streakDays} day streak, you're already making great progress. Keep focusing on your goals and remember to be kind to yourself along the way!`;
      setAiInsight(fallbackInsight);
    } finally {
      setIsGenerating(false);
    }
  };

  const completeSetup = () => {
    if (!newItem.trim()) return;
    
    const updatedProfile = {
      ...profile,
      name: newItem,
      wellnessScore: 75,
      streakDays: 1,
      totalSessions: 1,
      personalityTraits: ['Curious', 'Growth-oriented', 'Mindful'],
      achievements: ['Welcome to MindfulMe!'],
      interests: ['Mental Wellness', 'Personal Growth'],
      goals: ['Daily mindfulness practice']
    };
    
    saveProfile(updatedProfile);
    setOpenDialog(false);
    setNewItem('');
    generateAIInsight();
  };

  const handleLogout = () => {
    // Clear all local storage data
    localStorage.clear();
    
    // Reset all state
    setProfile({
      name: '',
      age: '',
      bio: '',
      interests: [],
      goals: [],
      moodHistory: [],
      achievements: [],
      personalityTraits: [],
      lifeEvents: [],
      preferences: {
        meditation: true,
        exercise: false,
        reading: true,
        music: true,
        social: false
      },
      wellnessScore: 0,
      streakDays: 0,
      totalSessions: 0
    });
    
    setAiInsight('');
    setActiveTab(0);
    
    // Show confirmation
    setSnackbar({
      open: true,
      message: 'All data cleared successfully. You can start fresh!',
      severity: 'success'
    });
  };

  const addItem = (type) => {
    if (!newItem.trim()) return;
    
    const updatedProfile = {
      ...profile,
      [type]: [...profile[type], newItem]
    };
    
    saveProfile(updatedProfile);
    setNewItem('');
    setOpenDialog(false);
  };

  const getWellnessColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const interestCategories = [
    { name: 'Meditation', icon: <Spa />, color: '#9c27b0' },
    { name: 'Exercise', icon: <FitnessCenter />, color: '#4caf50' },
    { name: 'Reading', icon: <Book />, color: '#2196f3' },
    { name: 'Music', icon: <Audiotrack />, color: '#ff5722' },
    { name: 'Travel', icon: <Flight />, color: '#795548' },
    { name: 'Photography', icon: <Camera />, color: '#607d8b' },
    { name: 'Cooking', icon: <Restaurant />, color: '#ff9800' },
    { name: 'Movies', icon: <Movie />, color: '#e91e63' },
    { name: 'Sports', icon: <Sports />, color: '#8bc34a' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          background: darkMode ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          borderRadius: 3
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Avatar sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'white',
                color: '#667eea',
                fontSize: 48,
                fontWeight: 'bold'
              }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {profile.name || 'Welcome to Your Journey'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {profile.bio || 'Discover your path to mental wellness'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<LocalFireDepartment />}
                  label={`${profile.streakDays} Day Streak`}
                  sx={{ mr: 1, bgcolor: '#ff9800', color: 'white' }}
                />
                <Chip 
                  icon={<EmojiEvents />}
                  label={`${profile.achievements.length} Achievements`}
                  sx={{ mr: 1, bgcolor: '#4caf50', color: 'white' }}
                />
                <Chip 
                  icon={<Psychology />}
                  label={`Wellness Score: ${profile.wellnessScore}`}
                  sx={{ bgcolor: '#2196f3', color: 'white' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Wellness Score</Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={profile.wellnessScore}
                    size={80}
                    thickness={6}
                    sx={{ color: 'white' }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      {profile.wellnessScore}%
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{ mt: 2, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Person />} label="About Me" />
            <Tab icon={<Favorite />} label="Interests" />
            <Tab icon={<TrendingUp />} label="Goals" />
            <Tab icon={<Timeline />} label="Progress" />
            <Tab icon={<AutoAwesome />} label="AI Insights" />
            <Tab icon={<EmojiEvents />} label="Achievements" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Personal Information
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Name:</strong> {profile.name || 'Not set'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Bio:</strong> {profile.bio || 'No bio yet'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Edit />}
                    onClick={() => {
                      setDialogType('bio');
                      setOpenDialog(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Personality Traits
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.personalityTraits.map((trait, index) => (
                      <Chip key={index} label={trait} color="primary" />
                    ))}
                    <IconButton 
                      onClick={() => {
                        setDialogType('trait');
                        setOpenDialog(true);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {interestCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    border: profile.interests.includes(category.name) ? `2px solid ${category.color}` : 'none'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: category.color, 
                        color: 'white', 
                        mx: 'auto', 
                        mb: 2,
                        width: 60,
                        height: 60
                      }}>
                        {category.icon}
                      </Avatar>
                      <Typography variant="h6">{category.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.interests.includes(category.name) ? 'Added to interests' : 'Click to add'}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                    My Goals
                  </Typography>
                  <List>
                    {profile.goals.map((goal, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Star color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={goal} />
                      </ListItem>
                    ))}
                  </List>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => {
                      setDialogType('goal');
                      setOpenDialog(true);
                    }}
                  >
                    Add Goal
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Wellness Progress</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={profile.wellnessScore}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2">
                    Current Score: {profile.wellnessScore}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Activity Stats</Typography>
                  <Typography variant="body2">
                    Total Sessions: {profile.totalSessions}
                  </Typography>
                  <Typography variant="body2">
                    Current Streak: {profile.streakDays} days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Achievements</Typography>
                  <Typography variant="body2">
                    {profile.achievements.length} unlocked
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 4 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Personal Insights
              </Typography>
              <Button 
                variant="contained" 
                onClick={generateAIInsight}
                disabled={isGenerating}
                startIcon={<AutoAwesome />}
                sx={{ mb: 2 }}
              >
                {isGenerating ? 'Generating Insights...' : 'Generate AI Insights'}
              </Button>
              {aiInsight && (
                <Paper sx={{ p: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {aiInsight}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 5 && (
          <Grid container spacing={3}>
            {profile.achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <EmojiEvents sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
                      <Typography variant="h6">{achievement}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="edit"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #667eea, #764ba2)'
          }}
          onClick={() => {
            setDialogType('general');
            setOpenDialog(true);
          }}
        >
          <Edit />
        </Fab>

        {/* Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogType === 'setup' ? 'Welcome to MindfulMe!' : 
             dialogType === 'bio' ? 'Edit Bio' :
             dialogType === 'trait' ? 'Add Personality Trait' :
             dialogType === 'goal' ? 'Add Goal' : 'Edit Profile'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline={dialogType === 'bio'}
              rows={dialogType === 'bio' ? 4 : 1}
              label={dialogType === 'setup' ? 'What should we call you?' : 
                     dialogType === 'bio' ? 'Tell us about yourself' :
                     dialogType === 'trait' ? 'Personality trait' :
                     dialogType === 'goal' ? 'Your goal' : 'Enter text'}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={dialogType === 'setup' ? 'Enter your name' :
                        dialogType === 'bio' ? 'Share your story...' :
                        dialogType === 'trait' ? 'e.g., Creative, Compassionate' :
                        dialogType === 'goal' ? 'e.g., Meditate daily' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={dialogType === 'setup' ? completeSetup : 
                       dialogType === 'bio' ? () => addItem('bio') :
                       dialogType === 'trait' ? () => addItem('personalityTraits') :
                       dialogType === 'goal' ? () => addItem('goals') :
                       () => addItem('general')}
              disabled={!newItem.trim()}
            >
              {dialogType === 'setup' ? 'Start Journey' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default UltimateProfile;
