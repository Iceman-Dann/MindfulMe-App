import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import { 
  Phone,
  Message,
  LocationOn,
  LocalHospital,
  Psychology,
  Warning,
  CheckCircle,
  Timer,
  CrisisAlert,
  Support,
  HealthAndSafety
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CrisisDetection = () => {
  const [riskLevel, setRiskLevel] = useState('low');
  const [warningTriggers, setWarningTriggers] = useState([]);
  const [emergencyDialog, setEmergencyDialog] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);

  const emergencyResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 free and confidential support',
      type: 'hotline'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Text-based crisis support',
      type: 'text'
    },
    {
      name: 'Emergency Services',
      phone: '911',
      description: 'For immediate medical emergencies',
      type: 'emergency'
    },
    {
      name: 'SAMHSA Helpline',
      phone: '1-800-662-4357',
      description: 'Treatment referral and information service',
      type: 'hotline'
    }
  ];

  const warningSigns = [
    'Expressions of hopelessness or worthlessness',
    'Increased isolation or withdrawal',
    'Sudden mood changes',
    'Talking about death or suicide',
    'Giving away possessions',
    'Increased substance use',
    'Extreme mood swings',
    'Changes in sleep patterns'
  ];

  useEffect(() => {
    // Simulate risk assessment based on user data
    const assessRisk = () => {
      const triggers = [];
      let score = 0;
      
      // Simulate analyzing recent mood patterns, chat content, etc.
      const recentMoods = ['sad', 'anxious', 'hopeless'];
      const chatKeywords = ['worthless', 'hopeless', 'end it all'];
      
      if (recentMoods.includes('hopeless')) {
        triggers.push('Persistent negative mood detected');
        score += 30;
      }
      
      if (chatKeywords.some(keyword => Math.random() > 0.7)) {
        triggers.push('Concerning language patterns detected');
        score += 40;
      }
      
      if (Math.random() > 0.8) {
        triggers.push('Unusual activity patterns');
        score += 20;
      }
      
      setWarningTriggers(triggers);
      setAssessmentScore(score);
      
      if (score >= 70) setRiskLevel('critical');
      else if (score >= 40) setRiskLevel('elevated');
      else setRiskLevel('low');
    };
    
    assessRisk();
  }, []);

  const getRiskColor = (level) => {
    switch(level) {
      case 'critical': return '#f44336';
      case 'elevated': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const handleEmergencyCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  const startBreathingExercise = () => {
    // Navigate to breathing exercise or open modal
    console.log('Starting emergency breathing exercise');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Crisis Detection & Support
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        AI-powered monitoring for early detection of mental health crises with immediate intervention options
      </Typography>

      {/* Risk Assessment Card */}
      <Card sx={{ mb: 4, border: `2px solid ${getRiskColor(riskLevel)}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CrisisAlert sx={{ 
              fontSize: 40, 
              color: getRiskColor(riskLevel),
              mr: 2 
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                Current Risk Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on recent activity patterns and mood analysis
              </Typography>
            </Box>
            <Chip 
              label={`${riskLevel.toUpperCase()} RISK`}
              sx={{ 
                backgroundColor: getRiskColor(riskLevel),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={assessmentScore}
            sx={{ 
              mb: 2,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getRiskColor(riskLevel)
              }
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Risk Score: {assessmentScore}/100
          </Typography>
          
          {warningTriggers.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Detected Warning Signs:
              </Typography>
              <List dense>
                {warningTriggers.map((trigger, index) => (
                  <ListItem key={index}>
                    <Warning sx={{ color: 'warning.main', mr: 1, fontSize: 20 }} />
                    <ListItemText primary={trigger} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Phone sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">Call 988</Typography>
              <Typography variant="body2" color="text.secondary">
                Suicide & Crisis Lifeline
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => handleEmergencyCall('988')}
                sx={{ mt: 1 }}
              >
                Call Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Message sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6">Text Support</Typography>
              <Typography variant="body2" color="text.secondary">
                Text HOME to 741741
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ mt: 1 }}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Psychology sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">Breathing Exercise</Typography>
              <Typography variant="body2" color="text.secondary">
                5-minute calm down
              </Typography>
              <Button 
                variant="outlined" 
                color="success"
                size="small"
                onClick={startBreathingExercise}
                sx={{ mt: 1 }}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <LocationOn sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6">Find Help</Typography>
              <Typography variant="body2" color="text.secondary">
                Local resources
              </Typography>
              <Button 
                variant="outlined" 
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              >
                Locate
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Emergency Resources */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
            Emergency Resources
          </Typography>
          
          <Grid container spacing={2}>
            {emergencyResources.map((resource, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      {resource.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {resource.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {resource.phone}
                      </Typography>
                      <Button 
                        size="small"
                        onClick={() => handleEmergencyCall(resource.phone)}
                        startIcon={<Phone />}
                      >
                        Call
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Warning Signs Education */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recognize Warning Signs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Be aware of these warning signs in yourself and others:
          </Typography>
          <Grid container spacing={1}>
            {warningSigns.map((sign, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  {sign}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Critical Alert Dialog */}
      <Dialog open={emergencyDialog && riskLevel === 'critical'} maxWidth="md">
        <DialogTitle sx={{ backgroundColor: 'error.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1 }} />
            Immediate Attention Required
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Our system has detected patterns that may indicate a mental health crisis. 
            Please reach out for help immediately.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Immediate Actions:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><Phone /></ListItemIcon>
                <ListItemText primary="Call 988 - Suicide & Crisis Lifeline" />
              </ListItem>
              <ListItem>
                <ListItemIcon><LocalHospital /></ListItemIcon>
                <ListItemText primary="Call 911 for immediate medical help" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Message /></ListItemIcon>
                <ListItemText primary="Text HOME to 741741 for crisis support" />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmergencyDialog(false)}>
            I understand
          </Button>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<Phone />}
            onClick={() => handleEmergencyCall('988')}
          >
            Call 988 Now
          </Button>
        </DialogActions>
      </Dialog>

      <Alert severity="error" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>IMPORTANT:</strong> This system is designed to support, not replace, professional mental health care. 
          If you or someone you know is in immediate danger, call emergency services immediately.
        </Typography>
      </Alert>
    </Box>
  );
};

export default CrisisDetection;
