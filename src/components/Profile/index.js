import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  Fab,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Person,
  Edit,
  Settings,
  TrendingUp,
  Psychology,
  EmojiEvents,
  Favorite,
  Star,
  Timeline as TimelineIcon,
  Notifications,
  DarkMode,
  LightMode,
  Add,
  Camera,
  CalendarToday,
  LocalHospital,
  SelfImprovement,
  Mood,
  FitnessCenter,
  Book,
  MusicNote,
  Brush,
  Coffee,
  Nightlight,
  AccessTime,
  LocationOn,
  School,
  Work,
  Phone,
  Email,
  Cake,
  Height,
  Weight
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode?.darkMode) ?? false;
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    age: 25,
    bio: 'Mental wellness enthusiast on a journey to better mental health',
    location: 'San Francisco, CA',
    occupation: 'Software Developer',
    phone: '+1 (555) 123-4567',
    email: 'alex.johnson@email.com',
    birthday: '1998-05-15',
    height: "5'10\"",
    weight: '165 lbs',
    emergencyContact: 'Jane Johnson - Sister',
    emergencyPhone: '+1 (555) 987-6543'
  });

  const [wellnessStats, setWellnessStats] = useState({
    moodScore: 85,
    anxietyLevel: 30,
    sleepQuality: 75,
    exerciseMinutes: 45,
    meditationSessions: 12,
    journalEntries: 28,
    therapySessions: 8,
    streakDays: 15
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: '7-Day Streak', icon: <EmojiEvents />, color: '#4caf50', unlocked: true },
    { id: 2, title: 'Mindfulness Master', icon: <Psychology />, color: '#9c27b0', unlocked: true },
    { id: 3, title: 'Mood Tracker', icon: <Mood />, color: '#ff9800', unlocked: true },
    { id: 4, title: '30-Day Champion', icon: <Star />, color: '#f44336', unlocked: false },
    { id: 5, title: 'Therapy Graduate', icon: <LocalHospital />, color: '#2196f3', unlocked: false }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'mood', title: 'Logged Mood', description: 'Feeling great today!', time: '2 hours ago', icon: <Mood /> },
    { id: 2, type: 'meditation', title: 'Meditation Session', description: '15 minutes of mindfulness', time: '5 hours ago', icon: <SelfImprovement /> },
    { id: 3, type: 'journal', title: 'Journal Entry', description: 'Wrote about daily thoughts', time: '1 day ago', icon: <Book /> },
    { id: 4, type: 'exercise', title: 'Workout Complete', description: '30 minutes cardio', time: '2 days ago', icon: <FitnessCenter /> }
  ]);

  const [wellnessGoals, setWellnessGoals] = useState([
    { id: 1, title: 'Daily Meditation', progress: 80, target: '15 min/day' },
    { id: 2, title: 'Mood Tracking', progress: 95, target: 'Daily entries' },
    { id: 3, title: 'Exercise', progress: 60, target: '3x per week' },
    { id: 4, title: 'Sleep Quality', progress: 70, target: '8 hours/night' }
  ]);

  const handleSaveProfile = () => {
    // Save profile data to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setEditProfile(false);
  };

  const handleThemeToggle = () => {
    // Simple theme toggle using localStorage
    const newDarkMode = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    // Force re-render by triggering a state change in parent
    window.location.reload();
  };

  useEffect(() => {
    // Load saved profile data
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const getActivityColor = (type) => {
    const colors = {
      mood: '#4caf50',
      meditation: '#9c27b0',
      journal: '#ff9800',
      exercise: '#2196f3',
      therapy: '#f44336'
    };
    return colors[type] || '#666';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" color={darkMode ? '#fff' : '#1a237e'} gutterBottom>
            Your Wellness Journey
          </Typography>
          <Typography variant="h6" color={darkMode ? '#b0bec5' : '#546e7a'}>
            Every step counts towards better mental health
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
              backdropFilter: 'blur(10px)',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}>
              <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 2,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      fontSize: '48px'
                    }}
                  >
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      '&:hover': { background: 'linear-gradient(45deg, #5a67d8, #6b46c1)' }
                    }}
                    size="small"
                  >
                    <Camera />
                  </IconButton>
                </Box>

                <Typography variant="h5" fontWeight="bold" color={darkMode ? '#fff' : '#1a237e'}>
                  {profileData.name}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <Chip icon={<LocationOn />} label={profileData.location} size="small" />
                  <Chip icon={<Cake />} label={`${profileData.age} years`} size="small" />
                </Box>

                <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'} sx={{ mb: 3 }}>
                  {profileData.bio}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setEditProfile(true)}
                  sx={{ mb: 2 }}
                  fullWidth
                >
                  Edit Profile
                </Button>

                <Divider sx={{ my: 2 }} />

                {/* Quick Stats */}
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                      Streak Days
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#4caf50">
                      {wellnessStats.streakDays}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                      Total Sessions
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#2196f3">
                      {wellnessStats.meditationSessions}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                      Mood Score
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="#ff9800">
                      {wellnessStats.moodScore}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Wellness Stats */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Mood & Anxiety */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Mood sx={{ mr: 1, color: '#4caf50' }} />
                      <Typography variant="h6" color={darkMode ? '#fff' : '#1a237e'}>
                        Mood & Anxiety
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                          Mood Score
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">{wellnessStats.moodScore}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={wellnessStats.moodScore}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#4caf50',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                          Anxiety Level
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">{wellnessStats.anxietyLevel}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={100 - wellnessStats.anxietyLevel}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#ff9800',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sleep & Exercise */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Nightlight sx={{ mr: 1, color: '#9c27b0' }} />
                      <Typography variant="h6" color={darkMode ? '#fff' : '#1a237e'}>
                        Sleep & Exercise
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                          Sleep Quality
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">{wellnessStats.sleepQuality}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={wellnessStats.sleepQuality}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#9c27b0',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                          Exercise Today
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">{wellnessStats.exerciseMinutes} min</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(wellnessStats.exerciseMinutes / 60) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#2196f3',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Wellness Goals */}
              <Grid item xs={12}>
                <Card sx={{ 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <TrendingUp sx={{ mr: 1, color: '#667eea' }} />
                      <Typography variant="h6" color={darkMode ? '#fff' : '#1a237e'}>
                        Wellness Goals
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {wellnessGoals.map((goal) => (
                        <Grid item xs={12} sm={6} key={goal.id}>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                                {goal.title}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {goal.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={goal.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: goal.progress >= 80 ? '#4caf50' : goal.progress >= 50 ? '#ff9800' : '#f44336',
                                  borderRadius: 3
                                }
                              }}
                            />
                            <Typography variant="caption" color={darkMode ? '#b0bec5' : '#666'}>
                              Target: {goal.target}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activities */}
              <Grid item xs={12}>
                <Card sx={{ 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <TimelineIcon sx={{ mr: 1, color: '#ff9800' }} />
                      <Typography variant="h6" color={darkMode ? '#fff' : '#1a237e'}>
                        Recent Activities
                      </Typography>
                    </Box>
                    
                    <List>
                      {recentActivities.map((activity, index) => (
                        <ListItem key={activity.id} sx={{ borderLeft: `3px solid ${getActivityColor(activity.type)}`, pl: 2 }}>
                          <ListItemIcon>
                            <Box sx={{ color: getActivityColor(activity.type) }}>
                              {activity.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color={darkMode ? '#fff' : '#1a237e'}>
                                {activity.title}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'}>
                                  {activity.description}
                                </Typography>
                                <Typography variant="caption" color={darkMode ? '#9e9e9e' : '#999'}>
                                  {activity.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Achievements */}
              <Grid item xs={12}>
                <Card sx={{ 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <EmojiEvents sx={{ mr: 1, color: '#ffd700' }} />
                      <Typography variant="h6" color={darkMode ? '#fff' : '#1a237e'}>
                        Achievements
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {achievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip
                            icon={achievement.icon}
                            label={achievement.title}
                            sx={{
                              backgroundColor: achievement.unlocked ? achievement.color : '#e0e0e0',
                              color: achievement.unlocked ? 'white' : '#999',
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: achievement.unlocked ? 'inherit' : '#999'
                              }
                            }}
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfile} onClose={() => setEditProfile(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={profileData.occupation}
                  onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProfile(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="theme-toggle"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: darkMode ? 'linear-gradient(45deg, #ffd700, #ff8c00)' : 'linear-gradient(45deg, #667eea, #764ba2)'
          }}
          onClick={handleThemeToggle}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </Fab>
      </motion.div>
    </Container>
  );
};

export default Profile;
