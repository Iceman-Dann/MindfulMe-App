import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Slider,
  IconButton,
  Grid,
  Fab,
  Backdrop,
  CircularProgress,
  LinearProgress,
  useTheme,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Spa,
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  AccessTime,
  SelfImprovement,
  Nightlight,
  Waves,
  Psychology,
  Timer,
  Air,
  Refresh,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const EnhancedGuidedMeditation = () => {
  const theme = useTheme();
  const [selectedSession, setSelectedSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [isBreathingExercise, setIsBreathingExercise] = useState(false);
  const [breathingCount, setBreathingCount] = useState(0);
  const [customTimer, setCustomTimer] = useState(5);
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const breathingRef = useRef(null);

  const meditationSessions = [
    {
      id: 1,
      title: "Morning Mindfulness",
      description: "Start your day with clarity and intention",
      duration: "10 min",
      category: "Morning",
      difficulty: "Beginner",
      benefits: ["Focus", "Energy", "Clarity"],
      color: "#feca57",
      icon: <Waves />,
      audioUrl: "/assets/audio/Calm_Meditation_Music.mp3"
    },
    {
      id: 2,
      title: "Stress Relief",
      description: "Release tension and find calm",
      duration: "15 min",
      category: "Stress",
      difficulty: "Intermediate",
      benefits: ["Relaxation", "Stress Reduction", "Peace"],
      color: "#48dbfb",
      icon: <Spa />,
      audioUrl: "/assets/audio/Peaceful_Music_for_Meditation.mp3"
    },
    {
      id: 3,
      title: "Deep Sleep",
      description: "Prepare your mind for restful sleep",
      duration: "20 min",
      category: "Sleep",
      difficulty: "Beginner",
      benefits: ["Sleep Quality", "Relaxation", "Calm"],
      color: "#5f27cd",
      icon: <Nightlight />,
      audioUrl: "/assets/audio/Vishuddha_Throat_Chakra_Chakra_Meditation_Music.mp3"
    },
    {
      id: 4,
      title: "Anxiety Relief",
      description: "Calm anxious thoughts and find peace",
      duration: "12 min",
      category: "Anxiety",
      difficulty: "Intermediate",
      benefits: ["Anxiety Reduction", "Grounding", "Peace"],
      color: "#00d2d3",
      icon: <Psychology />,
      audioUrl: "/assets/audio/Calm_Meditation_Music.mp3"
    },
    {
      id: 5,
      title: "Focus Enhancement",
      description: "Improve concentration and mental clarity",
      duration: "8 min",
      category: "Focus",
      difficulty: "Advanced",
      benefits: ["Focus", "Productivity", "Clarity"],
      color: "#ff9ff3",
      icon: <SelfImprovement />,
      audioUrl: "/assets/audio/Peaceful_Music_for_Meditation.mp3"
    },
    {
      id: 6,
      title: "Breathing Exercise",
      description: "Master your breath for instant calm",
      duration: "5 min",
      category: "Breathing",
      difficulty: "Beginner",
      benefits: ["Breath Control", "Calm", "Focus"],
      color: "#54a0ff",
      icon: <Air />,
      audioUrl: "/assets/audio/Calm_Meditation_Music.mp3"
    }
  ];

  const handleSessionSelect = async (session) => {
    setIsLoading(true);
    setSelectedSession(session);
    handleStop();
    
    // Simulate loading audio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (audioRef.current) {
      audioRef.current.src = session.audioUrl;
      audioRef.current.load();
    }
    
    setIsLoading(false);
  };

  const handlePlayPause = () => {
    if (!selectedSession || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleTimeUpdate = (e) => {
    const audio = e.target;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  };

  const handleSeek = (e, newValue) => {
    if (audioRef.current && duration) {
      const seekTime = (newValue / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e, newValue) => {
    const newVolume = newValue / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const startBreathingExercise = () => {
    setIsBreathingExercise(true);
    setBreathingCount(0);
    
    const breathingCycle = () => {
      setBreathingCount(prev => prev + 1);
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    };
    
    breathingRef.current = setInterval(breathingCycle, 4000); // 4 seconds per phase
    
    // Stop after 5 minutes
    setTimeout(() => {
      if (breathingRef.current) {
        clearInterval(breathingRef.current);
        setIsBreathingExercise(false);
        setBreathingPhase('inhale');
      }
    }, 300000);
  };

  const stopBreathingExercise = () => {
    if (breathingRef.current) {
      clearInterval(breathingRef.current);
    }
    setIsBreathingExercise(false);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  const startCustomTimer = () => {
    const minutes = parseInt(customTimer) || 5;
    if (minutes > 0) {
      setTimerSeconds(minutes * 60);
      setIsTimerMode(true);
    }
  };

  const stopTimer = () => {
    setIsTimerMode(false);
    setTimerSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isTimerMode && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerMode(false);
            // Timer completed
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerMode, timerSeconds]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', () => {});
      };
    }
  }, [selectedSession]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isFullscreen 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}
      />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant={isFullscreen ? "h2" : "h3"} 
              sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: isFullscreen ? 'white' : '#667eea',
                textShadow: isFullscreen ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              <Spa sx={{ mr: 2, verticalAlign: 'middle' }} />
              Guided Meditation & Mindfulness
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: isFullscreen ? 'rgba(255,255,255,0.9)' : '#666',
                mb: 4 
              }}
            >
              Transform your mental state with expert-guided meditation sessions
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Meditation Sessions */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3, 
                  color: isFullscreen ? 'white' : '#333' 
                }}
              >
                Choose Your Meditation Journey
              </Typography>
              
              <Grid container spacing={3}>
                {meditationSessions.map((session, index) => (
                  <Grid item xs={12} sm={6} key={session.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedSession?.id === session.id ? '3px solid' : '1px solid rgba(0,0,0,0.1)',
                          borderColor: selectedSession?.id === session.id ? session.color : 'rgba(0,0,0,0.1)',
                          background: isFullscreen ? 'rgba(255,255,255,0.1)' : 'white',
                          backdropFilter: isFullscreen ? 'blur(10px)' : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isFullscreen ? '0 8px 32px rgba(0,0,0,0.3)' : 4,
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleSessionSelect(session)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: session.color, mr: 2 }}>
                              {session.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 600, 
                                  mb: 0.5,
                                  color: isFullscreen ? 'white' : 'inherit'
                                }}
                              >
                                {session.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666' }}
                              >
                                {session.description}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Chip 
                              label={session.duration} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderColor: isFullscreen ? 'rgba(255,255,255,0.5)' : undefined,
                                color: isFullscreen ? 'white' : 'inherit'
                              }} 
                            />
                            <Chip 
                              label={session.category} 
                              size="small" 
                              sx={{ 
                                bgcolor: session.color + '20', 
                                color: session.color 
                              }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {session.benefits.map((benefit, idx) => (
                              <Chip 
                                key={idx} 
                                label={benefit} 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                  borderColor: isFullscreen ? 'rgba(255,255,255,0.3)' : undefined,
                                  color: isFullscreen ? 'rgba(255,255,255,0.8)' : 'inherit'
                                }} 
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Player & Controls */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card sx={{ 
                background: isFullscreen ? 'rgba(255,255,255,0.1)' : 'white',
                backdropFilter: isFullscreen ? 'blur(10px)' : 'none',
                border: isFullscreen ? '1px solid rgba(255,255,255,0.2)' : 'none'
              }}>
                <CardContent sx={{ p: 3 }}>
                  {selectedSession ? (
                    <>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: selectedSession.color, 
                          mx: 'auto', 
                          mb: 2 
                        }}>
                          {selectedSession.icon}
                        </Avatar>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            color: isFullscreen ? 'white' : 'inherit'
                          }}
                        >
                          {selectedSession.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666' }}
                        >
                          {selectedSession.duration} • {selectedSession.category}
                        </Typography>
                      </Box>

                      {/* Progress */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666' }}
                          >
                            {formatTime(currentTime)}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666' }}
                          >
                            {formatTime(duration)}
                          </Typography>
                        </Box>
                        <Slider
                          value={progress}
                          onChange={handleSeek}
                          sx={{
                            color: isFullscreen ? 'white' : selectedSession.color,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16
                            }
                          }}
                        />
                      </Box>

                      {/* Main Controls */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                        <IconButton
                          onClick={handleStop}
                          size="small"
                          sx={{
                            color: isFullscreen ? 'white' : 'inherit',
                            bgcolor: isFullscreen ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                          }}
                        >
                          <Stop />
                        </IconButton>
                        
                        <IconButton
                          onClick={handlePlayPause}
                          disabled={isLoading}
                          sx={{
                            bgcolor: selectedSession.color,
                            color: 'white',
                            width: 56,
                            height: 56,
                            '&:hover': { bgcolor: selectedSession.color + 'dd' },
                            '&:disabled': { opacity: 0.6 }
                          }}
                        >
                          {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : isPlaying ? (
                            <Pause />
                          ) : (
                            <PlayArrow />
                          )}
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          sx={{
                            color: isFullscreen ? 'white' : 'inherit',
                            bgcolor: isFullscreen ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                          }}
                        >
                          <Refresh />
                        </IconButton>
                      </Box>

                      {/* Volume Control */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <IconButton 
                          onClick={toggleMute}
                          size="small"
                          sx={{ color: isFullscreen ? 'white' : 'inherit' }}
                        >
                          {isMuted ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>
                        <Slider
                          value={volume * 100}
                          onChange={handleVolumeChange}
                          sx={{
                            flex: 1,
                            color: isFullscreen ? 'white' : selectedSession.color,
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16
                            }
                          }}
                        />
                      </Box>

                      {/* Timer Section */}
                      <Card sx={{ 
                        mb: 3, 
                        background: isFullscreen ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                        border: `1px solid ${selectedSession.color}30`
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ mb: 2, color: selectedSession.color }}>
                            <Timer sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Meditation Timer
                          </Typography>
                          
                          {isTimerMode ? (
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography 
                                variant="h3" 
                                sx={{ 
                                  color: selectedSession.color,
                                  fontWeight: 700,
                                  mb: 1
                                }}
                              >
                                {formatTime(timerSeconds)}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666',
                                  mb: 2
                                }}
                              >
                                Timer Active
                              </Typography>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={stopTimer}
                                sx={{ mb: 1 }}
                              >
                                Stop Timer
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                  type="number"
                                  label="Minutes"
                                  value={customTimer}
                                  onChange={(e) => setCustomTimer(Math.max(1, Math.min(60, parseInt(e.target.value) || 5)))}
                                  inputProps={{ min: 1, max: 60 }}
                                  size="small"
                                  sx={{ width: 120 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  minutes
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<Timer />}
                                onClick={startCustomTimer}
                                sx={{
                                  bgcolor: selectedSession.color,
                                  color: 'white',
                                  '&:hover': { bgcolor: selectedSession.color + 'dd' }
                                }}
                              >
                                Start Timer
                              </Button>
                            </Box>
                          )}
                        </CardContent>
                      </Card>

                      {/* Breathing Exercise Section */}
                      <Card sx={{ 
                        mb: 3, 
                        background: isFullscreen ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                        border: `1px solid ${selectedSession.color}30`
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ mb: 2, color: selectedSession.color }}>
                            <Air sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Breathing Exercise
                          </Typography>
                          
                          {isBreathingExercise ? (
                            <Box sx={{ textAlign: 'center' }}>
                              <motion.div
                                animate={{
                                  scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'hold' ? 1.5 : 1,
                                  opacity: breathingPhase === 'hold' ? 0.7 : 1
                                }}
                                transition={{ duration: 2 }}
                              >
                                <Typography 
                                  variant="h4" 
                                  sx={{ 
                                    color: selectedSession.color,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    mb: 1
                                  }}
                                >
                                  {breathingPhase}
                                </Typography>
                              </motion.div>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666',
                                  mb: 2
                                }}
                              >
                                Round {breathingCount + 1}
                              </Typography>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={stopBreathingExercise}
                              >
                                Stop Exercise
                              </Button>
                            </Box>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Air />}
                              onClick={startBreathingExercise}
                              sx={{
                                borderColor: selectedSession.color,
                                color: selectedSession.color,
                                width: '100%',
                                '&:hover': {
                                  borderColor: selectedSession.color,
                                  bgcolor: selectedSession.color + '10'
                                }
                              }}
                            >
                              Start Breathing Exercise
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Spa sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ color: isFullscreen ? 'rgba(255,255,255,0.8)' : '#666' }}
                      >
                        Select a meditation session to begin
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Floating Action Buttons */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: `linear-gradient(45deg, #667eea, #764ba2)`,
            '&:hover': {
              background: `linear-gradient(45deg, #764ba2, #667eea)`,
            }
          }}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </Fab>
      </Container>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default EnhancedGuidedMeditation;
