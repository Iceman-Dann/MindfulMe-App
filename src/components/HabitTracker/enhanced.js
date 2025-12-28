import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fab,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add,
  Delete,
  CheckCircle,
  Psychology,
  AutoAwesome,
  Lightbulb,
  Edit,
  TrendingUp,
  ExpandMore,
  Timeline,
  Insights,
  Flag,
  CalendarToday,
  Star,
  Notifications,
  MoreVert,
  Refresh,
  GpsFixed,
  Speed,
  Assessment,
  EmojiEvents,
  LocalFireDepartment,
  FitnessCenter,
  SelfImprovement,
  Nightlight,
  Opacity,
  Restaurant,
  DirectionsRun,
  Book,
  MusicNote,
  Work,
  Home,
  Water
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isBefore, isAfter, differenceInDays, startOfDay, endOfDay, isToday, isPast } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, RadarChartPolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

const COHERE_API_KEY = "A443dmaow1J4IZSxVAsjjJFw8OQv4WwZDOispMeA";

const HabitTracker = () => {
  const theme = useTheme();
  
  // State management
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('advancedHabits');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: 'health',
    frequency: 'daily',
    targetCount: 1,
    unit: 'times',
    timeOfDay: 'morning',
    difficulty: 'medium',
    motivation: '',
    rewards: [],
    obstacles: [],
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    aiAnalysis: null,
    customReminders: []
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalHabits: 0,
    activeHabits: 0,
    completedToday: 0,
    averageStreak: 0,
    completionRate: 0,
    consistencyScore: 0,
    categoryDistribution: [],
    progressHistory: [],
    weeklyProgress: [],
    monthlyTrends: []
  });

  // Habit categories with icons
  const habitCategories = [
    { value: 'health', label: 'Health & Fitness', icon: <FitnessCenter />, color: 'success' },
    { value: 'mindfulness', label: 'Mindfulness', icon: <Psychology />, color: 'primary' },
    { value: 'learning', label: 'Learning', icon: <Book />, color: 'info' },
    { value: 'creativity', label: 'Creativity', icon: <MusicNote />, color: 'secondary' },
    { value: 'productivity', label: 'Productivity', icon: <Work />, color: 'warning' },
    { value: 'social', label: 'Social', icon: <Home />, color: 'error' },
    { value: 'nutrition', label: 'Nutrition', icon: <Restaurant />, color: 'success' },
    { value: 'sleep', label: 'Sleep', icon: <Nightlight />, color: 'primary' },
    { value: 'hydration', label: 'Hydration', icon: <Water />, color: 'info' },
    { value: 'exercise', label: 'Exercise', icon: <DirectionsRun />, color: 'warning' }
  ];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('advancedHabits', JSON.stringify(habits));
    updateAnalytics();
  }, [habits]);

  // Advanced AI Functions
  const generateHabitAnalysis = async (habitData) => {
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `As a behavioral psychologist and habit formation expert, analyze this habit and provide comprehensive insights:

Habit: ${habitData.title}
Description: ${habitData.description}
Category: ${habitData.category}
Frequency: ${habitData.frequency}
Target: ${habitData.targetCount} ${habitData.unit} per ${habitData.frequency}
Difficulty: ${habitData.difficulty}

Please provide:
1. Habit formation difficulty (1-10)
2. Estimated time to form habit (in days)
3. Potential obstacles and solutions
4. Motivational strategies
5. Optimal timing and triggers
6. Reward system recommendations
7. Success metrics and tracking methods
8. Psychological principles at play
9. Environmental factors to consider
10. Accountability strategies

Format as JSON with keys: difficulty, formationTime, obstacles, motivation, timing, rewards, metrics, principles, environment, accountability`,
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.text);
    } catch (error) {
      console.error('Error generating habit analysis:', error);
      return null;
    }
  };

  const generatePersonalizedCoaching = async (habit, userProgress) => {
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `As a habit formation coach, provide personalized coaching for this user:

Habit: ${habit.title}
Current Streak: ${habit.streak} days
Best Streak: ${habit.bestStreak} days
Completion Rate: ${calculateCompletionRate(habit)}%
Frequency: ${habit.frequency}

User's recent progress: ${JSON.stringify(userProgress)}

Please provide:
1. Specific encouragement based on current streak
2. Actionable advice for maintaining consistency
3. Strategies to overcome current challenges
4. Motivation boosters for this specific habit
5. Warning signs and prevention strategies

Keep it concise, motivational, and actionable (max 200 words).`,
          temperature: 0.7,
          max_tokens: 300
        })
      });
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error generating coaching:', error);
      return "Keep going! Consistency is key to habit formation.";
    }
  };

  const generateSmartHabitPlan = async (habitIdea) => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `Transform this habit idea into a comprehensive habit formation plan: "${habitIdea}"

Create a detailed plan with:
1. Specific, measurable action steps
2. Optimal frequency and timing
3. Trigger identification and implementation
4. Environment design recommendations
5. Accountability system
6. Reward structure
7. Progress tracking methods
8. Potential obstacles and solutions
9. Motivation strategies
10. Success metrics

Format as JSON with all these details.`,
          temperature: 0.3,
          max_tokens: 800
        })
      });
      
      const data = await response.json();
      const plan = JSON.parse(data.text);
      
      setNewHabit(prev => ({
        ...prev,
        title: plan.title || habitIdea,
        description: plan.description || '',
        frequency: plan.frequency || 'daily',
        targetCount: plan.targetCount || 1,
        unit: plan.unit || 'times',
        timeOfDay: plan.timing || 'morning',
        motivation: plan.motivation || '',
        rewards: plan.rewards || [],
        obstacles: plan.obstacles || [],
        aiAnalysis: plan
      }));
      
      setSnackbar({
        open: true,
        message: 'AI-powered habit plan created!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating habit plan:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate AI habit plan',
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateAnalytics = useCallback(() => {
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.isActive !== false).length;
    const completedToday = habits.filter(h => isHabitCompletedToday(h)).length;
    
    const averageStreak = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
      : 0;
    
    const completionRate = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + calculateCompletionRate(h), 0) / habits.length)
      : 0;
    
    // Category distribution
    const categoryCount = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {});
    
    const categoryDistribution = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
      color: theme.palette.primary.main
    }));
    
    setAnalytics({
      totalHabits,
      activeHabits,
      completedToday,
      averageStreak,
      completionRate,
      consistencyScore: Math.round((averageStreak + completionRate) / 2),
      categoryDistribution,
      progressHistory: generateProgressHistory(),
      weeklyProgress: generateWeeklyProgress(),
      monthlyTrends: generateMonthlyTrends()
    });
  }, [habits]);

  const isHabitCompletedToday = (habit) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habit.completedDates && habit.completedDates.includes(today);
  };

  const calculateCompletionRate = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const startDate = habit.createdAt ? new Date(habit.createdAt) : new Date();
    const daysSinceStart = differenceInDays(new Date(), startDate) + 1;
    
    return Math.round((habit.completedDates.length / daysSinceStart) * 100);
  };

  const generateProgressHistory = () => {
    const history = [];
    for (let i = 29; i >= 0; i--) {
      const date = addDays(new Date(), -i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const completedCount = habits.filter(h => 
        h.completedDates && h.completedDates.includes(dateStr)
      ).length;
      
      history.push({
        date: format(date, 'MMM dd'),
        completed: completedCount,
        total: habits.length
      });
    }
    
    return history;
  };

  const generateWeeklyProgress = () => {
    const weekData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), -i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayName = days[date.getDay()];
      
      weekData.push({
        day: dayName,
        completed: habits.filter(h => 
          h.completedDates && h.completedDates.includes(dateStr)
        ).length
      });
    }
    
    return weekData.reverse();
  };

  const generateMonthlyTrends = () => {
    const trends = [];
    for (let i = 11; i >= 0; i--) {
      const date = addDays(new Date(), -i * 30);
      const monthStart = startOfDay(date);
      const monthEnd = endOfDay(addDays(date, 30));
      
      const completedInMonth = habits.filter(h => 
        h.completedDates && h.completedDates.some(d => {
          const checkDate = new Date(d);
          return checkDate >= monthStart && checkDate <= monthEnd;
        })
      ).length;
      
      trends.push({
        month: format(date, 'MMM'),
        completed: completedInMonth
      });
    }
    
    return trends;
  };

  const handleAddHabit = async () => {
    if (!newHabit.title.trim()) return;

    const habitWithAI = await generateHabitAnalysis(newHabit);
    
    const habit = {
      id: uuidv4(),
      ...newHabit,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,
      completedDates: [],
      aiAnalysis: habitWithAI,
      progressHistory: []
    };

    setHabits([...habits, habit]);
    resetNewHabit();
    
    setSnackbar({
      open: true,
      message: 'Advanced habit created with AI analysis!',
      severity: 'success'
    });
  };

  const resetNewHabit = () => {
    setNewHabit({
      title: '',
      description: '',
      category: 'health',
      frequency: 'daily',
      targetCount: 1,
      unit: 'times',
      timeOfDay: 'morning',
      difficulty: 'medium',
      motivation: '',
      rewards: [],
      obstacles: [],
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      aiAnalysis: null,
      customReminders: []
    });
  };

  const toggleHabitCompletion = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const isCompleted = isHabitCompletedToday(habit);
        
        let newCompletedDates = [...(habit.completedDates || [])];
        let newStreak = habit.streak;
        let newBestStreak = habit.bestStreak;
        
        if (isCompleted) {
          // Remove today's completion
          newCompletedDates = newCompletedDates.filter(date => date !== today);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          // Add today's completion
          newCompletedDates.push(today);
          newStreak = habit.streak + 1;
          newBestStreak = Math.max(newBestStreak, newStreak);
          
          // Generate personalized coaching
          generatePersonalizedCoaching(habit, {
            action: 'completed',
            newStreak
          }).then(coaching => {
            setSnackbar({
              open: true,
              message: coaching,
              severity: 'success'
            });
          });
        }
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
          bestStreak: newBestStreak,
          lastUpdated: new Date().toISOString()
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
    setSnackbar({
      open: true,
      message: 'Habit deleted successfully',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const renderAnalyticsDashboard = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} md={3}>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GpsFixed sx={{ mr: 1 }} />
              <Typography variant="h6">Total Habits</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">{analytics.totalHabits}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {analytics.activeHabits} active
            </Typography>
          </CardContent>
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#fff', 0.1)
          }} />
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="h6">Completed Today</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">{analytics.completedToday}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {analytics.completionRate}% completion rate
            </Typography>
          </CardContent>
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#fff', 0.1)
          }} />
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalFireDepartment sx={{ mr: 1 }} />
              <Typography variant="h6">Avg Streak</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">{analytics.averageStreak}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              days consistency
            </Typography>
          </CardContent>
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#fff', 0.1)
          }} />
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GpsFixed sx={{ mr: 1 }} />
              <Typography variant="h6">Consistency</Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold">{analytics.consistencyScore}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              overall score
            </Typography>
          </CardContent>
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#fff', 0.1)
          }} />
        </Card>
      </Grid>

      {/* Progress Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>30-Day Progress Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.progressHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke={theme.palette.primary.main} 
                  strokeWidth={2}
                  dot={{ fill: theme.palette.primary.main }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Progress */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>This Week's Progress</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="completed" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderHabitCard = (habit) => {
    const category = habitCategories.find(c => c.value === habit.category) || habitCategories[0];
    const isCompleted = isHabitCompletedToday(habit);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        layout
      >
        <Card sx={{ mb: 2, position: 'relative' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" gutterBottom>{habit.title}</Typography>
                  <IconButton 
                    onClick={() => toggleHabitCompletion(habit.id)}
                    color={isCompleted ? 'success' : 'default'}
                    sx={{ ml: 1 }}
                  >
                    {isCompleted ? <CheckCircle /> : <CheckCircle />}
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {habit.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={category.icon}
                    label={category.label}
                    size="small" 
                    color={category.color}
                    variant="outlined"
                  />
                  <Chip 
                    label={`${habit.frequency} - ${habit.targetCount} ${habit.unit}`}
                    size="small" 
                    variant="outlined"
                  />
                  <Chip 
                    label={habit.timeOfDay}
                    size="small" 
                    variant="outlined"
                  />
                  {habit.aiAnalysis && (
                    <Chip 
                      icon={<Psychology fontSize="small" />}
                      label="AI Enhanced"
                      size="small"
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>
              
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
            </Box>

            {/* Streak Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  <LocalFireDepartment sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
                  Current Streak: {habit.streak} days
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Best: {habit.bestStreak} days
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((habit.streak / 30) * 100, 100)} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #ff9800, #f44336)'
                  }
                }} 
              />
            </Box>

            {/* AI Analysis */}
            {habit.aiAnalysis && (
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2">AI Insights & Analysis</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>Formation Difficulty</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={habit.aiAnalysis.difficulty * 10} 
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2">
                        {habit.aiAnalysis.formationTime} days to form habit
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Motivation Strategy</Typography>
                      <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                        <Typography variant="body2">
                          {habit.aiAnalysis.motivation}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Progress History */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Recent Progress</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {habit.completedDates && habit.completedDates.slice(-7).map((date, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: isToday(new Date(date)) ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: isToday(new Date(date)) ? 'white' : 'text.secondary'
                    }}
                  >
                    {format(new Date(date), 'd')}
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Advanced Habit Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered habit formation with behavioral psychology insights
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Dashboard" />
        <Tab label="My Habits" />
        <Tab label="Analytics" />
        <Tab label="AI Coach" />
      </Tabs>

      {activeTab === 0 && renderAnalyticsDashboard()}
      
      {activeTab === 1 && (
        <Box>
          {/* Add Habit Section */}
          <Card sx={{ mb: 3, elevation: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Create Advanced Habit</Typography>
              
              <TextField
                fullWidth
                label="Habit Title"
                value={newHabit.title}
                onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                placeholder="What habit do you want to build?"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="Why is this habit important to you?"
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newHabit.category}
                      label="Category"
                      onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                    >
                      {habitCategories.map(cat => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {cat.icon} {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={newHabit.frequency}
                      label="Frequency"
                      onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => generateSmartHabitPlan(newHabit.title)}
                  disabled={!newHabit.title.trim() || isGenerating}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesome />}
                >
                  {isGenerating ? 'Analyzing...' : 'AI Plan'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddHabit}
                  disabled={!newHabit.title.trim()}
                  startIcon={<Add />}
                >
                  Create Habit
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Habits List */}
          <AnimatePresence>
            {habits.map(habit => renderHabitCard(habit))}
          </AnimatePresence>
        </Box>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                {/* Add detailed analytics charts */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>AI Habit Coach</Typography>
            <Typography variant="body2" color="text.secondary">
              Get personalized coaching and habit formation strategies from your AI coach
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add habit"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HabitTracker;
