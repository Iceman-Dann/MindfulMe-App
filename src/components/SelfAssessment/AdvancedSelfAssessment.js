import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Container,
  Grid,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fab,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  CircularProgress,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Zoom,
  Fade,
  Slide,
  Checkbox,
  TextField
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  EmojiEvents,
  Star,
  Lightbulb,
  Assessment,
  Timeline,
  Insights,
  AutoAwesome,
  Refresh,
  Share,
  Download,
  Visibility,
  Favorite,
  LocalFireDepartment,
  MilitaryTech,
  WorkspacePremium,
  Speed,
  GpsFixed,
  Analytics,
  HealthAndSafety,
  SelfImprovement,
  Mood,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  SentimentVeryDissatisfied
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const AdvancedSelfAssessment = () => {
  const theme = useTheme();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState(() => {
    const saved = localStorage.getItem('assessmentHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [personalizedGoals, setPersonalizedGoals] = useState(() => {
    const saved = localStorage.getItem('personalizedGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [wellnessScore, setWellnessScore] = useState(() => {
    const saved = localStorage.getItem('wellnessScore');
    return saved ? JSON.parse(saved) : 0;
  });
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('streakData');
    return saved ? JSON.parse(saved) : { current: 0, best: 0 };
  });
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [showPersonalInsights, setShowPersonalInsights] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Advanced assessment categories
  const assessmentCategories = [
    {
      id: 'emotional',
      title: 'Emotional Wellness',
      color: '#FF6B6B',
      questions: [
        'How would you rate your current emotional state?',
        'How well do you manage stress in daily life?',
        'How often do you practice self-care?',
        'How satisfied are you with your emotional relationships?',
        'How well do you understand your emotional triggers?'
      ]
    },
    {
      id: 'mental',
      title: 'Mental Clarity',
      color: '#4ECDC4',
      questions: [
        'How focused do you feel during work/study?',
        'How well are you sleeping lately?',
        'How often do you take breaks to recharge?',
        'How would you rate your decision-making ability?',
        'How often do you engage in mentally stimulating activities?'
      ]
    },
    {
      id: 'physical',
      title: 'Physical Health',
      color: '#45B7D1',
      questions: [
        'How would you rate your energy levels?',
        'How consistent is your exercise routine?',
        'How balanced is your diet?',
        'How well are you staying hydrated?',
        'How would you rate your overall physical fitness?'
      ]
    },
    {
      id: 'social',
      title: 'Social Connection',
      color: '#96CEB4',
      questions: [
        'How satisfied are you with your social life?',
        'How often do you connect with friends/family?',
        'How comfortable are you in social situations?',
        'How would you rate your support system?',
        'How often do you engage in community activities?'
      ]
    },
    {
      id: 'spiritual',
      title: 'Purpose & Meaning',
      color: '#FFEAA7',
      questions: [
        'How fulfilled do you feel in life?',
        'How clear are your life goals?',
        'How often do you engage in activities that bring you joy?',
        'How connected do you feel to your values?',
        'How would you rate your sense of purpose?'
      ]
    }
  ];

  // Helper function to get category icon
  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      emotional: <Mood />,
      mental: <Psychology />,
      physical: <HealthAndSafety />,
      social: <Favorite />,
      spiritual: <AutoAwesome />
    };
    return iconMap[categoryId] || <Assessment />;
  };

  // Generate AI-powered insights
  const generateAIInsights = async (assessmentData) => {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate score based on answers
    const answers = Object.values(assessmentData.answers);
    const avgScore = answers.reduce((sum, val) => sum + val, 0) / answers.length;
    const overallScore = Math.round((avgScore / 5) * 100);
    
    // Generate insights based on score and category
    const categoryInsights = {
      emotional: {
        strengths: overallScore >= 70 ? ["Emotional awareness", "Healthy expression"] : ["Self-reflection effort"],
        improvements: overallScore < 70 ? ["Emotional regulation", "Stress management"] : ["Maintaining balance"],
        recommendations: overallScore >= 70 
          ? ["Continue emotional journaling", "Practice gratitude daily", "Share feelings with trusted friends"]
          : ["Try deep breathing exercises", "Consider talking to a counselor", "Practice mindfulness"],
        motivation: overallScore >= 70 
          ? "Your emotional intelligence is a strength! Keep nurturing it."
          : "Emotional wellness is a journey. Be patient with yourself."
      },
      mental: {
        strengths: overallScore >= 70 ? ["Mental clarity", "Good focus"] : ["Effort in mental wellness"],
        improvements: overallScore < 70 ? ["Mental organization", "Cognitive rest"] : ["Preventing mental fatigue"],
        recommendations: overallScore >= 70
          ? ["Continue learning new things", "Practice mental challenges", "Maintain sleep schedule"]
          : ["Try meditation apps", "Reduce screen time before bed", "Take regular breaks"],
        motivation: overallScore >= 70
          ? "Your mind is sharp and focused! Keep challenging it."
          : "Mental clarity comes with practice. Small steps lead to big changes."
      },
      physical: {
        strengths: overallScore >= 70 ? ["Physical activity", "Healthy habits"] : ["Awareness of physical health"],
        improvements: overallScore < 70 ? ["Exercise consistency", "Nutrition balance"] : ["Preventing plateaus"],
        recommendations: overallScore >= 70
          ? ["Maintain your exercise routine", "Stay hydrated", "Get regular checkups"]
          : ["Start with 10-minute walks", "Add more vegetables to meals", "Establish sleep routine"],
        motivation: overallScore >= 70
          ? "Your physical health is excellent! Keep up the great work."
          : "Physical health is built one day at a time. You've got this!"
      },
      social: {
        strengths: overallScore >= 70 ? ["Social connections", "Communication"] : ["Effort in relationships"],
        improvements: overallScore < 70 ? ["Social boundaries", "Quality time"] : ["Deepening connections"],
        recommendations: overallScore >= 70
          ? ["Nurture important relationships", "Join group activities", "Practice active listening"]
          : ["Reach out to one friend weekly", "Join a club or group", "Practice saying 'no' when needed"],
        motivation: overallScore >= 70
          ? "Your social connections are thriving! Continue investing in them."
          : "Building social connections takes time. Start small and be consistent."
      },
      spiritual: {
        strengths: overallScore >= 70 ? ["Sense of purpose", "Inner peace"] : ["Spiritual exploration"],
        improvements: overallScore < 70 ? ["Purpose clarity", "Mindfulness practice"] : ["Deepening practice"],
        recommendations: overallScore >= 70
          ? ["Continue your spiritual practices", "Share your wisdom", "Help others find meaning"]
          : ["Try meditation or prayer", "Spend time in nature", "Journal about values"],
        motivation: overallScore >= 70
          ? "Your spiritual wellness is inspiring! Keep shining your light."
          : "Spiritual wellness is personal. Find what resonates with you."
      }
    };
    
    const insights = categoryInsights[assessmentData.category] || categoryInsights.emotional;
    
    return {
      overallScore,
      strengths: insights.strengths,
      improvements: insights.improvements,
      recommendations: insights.recommendations,
      warnings: [],
      motivation: insights.motivation,
      habits: ["Daily self-reflection", "Regular exercise", "Healthy eating", "Quality sleep"],
      goals: [
        `Improve ${assessmentData.title} wellness`,
        "Build consistent healthy habits",
        "Enhance self-awareness"
      ],
      resources: [
        "Meditation apps",
        "Wellness communities",
        "Health tracking tools",
        "Professional support resources"
      ]
    };
  };

  // Start new assessment
  const startAssessment = (category) => {
    setCurrentAssessment(category);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setActiveTab(1);
  };

  // Handle answer selection
  const handleAnswer = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Complete assessment and generate insights
  const completeAssessment = async () => {
    setIsAnalyzing(true);
    
    const assessmentData = {
      category: currentAssessment.id,
      title: currentAssessment.title,
      date: new Date().toISOString(),
      answers: answers,
      questions: currentAssessment.questions
    };

    const insights = await generateAIInsights(assessmentData);
    
    const completedAssessment = {
      ...assessmentData,
      insights: insights,
      id: uuidv4()
    };

    // Update state first
    const updatedHistory = [completedAssessment, ...assessmentHistory];
    setAssessmentHistory(updatedHistory);
    setAiInsights(insights);
    setShowResults(true);
    setIsAnalyzing(false);
    
    // Update wellness score
    if (insights?.overallScore) {
      setWellnessScore(insights.overallScore);
      localStorage.setItem('wellnessScore', JSON.stringify(insights.overallScore));
    }

    // Generate personalized goals from insights
    if (insights?.goals) {
      const newGoals = insights.goals.map((goal, index) => ({
        id: uuidv4(),
        title: goal,
        description: insights.recommendations?.[index] || 'Personalized goal based on your assessment',
        category: currentAssessment.title,
        completed: false,
        created: new Date().toISOString()
      }));
      setPersonalizedGoals(prev => {
        const updated = [...newGoals, ...prev].slice(0, 10); // Keep max 10 goals
        localStorage.setItem('personalizedGoals', JSON.stringify(updated));
        return updated;
      });
    }

    // Update achievements
    const newAchievement = {
      id: uuidv4(),
      title: `${currentAssessment.title} Completed`,
      description: `Score: ${insights.overallScore}/100`,
      date: new Date().toISOString(),
      category: currentAssessment.id
    };
    setAchievements(prev => {
      const updated = [newAchievement, ...prev].slice(0, 20); // Keep max 20 achievements
      localStorage.setItem('achievements', JSON.stringify(updated));
      return updated;
    });

    // Update streak data
    const today = new Date().toDateString();
    const lastAssessmentDate = assessmentHistory[0]?.date ? new Date(assessmentHistory[0].date).toDateString() : null;
    
    if (lastAssessmentDate !== today) {
      setStreakData(prev => {
        const updated = {
          current: prev.current + 1,
          best: Math.max(prev.current + 1, prev.best)
        };
        localStorage.setItem('streakData', JSON.stringify(updated));
        return updated;
      });
    }

    // Save to localStorage after state updates
    localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
    
    setSnackbar({
      open: true,
      message: 'Assessment completed! Check your personalized insights.',
      severity: 'success'
    });
  };

  // Toggle goal completion
  const toggleGoalCompletion = (goalId) => {
    setPersonalizedGoals(prev => {
      const updated = prev.map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      );
      localStorage.setItem('personalizedGoals', JSON.stringify(updated));
      return updated;
    });
  };

  // Add this function after the completeAssessment function
  const calculateProgress = () => {
    if (!currentAssessment) return 0;
    return ((Object.keys(answers).length / currentAssessment.questions.length) * 100);
  };

  // Get mood emoji based on score
  const getMoodEmoji = (score) => {
    if (score >= 80) return <SentimentVerySatisfied sx={{ fontSize: 40, color: '#4CAF50' }} />;
    if (score >= 60) return <SentimentSatisfied sx={{ fontSize: 40, color: '#8BC34A' }} />;
    if (score >= 40) return <SentimentNeutral sx={{ fontSize: 40, color: '#FFC107' }} />;
    if (score >= 20) return <SentimentDissatisfied sx={{ fontSize: 40, color: '#FF9800' }} />;
    return <SentimentVeryDissatisfied sx={{ fontSize: 40, color: '#F44336' }} />;
  };

  // Render assessment interface
  const renderAssessmentInterface = () => {
    if (!currentAssessment) {
      return (
        <Grid container spacing={3}>
          {assessmentCategories.map((category, index) => (
            <Grid item xs={12} md={6} lg={4} key={category.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => startAssessment(category)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: category.color, 
                        width: 80, 
                        height: 80, 
                        mx: 'auto', 
                        mb: 2,
                        fontSize: 40
                      }}
                    >
                      {getCategoryIcon(category.id)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.questions.length} questions
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{ mt: 2, bgcolor: category.color }}
                      fullWidth
                    >
                      Start Assessment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (showResults && aiInsights) {
      return (
        <Fade in={showResults}>
          <Box>
            {/* Results Header */}
            <Card sx={{ mb: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Assessment Complete!
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                  {getMoodEmoji(aiInsights.overallScore)}
                  <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {aiInsights.overallScore}/100
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {currentAssessment.title} Wellness Score
                </Typography>
              </CardContent>
            </Card>

            {/* AI Insights Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lightbulb color="primary" />
                      Key Strengths
                    </Typography>
                    <List>
                      {aiInsights.strengths?.map((strength, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><Star color="primary" /></ListItemIcon>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp color="warning" />
                      Areas for Growth
                    </Typography>
                    <List>
                      {aiInsights.improvements?.map((improvement, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><TrendingUp color="warning" /></ListItemIcon>
                          <ListItemText primary={improvement} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AutoAwesome color="secondary" />
                      Personalized Recommendations
                    </Typography>
                    <Grid container spacing={2}>
                      {aiInsights.recommendations?.map((rec, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {rec}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})` }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      {aiInsights.motivation}
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        setShowResults(false);
                        setCurrentAssessment(null);
                        setCurrentQuestion(0);
                        setAnswers({});
                        setActiveTab(0);
                      }}
                      sx={{ mt: 2 }}
                    >
                      Take Another Assessment
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => setActiveTab(1)}
                      sx={{ mt: 2, ml: 1 }}
                    >
                      View Personal Insights
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      );
    }

    return (
      <Box>
        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {currentAssessment.title} Assessment
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {currentAssessment.questions.length}
          </Typography>
        </Box>

        {/* Current Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ py: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {currentAssessment.questions[currentQuestion]}
              </Typography>
              
              {/* Answer Options */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={answers[currentQuestion] === value ? 'contained' : 'outlined'}
                    size="large"
                    onClick={() => handleAnswer(currentQuestion, value)}
                    sx={{ 
                      minWidth: 80,
                      height: 80,
                      borderRadius: '50%',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </Box>
              
              <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
                (1 = Strongly Disagree, 5 = Strongly Agree)
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            startIcon={<Refresh />}
          >
            Previous
          </Button>
          
          <Button
            variant="contained"
            onClick={nextQuestion}
            disabled={!answers[currentQuestion]}
            endIcon={currentQuestion === currentAssessment.questions.length - 1 ? <Assessment /> : <TrendingUp />}
          >
            {currentQuestion === currentAssessment.questions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Box>
      </Box>
    );
  };

  // Render personal insights with AI chat
  const renderPersonalInsights = () => {
    const latestAssessment = assessmentHistory[0];
    
    const handleChatMessage = async () => {
      if (!chatInput.trim()) return;
      
      const userMessage = {
        id: uuidv4(),
        text: chatInput,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setIsChatLoading(true);
      
      // Simulate API delay for better UX
      setTimeout(() => {
        const aiResponse = {
          id: uuidv4(),
          text: getWellnessResponse(chatInput, latestAssessment),
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        
        setChatMessages(prev => [...prev, aiResponse]);
        setIsChatLoading(false);
        setChatInput('');
      }, 1000);
    };

    // Helper function to provide contextual wellness responses
    const getWellnessResponse = (userInput, assessment) => {
      const lowerInput = userInput.toLowerCase();
      
      // Contextual responses based on assessment results
      if (assessment?.insights) {
        if (lowerInput.includes('score') || lowerInput.includes('result')) {
          return `Your wellness score is ${assessment.insights.overallScore}/100. ${assessment.insights.motivation}`;
        }
        if (lowerInput.includes('improve') || lowerInput.includes('better')) {
          return `Based on your assessment, focus on: ${assessment.insights.recommendations?.slice(0, 2).join(' and ') || 'building healthy habits'}. Remember that ${assessment.insights.motivation.toLowerCase()}`;
        }
      }
      
      // General wellness responses
      if (lowerInput.includes('stress') || lowerInput.includes('anxious') || lowerInput.includes('worry')) {
        return "I understand you're feeling stressed. Try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system. Also, try identifying one small thing you can control right now.";
      } else if (lowerInput.includes('sleep') || lowerInput.includes('tired') || lowerInput.includes('insomnia')) {
        return "Sleep issues are common. Try establishing a 'wind-down' routine: no screens 1 hour before bed, keep your room cool (65-68°F), and try progressive muscle relaxation. Avoid caffeine after 2 PM and consider writing down worries before bed.";
      } else if (lowerInput.includes('motivation') || lowerInput.includes('energy') || lowerInput.includes('lazy')) {
        return "For motivation, try the '2-minute rule': if something takes less than 2 minutes, do it now. For bigger tasks, just start for 5 minutes. Celebrate small wins - your brain releases dopamine when you acknowledge progress, even tiny steps.";
      } else if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('fitness')) {
        return "Movement is medicine! Even 10 minutes of walking boosts mood and creativity. Try 'exercise snacking' - short bursts throughout the day. Find something you enjoy: dancing, yoga, or just walking in nature. Consistency beats intensity every time.";
      } else if (lowerInput.includes('diet') || lowerInput.includes('food') || lowerInput.includes('eat')) {
        return "Focus on adding rather than restricting. Try the 'plate method': half your plate vegetables, quarter protein, quarter complex carbs. Stay hydrated - sometimes thirst mimics hunger. Remember, perfection isn't the goal - progress is.";
      } else if (lowerInput.includes('relationship') || lowerInput.includes('friend') || lowerInput.includes('family')) {
        return "Healthy relationships require boundaries and communication. Try 'I feel' statements instead of accusations. Quality time matters more than quantity. It's okay to say no to protect your energy - true supporters will understand.";
      } else if (lowerInput.includes('work') || lowerInput.includes('job') || lowerInput.includes('career')) {
        return "Work-life balance isn't about equal time - it's about feeling fulfilled in both. Try setting clear boundaries: no work emails after 7 PM, take actual lunch breaks, and use your vacation days. Your worth isn't measured by your productivity.";
      } else if (lowerInput.includes('mindfulness') || lowerInput.includes('meditation') || lowerInput.includes('present')) {
        return "Mindfulness isn't about emptying your mind - it's about observing thoughts without judgment. Try '5-4-3-2-1 grounding': notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you to the present moment.";
      } else if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('unhappy')) {
        return "It's okay to feel sad - emotions are information, not instructions. Try 'behavioral activation': do one small thing you used to enjoy, even if you don't feel like it. Sunlight for 10 minutes, a short walk, or calling a friend can help. Be gentle with yourself.";
      } else if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('frustrated')) {
        return "Anger is often a secondary emotion - what's underneath it? Try the 'STOP' technique: Stop, Take a breath, Observe what's happening, Proceed mindfully. Physical activity can help process anger - try push-ups, running, or even just screaming into a pillow.";
      } else {
        return "I'm here to support your wellness journey. Based on what you've shared, I'd suggest focusing on small, consistent changes rather than big overhauls. What specific area of wellness would you like to explore - mental health, physical health, relationships, or something else?";
      }
    };

    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Personal Insights & AI Coach
        </Typography>

        <Grid container spacing={3}>
          {/* Latest Assessment Insights */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Insights color="primary" />
                  Latest Assessment Insights
                </Typography>
                
                {latestAssessment ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      {getMoodEmoji(latestAssessment.insights?.overallScore || 0)}
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {latestAssessment.insights?.overallScore || 0}/100
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {latestAssessment.title || 'Assessment'} - {format(new Date(latestAssessment.date), 'MMM dd, yyyy')}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Key Strengths:</Typography>
                      {(latestAssessment.insights?.strengths || []).length > 0 ? (
                        latestAssessment.insights.strengths.map((strength, index) => (
                          <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                            • {strength}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No strengths recorded yet
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
                      {(latestAssessment.insights?.recommendations || []).slice(0, 3).length > 0 ? (
                        latestAssessment.insights.recommendations.slice(0, 3).map((rec, index) => (
                          <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                            • {rec}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No recommendations available yet
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Complete an assessment to see your personalized insights
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* AI Chat Interface */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology color="secondary" />
                  AI Wellness Coach
                </Typography>
                
                {/* Chat Messages */}
                <Box sx={{ 
                  flexGrow: 1, 
                  overflowY: 'auto', 
                  mb: 2, 
                  p: 1, 
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                  borderRadius: 1,
                  maxHeight: 250
                }}>
                  {chatMessages.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      Ask me anything about your wellness journey!
                    </Typography>
                  )}
                  {chatMessages.map((msg, index) => (
                    <Box key={msg.id || index} sx={{ mb: 2 }}>
                      <Paper sx={{ 
                        p: 1.5, 
                        bgcolor: (msg.sender === 'user' || msg.role === 'user') ? 'primary.main' : 'grey.100',
                        color: (msg.sender === 'user' || msg.role === 'user') ? 'white' : 'text.primary',
                        ml: (msg.sender === 'user' || msg.role === 'user') ? 8 : 0,
                        mr: (msg.sender === 'ai' || msg.role === 'assistant') ? 8 : 0
                      }}>
                        <Typography variant="body2">
                          {msg.text || msg.content}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  {isChatLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Box>
                
                {/* Chat Input */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ask about your wellness..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                    disabled={isChatLoading}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleChatMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                  >
                    Send
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render analytics dashboard
  const renderAnalytics = () => {
    const recentAssessments = assessmentHistory.slice(0, 10);
    
    const chartData = recentAssessments.map((assessment, index) => ({
      date: format(new Date(assessment.date), 'MMM dd'),
      score: assessment.insights?.overallScore || 0,
      category: assessment.category
    }));

    const categoryData = assessmentCategories.map(category => {
      const categoryAssessments = assessmentHistory.filter(a => a.category === category.id);
      const avgScore = categoryAssessments.length > 0 
        ? categoryAssessments.reduce((sum, a) => sum + (a.insights?.overallScore || 0), 0) / categoryAssessments.length
        : 0;
      
      return {
        category: category.title,
        score: Math.round(avgScore),
        fullMark: 100
      };
    });

    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Wellness Analytics
        </Typography>

        {assessmentHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No assessment data yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Complete assessments to see your wellness analytics and progress over time
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setActiveTab(0)}
            >
              Start Assessment
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
          {/* Overview Cards */}
          <Grid item xs={12} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, #667eea, #764ba2)`, color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {wellnessScore || 0}
                </Typography>
                <Typography variant="body2">
                  Current Wellness Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, #f093fb, #f5576c)`, color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {streakData?.current || 0}
                </Typography>
                <Typography variant="body2">
                  Day Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, #4facfe, #00f2fe)`, color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {assessmentHistory.length}
                </Typography>
                <Typography variant="body2">
                  Total Assessments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, #43e97b, #38f9d7)`, color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MilitaryTech sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {achievements?.length || 0}
                </Typography>
                <Typography variant="body2">
                  Achievements
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Wellness Progress Over Time
                </Typography>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No data available for chart
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Category Radar */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Wellness by Category
                </Typography>
                {assessmentHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={categoryData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No category data available yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Assessments */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Assessment History
                </Typography>
                {recentAssessments.length > 0 ? (
                  <List>
                    {recentAssessments.map((assessment) => (
                      <ListItem key={assessment.id} divider>
                        <ListItemIcon>
                          {getMoodEmoji(assessment.insights?.overallScore || 0)}
                        </ListItemIcon>
                        <ListItemText
                          primary={assessment.title}
                          secondary={`${format(new Date(assessment.date), 'MMM dd, yyyy')} - Score: ${assessment.insights?.overallScore || 0}/100`}
                        />
                        <Chip 
                          label={assessment.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No assessment history available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        )}
      </Box>
    );
  };

  // Render goals and achievements
  const renderGoalsAchievements = () => (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Goals & Achievements
      </Typography>

      <Grid container spacing={3}>
        {/* Personalized Goals */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GpsFixed color="primary" />
                Your Wellness Goals
              </Typography>
              
              {personalizedGoals && personalizedGoals.length > 0 ? (
                <List>
                  {personalizedGoals.map((goal, index) => (
                    <ListItem key={goal.id || index} divider>
                      <ListItemIcon>
                        <Checkbox 
                          checked={goal.completed || false} 
                          onChange={() => toggleGoalCompletion(goal.id || index)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={goal.title}
                        secondary={goal.description}
                        sx={{ 
                          textDecoration: goal.completed ? 'line-through' : 'none',
                          opacity: goal.completed ? 0.7 : 1
                        }}
                      />
                      <Chip 
                        label={goal.category || 'General'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Complete assessments to generate personalized goals
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => setActiveTab(0)}
                  >
                    Start Assessment
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents color="warning" />
                Achievements
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <Paper key={achievement.id || index} sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <WorkspacePremium color="warning" />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {achievement.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          {achievement.date && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {format(new Date(achievement.date), 'MMM dd, yyyy')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No achievements yet. Keep taking assessments!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Advanced Self Assessment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered wellness analysis with personalized insights and recommendations
        </Typography>
      </Box>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">
              AI is analyzing your responses...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generating personalized insights
            </Typography>
          </Card>
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Button
          onClick={() => setActiveTab(0)}
          variant={activeTab === 0 ? 'contained' : 'text'}
          sx={{ mr: 2 }}
          startIcon={<Assessment />}
        >
          Assessments
        </Button>
        <Button
          onClick={() => setActiveTab(1)}
          variant={activeTab === 1 ? 'contained' : 'text'}
          sx={{ mr: 2 }}
          startIcon={<Insights />}
        >
          Personal Insights
        </Button>
        <Button
          onClick={() => setActiveTab(2)}
          variant={activeTab === 2 ? 'contained' : 'text'}
          sx={{ mr: 2 }}
          startIcon={<Analytics />}
        >
          Analytics
        </Button>
        <Button
          onClick={() => setActiveTab(3)}
          variant={activeTab === 3 ? 'contained' : 'text'}
          startIcon={<EmojiEvents />}
        >
          Goals & Achievements
        </Button>
      </Box>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 0 && renderAssessmentInterface()}
        {activeTab === 1 && renderPersonalInsights()}
        {activeTab === 2 && renderAnalytics()}
        {activeTab === 3 && renderGoalsAchievements()}
      </AnimatePresence>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => setActiveTab(0)}
      >
        <Psychology />
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdvancedSelfAssessment;
