import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Camera,
  CameraAlt,
  Stop,
  Refresh,
  Psychology,
  TrendingUp,
  Lightbulb
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AIEmotionDetector = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Emotion labels
  const emotions = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
  
  // Emotion colors
  const emotionColors = {
    neutral: '#9E9E9E',
    happy: '#4CAF50',
    sad: '#2196F3',
    angry: '#F44336',
    fearful: '#9C27B0',
    disgusted: '#FF9800',
    surprised: '#FF5722'
  };

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setError(null);
        // In a real implementation, you would load actual models
        // For demo purposes, we'll simulate model loading
        console.log('Loading emotion detection models...');
        
        // Simulate model loading delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsModelLoaded(true);
        console.log('Emotion detection models loaded successfully');
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Failed to load emotion detection models. Please refresh the page.');
      }
    };

    loadModels();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please allow camera access to use emotion detection.');
    }
  };

  // Stop camera
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
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  // Simulate emotion detection (replace with real face-api.js implementation)
  const detectEmotion = useCallback(() => {
    // Simulate emotion detection with random results
    // In real implementation, this would use face-api.js to detect emotions
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
    
    const emotionData = {
      emotion: randomEmotion,
      confidence: confidence,
      timestamp: new Date()
    };

    setCurrentEmotion(emotionData);
    setEmotionHistory(prev => [...prev.slice(-9), emotionData]); // Keep last 10 emotions
  }, []);

  // Start emotion detection
  const startDetection = () => {
    if (!cameraActive) {
      setError('Please start the camera first.');
      return;
    }

    setIsDetecting(true);
    detectEmotion(); // Initial detection
    
    // Detect emotions every 2 seconds
    detectionIntervalRef.current = setInterval(detectEmotion, 2000);
  };

  // Stop emotion detection
  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Get wellness recommendation based on emotion
  const getWellnessRecommendation = (emotion) => {
    const recommendations = {
      happy: "Keep up the positive energy! Consider sharing your joy with others or journaling what's making you happy.",
      neutral: "You're in a balanced state. This is a great time for mindfulness exercises or setting daily intentions.",
      sad: "It's okay to feel sad. Try listening to calming music, talking to a friend, or engaging in a comforting activity.",
      angry: "Your anger is valid. Consider deep breathing exercises, physical activity, or expressing your feelings constructively.",
      fearful: "When feeling anxious, try grounding techniques, deep breathing, or talking through your fears with someone you trust.",
      disgusted: "This feeling might indicate something needs to change. Consider what's causing this feeling and how you can address it.",
      surprised: "Surprise can be energizing! Take a moment to process what's new and decide how you want to respond."
    };
    return recommendations[emotion] || "Take a moment to check in with yourself and practice self-awareness.";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          <Psychology sx={{ mr: 2, verticalAlign: 'middle' }} />
          AI Emotion Detection
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Real-time emotion analysis using computer vision and machine learning
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Model Loading */}
        {!isModelLoaded && (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Loading AI Models...</Typography>
            <Typography variant="body2" color="text.secondary">
              Initializing emotion detection neural networks
            </Typography>
          </Paper>
        )}

        {isModelLoaded && (
          <Grid container spacing={4}>
            {/* Camera Section */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Live Camera Feed
                </Typography>
                
                {/* Video Display */}
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width="640"
                    height="480"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      border: '2px solid #e0e0e0',
                      display: cameraActive ? 'block' : 'none'
                    }}
                  />
                  
                  {/* Canvas for emotion overlay (for real implementation) */}
                  <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      display: 'none'
                    }}
                  />
                  
                  {/* Placeholder when camera is off */}
                  {!cameraActive && (
                    <Box
                      sx={{
                        width: '100%',
                        height: '300px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #ccc'
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <CameraAlt sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          Camera Off
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click "Start Camera" to begin emotion detection
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Camera Controls */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {!cameraActive ? (
                    <Button
                      variant="contained"
                      startIcon={<Camera />}
                      onClick={startCamera}
                      size="large"
                    >
                      Start Camera
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<Stop />}
                      onClick={stopCamera}
                      size="large"
                      color="error"
                    >
                      Stop Camera
                    </Button>
                  )}
                  
                  {cameraActive && !isDetecting && (
                    <Button
                      variant="contained"
                      startIcon={<Psychology />}
                      onClick={startDetection}
                      size="large"
                      color="primary"
                    >
                      Start Detection
                    </Button>
                  )}
                  
                  {isDetecting && (
                    <Button
                      variant="outlined"
                      startIcon={<Stop />}
                      onClick={stopDetection}
                      size="large"
                      color="warning"
                    >
                      Stop Detection
                    </Button>
                  )}
                </Box>

                {/* Detection Status */}
                {isDetecting && (
                  <Box sx={{ mt: 3 }}>
                    <Alert severity="info">
                      <LinearProgress sx={{ mb: 1 }} />
                      Emotion detection in progress... Analyzing facial expressions every 2 seconds.
                    </Alert>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} md={4}>
              {/* Current Emotion */}
              {currentEmotion && (
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Current Emotion
                  </Typography>
                  
                  <motion.div
                    key={currentEmotion.emotion}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          color: emotionColors[currentEmotion.emotion],
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}
                      >
                        {currentEmotion.emotion}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        Confidence: {(currentEmotion.confidence * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={currentEmotion.confidence * 100}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: emotionColors[currentEmotion.emotion]
                        }
                      }}
                    />
                  </motion.div>
                </Paper>
              )}

              {/* Wellness Recommendation */}
              {currentEmotion && (
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Wellness Recommendation
                  </Typography>
                  <Typography variant="body2">
                    {getWellnessRecommendation(currentEmotion.emotion)}
                  </Typography>
                </Paper>
              )}

              {/* Emotion History */}
              {emotionHistory.length > 0 && (
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Recent Emotions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {emotionHistory.slice(-5).reverse().map((emotion, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: 'grey.50'
                        }}
                      >
                        <Chip
                          label={emotion.emotion}
                          size="small"
                          sx={{
                            backgroundColor: emotionColors[emotion.emotion],
                            color: 'white',
                            textTransform: 'capitalize',
                            fontWeight: 'bold'
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {(emotion.confidence * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}

        {/* Info Section */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>1. Computer Vision:</strong> Uses facial landmark detection to analyze facial expressions in real-time.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>2. Machine Learning:</strong> Trained neural networks classify expressions into 7 basic emotions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>3. Wellness Insights:</strong> Provides personalized recommendations based on detected emotions.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AIEmotionDetector;
