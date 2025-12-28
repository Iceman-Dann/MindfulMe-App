import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  IconButton,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Phone,
  Chat,
  LocationOn,
  People,
  Psychology,
  Warning,
  CheckCircle,
  ArrowForward,
  LocalHospital,
  Support,
  Send,
  Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import cohereAPI from '../../utils/cohereAI';

const CrisisInterventionSystem = () => {
  const [riskLevel, setRiskLevel] = useState('low');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [crisisAlerts, setCrisisAlerts] = useState([]);
  const [interventionSteps, setInterventionSteps] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [immediateActions, setImmediateActions] = useState([]);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  const crisisResources = {
    high: [
      { title: 'National Suicide Prevention Lifeline', phone: '988', available: '24/7' },
      { title: 'Crisis Text Line', text: 'HOME to 741741', available: '24/7' },
      { title: 'Emergency Services', phone: '911', available: '24/7' }
    ],
    medium: [
      { title: 'SAMHSA Helpline', phone: '1-800-662-4357', available: '24/7' },
      { title: 'Veterans Crisis Line', phone: '988 Press 1', available: '24/7' },
      { title: 'The Trevor Project', phone: '1-866-488-7386', available: '24/7' }
    ],
    low: [
      { title: 'Warm Lines', description: 'Peer support lines', available: 'Varies' },
      { title: 'Mental Health America', url: 'mhanational.org', available: 'Business hours' },
      { title: 'NAMI Helpline', phone: '1-800-950-6264', available: 'Mon-Fri 10am-10pm' }
    ]
  };

  useEffect(() => {
    // Initialize with welcome message
    setChatMessages([
      {
        type: 'system',
        content: 'Welcome to the Crisis Intervention System. I\'m here to provide immediate support and connect you with resources. How are you feeling right now?',
        timestamp: new Date()
      }
    ]);
  }, []);

  const analyzeCrisisLevel = async (userText) => {
    setIsAnalyzing(true);
    
    try {
      const prompt = `Analyze this message for crisis intervention urgency. Look for:

Risk indicators:
- Self-harm or suicide mentions
- Hopelessness/helplessness
- Feeling trapped or burden
- Saying goodbye
- Giving away possessions
- Extreme emotional distress
- Harm to others

User message: "${userText}"

Respond with JSON format:
{
  "risk_level": "high|medium|low",
  "confidence": 85,
  "indicators": ["indicator1", "indicator2"],
  "immediate_actions": ["action1", "action2"],
  "intervention_steps": ["step1", "step2"],
  "recommended_resources": ["resource1", "resource2"]
}

Analysis:`;

      const response = await cohereAPI.generateCrisisSupport(prompt);
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          setRiskLevel(analysis.risk_level);
          setImmediateActions(analysis.immediate_actions || []);
          setInterventionSteps(analysis.intervention_steps || []);
          
          if (analysis.risk_level === 'high') {
            generateCrisisAlerts(analysis.indicators);
            setShowEmergencyDialog(true);
          }
          
          return analysis;
        }
      } catch (parseError) {
        console.error('Error parsing crisis analysis:', parseError);
      }
      
      return { risk_level: 'low', confidence: 50 };
      
    } catch (error) {
      console.error('Error in crisis analysis:', error);
      return { risk_level: 'low', confidence: 0 };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateCrisisAlerts = (indicators) => {
    const alerts = indicators.map(indicator => ({
      id: Date.now() + Math.random(),
      type: 'warning',
      message: `Crisis indicator detected: ${indicator}`,
      timestamp: new Date(),
      severity: 'high'
    }));
    
    setCrisisAlerts(alerts);
  };

  const handleUserMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage(userInput);
    setUserInput('');
    
    // Analyze crisis level
    const analysis = await analyzeCrisisLevel(userInput);
    
    // Generate AI response
    const aiResponse = await generateCrisisResponse(userInput, analysis);
    
    const assistantMessage = {
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      riskLevel: analysis.risk_level
    };
    
    setChatMessages(prev => [...prev, assistantMessage]);
  };

  const generateCrisisResponse = async (userText, analysis) => {
    try {
      const prompt = `Provide immediate crisis support response for this message: "${userText}"

Risk level: ${analysis.risk_level}
Confidence: ${analysis.confidence}%

Guidelines:
- If HIGH risk: Prioritize safety, provide immediate resources, be direct but compassionate
- If MEDIUM risk: Validate feelings, provide coping strategies, offer resources
- If LOW risk: Provide supportive listening, general wellness suggestions

Include:
1. Validation of their feelings
2. Immediate safety steps (if needed)
3. Specific resources
4. Hope and encouragement

Response:`;

      const response = await cohereAPI.generateCrisisSupport(prompt);
      return response || 'I\'m here to support you. Your feelings are valid, and help is available.';
      
    } catch (error) {
      console.error('Error generating crisis response:', error);
      return 'I\'m here to listen and support you. Please know that help is available and you don\'t have to go through this alone.';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#607d8b';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <Warning sx={{ fontSize: 32 }} />;
      case 'medium': return <Warning sx={{ fontSize: 32 }} />;
      case 'low': return <CheckCircle sx={{ fontSize: 32 }} />;
      default: return <Psychology sx={{ fontSize: 32 }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={8} sx={{ maxWidth: 800, mx: 'auto', borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Warning sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
            <Typography variant="h4" fontWeight="bold" color="error.main">
              AI Crisis Intervention System
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Real-time crisis detection and immediate intervention support powered by AI.
          </Typography>

          {/* Risk Level Indicator */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box sx={{ mr: 2, color: getRiskColor(riskLevel) }}>
                  {getRiskIcon(riskLevel)}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Current Risk Level
                  </Typography>
                  <Chip
                    label={riskLevel.toUpperCase()}
                    sx={{
                      backgroundColor: getRiskColor(riskLevel),
                      color: 'white',
                      fontWeight: 'bold',
                      mt: 1
                    }}
                  />
                </Box>
              </Box>
              
              {isAnalyzing && (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography variant="body2">Analyzing...</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Crisis Alerts */}
          <AnimatePresence>
            {crisisAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {crisisAlerts.map((alert) => (
                  <Alert key={alert.id} severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {alert.message}
                    </Typography>
                  </Alert>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Immediate Actions */}
          {immediateActions.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="h6" mb={2} fontWeight="bold">
                Immediate Actions Required
              </Typography>
              {immediateActions.map((action, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <ArrowForward sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{action}</Typography>
                </Box>
              ))}
            </Paper>
          )}

          {/* Emergency Resources */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Emergency Resources
            </Typography>
            <Grid container spacing={2}>
              {crisisResources[riskLevel].map((resource, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        {resource.title}
                      </Typography>
                      {resource.phone && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <Phone sx={{ fontSize: 16, mr: 1 }} />
                          <Typography variant="body2">{resource.phone}</Typography>
                        </Box>
                      )}
                      {resource.text && (
                        <Typography variant="body2" color="text.secondary">
                          Text: {resource.text}
                        </Typography>
                      )}
                      <Chip
                        label={resource.available}
                        size="small"
                        sx={{ mt: 1 }}
                        color="primary"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Intervention Steps */}
          {interventionSteps.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" mb={2} fontWeight="bold">
                Recommended Intervention Steps
              </Typography>
              <List>
                {interventionSteps.map((step, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemIcon>
                      <Support color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Chat Interface */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Crisis Support Chat
            </Typography>
            
            <Box sx={{ height: 300, overflowY: 'auto', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              {chatMessages.map((message, index) => (
                <Box key={index} mb={2}>
                  <Box display="flex" alignItems="flex-start" mb={1}>
                    <Avatar
                      sx={{
                        bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                        width: 32,
                        height: 32,
                        mr: 1
                      }}
                    >
                      {message.type === 'user' ? 'U' : 'AI'}
                    </Avatar>
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: message.type === 'user' ? 'primary.light' : 'white',
                          color: message.type === 'user' ? 'primary.contrastText' : 'text.primary'
                        }}
                      >
                        {message.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type how you're feeling..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                disabled={isAnalyzing}
              />
              <IconButton
                color="primary"
                onClick={handleUserMessage}
                disabled={isAnalyzing || !userInput.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Paper>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Phone />}
              onClick={() => setShowEmergencyDialog(true)}
            >
              Call Emergency Services
            </Button>
            <Button
              variant="outlined"
              startIcon={<Chat />}
              onClick={() => setChatOpen(true)}
            >
              Live Support
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Emergency Dialog */}
      <Dialog open={showEmergencyDialog} onClose={() => setShowEmergencyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Warning sx={{ mr: 2, color: 'error.main' }} />
            Emergency Contact Options
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={3}>
            If you're in immediate danger, please use one of these emergency resources:
          </Typography>
          <List>
            <ListItem button component="a" href="tel:988">
              <ListItemIcon><Phone /></ListItemIcon>
              <ListItemText primary="988 - Suicide & Crisis Lifeline" secondary="24/7 Free, confidential support" />
            </ListItem>
            <ListItem button component="a" href="tel:911">
              <ListItemIcon><LocalHospital /></ListItemIcon>
              <ListItemText primary="911 - Emergency Services" secondary="For immediate medical emergencies" />
            </ListItem>
            <ListItem button component="a" href="sms:741741">
              <ListItemIcon><Chat /></ListItemIcon>
              <ListItemText primary="Text HOME to 741741" secondary="Crisis Text Line - 24/7 support via text" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmergencyDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CrisisInterventionSystem;
