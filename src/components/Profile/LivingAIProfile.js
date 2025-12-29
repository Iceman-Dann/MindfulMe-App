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
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
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
  ExpandMore,
  Chat,
  Mood,
  Nightlight,
  WbSunny,
  Logout
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import cohereAPI from '../../utils/cohereAI';

const LivingAIProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    interests: [],
    goals: [],
    moodHistory: [],
    achievements: [],
    personalityTraits: [],
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
  const [moodData, setMoodData] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [lifeInsights, setLifeInsights] = useState([]);
  const [moodPrediction, setMoodPrediction] = useState('');
  const [personalityAnalysis, setPersonalityAnalysis] = useState('');
  const darkMode = useSelector((state) => state.darkMode?.darkMode) ?? false;

  useEffect(() => {
    // Load onboarding profile data first
    const onboardingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const savedProfile = JSON.parse(localStorage.getItem('livingProfile') || '{}');
    
    // Merge onboarding data with existing profile
    let mergedProfile = { ...savedProfile };
    
    if (onboardingProfile.name) {
      mergedProfile.name = onboardingProfile.name;
    }
    if (onboardingProfile.interests && onboardingProfile.interests.length > 0) {
      mergedProfile.interests = onboardingProfile.interests;
    }
    if (onboardingProfile.goals) {
      mergedProfile.goals = [onboardingProfile.goals];
    }
    
    // Set defaults if not present
    if (!mergedProfile.wellnessScore) mergedProfile.wellnessScore = 75;
    if (!mergedProfile.streakDays) mergedProfile.streakDays = 1;
    if (!mergedProfile.totalSessions) mergedProfile.totalSessions = 1;
    if (!mergedProfile.achievements || mergedProfile.achievements.length === 0) {
      mergedProfile.achievements = ['Welcome to MindfulMe!'];
    }
    if (!mergedProfile.personalityTraits || mergedProfile.personalityTraits.length === 0) {
      mergedProfile.personalityTraits = ['Curious', 'Growth-oriented'];
    }
    
    setProfile(mergedProfile);
    
    // Save merged profile
    localStorage.setItem('livingProfile', JSON.stringify(mergedProfile));
    
    generateAIRecommendations(mergedProfile);
    generateLifeInsights(mergedProfile);
    
    const savedMoods = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodData(savedMoods);
  }, []);

  const saveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('livingProfile', JSON.stringify(updatedProfile));
    generateAIRecommendations(updatedProfile);
  };

  const generateAIRecommendations = async (profileData) => {
    setIsGenerating(true);
    try {
      const prompt = `Based on this user profile, generate 3 personalized wellness recommendations:
      
      Name: ${profileData.name}
      Interests: ${profileData.interests.join(', ')}
      Goals: ${profileData.goals.join(', ')}
      Wellness Score: ${profileData.wellnessScore}
      
      Provide specific, actionable recommendations based on their interests and goals.
      Format as a JSON array of strings: ["recommendation1", "recommendation2", "recommendation3"]`;
      
      const response = await cohereAPI.generateWellnessAdvice(prompt, { type: 'recommendations' });
      if (response) {
        try {
          const recommendations = JSON.parse(response);
          setAiRecommendations(recommendations);
        } catch (e) {
          const fallback = response.split('\n').filter(line => line.trim()).slice(0, 3);
          setAiRecommendations(fallback.length > 0 ? fallback : [
            `Try ${profileData.interests[0] || 'meditation'} for 5 minutes daily`,
            'Exercise regularly to boost mood and energy',
            'Read something inspiring to stay motivated'
          ]);
        }
      } else {
        // Provide personalized fallback based on profile data
        setAiRecommendations([
          `Continue with ${profileData.interests[0] || 'your wellness activities'} - you're doing great!`,
          'Practice gratitude daily to boost your positive mindset',
          'Set small, achievable goals to maintain momentum'
        ]);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setAiRecommendations([
        'Try meditation for 5 minutes daily',
        'Exercise regularly to boost mood',
        'Read something inspiring'
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLifeInsights = async (profileData) => {
    try {
      const prompt = `Analyze this user's life patterns and provide insights:
      
      Profile: ${JSON.stringify(profileData)}
      Recent moods: ${JSON.stringify(moodData.slice(-5))}
      
      Provide 3 insights about their mental wellness journey.
      Format as JSON array: ["insight1", "insight2", "insight3"]`;
      
      const response = await cohereAPI.generateCBTExercise(prompt, 'insights');
      if (response) {
        try {
          const insights = JSON.parse(response);
          setLifeInsights(insights);
        } catch (e) {
          const fallback = response.split('\n').filter(line => line.trim()).slice(0, 3);
          setLifeInsights(fallback.length > 0 ? fallback : ['You are making progress', 'Keep up the good work', 'Focus on self-care']);
        }
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setLifeInsights(['You are making progress', 'Keep up the good work', 'Focus on self-care']);
    }
  };

  const generateMoodPrediction = async () => {
    try {
      const prompt = `Based on this mood history, predict tomorrow's mood: ${JSON.stringify(moodData.slice(-7))}`;
      const response = await cohereAPI.generateWellnessAdvice(prompt, { type: 'mood-prediction' });
      if (response) {
        setMoodPrediction(response);
      } else {
        setMoodPrediction('Based on your recent mood patterns, tomorrow looks promising! Your wellness routine is making a positive impact.');
      }
    } catch (error) {
      setMoodPrediction('Tomorrow looks bright! Keep up your wellness routine and positive mindset.');
    }
  };

  const generatePersonalityAnalysis = async () => {
    try {
      const prompt = `Analyze this person's personality based on their profile: ${JSON.stringify(profile)}. Give them a fun personality type and analysis.`;
      const response = await cohereAPI.generateWellnessAdvice(prompt, { type: 'personality-analysis' });
      if (response) {
        setPersonalityAnalysis(response);
      } else {
        // Provide personalized fallback
        setPersonalityAnalysis(`The Mindful Achiever - ${profile.name || 'You'} show dedication to wellness with a ${profile.wellnessScore}% score! Your interests in ${profile.interests.join(', ')} reveal a curious and growth-oriented personality. You're the type who balances self-improvement with compassion for others.`);
      }
    } catch (error) {
      setPersonalityAnalysis(`The Wellness Warrior - You're committed to personal growth and mental wellness. Your journey shows strength and determination!`);
    }
  };

  const logMood = (mood) => {
    const newMood = {
      mood,
      timestamp: new Date().toISOString(),
      note: ''
    };
    
    const updatedMoods = [...moodData, newMood];
    setMoodData(updatedMoods);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
    
    const updatedProfile = {
      ...profile,
      moodHistory: updatedMoods,
      wellnessScore: Math.min(100, profile.wellnessScore + 5)
    };
    saveProfile(updatedProfile);
    
    generateLifeInsights(updatedProfile);
  };

  const completeSetup = () => {
    if (!newItem.trim()) return;
    
    const updatedProfile = {
      ...profile,
      name: newItem,
      wellnessScore: 75,
      streakDays: 1,
      totalSessions: 1,
      personalityTraits: ['Curious', 'Growth-oriented'],
      achievements: ['Welcome to MindfulMe!'],
      interests: ['Mental Wellness'],
      goals: ['Daily mindfulness practice']
    };
    
    saveProfile(updatedProfile);
    setOpenDialog(false);
    setNewItem('');
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
    
    setMoodData([]);
    setAiRecommendations([]);
    setLifeInsights([]);
    setMoodPrediction('');
    setPersonalityAnalysis('');
    setActiveTab(0);
    
    // Show confirmation
    alert('All data cleared successfully. You can start fresh!');
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
        {/* AI Header Section */}
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
                AI-Powered Wellness Companion
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
                  label={`Wellness: ${profile.wellnessScore}%`}
                  sx={{ bgcolor: '#2196f3', color: 'white' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>AI Wellness Score</Typography>
                <CircularProgress 
                  variant="determinate" 
                  value={profile.wellnessScore}
                  size={80}
                  thickness={6}
                  sx={{ color: 'white' }}
                />
                <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
                  {profile.wellnessScore}%
                </Typography>
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

        {/* AI Mood Tracker */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Mood sx={{ mr: 1, verticalAlign: 'middle' }} />
              How are you feeling today?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => logMood('happy')}
                startIcon={<WbSunny />}
              >
                Great
              </Button>
              <Button 
                variant="contained" 
                color="warning"
                onClick={() => logMood('okay')}
                startIcon={<Psychology />}
              >
                Okay
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => logMood('sad')}
                startIcon={<Nightlight />}
              >
                Low
              </Button>
              <Button 
                variant="outlined"
                onClick={() => generateMoodPrediction()}
                startIcon={<AutoAwesome />}
              >
                Predict Tomorrow
              </Button>
            </Box>
          </CardContent>
        </Card>

        {moodPrediction && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Mood Prediction
              </Typography>
              <Typography variant="body1">{moodPrediction}</Typography>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Personal Recommendations
              </Typography>
              <List>
                {aiRecommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Favorite />} label="Interests" />
            <Tab icon={<TrendingUp />} label="Goals" />
            <Tab icon={<Insights />} label="AI Insights" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Personal Information
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Name:</strong> {profile.name || 'Not set'}
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
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                    AI Personality Analysis
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={generatePersonalityAnalysis}
                    startIcon={<AutoAwesome />}
                    sx={{ mb: 2 }}
                  >
                    Analyze My Personality
                  </Button>
                  {personalityAnalysis && (
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {personalityAnalysis}
                    </Typography>
                  )}
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
                  }}
                  onClick={() => {
                    const updatedInterests = profile.interests.includes(category.name)
                      ? profile.interests.filter(i => i !== category.name)
                      : [...profile.interests, category.name];
                    saveProfile({...profile, interests: updatedInterests});
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
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Life Analysis
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => generateLifeInsights(profile)}
                disabled={isGenerating}
                startIcon={<AutoAwesome />}
                sx={{ mb: 2 }}
              >
                {isGenerating ? 'Analyzing...' : 'Generate AI Insights'}
              </Button>
              {lifeInsights.length > 0 && (
                <Box>
                  {lifeInsights.map((insight, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Insight {index + 1}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{insight}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
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
             dialogType === 'bio' ? 'Edit Profile' :
             dialogType === 'goal' ? 'Add Goal' : 'Edit Profile'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline={dialogType === 'bio'}
              rows={dialogType === 'bio' ? 4 : 1}
              label={dialogType === 'setup' ? 'What should we call you?' : 
                     dialogType === 'bio' ? 'Tell us about yourself' :
                     dialogType === 'goal' ? 'Your goal' : 'Enter text'}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={dialogType === 'setup' ? 'Enter your name' :
                        dialogType === 'bio' ? 'Share your story...' :
                        dialogType === 'goal' ? 'e.g., Meditate daily' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={dialogType === 'setup' ? completeSetup : 
                       dialogType === 'bio' ? () => addItem('bio') :
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

export default LivingAIProfile;
