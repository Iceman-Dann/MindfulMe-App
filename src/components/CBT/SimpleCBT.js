import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  Grid,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Psychology,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Assignment,
  Mood,
  SentimentSatisfied,
  SentimentDissatisfied
} from '@mui/icons-material';

const SimpleCBT = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    automaticThought: '',
    emotions: '',
    evidenceFor: '',
    evidenceAgainst: '',
    alternativeThought: ''
  });
  const [savedRecords, setSavedRecords] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setThoughtRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveThoughtRecord = () => {
    if (thoughtRecord.situation && thoughtRecord.automaticThought) {
      const newRecord = {
        id: Date.now(),
        ...thoughtRecord,
        date: new Date().toLocaleDateString()
      };
      setSavedRecords(prev => [newRecord, ...prev]);
      setThoughtRecord({
        situation: '',
        automaticThought: '',
        emotions: '',
        evidenceFor: '',
        evidenceAgainst: '',
        alternativeThought: ''
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const exercises = [
    {
      title: "Thought Challenge",
      description: "Identify and challenge negative thoughts",
      icon: <Psychology />,
      difficulty: "Beginner",
      time: "10-15 min"
    },
    {
      title: "Behavioral Activation",
      description: "Schedule positive activities",
      icon: <TrendingUp />,
      difficulty: "Intermediate",
      time: "20-30 min"
    },
    {
      title: "Mindfulness Practice",
      description: "Practice present-moment awareness",
      icon: <Lightbulb />,
      difficulty: "Beginner",
      time: "15-20 min"
    },
    {
      title: "Problem Solving",
      description: "Develop coping strategies",
      icon: <Assignment />,
      difficulty: "Advanced",
      time: "25-35 min"
    }
  ];

  const renderThoughtRecord = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology color="primary" />
          Thought Record
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Situation"
              multiline
              rows={2}
              value={thoughtRecord.situation}
              onChange={(e) => handleInputChange('situation', e.target.value)}
              placeholder="What happened?"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Automatic Thought"
              multiline
              rows={2}
              value={thoughtRecord.automaticThought}
              onChange={(e) => handleInputChange('automaticThought', e.target.value)}
              placeholder="What thought went through your mind?"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Emotions"
              multiline
              rows={2}
              value={thoughtRecord.emotions}
              onChange={(e) => handleInputChange('emotions', e.target.value)}
              placeholder="How did you feel? (Rate intensity 0-100)"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Evidence For"
              multiline
              rows={3}
              value={thoughtRecord.evidenceFor}
              onChange={(e) => handleInputChange('evidenceFor', e.target.value)}
              placeholder="What evidence supports this thought?"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Evidence Against"
              multiline
              rows={3}
              value={thoughtRecord.evidenceAgainst}
              onChange={(e) => handleInputChange('evidenceAgainst', e.target.value)}
              placeholder="What evidence contradicts this thought?"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Alternative Thought"
              multiline
              rows={2}
              value={thoughtRecord.alternativeThought}
              onChange={(e) => handleInputChange('alternativeThought', e.target.value)}
              placeholder="What's a more balanced perspective?"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveThoughtRecord}
              size="large"
              startIcon={<CheckCircle />}
            >
              Save Thought Record
            </Button>
          </Grid>
        </Grid>
        
        {showSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Thought record saved successfully!
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderExercises = () => (
    <Grid container spacing={3}>
      {exercises.map((exercise, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>
                  {exercise.icon}
                </Box>
                <Typography variant="h6">{exercise.title}</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {exercise.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={exercise.difficulty} size="small" variant="outlined" />
                <Chip label={exercise.time} size="small" color="primary" variant="outlined" />
              </Box>
              
              <Button variant="outlined" fullWidth>
                Start Exercise
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProgress = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Progress
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Statistics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">
                  {savedRecords.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thought Records
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">
                  85%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main">
                  7
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day Streak
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {savedRecords.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Thought Records</Typography>
            <List>
              {savedRecords.slice(0, 5).map((record) => (
                <ListItem key={record.id} divider>
                  <ListItemIcon>
                    <Mood color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={record.situation.substring(0, 50) + '...'}
                    secondary={`${record.date} - ${record.emotions.substring(0, 30)}...`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        CBT Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Cognitive Behavioral Therapy exercises to help manage thoughts and emotions
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Button
          onClick={() => setActiveTab(0)}
          variant={activeTab === 0 ? 'contained' : 'text'}
          sx={{ mr: 2 }}
        >
          Thought Record
        </Button>
        <Button
          onClick={() => setActiveTab(1)}
          variant={activeTab === 1 ? 'contained' : 'text'}
          sx={{ mr: 2 }}
        >
          Exercises
        </Button>
        <Button
          onClick={() => setActiveTab(2)}
          variant={activeTab === 2 ? 'contained' : 'text'}
        >
          Progress
        </Button>
      </Box>

      {activeTab === 0 && renderThoughtRecord()}
      {activeTab === 1 && renderExercises()}
      {activeTab === 2 && renderProgress()}
    </Container>
  );
};

export default SimpleCBT;
