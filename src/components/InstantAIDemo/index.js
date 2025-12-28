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
  TextField,
  Alert,
  CircularProgress,
  Badge,
  Fab
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  SentimentVerySatisfied,
  SentimentNeutral,
  SentimentVeryDissatisfied,
  AutoAwesome,
  Speed,
  Lightbulb,
  Chat,
  Star,
  RocketLaunch,
  Refresh,
  Send
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import cohereAPI from '../../utils/cohereAI';

const InstantAIDemo = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [moodHistory, setMoodHistory] = useState([
    { day: 'Mon', mood: 6, stress: 7, energy: 5 },
    { day: 'Tue', mood: 7, stress: 6, energy: 6 },
    { day: 'Wed', mood: 8, stress: 5, energy: 7 },
    { day: 'Thu', mood: 7, stress: 6, energy: 6 },
    { day: 'Fri', mood: 9, stress: 4, energy: 8 },
    { day: 'Sat', mood: 8, stress: 5, energy: 7 },
    { day: 'Sun', mood: 9, stress: 3, energy: 9 }
  ]);
  const [wellnessScore, setWellnessScore] = useState(75);
  const [insights, setInsights] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const emotionColors = {
    happy: '#4caf50',
    neutral: '#607d8b',
    sad: '#2196f3',
    anxious: '#ff9800',
    stressed: '#f44336'
  };

  const emotionIcons = {
    happy: <SentimentVerySatisfied />,
    neutral: <SentimentNeutral />,
    sad: <SentimentVeryDissatisfied />,
    anxious: <SentimentNeutral />,
    stressed: <SentimentVeryDissatisfied />
  };

  const quickEmotions = [
    { mood: 'happy', label: 'Happy', color: '#4caf50', prompt: "I'm feeling great today!" },
    { mood: 'stressed', label: 'Stressed', color: '#f44336', prompt: "I'm overwhelmed with work" },
    { mood: 'anxious', label: 'Anxious', color: '#ff9800', prompt: "I'm worried about the future" },
    { mood: 'sad', label: 'Sad', color: '#2196f3', prompt: "I'm feeling down today" }
  ];

  const radarData = [
    { subject: 'Mood', A: 85, fullMark: 100 },
    { subject: 'Energy', A: 78, fullMark: 100 },
    { subject: 'Focus', A: 92, fullMark: 100 },
    { subject: 'Sleep', A: 70, fullMark: 100 },
    { subject: 'Stress', A: 45, fullMark: 100 },
    { subject: 'Social', A: 88, fullMark: 100 }
  ];

  const analyzeEmotion = async (text) => {
    setIsAnalyzing(true);
    setShowResults(false);
    
    try {
      // Simulate quick emotion detection
      const detectedMood = detectMoodFromText(text);
      setCurrentMood(detectedMood);
      
      // Get AI response
      const response = await cohereAPI.generateWellnessAdvice(
        `User says: "${text}". Current mood: ${detectedMood}. Provide quick, impactful wellness advice in 2-3 sentences.`
      );
      
      if (response) {
        setAiResponse(response);
        generateInsights(detectedMood);
        updateWellnessScore(detectedMood);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setAiResponse('I\'m here to support you. Your feelings are valid.');
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectMoodFromText = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('good')) return 'happy';
    if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('pressure')) return 'stressed';
    if (lowerText.includes('worr') || lowerText.includes('anxious') || lowerText.includes('nervous')) return 'anxious';
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) return 'sad';
    return 'neutral';
  };

  const generateInsights = (mood) => {
    const moodInsights = {
      happy: [
        "Your positive energy is contagious!",
        "Great time to tackle challenging tasks",
        "Share your positivity with others"
      ],
      stressed: [
        "Take 3 deep breaths right now",
        "Break tasks into smaller steps",
        "You've handled challenges before"
      ],
      anxious: [
        "Focus on what you can control",
        "Ground yourself in the present moment",
        "Your feelings are temporary"
      ],
      sad: [
        "It's okay to feel this way",
        "Reach out to someone you trust",
        "This feeling will pass"
      ],
      neutral: [
        "Perfect time for self-reflection",
        "Consider setting a new goal",
        "Practice gratitude for small things"
      ]
    };
    
    setInsights(moodInsights[mood] || moodInsights.neutral);
  };

  const updateWellnessScore = (mood) => {
    const moodScores = {
      happy: 85,
      stressed: 45,
      anxious: 55,
      sad: 40,
      neutral: 65
    };
    
    setWellnessScore(prev => Math.min(100, Math.max(0, prev + (mood === 'happy' ? 5 : mood === 'stressed' ? -3 : 0))));
  };

  const handleQuickEmotion = (emotion) => {
    setUserInput(emotion.prompt);
    analyzeEmotion(emotion.prompt);
  };

  const handleSubmit = () => {
    if (userInput.trim()) {
      analyzeEmotion(userInput);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={8} sx={{ maxWidth: 1000, mx: 'auto', borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Psychology sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Instant AI Wellness Analysis
            </Typography>
            <Chip
              label="LIVE DEMO"
              color="success"
              sx={{ ml: 2, fontWeight: 'bold' }}
            />
          </Box>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Experience real-time AI emotional analysis and personalized wellness insights in seconds.
          </Typography>

          {/* Quick Emotion Selection */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              How are you feeling right now?
            </Typography>
            <Grid container spacing={2}>
              {quickEmotions.map((emotion, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleQuickEmotion(emotion)}
                      sx={{
                        borderColor: emotion.color,
                        color: emotion.color,
                        py: 2,
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: emotion.color,
                          color: 'white'
                        }
                      }}
                    >
                      {emotion.label}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Text Input */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Or type how you're feeling..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isAnalyzing}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handleSubmit}
                disabled={isAnalyzing || !userInput.trim()}
                sx={{ minWidth: 120 }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </Box>
          </Paper>

          {/* Loading State */}
          {isAnalyzing && (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
                AI is analyzing your emotional state...
              </Typography>
            </Box>
          )}

          {/* Results */}
          <AnimatePresence>
            {showResults && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={3}>
                  {/* Emotion Result */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" mb={2} fontWeight="bold">
                        Detected Emotional State
                      </Typography>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar sx={{ bgcolor: emotionColors[currentMood], mr: 2, fontSize: 40 }}>
                          {emotionIcons[currentMood]}
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight="bold" textTransform="capitalize">
                            {currentMood}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Confidence: 94%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body1">
                          {aiResponse}
                        </Typography>
                      </Alert>
                    </Paper>
                  </Grid>

                  {/* Wellness Score */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" mb={2} fontWeight="bold">
                        Your Wellness Score
                      </Typography>
                      <Box textAlign="center" mb={2}>
                        <Typography variant="h2" fontWeight="bold" color="primary">
                          {wellnessScore}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          out of 100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={wellnessScore}
                        sx={{ height: 12, borderRadius: 6, mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary" align="center">
                        {wellnessScore >= 80 ? 'Excellent!' : wellnessScore >= 60 ? 'Good progress!' : 'Room for improvement'}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Insights */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" mb={2} fontWeight="bold" display="flex" alignItems="center">
                        <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
                        Personalized Insights
                      </Typography>
                      {insights.map((insight, index) => (
                        <Alert key={index} severity="success" sx={{ mb: 1 }}>
                          {insight}
                        </Alert>
                      ))}
                    </Paper>
                  </Grid>

                  {/* Mood Trends */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" mb={2} fontWeight="bold">
                        Weekly Mood Trends
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={moodHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="mood" stroke="#4caf50" strokeWidth={3} />
                          <Line type="monotone" dataKey="energy" stroke="#2196f3" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  {/* Wellness Radar */}
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" mb={2} fontWeight="bold">
                        Complete Wellness Profile
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Your Score" dataKey="A" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Stats */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Fab
              variant="extended"
              color="primary"
              sx={{ mr: 2 }}
            >
              <RocketLaunch sx={{ mr: 1 }} />
              Hackathon Ready
            </Fab>
            <Fab
              variant="extended"
              color="secondary"
            >
              <Speed sx={{ mr: 1 }} />
              Instant Results
            </Fab>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InstantAIDemo;
