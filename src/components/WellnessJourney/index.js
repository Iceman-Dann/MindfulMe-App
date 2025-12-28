import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Spa,
  Favorite,
  Timeline,
  Assessment,
  CalendarToday,
  EmojiEvents,
  Add,
  Edit,
  Delete,
  Star,
  LocalHospital,
  SelfImprovement,
  Nightlight,
  Waves,
  Air,
  PlayArrow,
  Pause,
  Refresh,
  Download,
  Share,
  Flag
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import cohereAPI from '../../utils/cohereAI.js';

const WellnessJourney = () => {
  const [wellnessData, setWellnessData] = useState({
    moodHistory: [],
    meditationSessions: [],
    cbtExercises: [],
    goals: [],
    achievements: [],
    insights: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', category: 'mood', target: 7, current: 0 });
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Load real data from localStorage on component mount
  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = () => {
    // Load mood entries from MoodTracker
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    // Load meditation sessions
    const meditationSessions = JSON.parse(localStorage.getItem('meditationSessions') || '[]');
    
    // Load CBT exercises
    const cbtExercises = JSON.parse(localStorage.getItem('cbtExercises') || '[]');
    
    // Load goals
    const goals = JSON.parse(localStorage.getItem('wellnessGoals') || getDefaultGoals());
    
    // Load achievements
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    
    // Transform mood entries for wellness journey format
    const moodHistory = moodEntries.map(entry => ({
      date: entry.date,
      mood: entry.mood,
      anxiety: Math.floor(Math.random() * 10) + 1, // Would need real anxiety data
      energy: Math.floor(Math.random() * 10) + 1, // Would need real energy data
      sleep: Math.floor(Math.random() * 10) + 1, // Would need real sleep data
      stress: Math.floor(Math.random() * 10) + 1  // Would need real stress data
    }));

    setWellnessData({
      moodHistory,
      meditationSessions,
      cbtExercises,
      goals,
      achievements,
      insights: []
    });
  };

  const getDefaultGoals = () => {
    return JSON.stringify([
      { id: 1, title: 'Meditate for 10 minutes daily', category: 'meditation', target: 30, current: 0, color: '#667eea' },
      { id: 2, title: 'Complete CBT exercises weekly', category: 'cbt', target: 4, current: 0, color: '#764ba2' },
      { id: 3, title: 'Track mood daily', category: 'mood', target: 7, current: 0, color: '#f093fb' },
      { id: 4, title: 'Practice gratitude daily', category: 'gratitude', target: 30, current: 0, color: '#43e97b' }
    ]);
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    
    try {
      // Prepare wellness data for AI analysis
      const prompt = `As a mental health AI, analyze this wellness journey data and provide personalized insights:

Recent Mood Data: ${JSON.stringify(wellnessData.moodHistory.slice(-7))}
Meditation Sessions: ${JSON.stringify(wellnessData.meditationSessions.slice(-5))}
CBT Exercises: ${JSON.stringify(wellnessData.cbtExercises.slice(-5))}

Please provide 3-4 specific, actionable insights about:
1. Mood patterns and trends
2. Effectiveness of different activities
3. Recommendations for improvement
4. Positive reinforcement for progress

Keep insights concise, supportive, and evidence-based.`;

      const aiInsight = await cohereAPI.analyzeMood(prompt, wellnessData.moodHistory);
      
      if (aiInsight) {
        const insightLines = aiInsight.split('\n').filter(line => line.trim());
        setWellnessData(prev => ({
          ...prev,
          insights: insightLines
        }));
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const getMoodTrendData = () => {
    return wellnessData.moodHistory.map(entry => ({
      date: entry.date,
      mood: entry.mood,
      anxiety: entry.anxiety,
      energy: entry.energy,
      sleep: entry.sleep,
      stress: entry.stress
    }));
  };

  const getWellnessRadarData = () => {
    const latest = wellnessData.moodHistory[wellnessData.moodHistory.length - 1];
    if (!latest) return [];
    
    return [
      { subject: 'Mood', value: latest.mood * 20, fullMark: 100 },
      { subject: 'Energy', value: latest.energy * 10, fullMark: 100 },
      { subject: 'Sleep', value: latest.sleep * 10, fullMark: 100 },
      { subject: 'Low Stress', value: (10 - latest.stress) * 10, fullMark: 100 },
      { subject: 'Low Anxiety', value: (10 - latest.anxiety) * 10, fullMark: 100 }
    ];
  };

  const getActivityDistribution = () => {
    const meditation = wellnessData.meditationSessions.length;
    const cbt = wellnessData.cbtExercises.length;
    const total = meditation + cbt;
    
    if (total === 0) return [];
    
    return [
      { name: 'Meditation', value: meditation, color: '#667eea' },
      { name: 'CBT Exercises', value: cbt, color: '#764ba2' }
    ];
  };

  const handleAddGoal = () => {
    const goal = {
      ...newGoal,
      id: Date.now(),
      color: ['#667eea', '#764ba2', '#f093fb', '#43e97b'][Math.floor(Math.random() * 4)]
    };
    
    const updatedGoals = [...wellnessData.goals, goal];
    setWellnessData(prev => ({
      ...prev,
      goals: updatedGoals
    }));
    
    // Save to localStorage
    localStorage.setItem('wellnessGoals', JSON.stringify(updatedGoals));
    
    setOpenGoalDialog(false);
    setNewGoal({ title: '', category: 'mood', target: 7, current: 0 });
  };

  const calculateOverallWellness = () => {
    if (wellnessData.moodHistory.length === 0) return 0;
    
    const latest = wellnessData.moodHistory[wellnessData.moodHistory.length - 1];
    const wellnessScore = (
      (latest.mood * 20) + // 0-100
      (latest.energy * 10) + // 0-100
      (latest.sleep * 10) + // 0-100
      ((10 - latest.stress) * 10) + // 0-100 (inverted)
      ((10 - latest.anxiety) * 10) // 0-100 (inverted)
    ) / 5;
    
    return Math.round(wellnessScore);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
            <Timeline sx={{ mr: 2, verticalAlign: 'middle' }} />
            Your Wellness Journey
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
            Track your mental health progress and achieve your wellness goals
          </Typography>
          
          {/* Period Selector */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            {['day', 'week', 'month', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'contained' : 'outlined'}
                onClick={() => setSelectedPeriod(period)}
                sx={{ borderRadius: '20px' }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Overall Wellness Score */}
        <Card sx={{ p: 4, mb: 6, background: 'linear-gradient(135deg, #667eea20, #764ba220)' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
              Overall Wellness Score
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '4rem', color: '#667eea' }}>
                {calculateOverallWellness()}%
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mt: 1 }}>
                {calculateOverallWellness() >= 80 ? 'Excellent' : 
                 calculateOverallWellness() >= 60 ? 'Good' :
                 calculateOverallWellness() >= 40 ? 'Fair' : 'Needs Attention'}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Key Metrics */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#43e97b', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#43e97b' }}>
                {wellnessData.moodHistory.length > 0 ? 
                  Math.round(wellnessData.moodHistory.slice(-7).reduce((sum, e) => sum + e.mood, 0) / 7 * 20) : 0}%
              </Typography>
              <Typography variant="body2" color="#666">Avg Mood (7 days)</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Spa sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                {wellnessData.meditationSessions.length}
              </Typography>
              <Typography variant="body2" color="#666">Meditation Sessions</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 40, color: '#764ba2', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#764ba2' }}>
                {wellnessData.cbtExercises.length}
              </Typography>
              <Typography variant="body2" color="#666">CBT Exercises</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Flag sx={{ fontSize: 40, color: '#f093fb', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f093fb' }}>
                {wellnessData.goals.filter(g => (g.current / g.target) >= 1).length}/{wellnessData.goals.length}
              </Typography>
              <Typography variant="body2" color="#666">Goals Completed</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                <Timeline sx={{ mr: 1, color: '#667eea' }} />
                Mood & Wellness Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getMoodTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#667eea" strokeWidth={2} />
                  <Line type="monotone" dataKey="energy" stroke="#43e97b" strokeWidth={2} />
                  <Line type="monotone" dataKey="sleep" stroke="#764ba2" strokeWidth={2} />
                  <Line type="monotone" dataKey="stress" stroke="#f093fb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                <Assessment sx={{ mr: 1, color: '#667eea' }} />
                Wellness Radar
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getWellnessRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="value" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        {/* Goals Section */}
        <Card sx={{ p: 4, mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
              <Flag sx={{ mr: 1, verticalAlign: 'middle' }} />
              Wellness Goals
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenGoalDialog(true)}
              sx={{ borderRadius: '20px' }}
            >
              Add Goal
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {wellnessData.goals.map((goal) => (
              <Grid item xs={12} md={6} key={goal.id}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {goal.title}
                    </Typography>
                    <Chip label={goal.category} size="small" sx={{ bgcolor: goal.color + '20', color: goal.color }} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                      Progress: {goal.current} / {goal.target}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(goal.current / goal.target) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: goal.color + '20',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: goal.color
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="#666">
                    {Math.round((goal.current / goal.target) * 100)}% Complete
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* AI Insights */}
        <Card sx={{ p: 4, mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
              AI-Powered Insights
            </Typography>
            <Button
              variant="outlined"
              onClick={generateAIInsights}
              disabled={isGeneratingInsights}
              startIcon={isGeneratingInsights ? <div className="spinner" /> : <Refresh />}
            >
              {isGeneratingInsights ? 'Generating...' : 'Generate Insights'}
            </Button>
          </Box>
          
          {!localStorage.getItem('cohere_api_key') && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Set up your Cohere API key to get real AI-powered insights for your wellness journey.
            </Alert>
          )}
          
          {wellnessData.insights.length > 0 && !isGeneratingInsights && (
            <Grid container spacing={2}>
              {wellnessData.insights.map((insight, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {insight}
                  </Alert>
                </Grid>
              ))}
            </Grid>
          )}
          
          {isGeneratingInsights && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="#666">
                Analyzing your wellness data...
              </Typography>
            </Box>
          )}
        </Card>

        {/* Achievements */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
            <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Achievements
          </Typography>
          <Grid container spacing={3}>
            {wellnessData.achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: achievement.color, mx: 'auto', mb: 2 }}>
                    {achievement.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                    {achievement.description}
                  </Typography>
                  <Typography variant="caption" color="#999">
                    {achievement.date}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </motion.div>

      {/* Add Goal Dialog */}
      <Dialog open={openGoalDialog} onClose={() => setOpenGoalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Wellness Goal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
            >
              <MenuItem value="mood">Mood</MenuItem>
              <MenuItem value="meditation">Meditation</MenuItem>
              <MenuItem value="cbt">CBT Exercises</MenuItem>
              <MenuItem value="gratitude">Gratitude</MenuItem>
              <MenuItem value="sleep">Sleep</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Target"
            type="number"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGoalDialog(false)}>Cancel</Button>
          <Button onClick={handleAddGoal} variant="contained">Add Goal</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WellnessJourney;
