import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Grid,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Snackbar,
  Fab,
  Tooltip,
  Badge,
  CircularProgress,
  Zoom,
  Fade,
  Slide,
  Grow,
  Backdrop,
  Modal,
  useTheme,
  alpha
} from '@mui/material';
import {
  Psychology,
  ExpandMore,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Healing,
  Assignment,
  PlayArrow,
  Refresh,
  Star,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  MoodBad,
  Mood,
  AutoAwesome,
  Timeline,
  Insights,
  Analytics,
  Brain,
  Spa,
  FitnessCenter,
  SelfImprovement,
  RecordVoiceOver,
  Mic,
  Stop,
  Visibility,
  VisibilityOff,
  Download,
  Share,
  EmojiEvents,
  Speed,
  CloudUpload,
  PsychologyAlt,
  HealthAndSafety,
  Favorite,
  LocalFireDepartment,
  WorkspacePremium,
  Bolt,
  Gesture,
  TipsAndUpdates
} from '@mui/icons-material';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

const COHERE_API_KEY = "A443dmaow1J4IZSxVAsjjJFw8OQv4WwZDOispMeA";

const InteractiveCBT = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [showAIVisualization, setShowAIVisualization] = useState(false);
  const [aiThinkingProcess, setAiThinkingProcess] = useState([]);
  
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    automaticThought: '',
    emotions: '',
    evidenceFor: '',
    evidenceAgainst: '',
    alternativeThought: '',
    emotionRating: 5,
    beliefRating: 5
  });
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('cbtSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [cognitiveDistortions, setCognitiveDistortions] = useState([]);
  const [progressMetrics, setProgressMetrics] = useState({
    sessionsCompleted: 0,
    averageEmotionRating: 0,
    mostWorkedOnDistortion: '',
    improvementRate: 0
  });
  
  const [exercises, setExercises] = useState([
    {
      id: 1,
      title: 'AI-Powered Thought Record',
      description: 'Real-time AI analysis of your thought patterns',
      type: 'thought-record',
      difficulty: 'beginner',
      duration: '15-20 min',
      icon: <Psychology />,
      color: '#FF6B6B',
      features: ['Real-time AI analysis', 'Emotion tracking', 'Cognitive distortion detection']
    },
    {
      id: 2,
      title: 'Smart Behavioral Experiment',
      description: 'AI-designed experiments based on your patterns',
      type: 'experiment',
      difficulty: 'intermediate',
      duration: '30-45 min',
      icon: <Lightbulb />,
      color: '#4ECDC4',
      features: ['Personalized experiments', 'Predictive outcomes', 'Progress tracking']
    },
    {
      id: 3,
      title: 'Deep Core Belief Analysis',
      description: 'AI uncovers your deepest belief patterns',
      type: 'core-belief',
      difficulty: 'advanced',
      duration: '45-60 min',
      icon: <PsychologyAlt />,
      color: '#45B7D1',
      features: ['Belief mapping', 'Pattern recognition', 'Transformation planning']
    },
    {
      id: 4,
      title: 'Adaptive Exposure Therapy',
      description: 'AI-guided gradual exposure with real-time monitoring',
      type: 'exposure',
      difficulty: 'intermediate',
      duration: '20-30 min',
      icon: <Spa />,
      color: '#96CEB4',
      features: ['Anxiety monitoring', 'Adaptive pacing', 'Success prediction']
    },
    {
      id: 5,
      title: 'Intelligent Problem-Solving',
      description: 'AI-powered solution generation and evaluation',
      type: 'problem-solving',
      difficulty: 'beginner',
      duration: '15-25 min',
      icon: <Lightbulb />,
      color: '#FFEAA7',
      features: ['Solution brainstorming', 'Feasibility analysis', 'Action planning']
    }
  ]);
  
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Advanced AI Functions with impressive features
  const generateRealTimeAnalysis = async (text, field) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI thinking process
    const thinkingSteps = [
      'Analyzing text patterns...',
      'Identifying cognitive distortions...',
      'Cross-referencing with emotional indicators...',
      'Generating personalized insights...',
      'Creating actionable recommendations...'
    ];
    
    for (let i = 0; i < thinkingSteps.length; i++) {
      setAiThinkingProcess(prev => [...prev, thinkingSteps[i]]);
      setAnalysisProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `As an expert CBT therapist with advanced AI capabilities, analyze this ${field} in real-time:

${text}

Provide comprehensive analysis including:
1. Cognitive distortions detected (with confidence scores)
2. Emotional intensity indicators
3. Thought pattern classification
4. Immediate intervention suggestions
5. Risk assessment
6. Personalized coping strategies
7. Progress indicators

Format as JSON with detailed metrics and visualizable data points.`,
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      const analysis = JSON.parse(data.text);
      
      setRealTimeAnalysis(analysis);
      setAiThinkingProcess([]);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
      
      // Update emotion history
      if (field === 'emotions') {
        setEmotionHistory(prev => [...prev, {
          timestamp: new Date(),
          emotions: text,
          analysis: analysis.emotionalIntensity
        }]);
      }
      
      // Update cognitive distortions
      if (analysis.distortions) {
        setCognitiveDistortions(prev => [...prev, ...analysis.distortions]);
      }
      
    } catch (error) {
      console.error('Error in real-time analysis:', error);
      setIsAnalyzing(false);
      setAiThinkingProcess([]);
    }
  };
  
  const generateAdvancedCBTInsights = async (completeRecord) => {
    setIsGenerating(true);
    setShowAIVisualization(true);
    
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `As a world-class CBT therapist with AI-enhanced capabilities, provide comprehensive analysis:

Complete Thought Record:
${JSON.stringify(completeRecord, null, 2)}

Generate detailed insights including:
1. Cognitive distortion analysis with percentages
2. Emotional pattern recognition
3. Thought-behavior connections
4. Alternative thought suggestions with effectiveness scores
5. Behavioral activation recommendations
6. Long-term transformation plan
7. Progress metrics and KPIs
8. Visualization data for charts
9. Personalized affirmations
10. Next session recommendations

Format as comprehensive JSON with actionable insights and metrics.`,
          temperature: 0.3,
          max_tokens: 1500
        })
      });
      
      const data = await response.json();
      const insights = JSON.parse(data.text);
      
      setAiInsights(insights);
      
      // Update progress metrics
      setProgressMetrics(prev => ({
        ...prev,
        sessionsCompleted: prev.sessionsCompleted + 1,
        averageEmotionRating: (prev.averageEmotionRating + completeRecord.emotionRating) / 2,
        improvementRate: calculateImprovementRate()
      }));
      
      // Show celebration for milestone
      if (progressMetrics.sessionsCompleted > 0 && progressMetrics.sessionsCompleted % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
      setIsGenerating(false);
      
    } catch (error) {
      console.error('Error generating advanced insights:', error);
      setIsGenerating(false);
    }
  };
  
  const calculateImprovementRate = () => {
    if (sessions.length < 2) return 0;
    const recentSessions = sessions.slice(-5);
    const olderSessions = sessions.slice(-10, -5);
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.emotionRating, 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + s.emotionRating, 0) / olderSessions.length;
    
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  };
  
  // Voice recording functionality
  const startVoiceRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setVoiceTranscript("I'm feeling overwhelmed because I have too much work to do and I don't know where to start. I feel like I'm going to fail and everyone will be disappointed in me.");
      setIsRecording(false);
    }, 3000);
  };
  
  const stopVoiceRecording = () => {
    setIsRecording(false);
  };
  
  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('cbtSessions', JSON.stringify(sessions));
  }, [sessions]);

  // AI Functions
  const generateCBTAnalysis = async (thoughtData) => {
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `As a CBT therapist, analyze this thought record and provide professional insights:

Situation: ${thoughtData.situation}
Automatic Thought: ${thoughtData.automaticThought}
Emotions: ${thoughtData.emotions}
Evidence For: ${thoughtData.evidenceFor}
Evidence Against: ${thoughtData.evidenceAgainst}

Please provide:
1. Cognitive distortions identified
2. Thought pattern analysis
3. Socratic questions to challenge the thought
4. Alternative balanced thoughts
5. Behavioral recommendations
6. Coping strategies
7. Progress suggestions

Format as JSON with keys: distortions, analysis, questions, alternatives, recommendations, strategies, progress`,
          temperature: 0.3,
          max_tokens: 800
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.text);
    } catch (error) {
      console.error('Error generating CBT analysis:', error);
      return null;
    }
  };

  const generatePersonalizedExercise = async (exerciseType, userConcerns) => {
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          message: `As a CBT therapist, create a personalized ${exerciseType} exercise for someone with these concerns: ${userConcerns}

Create a structured exercise with:
1. Clear objectives
2. Step-by-step instructions
3. Thought-provoking questions
4. Practice scenarios
5. Reflection prompts
6. Progress tracking methods
7. Estimated time commitment
8. Difficulty adjustments

Make it practical, actionable, and therapeutic.`,
          temperature: 0.4,
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error generating exercise:', error);
      return "Let's work through this together step by step.";
    }
  };

  const completeThoughtRecord = async () => {
    setIsGenerating(true);
    try {
      const analysis = await generateCBTAnalysis(thoughtRecord);
      
      const session = {
        id: uuidv4(),
        type: 'thought-record',
        date: new Date().toISOString(),
        ...thoughtRecord,
        aiAnalysis: analysis,
        completed: true
      };
      
      setSessions([...sessions, session]);
      
      setSnackbar({
        open: true,
        message: 'Thought record completed with AI analysis!',
        severity: 'success'
      });
      
      // Reset form
      setThoughtRecord({
        situation: '',
        automaticThought: '',
        emotions: '',
        evidenceFor: '',
        evidenceAgainst: '',
        alternativeThought: '',
        emotionRating: 5,
        beliefRating: 5
      });
      
      setActiveStep(0);
    } catch (error) {
      console.error('Error completing thought record:', error);
      setSnackbar({
        open: true,
        message: 'Failed to complete thought record',
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startExercise = async (exercise) => {
    setSelectedExercise(exercise);
    setIsGenerating(true);
    
    try {
      const personalizedContent = await generatePersonalizedExercise(
        exercise.type,
        'anxiety, negative thoughts, stress management'
      );
      
      setExerciseProgress({
        ...exerciseProgress,
        [exercise.id]: {
          started: true,
          content: personalizedContent,
          currentStep: 0,
          completed: false
        }
      });
      
      setSnackbar({
        open: true,
        message: 'Exercise personalized and ready to begin!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error starting exercise:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderThoughtRecordForm = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Cognitive Behavioral Therapy - Thought Record</Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Situation</StepLabel>
          </Step>
          <Step>
            <StepLabel>Thoughts</StepLabel>
          </Step>
          <Step>
            <StepLabel>Emotions</StepLabel>
          </Step>
          <Step>
            <StepLabel>Evidence</StepLabel>
          </Step>
          <Step>
            <StepLabel>Alternative</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              1. Describe the situation that triggered your thoughts
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Situation"
              value={thoughtRecord.situation}
              onChange={(e) => setThoughtRecord({...thoughtRecord, situation: e.target.value})}
              placeholder="What happened? Where were you? Who was with you?"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button disabled>Previous</Button>
              <Button 
                onClick={() => setActiveStep(1)}
                disabled={!thoughtRecord.situation.trim()}
                variant="contained"
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              2. What automatic thoughts went through your mind?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Automatic Thoughts"
              value={thoughtRecord.automaticThought}
              onChange={(e) => setThoughtRecord({...thoughtRecord, automaticThought: e.target.value})}
              placeholder="What thoughts popped into your head?"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(0)}>Previous</Button>
              <Button 
                onClick={() => setActiveStep(2)}
                disabled={!thoughtRecord.automaticThought.trim()}
                variant="contained"
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              3. What emotions did you feel? Rate their intensity
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Emotions"
              value={thoughtRecord.emotions}
              onChange={(e) => setThoughtRecord({...thoughtRecord, emotions: e.target.value})}
              placeholder="How did you feel? (e.g., anxious, sad, angry)"
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>Emotion Intensity (1-10)</Typography>
              <Slider
                value={thoughtRecord.emotionRating}
                onChange={(e, newValue) => setThoughtRecord({...thoughtRecord, emotionRating: newValue})}
                min={1}
                max={10}
                marks={[
                  { value: 1, label: 'Very Low' },
                  { value: 5, label: 'Moderate' },
                  { value: 10, label: 'Very High' }
                ]}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(1)}>Previous</Button>
              <Button 
                onClick={() => setActiveStep(3)}
                disabled={!thoughtRecord.emotions.trim()}
                variant="contained"
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              4. Evidence for and against your automatic thought
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Evidence that supports the thought"
              value={thoughtRecord.evidenceFor}
              onChange={(e) => setThoughtRecord({...thoughtRecord, evidenceFor: e.target.value})}
              placeholder="What facts support your automatic thought?"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Evidence against the thought"
              value={thoughtRecord.evidenceAgainst}
              onChange={(e) => setThoughtRecord({...thoughtRecord, evidenceAgainst: e.target.value})}
              placeholder="What facts contradict your automatic thought?"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(2)}>Previous</Button>
              <Button 
                onClick={() => setActiveStep(4)}
                disabled={!thoughtRecord.evidenceFor.trim() || !thoughtRecord.evidenceAgainst.trim()}
                variant="contained"
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 4 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              5. Alternative balanced thought
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Alternative Thought"
              value={thoughtRecord.alternativeThought}
              onChange={(e) => setThoughtRecord({...thoughtRecord, alternativeThought: e.target.value})}
              placeholder="What would be a more balanced, realistic thought?"
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>How much do you believe the alternative thought?</Typography>
              <Slider
                value={thoughtRecord.beliefRating}
                onChange={(e, newValue) => setThoughtRecord({...thoughtRecord, beliefRating: newValue})}
                min={1}
                max={10}
                marks={[
                  { value: 1, label: 'Not at all' },
                  { value: 5, label: 'Somewhat' },
                  { value: 10, label: 'Completely' }
                ]}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(3)}>Previous</Button>
              <Button 
                onClick={completeThoughtRecord}
                disabled={!thoughtRecord.alternativeThought.trim() || isGenerating}
                variant="contained"
                color="primary"
                startIcon={isGenerating ? <Refresh /> : <CheckCircle />}
              >
                {isGenerating ? 'Analyzing...' : 'Complete'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderExerciseCard = (exercise) => {
    const progress = exerciseProgress[exercise.id];
    const isStarted = progress && progress.started;
    const isCompleted = progress && progress.completed;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        layout
      >
        <Card sx={{ mb: 2, position: 'relative' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{exercise.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {exercise.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={exercise.difficulty}
                    size="small" 
                    color={
                      exercise.difficulty === 'beginner' ? 'success' : 
                      exercise.difficulty === 'intermediate' ? 'warning' : 'error'
                    }
                  />
                  <Chip 
                    label={exercise.duration}
                    size="small" 
                    variant="outlined"
                  />
                  {isCompleted && (
                    <Chip 
                      icon={<CheckCircle fontSize="small" />}
                      label="Completed"
                      size="small"
                      color="success"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {!isStarted ? (
                <Button
                  variant="contained"
                  onClick={() => startExercise(exercise)}
                  disabled={isGenerating}
                  startIcon={isGenerating ? <Refresh /> : <PlayArrow />}
                >
                  {isGenerating ? 'Preparing...' : 'Start'}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  {isCompleted ? 'Review' : 'Continue'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderSessions = () => (
    <>
      <Typography variant="h6" gutterBottom>Your CBT Sessions</Typography>
      {sessions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sessions yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start with a thought record or exercise to track your progress
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
            >
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {session.type === 'thought-record' ? 'Thought Record' : 'Exercise'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(session.date), 'MMM d, yyyy h:mm a')}
                      </Typography>
                    </Box>
                    <Chip 
                      icon={<CheckCircle fontSize="small" />}
                      label="Completed"
                      size="small"
                      color="success"
                    />
                  </Box>
                  
                  {session.type === 'thought-record' && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">Session Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>Situation</Typography>
                            <Paper sx={{ p: 2, mb: 2 }}>
                              <Typography variant="body2">{session.situation}</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>Automatic Thought</Typography>
                            <Paper sx={{ p: 2, mb: 2 }}>
                              <Typography variant="body2">{session.automaticThought}</Typography>
                            </Paper>
                          </Grid>
                          {session.aiAnalysis && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom>AI Insights</Typography>
                              <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                                <Typography variant="body2" whiteSpace="pre-line">
                                  {JSON.stringify(session.aiAnalysis, null, 2)}
                                </Typography>
                              </Paper>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </>
  );

  const renderSmartExercises = () => (
    <Box>
      <Typography variant="h5" gutterBottom>AI- Enhanced Exercises</Typography>
      <Grid container spacing={3}>
        {exercises.map(exercise => (
          <Grid item xs={12} md={6} key={exercise.id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${exercise.color}20`,
                '&:hover': { boxShadow: `0 8px 32px ${exercise.color}30` }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: exercise.color }}>
                      {exercise.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{exercise.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exercise.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={exercise.difficulty} size="small" color="primary" />
                    <Chip label={exercise.duration} size="small" variant="outlined" />
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>AI Features:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {exercise.features.map((feature, index) => (
                      <Chip key={index} label={feature} size="small" variant="outlined" />
                    ))}
                  </Box>
                  
                  <Button 
                    fullWidth 
                    variant="contained"
                    sx={{ 
                      background: `linear-gradient(45deg, ${exercise.color}, ${exercise.color}CC)`,
                      '&:hover': { background: `linear-gradient(45deg, ${exercise.color}CC, ${exercise.color})` }
                    }}
                  >
                    Start Exercise
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderProgressAnalytics = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Your Progress Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', p: 3 }}>
            <Typography variant="h6" gutterBottom>Emotion History</Typography>
            {emotionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={emotionHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="analysis" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No emotion data yet
              </Typography>
            )}
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', p: 3 }}>
            <Typography variant="h6" gutterBottom>Cognitive Distortions</Typography>
            {cognitiveDistortions.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cognitiveDistortions.map((distortion, index) => (
                  <Chip key={index} label={distortion} color="warning" variant="outlined" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No distortions identified yet
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('cbtSessions', JSON.stringify(sessions));
  }, [sessions]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Interactive CBT Tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cognitive Behavioral Therapy exercises with AI-powered insights and personalized guidance
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Thought Record" />
        <Tab label="Exercises" />
        <Tab label="Sessions" />
        <Tab label="Progress" />
      </Tabs>

      {activeTab === 0 && renderThoughtRecordForm()}
      {activeTab === 1 && renderSmartExercises()}
      {activeTab === 2 && renderSessions()}
      {activeTab === 3 && renderProgressAnalytics()}

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

export default InteractiveCBT;
