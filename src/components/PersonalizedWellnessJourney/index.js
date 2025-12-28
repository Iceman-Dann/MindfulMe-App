import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  EmojiEvents,
  CalendarToday,
  SelfImprovement,
  Favorite,
  Lightbulb,
  Star,
  Timeline,
  Target,
  LocalFireDepartment,
  Water,
  Nightlight,
  DirectionsRun,
  MenuBook,
  People,
  Refresh,
  PlayArrow,
  CheckCircle,
  Lock
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import cohereAPI from '../../utils/cohereAI';

const PersonalizedWellnessJourney = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [wellnessPlan, setWellnessPlan] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);

  const wellnessCategories = [
    { name: 'Mindfulness', icon: <SelfImprovement />, color: '#9c27b0' },
    { name: 'Physical Activity', icon: <DirectionsRun />, color: '#f44336' },
    { name: 'Sleep', icon: <Nightlight />, color: '#2196f3' },
    { name: 'Nutrition', icon: <Water />, color: '#4caf50' },
    { name: 'Social Connection', icon: <People />, color: '#ff9800' },
    { name: 'Learning', icon: <MenuBook />, color: '#795548' }
  ];

  useEffect(() => {
    initializeWellnessJourney();
  }, []);

  const initializeWellnessJourney = async () => {
    // Load or create user profile
    const profile = await loadUserProfile();
    setUserProfile(profile);
    
    // Generate personalized wellness plan
    await generateWellnessPlan(profile);
    
    // Load progress data
    loadProgressData();
    
    // Load achievements
    loadAchievements();
  };

  const loadUserProfile = () => {
    // Simulated user profile - in real app, this would come from backend
    return {
      age: 25,
      goals: ['reduce anxiety', 'improve sleep', 'build resilience'],
      preferences: ['meditation', 'yoga', 'journaling'],
      challenges: ['stress', 'procrastination'],
      schedule: 'busy',
      personality: 'introverted',
      currentMood: 'neutral',
      stressLevel: 6,
      sleepQuality: 5,
      activityLevel: 3
    };
  };

  const generateWellnessPlan = async (profile) => {
    setIsGenerating(true);
    
    try {
      const prompt = `Create a personalized mental wellness journey based on this user profile:

User Profile:
- Age: ${profile.age}
- Goals: ${profile.goals.join(', ')}
- Preferences: ${profile.preferences.join(', ')}
- Challenges: ${profile.challenges.join(', ')}
- Schedule: ${profile.schedule}
- Personality: ${profile.personality}
- Current Mood: ${profile.currentMood}
- Stress Level: ${profile.stressLevel}/10
- Sleep Quality: ${profile.sleepQuality}/10
- Activity Level: ${profile.activityLevel}/10

Generate a comprehensive 30-day wellness plan with:

1. Weekly themes and focus areas
2. Daily activities and exercises
3. Progress milestones
4. Personalized recommendations
5. Adaptive difficulty levels

Format as JSON:
{
  "title": "Wellness Journey Title",
  "description": "Brief description",
  "duration": 30,
  "weekly_themes": [
    {
      "week": 1,
      "theme": "theme_name",
      "focus": "main_focus",
      "activities": ["activity1", "activity2"]
    }
  ],
  "daily_tasks": [
    {
      "day": 1,
      "tasks": [
        {
          "title": "task_title",
          "description": "task_description",
          "category": "mindfulness|physical|sleep|nutrition|social|learning",
          "duration_minutes": 10,
          "difficulty": "easy|medium|hard",
          "points": 10
        }
      ]
    }
  ],
  "milestones": [
    {
      "day": 7,
      "title": "milestone_title",
      "description": "milestone_description",
      "reward": "reward_description"
    }
  ],
  "insights": ["insight1", "insight2"]
}

Wellness Plan:`;

      const response = await cohereAPI.generateWellnessAdvice(prompt);
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const plan = JSON.parse(jsonMatch[0]);
          setWellnessPlan(plan);
          setDailyTasks(plan.daily_tasks || []);
          setInsights(plan.insights || []);
        }
      } catch (parseError) {
        console.error('Error parsing wellness plan:', parseError);
        // Fallback plan
        setWellnessPlan(createFallbackPlan());
      }
      
    } catch (error) {
      console.error('Error generating wellness plan:', error);
      setWellnessPlan(createFallbackPlan());
    } finally {
      setIsGenerating(false);
    }
  };

  const createFallbackPlan = () => {
    return {
      title: "MindfulMe 30-Day Journey",
      description: "A personalized path to mental wellness",
      duration: 30,
      weekly_themes: [
        { week: 1, theme: "Mindful Foundations", focus: "Building awareness", activities: ["Meditation", "Breathing exercises"] },
        { week: 2, theme: "Emotional Intelligence", focus: "Understanding emotions", activities: ["Journaling", "Mood tracking"] },
        { week: 3, theme: "Resilience Building", focus: "Coping strategies", activities: ["CBT exercises", "Stress management"] },
        { week: 4, theme: "Sustainable Wellness", focus: "Long-term habits", activities: ["Habit formation", "Self-care"] }
      ],
      daily_tasks: generateSampleTasks(),
      milestones: [
        { day: 7, title: "First Week Complete", description: "Established mindfulness practice", reward: "50 bonus points" },
        { day: 14, title: "Halfway There", description: "Developed emotional awareness", reward: "100 bonus points" },
        { day: 21, title: "Three Weeks Strong", description: "Built resilience skills", reward: "150 bonus points" },
        { day: 30, title: "Journey Complete", description: "Transformed mental wellness", reward: "500 bonus points" }
      ],
      insights: [
        "Consistency is more important than intensity",
        "Small daily actions create big changes",
        "Self-compassion accelerates progress"
      ]
    };
  };

  const generateSampleTasks = () => {
    const tasks = [];
    for (let day = 1; day <= 30; day++) {
      tasks.push({
        day,
        tasks: [
          {
            title: "Morning Meditation",
            description: "Start your day with 10 minutes of mindfulness",
            category: "mindfulness",
            duration_minutes: 10,
            difficulty: "easy",
            points: 10
          },
          {
            title: "Gratitude Journal",
            description: "Write 3 things you're grateful for",
            category: "learning",
            duration_minutes: 5,
            difficulty: "easy",
            points: 5
          }
        ]
      });
    }
    return tasks;
  };

  const loadProgressData = () => {
    // Simulated progress data
    const data = [
      { day: 'Mon', mood: 6, anxiety: 7, energy: 5 },
      { day: 'Tue', mood: 7, anxiety: 6, energy: 6 },
      { day: 'Wed', mood: 8, anxiety: 5, energy: 7 },
      { day: 'Thu', mood: 7, anxiety: 6, energy: 6 },
      { day: 'Fri', mood: 9, anxiety: 4, energy: 8 },
      { day: 'Sat', mood: 8, anxiety: 5, energy: 7 },
      { day: 'Sun', mood: 9, anxiety: 3, energy: 9 }
    ];
    setProgressData(data);
  };

  const loadAchievements = () => {
    const achievements = [
      { id: 1, title: "First Step", description: "Complete your first task", icon: <Star />, earned: true, points: 10 },
      { id: 2, title: "Week Warrior", description: "7-day streak", icon: <LocalFireDepartment />, earned: true, points: 50 },
      { id: 3, title: "Mindfulness Master", description: "30 minutes total meditation", icon: <SelfImprovement />, earned: false, points: 100 },
      { id: 4, title: "Consistency King", description: "14-day streak", icon: <EmojiEvents />, earned: false, points: 200 }
    ];
    setAchievements(achievements);
  };

  const handleTaskComplete = (taskId) => {
    // Mark task as complete and update progress
    setDailyTasks(prev => prev.map(day => ({
      ...day,
      tasks: day.tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    })));
  };

  const getCategoryData = () => {
    return wellnessCategories.map(cat => ({
      name: cat.name,
      value: Math.floor(Math.random() * 100) + 20,
      color: cat.color
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <OverviewTab />;
      case 1: return <DailyTasksTab />;
      case 2: return <ProgressTab />;
      case 3: return <AchievementsTab />;
      default: return <OverviewTab />;
    }
  };

  const OverviewTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Your Wellness Journey
          </Typography>
          {wellnessPlan ? (
            <Box>
              <Typography variant="h5" color="primary" mb={1}>
                {wellnessPlan.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {wellnessPlan.description}
              </Typography>
              
              <Box mb={3}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Overall Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  65% Complete
                </Typography>
              </Box>

              <Typography variant="h6" mb={2}>Weekly Themes</Typography>
              {wellnessPlan.weekly_themes?.map((week, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Week {week.week}: {week.theme}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Focus: {week.focus}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Wellness Categories
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
            {wellnessCategories.map((cat, index) => (
              <Chip
                key={index}
                icon={cat.icon}
                label={cat.name}
                size="small"
                sx={{ backgroundColor: cat.color, color: 'white' }}
              />
            ))}
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold" display="flex" alignItems="center">
            <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
            Personalized Insights
          </Typography>
          {insights.map((insight, index) => (
            <Alert key={index} severity="info" sx={{ mb: 1 }}>
              {insight}
            </Alert>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  const DailyTasksTab = () => (
    <Grid container spacing={3}>
      {dailyTasks.slice(0, 7).map((day) => (
        <Grid item xs={12} md={6} lg={4} key={day.day}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Day {day.day}
                </Typography>
              </Box>
              
              {day.tasks?.map((task, taskIndex) => (
                <Paper key={taskIndex} variant="outlined" sx={{ p: 2, mb: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Chip
                          label={task.category}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {task.duration_minutes} min • {task.points} pts
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      color="primary"
                      onClick={() => handleTaskComplete(task.id)}
                      disabled={task.completed}
                    >
                      {task.completed ? <CheckCircle color="success" /> : <PlayArrow />}
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const ProgressTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Weekly Mood & Energy Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#4caf50" strokeWidth={2} />
              <Line type="monotone" dataKey="energy" stroke="#2196f3" strokeWidth={2} />
              <Line type="monotone" dataKey="anxiety" stroke="#f44336" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  const AchievementsTab = () => (
    <Grid container spacing={3}>
      {achievements.map((achievement) => (
        <Grid item xs={12} sm={6} md={4} key={achievement.id}>
          <Card elevation={3} sx={{ 
            opacity: achievement.earned ? 1 : 0.6,
            position: 'relative'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: achievement.earned ? 'primary.main' : 'grey.400', mr: 2 }}>
                  {achievement.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Chip
                  label={`${achievement.points} points`}
                  size="small"
                  color={achievement.earned ? 'primary' : 'default'}
                />
                {achievement.earned ? (
                  <CheckCircle color="success" />
                ) : (
                  <Lock color="action" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (isGenerating) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Generating Your Personalized Wellness Journey...
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={8} sx={{ maxWidth: 1200, mx: 'auto', borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Psychology sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              AI-Powered Wellness Journey
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Your personalized mental health program powered by machine learning and AI insights.
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="Overview" icon={<TrendingUp />} />
            <Tab label="Daily Tasks" icon={<CalendarToday />} />
            <Tab label="Progress" icon={<Timeline />} />
            <Tab label="Achievements" icon={<EmojiEvents />} />
          </Tabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => generateWellnessPlan(userProfile)}
              disabled={isGenerating}
            >
              Regenerate Plan
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalizedWellnessJourney;
