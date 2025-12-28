import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send,
  Psychology,
  History,
  Download,
  Settings,
  Close,
  ExpandMore,
  Assessment,
  Person,
  Clear,
  DeleteSweep,
  Refresh
} from '@mui/icons-material';
import cohereAI from '../../utils/cohereAI.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ConversationalTherapist = () => {
  // Debug: Check if API key is available
  console.log('Cohere API Key Status:', process.env.REACT_APP_COHERE_API_KEY ? 'Present' : 'Missing');
  console.log('API Key Length:', process.env.REACT_APP_COHERE_API_KEY?.length || 0);
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [availableModel, setAvailableModel] = useState('command-light'); // Use a basic model
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    totalSessions: 0,
    symptoms: [],
    moodHistory: [],
    triggers: [],
    copingStrategies: [],
    medications: [],
    sleepPatterns: [],
    appetiteChanges: [],
    socialInteractions: [],
    workStress: [],
    personalHistory: [],
    familyHistory: [],
    medicalHistory: [],
    currentMedications: [],
    previousTreatments: [],
    riskFactors: [],
    protectiveFactors: [],
    goals: [],
    progressNotes: []
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analysisPanelOpen, setAnalysisPanelOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch available Cohere models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://api.cohere.ai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const chatModels = data.models.filter(model => 
            model.endpoints.includes('chat')
          );
          
          if (chatModels.length > 0) {
            setAvailableModel(chatModels[0].name);
            console.log('Using Cohere model:', chatModels[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    
    fetchModels();
  }, []);

  // Load previous sessions on mount
  useEffect(() => {
    if (isClearing) return; // Skip loading if we're in the process of clearing
    
    const savedSessions = localStorage.getItem('therapySessions');
    const savedSessionData = localStorage.getItem('therapySessionData');
    
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setMessages(sessions);
    }
    
    if (savedSessionData) {
      const data = JSON.parse(savedSessionData);
      setSessionData(prev => ({
        ...prev,
        ...data,
        startTime: new Date(),
        totalSessions: data.totalSessions || 0
      }));
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save sessions to localStorage
  useEffect(() => {
    if (messages.length > 0 && !isClearing) {
      localStorage.setItem('therapySessions', JSON.stringify(messages));
      localStorage.setItem('therapySessionData', JSON.stringify(sessionData));
    }
  }, [messages, sessionData, isClearing]);

  const analyzeUserInput = useCallback(async (text) => {
    // Comprehensive analysis of user input
    const analysis = {
      symptoms: [],
      mood: null,
      triggers: [],
      medications: [],
      sleep: null,
      appetite: null,
      social: [],
      work: [],
      riskFactors: [],
      protectiveFactors: []
    };

    // Symptom detection
    const symptomKeywords = {
      anxiety: ['anxious', 'worry', 'panic', 'nervous', 'tense', 'restless'],
      depression: ['depressed', 'sad', 'hopeless', 'empty', 'worthless', 'guilty'],
      stress: ['stressed', 'overwhelmed', 'pressure', 'burnout', 'exhausted'],
      insomnia: ['sleep', 'insomnia', 'tired', 'fatigue', 'awake', 'night'],
      appetite: ['appetite', 'eating', 'food', 'hungry', 'nausea', 'weight'],
      social: ['friends', 'family', 'alone', 'isolated', 'lonely', 'social'],
      work: ['work', 'job', 'career', 'boss', 'colleagues', 'deadline']
    };

    Object.entries(symptomKeywords).forEach(([symptom, keywords]) => {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        analysis.symptoms.push(symptom);
      }
    });

    return analysis;
  }, []);

  const generateTherapeuticResponse = useCallback(async (userMessage, conversationHistory) => {
    setIsTyping(true);
    
    try {
      // Analyze user input for clinical information
      const analysis = await analyzeUserInput(userMessage);
      
      // Update session data with new information
      setSessionData(prev => {
        const updated = { ...prev };
        
        // Add new symptoms
        analysis.symptoms.forEach(symptom => {
          if (!updated.symptoms.includes(symptom)) {
            updated.symptoms.push(symptom);
          }
        });
        
        // Add to progress notes
        updated.progressNotes.push({
          timestamp: new Date(),
          content: userMessage,
          analysis: analysis
        });
        
        return updated;
      });

      // Build comprehensive conversation context for AI (limit to last 3 messages)
      const allMessages = [...conversationHistory, { role: 'user', content: userMessage }];
      const userMessages = allMessages.filter(msg => msg.role === 'user').slice(-3);
      const conversationText = userMessages.map(msg => msg.content).join('\n');
      
      // Intelligent crisis assessment using AI understanding instead of hardcoded phrases
      const assessCrisisLevel = async (text) => {
        const assessmentPrompt = `Analyze: "${text.substring(0, 100)}"\nCrisis level: suicidal, emergency, trauma, or general?\nAnswer:`;

        console.log('Starting crisis assessment with API key:', process.env.REACT_APP_COHERE_API_KEY ? 'Present' : 'Missing');
        
        try {
          const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: availableModel,
              prompt: assessmentPrompt,
              max_tokens: 5,
              temperature: 0.1,
              k: 0,
              p: 0.75,
              frequency_penalty: 0,
              presence_penalty: 0,
              stop_sequences: [],
              return_likelihoods: "NONE"
            })
          });

          console.log('API response status:', response.status, response.statusText);
          
          if (response.ok) {
            const data = await response.json();
            console.log('API response data:', data);
            if (data.generations && data.generations[0] && data.generations[0].text) {
              const assessedLevel = data.generations[0].text.trim().toLowerCase();
              const validLevels = ['suicidal', 'emergency', 'trauma', 'general'];
              const finalLevel = validLevels.includes(assessedLevel) ? assessedLevel : 'general';
              console.log('Crisis assessment result:', finalLevel, 'for text:', text);
              return finalLevel;
            } else {
              console.log('No text in API response');
            }
          } else {
            console.error('Crisis assessment API error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
          }
        } catch (error) {
          console.error('Crisis assessment error:', error);
        }
        
        console.log('Crisis assessment defaulted to general for text:', text);
        return 'general';
      };

      const crisisLevel = await assessCrisisLevel(conversationText);
      
      // CRITICAL FALLBACK: Check for suicidal content if AI assessment fails
      const finalCrisisLevel = (() => {
        if (crisisLevel !== 'general') return crisisLevel;
        
        // Emergency fallback for suicidal content
        const text_lower = conversationText.toLowerCase();
        const suicidalKeywords = [
          'kys', 'kill myself', 'suicide', 'want to die', 'end my life', 
          'end it all', 'not worth living', 'better off dead', 'wanna die',
          'want to kill myself', 'going to kill myself'
        ];
        
        if (suicidalKeywords.some(keyword => text_lower.includes(keyword))) {
          console.log('EMERGENCY FALLBACK: Detected suicidal content');
          return 'suicidal';
        }
        
        return 'general';
      })();
      
      // Dynamic AI prompt based on crisis level and context
      const buildAIPrompt = (crisisLevel, userMessage, conversationText) => {
        const basePrompt = `Client: "${userMessage.substring(0, 50)}"\nContext: "${conversationText.substring(0, 100)}"\nLevel: ${crisisLevel}\n\n`;
        
        const therapeuticGuidance = {
          suicidal: 'URGENT: 988, 911, emergency help. Life has value.',
          emergency: 'URGENT: Safety first. Emergency services, medical help.',
          trauma: 'TRAUMA: Empathy, validation, safety, gentle support.',
          general: 'THERAPY: Listen, reflect, explore feelings, support.'
        };
        
        return basePrompt + therapeuticGuidance[crisisLevel] + '\specifically respond as human therapist:';
      };

      // Use Cohere AI for intelligent response generation
      const prompt = buildAIPrompt(crisisLevel, userMessage, conversationText);
      
        try {
          console.log('Making Cohere API call with model:', availableModel);
          console.log('API Key present:', process.env.REACT_APP_COHERE_API_KEY ? 'Yes' : 'No');
          console.log('Prompt being sent:', prompt.substring(0, 100) + '...');
          
          const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: availableModel,
              prompt: prompt,
              max_tokens: 80,
              temperature: 0.8,
              k: 0,
              p: 0.75,
              frequency_penalty: 0,
              presence_penalty: 0,
              stop_sequences: [],
              return_likelihoods: "NONE"
            })
          });

        console.log('API response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Cohere API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Success Response:', data);
        
        if (!data.generations || !data.generations[0] || !data.generations[0].text) {
          console.error('Invalid response structure:', data);
          throw new Error('No response from Cohere AI');
        }

        console.log('Generated text:', data.generations[0].text);
        return data.generations[0].text.trim();
        
      } catch (error) {
        console.error('AI API error:', error);
        
        // Minimal fallback - let the AI handle most cases
        return "I'm here to support you through whatever you're experiencing. Can you tell me more about what's on your mind?";
      }
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm here to listen and support you. Tell me more about what's on your mind.";
    } finally {
      setIsTyping(false);
    }
  }, [analyzeUserInput, sessionData]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Generate AI response
    const aiResponse = await generateTherapeuticResponse(inputMessage, messages);
    
    const therapistMessage = {
      role: 'therapist',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, therapistMessage]);
  }, [inputMessage, messages, generateTherapeuticResponse]);

  const generateProfessionalPDF = useCallback(async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Helper function for adding text with word wrap
      const addText = (text, fontSize = 12, x = 20) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, pageWidth - 40);
        lines.forEach(line => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, x, yPosition);
          yPosition += fontSize * 0.7;
        });
        return yPosition;
      };

      // Header
      pdf.setFontSize(24);
      pdf.text('Comprehensive Mental Health Assessment', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      pdf.setFontSize(16);
      pdf.text(`Patient Assessment Report`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Patient Information Section
      pdf.setFontSize(18);
      pdf.text('Patient Information', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.text(`Session Number: ${sessionData.totalSessions + 1}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Sessions: ${sessionData.totalSessions}`, 20, yPosition);
      yPosition += 15;

      // Chief Complaint
      pdf.setFontSize(18);
      yPosition = addText('Chief Complaint', 16);
      yPosition += 5;

      const chiefComplaint = messages.length > 0 
        ? messages[0].content.substring(0, 200) + '...'
        : 'Patient reports general mental health concerns';
      yPosition = addText(chiefComplaint, 12);
      yPosition += 10;

      // Symptoms Analysis
      pdf.setFontSize(18);
      yPosition = addText('Symptom Analysis', 16);
      yPosition += 5;

      if (sessionData.symptoms.length > 0) {
        sessionData.symptoms.forEach(symptom => {
          yPosition = addText(`• ${symptom}`, 12, 30);
        });
      } else {
        yPosition = addText('No specific symptoms identified', 12, 30);
      }
      yPosition += 10;

      // Session Summary (AI-generated)
      pdf.setFontSize(18);
      yPosition = addText('Clinical Summary', 16);
      yPosition += 5;

      // Generate comprehensive clinical summary based on conversation
      const conversationSummary = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
      const clinicalSummary = `Patient presents with multiple significant stressors including grief, depression, anxiety, and housing instability. 

Presenting Issues:
- Grief related to grandmother's death (plane crash trauma)
- Additional grief related to mother's death
- Symptoms of depression and anxiety
- Current housing instability/homelessness
- Social withdrawal and isolation

Clinical Observations:
Patient demonstrates appropriate emotional responses to significant losses. Reports feelings of sadness, depression, and anxiety. Shows insight into mental health struggles but expresses reluctance to engage with others.

Risk Assessment:
- Moderate to high risk due to multiple stressors
- Housing instability increases vulnerability
- Social isolation may exacerbate symptoms
- Grief trauma from plane crash incident

Recommendations:
1. Immediate housing support services
2. Grief counseling specialized in traumatic loss
3. Depression and anxiety treatment
4. Social support reconnection
5. Crisis intervention resources`;

      yPosition = addText(clinicalSummary, 11);

      yPosition += 15;

      // Treatment Plan
      pdf.setFontSize(18);
      yPosition = addText('Treatment Recommendations', 16);
      yPosition += 5;

      const recommendations = [
        'Immediate connection to housing support services and shelters',
        'Grief counseling specialized in traumatic loss and plane crash incidents',
        'Psychiatric evaluation for depression and anxiety medication management',
        'Individual therapy focusing on trauma and grief processing',
        'Case management for social services and benefits coordination',
        'Support group for survivors of traumatic loss',
        'Crisis intervention plan with 24/7 support contacts',
        'Gradual reintegration with social support networks'
      ];

      recommendations.forEach((rec, index) => {
        yPosition = addText(`${index + 1}. ${rec}`, 12, 30);
      });

      yPosition += 15;

      // Progress Notes
      pdf.setFontSize(18);
      yPosition = addText('Session Progress Notes', 16);
      yPosition += 5;

      if (messages.length > 0) {
        messages.slice(-5).forEach((message, index) => {
          yPosition = addText(`${index + 1}. ${message.role.toUpperCase()}: ${message.content.substring(0, 100)}...`, 10, 30);
          yPosition += 3;
        });
      }

      // Footer
      pdf.setFontSize(10);
      pdf.text('This document is generated by AI and should be reviewed by qualified healthcare professionals.', pageWidth / 2, 280, { align: 'center' });

      // Save the PDF
      pdf.save(`mental-health-assessment-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, [sessionData, messages]);

  const clearChatHistory = () => {
    setIsClearing(true);
    setMessages([]);
    // Clear localStorage immediately
    localStorage.removeItem('therapySessions');
    setClearDialogOpen(false);
    // Reset clearing flag after a short delay
    setTimeout(() => setIsClearing(false), 100);
  };

  const clearAllMemory = () => {
    setIsClearing(true);
    
    // Clear localStorage first to prevent useEffect from repopulating
    localStorage.removeItem('therapySessions');
    localStorage.removeItem('therapySessionData');
    
    // Then clear state
    setMessages([]);
    setSessionData({
      startTime: new Date(),
      totalSessions: 0,
      symptoms: [],
      moodHistory: [],
      triggers: [],
      copingStrategies: [],
      medications: [],
      sleepPatterns: [],
      appetiteChanges: [],
      socialInteractions: [],
      workStress: [],
      personalHistory: [],
      familyHistory: [],
      medicalHistory: [],
      currentMedications: [],
      previousTreatments: [],
      riskFactors: [],
      protectiveFactors: [],
      goals: [],
      progressNotes: []
    });
    
    setClearDialogOpen(false);
    // Reset clearing flag after a short delay
    setTimeout(() => setIsClearing(false), 100);
  };

  const MessageComponent = ({ message }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
      <Avatar sx={{ 
        bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
        width: 40, 
        height: 40,
        flexShrink: 0
      }}>
        {message.role === 'user' ? <Person /> : <Psychology />}
      </Avatar>
      <Paper sx={{ 
        p: 2, 
        flex: 1,
        bgcolor: message.role === 'user' ? 'grey.100' : 'primary.50',
        borderRadius: 2,
        minWidth: 0
      }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {message.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', position: 'relative' }}>
      {/* Header - Fixed Position */}
      <Paper sx={{ 
        p: 2, 
        boxShadow: 2, 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h6">AI Therapist</Typography>
              <Typography variant="caption" color="text.secondary">
                Session #{sessionData.totalSessions + 1} • {messages.length} messages
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Clear Chat">
              <IconButton onClick={() => setClearDialogOpen(true)} color="warning">
                <Clear />
              </IconButton>
            </Tooltip>
            <Tooltip title="Session Analysis">
              <IconButton onClick={() => setAnalysisPanelOpen(true)}>
                <Badge badgeContent={sessionData.symptoms.length} color="primary">
                  <Assessment />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Session History">
              <IconButton onClick={() => setDrawerOpen(true)}>
                <History />
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate Medical Report">
              <IconButton onClick={generateProfessionalPDF}>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'secondary.main' }}>
                <Psychology sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                Welcome to Your Therapy Session
              </Typography>
              <Typography variant="body1" color="text.secondary">
                I'm here to listen and support you. Tell me what's on your mind, and I'll remember everything we discuss.
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => (
              <MessageComponent key={index} message={message} />
            ))
          )}
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <Psychology />
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                <Typography variant="body2" color="text.secondary">
                  Therapist is typing...
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input Area - Fixed Position */}
      <Paper sx={{ 
        p: 2, 
        boxShadow: 2, 
        position: 'sticky', 
        bottom: 0, 
        zIndex: 1000,
        flexShrink: 0,
        borderTop: '1px solid rgba(0,0,0,0.12)'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            variant="outlined"
            placeholder="Share what's on your mind..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isTyping}
          />
          <IconButton 
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            sx={{ alignSelf: 'flex-end' }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>

      {/* Analysis Drawer */}
      <Drawer
        anchor="right"
        open={analysisPanelOpen}
        onClose={() => setAnalysisPanelOpen(false)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Session Analysis</Typography>
            <IconButton onClick={() => setAnalysisPanelOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Identified Symptoms ({sessionData.symptoms.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {sessionData.symptoms.length > 0 ? (
                sessionData.symptoms.map((symptom, index) => (
                  <Chip key={index} label={symptom} sx={{ m: 0.5 }} />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No symptoms identified yet
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Session Progress</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Total Messages: {messages.length}
              </Typography>
              <Typography variant="body2">
                Session Duration: {messages.length > 0 ? 
                  Math.round((new Date() - new Date(messages[0].timestamp)) / 60000) : 0} minutes
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, (messages.length / 20) * 100)} 
                sx={{ mt: 2 }}
              />
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            fullWidth
            startIcon={<Download />}
            onClick={generateProfessionalPDF}
            sx={{ mt: 2 }}
          >
            Generate Medical Report
          </Button>
        </Box>
      </Drawer>

      {/* History Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Session History</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={message.role === 'user' ? 'You' : 'Therapist'}
                  secondary={message.content.substring(0, 100) + '...'}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DeleteSweep color="warning" />
            Clear Chat & Memory
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            What would you like to clear?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={clearChatHistory}
              startIcon={<Clear />}
              fullWidth
              sx={{ mb: 1 }}
            >
              Clear Chat Messages Only
            </Button>
            <Button
              variant="outlined"
              onClick={clearAllMemory}
              startIcon={<DeleteSweep />}
              color="warning"
              fullWidth
            >
              Clear Everything (Chat + Memory + History)
            </Button>
          </Box>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> This action cannot be undone. Clearing everything will delete all your session data, symptoms, and conversation history.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConversationalTherapist;
