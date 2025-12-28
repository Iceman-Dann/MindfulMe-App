import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Paper,
  Avatar,
  LinearProgress,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Container,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  Rating,
  Tabs,
  Tab
} from '@mui/material';
import {
  Psychology,
  Favorite,
  TrendingUp,
  Spa,
  Star,
  NavigateNext,
  Lightbulb,
  EmojiEvents,
  HealthAndSafety,
  Download,
  PlayArrow,
  CheckCircle,
  AccessTime,
  Send,
  ExpandMore,
  History,
  Assessment,
  Healing,
  SelfImprovement,
  Mood,
  TipsAndUpdates,
  Assignment,
  CloudDownload
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import cohereAI from '../../utils/cohereAI.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PersonalTherapist = () => {
  const [currentPhase, setCurrentPhase] = useState('intake');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    symptoms: [],
    moodHistory: [],
    triggers: [],
    copingStrategies: [],
    insights: [],
    recommendations: [],
    progressScore: 0,
    sessionCount: 0
  });
  const [activeTab, setActiveTab] = useState(0);
  const pdfRef = useRef();
  const navigate = useNavigate();

  // Therapy phases that adapt based on user needs
  const therapyPhases = {
    intake: {
      title: "Welcome to Your Personal Therapy Session",
      description: "Let me get to know you and understand what you're experiencing",
      icon: <Psychology />,
      color: 'primary',
      questions: [
        "How are you feeling today?",
        "What's been on your mind lately?",
        "What would you like to work on in this session?"
      ]
    },
    assessment: {
      title: "Understanding Your Experience",
      description: "Let's explore your symptoms and patterns more deeply",
      icon: <Assessment />,
      color: 'secondary',
      questions: [
        "What specific symptoms are you experiencing?",
        "When did these feelings begin?",
        "What situations seem to trigger these feelings?"
      ]
    },
    exploration: {
      title: "Deep Exploration",
      description: "Let's understand the root causes and patterns",
      icon: <Healing />,
      color: 'info',
      questions: [
        "How do these feelings affect your daily life?",
        "What have you tried so far to cope?",
        "What would make the biggest difference for you?"
      ]
    },
    strategy: {
      title: "Building Your Wellness Toolkit",
      description: "Let's develop personalized strategies for you",
      icon: <SelfImprovement />,
      color: 'success',
      questions: [
        "What coping strategies resonate with you?",
        "What small changes could you start with?",
        "How can I best support your progress?"
      ]
    },
    planning: {
      title: "Your Path Forward",
      description: "Creating your personalized wellness plan",
      icon: <TrendingUp />,
      color: 'warning',
      questions: [
        "What are your wellness goals?",
        "What support do you need?",
        "How will you track your progress?"
      ]
    }
  };

  useEffect(() => {
    // Load previous session data if exists
    const savedData = localStorage.getItem('therapySessionData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSessionData(prev => ({
        ...prev,
        sessionCount: parsed.sessionCount || 0,
        moodHistory: parsed.moodHistory || []
      }));
    }
  }, []);

  const generateTherapeuticResponse = async (input, phase) => {
    setIsGenerating(true);
    
    try {
      let response = '';
      const context = {
        currentPhase: phase,
        sessionHistory: sessionHistory,
        symptoms: sessionData.symptoms,
        moodHistory: sessionData.moodHistory,
        sessionCount: sessionData.sessionCount
      };

      switch (phase) {
        case 'intake':
          response = await cohereAI.generateWellnessAdvice(
            `Intake session: ${input}\n\nProvide a warm, welcoming response that builds rapport and encourages openness. Show genuine care and curiosity about their wellbeing.`,
            context
          );
          break;
        case 'assessment':
          response = await cohereAI.generateWellnessAdvice(
            `Assessment phase: ${input}\n\nProvide thoughtful assessment questions and observations. Help identify patterns and symptoms without being clinical or judgmental.`,
            context
          );
          break;
        case 'exploration':
          response = await cohereAI.generateWellnessAdvice(
            `Deep exploration: ${input}\n\nProvide insightful reflections and gentle probing questions. Help uncover root causes while maintaining emotional safety.`,
            context
          );
          break;
        case 'strategy':
          response = await cohereAI.generateWellnessAdvice(
            `Strategy development: ${input}\n\nProvide practical, evidence-based coping strategies tailored to their specific situation. Make them actionable and realistic.`,
            context
          );
          break;
        case 'planning':
          response = await cohereAI.generateWellnessAdvice(
            `Wellness planning: ${input}\n\nProvide a comprehensive wellness plan with specific goals, timelines, and support strategies. Include progress tracking methods.`,
            context
          );
          break;
        default:
          response = await cohereAI.generateWellnessAdvice(input, context);
      }

      // Update session data
      const newEntry = {
        timestamp: new Date(),
        phase: phase,
        userInput: input,
        aiResponse: response,
        mood: analyzeMoodFromText(input)
      };

      setSessionHistory(prev => [...prev, newEntry]);
      setCurrentResponse(response);
      
      // Update session insights
      setSessionData(prev => ({
        ...prev,
        symptoms: extractSymptoms(input, prev.symptoms),
        insights: [...prev.insights, { phase, content: response.substring(0, 200) + '...', timestamp: new Date() }],
        progressScore: Math.min(100, prev.progressScore + 10)
      }));

      return response;
    } catch (error) {
      console.error('Error generating therapeutic response:', error);
      return "I'm here to support you. Let's take a moment and try again. Your wellbeing is important to me.";
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeMoodFromText = (text) => {
    const positiveWords = ['happy', 'good', 'great', 'excited', 'hopeful', 'calm', 'peaceful'];
    const negativeWords = ['sad', 'anxious', 'depressed', 'angry', 'frustrated', 'worried', 'stressed'];
    
    let score = 5; // neutral
    positiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 1;
    });
    negativeWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score -= 1;
    });
    
    return Math.max(1, Math.min(10, score));
  };

  const extractSymptoms = (text, existingSymptoms) => {
    const symptomKeywords = ['anxiety', 'depression', 'stress', 'sleep', 'appetite', 'energy', 'focus', 'mood'];
    const newSymptoms = [...existingSymptoms];
    
    symptomKeywords.forEach(symptom => {
      if (text.toLowerCase().includes(symptom) && !newSymptoms.includes(symptom)) {
        newSymptoms.push(symptom);
      }
    });
    
    return newSymptoms;
  };

  const handleUserSubmit = async () => {
    if (!userInput.trim()) return;
    
    const response = await generateTherapeuticResponse(userInput, currentPhase);
    setUserInput('');
    setDialogOpen(true);
  };

  const advancePhase = () => {
    const phases = Object.keys(therapyPhases);
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
    } else {
      // Session complete - generate summary
      generateSessionSummary();
    }
  };

  const generateSessionSummary = async () => {
    try {
      const summaryPrompt = `Based on this therapy session, create a comprehensive summary and wellness plan:

Session History: ${JSON.stringify(sessionHistory, null, 2)}
Symptoms Identified: ${sessionData.symptoms.join(', ')}
Session Progress: ${sessionData.progressScore}%

Please provide:
1. Key insights from the session
2. Identified patterns and triggers
3. Recommended coping strategies
4. Specific wellness goals
5. Follow-up recommendations
6. Progress tracking suggestions`;

      const summary = await cohereAI.generateWellnessAdvice(summaryPrompt, sessionData);
      
      setSessionData(prev => ({
        ...prev,
        recommendations: summary.split('\n').filter(line => line.trim()),
        sessionCount: prev.sessionCount + 1
      }));

      // Save session data
      localStorage.setItem('therapySessionData', JSON.stringify(sessionData));
      
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      return "Session summary available in your wellness report.";
    }
  };

  const generatePDFReport = async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.text('Personal Wellness Therapy Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Session Info
      pdf.setFontSize(12);
      pdf.text(`Session Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Session Number: ${sessionData.sessionCount + 1}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Progress Score: ${sessionData.progressScore}%`, 20, yPosition);
      yPosition += 20;

      // Symptoms
      pdf.setFontSize(14);
      pdf.text('Identified Symptoms:', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      sessionData.symptoms.forEach(symptom => {
        pdf.text(`• ${symptom}`, 30, yPosition);
        yPosition += 8;
      });
      yPosition += 10;

      // Session Insights
      pdf.setFontSize(14);
      pdf.text('Key Insights:', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      sessionData.insights.forEach((insight, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${insight.content}`, pageWidth - 40);
        lines.forEach(line => {
          pdf.text(line, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 4;
      });
      yPosition += 10;

      // Recommendations
      pdf.setFontSize(14);
      pdf.text('Wellness Recommendations:', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      sessionData.recommendations.forEach((rec, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
        lines.forEach(line => {
          pdf.text(line, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 4;
      });

      // Save PDF
      pdf.save(`wellness-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const currentPhaseData = therapyPhases[currentPhase];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <Spa sx={{ fontSize: 40 }} />
            Your Personal Therapist
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            AI-Powered Mental Health Support with Real Memory & Personalization
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Psychology />} 
              label="Real AI Therapy" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<History />} 
              label="Session Memory" 
              color="success" 
              variant="outlined"
            />
            <Chip 
              icon={<Assessment />} 
              label={`Progress: ${sessionData.progressScore}%`} 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              icon={<Assignment />} 
              label={`Session ${sessionData.sessionCount + 1}`} 
              color="info" 
              variant="outlined"
            />
          </Box>
        </Paper>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: `${currentPhaseData.color}.main`, mr: 2 }}>
              {currentPhaseData.icon}
            </Avatar>
            <Box>
              <Typography variant="h6">{currentPhaseData.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentPhaseData.description}
              </Typography>
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(Object.keys(therapyPhases).indexOf(currentPhase) / (Object.keys(therapyPhases).length - 1)) * 100} 
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            Phase {Object.keys(therapyPhases).indexOf(currentPhase) + 1} of {Object.keys(therapyPhases).length}
          </Typography>
        </Paper>
      </motion.div>

      {/* Main Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            {/* Therapeutic Questions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Let's explore this together:
              </Typography>
              {currentPhaseData.questions.map((question, index) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {question}
                </Alert>
              ))}
            </Box>

            {/* Conversation Area */}
            <Box sx={{ mb: 3, maxHeight: 300, overflowY: 'auto' }}>
              {sessionHistory.slice(-3).map((entry, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Chip 
                    label="You" 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
                    {entry.userInput}
                  </Typography>
                  <Chip 
                    label="Therapist" 
                    color="secondary" 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ mb: 2, pl: 2, color: 'text.secondary' }}>
                    {entry.aiResponse}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>
              ))}
            </Box>

            {/* Input Area */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Share what's on your mind... I'm here to listen and help."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isGenerating}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUserSubmit}
                  disabled={isGenerating || !userInput.trim()}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <Send />}
                  sx={{ flex: 1 }}
                >
                  {isGenerating ? 'Thinking...' : 'Share with Therapist'}
                </Button>
                {sessionHistory.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={advancePhase}
                    endIcon={<NavigateNext />}
                  >
                    Continue Journey
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="Progress" icon={<TrendingUp />} />
              <Tab label="Insights" icon={<Lightbulb />} />
              <Tab label="Symptoms" icon={<HealthAndSafety />} />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={sessionData.progressScore} 
                    sx={{ my: 1 }}
                  />
                  <Typography variant="h6" color="primary.main">
                    {sessionData.progressScore}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Sessions Completed
                  </Typography>
                  <Typography variant="h4">
                    {sessionData.sessionCount}
                  </Typography>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Key Insights
                </Typography>
                {sessionData.insights.slice(-3).map((insight, index) => (
                  <Alert key={index} severity="info" sx={{ mb: 1, fontSize: '0.8rem' }}>
                    {insight.content}
                  </Alert>
                ))}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Tracked Symptoms
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {sessionData.symptoms.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<CloudDownload />}
                onClick={generatePDFReport}
                disabled={sessionHistory.length === 0}
                fullWidth
              >
                Download Wellness Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={() => setDialogOpen(true)}
                disabled={sessionHistory.length === 0}
                fullWidth
              >
                View Session History
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Session History Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: '80vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology color="primary" />
            Therapy Session History
          </Box>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {sessionHistory.map((entry, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="primary">
                Phase: {entry.phase} - {new Date(entry.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>You:</strong> {entry.userInput}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                <strong>Therapist:</strong> {entry.aiResponse}
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PersonalTherapist;
