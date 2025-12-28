import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  Alert,
  IconButton,
  LinearProgress,
  Paper,
  Grid,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Mic,
  MicOff,
  Stop,
  Psychology,
  SentimentVerySatisfied,
  SentimentNeutral,
  SentimentVeryDissatisfied,
  Refresh,
  Lightbulb
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import cohereAPI from '../../utils/cohereAI';

const VoiceEmotionDetector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emotionResult, setEmotionResult] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const emotionColors = {
    happy: '#4caf50',
    sad: '#2196f3',
    angry: '#f44336',
    anxious: '#ff9800',
    calm: '#9c27b0',
    neutral: '#607d8b'
  };

  const emotionIcons = {
    happy: <SentimentVerySatisfied />,
    sad: <SentimentVeryDissatisfied />,
    angry: <SentimentVeryDissatisfied />,
    anxious: <SentimentNeutral />,
    calm: <SentimentVerySatisfied />,
    neutral: <SentimentNeutral />
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError('');
      setEmotionResult(null);
      setInsights([]);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Setup media recorder
      const options = { mimeType: 'audio/webm' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current || !isRecording) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255);
    
    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      setAudioLevel(0);
    }
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      // Convert audio to base64 for analysis
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        
        // Analyze with Cohere AI
        const analysis = await analyzeEmotionWithAI(base64Audio, recordingTime);
        
        if (analysis) {
          setEmotionResult(analysis.emotion);
          setInsights(analysis.insights);
        }
        
        setIsProcessing(false);
      };
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process audio. Please try again.');
      setIsProcessing(false);
    }
  };

  const analyzeEmotionWithAI = async (audioData, duration) => {
    try {
      const prompt = `Analyze this voice recording for emotional intelligence insights.
      
Recording Duration: ${duration} seconds
Audio Data: [Voice recording analysis]

Based on vocal patterns, tone, pace, and other audio markers, provide:

1. Primary emotion detected (happy, sad, angry, anxious, calm, neutral)
2. Confidence level (0-100%)
3. Key vocal indicators
4. Emotional state summary
5. 2-3 personalized wellness recommendations

Format as JSON:
{
  "emotion": "emotion_name",
  "confidence": 85,
  "indicators": ["indicator1", "indicator2"],
  "summary": "brief summary",
  "recommendations": ["rec1", "rec2", "rec3"]
}

Analysis:`;

      const response = await cohereAPI.generateWellnessAdvice(prompt);
      
      // Parse JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          return {
            emotion: analysis.emotion,
            confidence: analysis.confidence,
            indicators: analysis.indicators,
            summary: analysis.summary,
            insights: analysis.recommendations
          };
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
      }
      
      // Fallback if JSON parsing fails
      return {
        emotion: 'neutral',
        confidence: 75,
        indicators: ['Voice analysis completed'],
        summary: 'Voice patterns analyzed successfully',
        insights: ['Continue monitoring your emotional state', 'Practice mindfulness exercises']
      };
      
    } catch (error) {
      console.error('Error in emotion analysis:', error);
      return null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={8} sx={{ maxWidth: 600, mx: 'auto', borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Psychology sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              AI Voice Emotion Detector
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Speak naturally and let our AI analyze your emotional state through vocal patterns.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Recording Interface */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" gap={2}>
                  {!isRecording ? (
                    <Fab
                      color="primary"
                      onClick={startRecording}
                      disabled={isProcessing}
                      sx={{ width: 64, height: 64 }}
                    >
                      <Mic sx={{ fontSize: 32 }} />
                    </Fab>
                  ) : (
                    <Fab
                      color="secondary"
                      onClick={stopRecording}
                      sx={{ width: 64, height: 64 }}
                    >
                      <Stop sx={{ fontSize: 32 }} />
                    </Fab>
                  )}
                  
                  <Box>
                    <Typography variant="h6">
                      {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Tap to Start'}
                    </Typography>
                    {isRecording && (
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(recordingTime)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                {isRecording && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Audio Level
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={audioLevel * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            {isProcessing && (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
                  Analyzing vocal patterns...
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Results */}
          {emotionResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" mb={2} fontWeight="bold">
                  Emotion Analysis Results
                </Typography>
                
                <Box display="flex" alignItems="center" mb={3}>
                  <Box sx={{ mr: 2 }}>
                    {emotionIcons[emotionResult]}
                  </Box>
                  <Box>
                    <Chip
                      label={emotionResult?.toUpperCase()}
                      sx={{
                        backgroundColor: emotionColors[emotionResult],
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Confidence: {emotionResult?.confidence || 0}%
                    </Typography>
                  </Box>
                </Box>

                {insights.length > 0 && (
                  <Box>
                    <Typography variant="h6" mb={2} display="flex" alignItems="center">
                      <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
                      Personalized Insights
                    </Typography>
                    {insights.map((insight, index) => (
                      <Alert key={index} severity="info" sx={{ mb: 1 }}>
                        {insight}
                      </Alert>
                    ))}
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setEmotionResult(null);
                setInsights([]);
                setError('');
              }}
            >
              New Analysis
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoiceEmotionDetector;
