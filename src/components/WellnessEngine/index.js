import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  SelfImprovement, 
  Psychology, 
  Favorite, 
  MusicNote,
  Book,
  DirectionsRun,
  People,
  Refresh,
  Star,
  Add,
  Lightbulb,
  TrendingUp,
  EmojiEvents,
  LocalFireDepartment,
  Celebrate
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import cohereAI from '../../utils/cohereAI.js';

const WellnessEngine = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState({
    stressLevel: 'moderate',
    mood: 'neutral',
    energy: 0.7,
    sleepQuality: 0.8,
    activityLevel: 0.6,
    interests: [],
    goals: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [streak, setStreak] = useState(1);
  const [achievements, setAchievements] = useState(1);
  const [wellnessScore, setWellnessScore] = useState(80);
  const [showCelebration, setShowCelebration] = useState(false);

  const recommendationTypes = {
    meditation: { icon: <SelfImprovement />, color: '#9c27b0' },
    breathing: { icon: <Favorite />, color: '#f44336' },
    music: { icon: <MusicNote />, color: '#2196f3' },
    reading: { icon: <Book />, color: '#ff9800' },
    exercise: { icon: <DirectionsRun />, color: '#4caf50' },
    social: { icon: <People />, color: '#795548' }
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      // Create personalized prompt for AI
      const prompt = `Generate personalized wellness recommendations based on this user profile:

User Profile:
- Stress Level: ${userProfile.stressLevel}
- Current Mood: ${userProfile.mood}
- Energy Level: ${Math.round(userProfile.energy * 100)}%
- Sleep Quality: ${Math.round(userProfile.sleepQuality * 100)}%
- Activity Level: ${Math.round(userProfile.activityLevel * 100)}%
- Interests: ${userProfile.interests.join(', ') || 'Not specified'}
- Goals: ${userProfile.goals || 'Not specified'}

Please provide 6 personalized wellness recommendations as JSON array with this structure:
[
  {
    "type": "meditation|breathing|music|reading|exercise|social",
    "title": "Activity title",
    "description": "Brief description",
    "duration": "X min",
    "difficulty": "Beginner|Easy|Moderate",
    "effectiveness": 0.XX,
    "reasoning": "Why this helps specifically for this user",
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
  }
]

Make recommendations highly personalized based on their interests and current state. Return only valid JSON.`;

      const aiResponse = await cohereAI.generateWellnessAdvice(prompt, userProfile);
      
      let newRecommendations = [];
      
      if (aiResponse) {
        try {
          // Try to parse AI response as JSON
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            newRecommendations = JSON.parse(jsonMatch[0]);
          }
        } catch (parseError) {
          console.log('AI response parsing failed, using fallback');
        }
      }
      
      // Fallback to enhanced mock data if AI fails
      if (newRecommendations.length === 0) {
        newRecommendations = generatePersonalizedFallback();
      }
      
      // Generate AI insights
      await generateInsights();
      
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Use fallback recommendations
      setRecommendations(generatePersonalizedFallback());
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePersonalizedFallback = () => {
    const baseRecommendations = [
      {
        id: 1,
        type: 'meditation',
        title: userProfile.interests.includes('mindfulness') ? 'Advanced Mindfulness Practice' : '5-Minute Mindful Breathing',
        description: userProfile.stressLevel === 'high' ? 'Immediate stress relief technique' : 'Quick breathing exercise to reduce stress and improve focus',
        duration: '5 min',
        difficulty: 'Beginner',
        effectiveness: userProfile.stressLevel === 'high' ? 0.95 : 0.9,
        reasoning: `Based on your ${userProfile.stressLevel} stress level, short meditation sessions are most effective`,
        benefits: ['Stress Reduction', 'Improved Focus', 'Emotional Balance']
      },
      {
        id: 2,
        type: userProfile.interests.includes('music') ? 'music' : 'breathing',
        title: userProfile.interests.includes('music') ? 'Curated Wellness Playlist' : '4-7-8 Breathing Technique',
        description: userProfile.interests.includes('music') ? 'Personalized music for your current mood' : 'Ancient breathing technique for rapid relaxation',
        duration: userProfile.interests.includes('music') ? '15 min' : '3 min',
        difficulty: 'Easy',
        effectiveness: 0.88,
        reasoning: userProfile.interests.includes('music') ? 'Music therapy matches your interests' : 'Quick intervention for immediate stress relief',
        benefits: userProfile.interests.includes('music') ? ['Mood Enhancement', 'Anxiety Relief', 'Energy Boost'] : ['Immediate Calm', 'Reduced Anxiety', 'Better Sleep']
      }
    ];

    // Add more personalized recommendations based on interests
    if (userProfile.interests.includes('exercise')) {
      baseRecommendations.push({
        id: 3,
        type: 'exercise',
        title: userProfile.energy > 0.7 ? 'Energizing Yoga Flow' : 'Gentle Stretching Routine',
        description: userProfile.energy > 0.7 ? 'Boost your energy with dynamic movements' : 'Release physical tension with guided stretching',
        duration: '10 min',
        difficulty: 'Beginner',
        effectiveness: 0.85,
        reasoning: `Matches your interest in exercise and current energy level`,
        benefits: ['Physical Relief', 'Energy Boost', 'Mood Improvement']
      });
    }

    if (userProfile.interests.includes('reading')) {
      baseRecommendations.push({
        id: 4,
        type: 'reading',
        title: 'Personalized Growth Article',
        description: `Content focused on ${userProfile.goals || 'personal development'}`,
        duration: '8 min',
        difficulty: 'Easy',
        effectiveness: 0.8,
        reasoning: 'Aligns with your reading interests and goals',
        benefits: ['Knowledge Gain', 'Perspective Shift', 'Mood Elevation']
      });
    }

    return baseRecommendations.slice(0, 6);
  };

  const generateInsights = async () => {
    try {
      const insightPrompt = `Analyze this user wellness profile and provide 3 key insights:

Profile:
- Stress: ${userProfile.stressLevel}
- Mood: ${userProfile.mood}
- Energy: ${Math.round(userProfile.energy * 100)}%
- Sleep: ${Math.round(userProfile.sleepQuality * 100)}%
- Activity: ${Math.round(userProfile.activityLevel * 100)}%
- Interests: ${userProfile.interests.join(', ') || 'Not specified'}
- Goals: ${userProfile.goals || 'Not specified'}

Provide 3 concise, actionable insights as a JSON array of strings:
["insight 1", "insight 2", "insight 3"]

Make them personalized and helpful.`;

      const aiInsights = await cohereAI.generateWellnessAdvice(insightPrompt, userProfile);
      
      if (aiInsights) {
        try {
          const jsonMatch = aiInsights.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsedInsights = JSON.parse(jsonMatch[0]);
            setInsights(parsedInsights);
            return;
          }
        } catch (e) {
          console.log('Insight parsing failed');
        }
      }
      
      // Fallback insights
      setInsights([
        userProfile.stressLevel === 'high' ? 'Your stress levels indicate a need for immediate relaxation techniques' : 'Your stress levels are manageable with regular self-care',
        userProfile.sleepQuality < 0.7 ? 'Improving sleep quality could significantly impact your overall wellbeing' : 'Your sleep quality is good for maintaining mental clarity',
        userProfile.interests.length > 0 ? `Your interests in ${userProfile.interests.join(', ')} can be leveraged for better mental health` : 'Consider exploring different wellness activities to find what resonates with you'
      ]);
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !userProfile.interests.includes(newInterest.trim())) {
      setUserProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    generateRecommendations();
  };

 return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* WOW FACTOR: Gamification Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card sx={{ 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalFireDepartment sx={{ fontSize: 40, color: '#ff6b6b' }} />
                  AI Wellness Engine
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Your Personal Mental Health Companion
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEvents sx={{ color: '#ffd700' }} />
                  {streak} Day Streak!
                </Typography>
                <Typography variant="body2">
                  {achievements} Achievements Unlocked
                </Typography>
              </Box>
            </Box>
            
            {/* Wellness Score Bar */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                AI Wellness Score: {wellnessScore}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={wellnessScore} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #ff6b6b, #ffd700, #4caf50)',
                    borderRadius: 5
                  }
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<Star />}
                label={`Level ${Math.floor(wellnessScore/20) + 1} Wellness Warrior`}
                color="secondary"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                icon={<TrendingUp />}
                label="Top 10% This Week"
                color="secondary"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </CardContent>
          
          {/* Animated Background Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
        </Card>
      </motion.div>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            AI Wellness Recommendations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personalized suggestions based on your current mental and physical state
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={generateRecommendations} disabled={isGenerating}>
            <Refresh />
          </IconButton>
          <IconButton onClick={() => setInterestDialogOpen(true)} color="primary">
            <Add />
          </IconButton>
        </Box>
      </Box>

      {/* AI Insights Section */}
      {insights.length > 0 && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb />
              AI Insights for You
            </Typography>
            {insights.map((insight, index) => (
              <Alert key={index} severity="info" sx={{ mb: 1, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                {insight}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* User Profile Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
              Your Current State Analysis
            </Typography>
            <Button size="small" onClick={() => setInterestDialogOpen(true)} startIcon={<Add />}>
              Edit Interests & Goals
            </Button>
          </Box>
          
          {/* Display Interests */}
          {userProfile.interests.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Your Interests:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {userProfile.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    color="primary"
                    onDelete={() => removeInterest(interest)}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {userProfile.goals && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Your Goals:</Typography>
              <Typography variant="body1">{userProfile.goals}</Typography>
            </Box>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Stress Level</Typography>
              <LinearProgress 
                variant="determinate" 
                value={userProfile.stressLevel === 'low' ? 25 : userProfile.stressLevel === 'moderate' ? 50 : 75}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption">{userProfile.stressLevel}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Energy Level</Typography>
              <LinearProgress variant="determinate" value={userProfile.energy * 100} sx={{ mt: 1 }} />
              <Typography variant="caption">{Math.round(userProfile.energy * 100)}%</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Sleep Quality</Typography>
              <LinearProgress variant="determinate" value={userProfile.sleepQuality * 100} sx={{ mt: 1 }} />
              <Typography variant="caption">{Math.round(userProfile.sleepQuality * 100)}%</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Activity Level</Typography>
              <LinearProgress variant="determinate" value={userProfile.activityLevel * 100} sx={{ mt: 1 }} />
              <Typography variant="caption">{Math.round(userProfile.activityLevel * 100)}%</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      {isGenerating ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading personalized recommendations...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((rec) => (
            <Grid item xs={12} sm={6} md={4} key={rec.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: rec.id * 0.1 }}
              >
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: recommendationTypes[rec.type].color,
                        mr: 2 
                      }}>
                        {recommendationTypes[rec.type].icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                          {rec.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {rec.duration} • {rec.difficulty}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {rec.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Effectiveness
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={rec.effectiveness * 100}
                        sx={{ mt: 0.5 }}
                      />
                      <Typography variant="caption">
                        {Math.round(rec.effectiveness * 100)}% match for you
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" sx={{ 
                      fontStyle: 'italic', 
                      display: 'block', 
                      mb: 2,
                      color: 'text.secondary'
                    }}>
                      {rec.reasoning}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Benefits:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {rec.benefits.map((benefit, idx) => (
                          <Chip 
                            key={idx}
                            label={benefit}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      size="small"
                      fullWidth
                      sx={{ mt: 'auto' }}
                      onClick={() => {
                        // WOW FACTOR: Celebration Effect
                        setWellnessScore(prev => Math.min(100, prev + 5));
                        setAchievements(prev => prev + 1);
                        setShowCelebration(true);
                        setTimeout(() => setShowCelebration(false), 3000);
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Celebrate />
                        Start Activity
                      </Box>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Interest & Goals Dialog */}
      <Dialog open={interestDialogOpen} onClose={() => setInterestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Personalize Your Wellness Journey</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body1" gutterBottom>
              Tell us about your interests and goals to get better recommendations
            </Typography>
            
            <Typography variant="h6">Your Interests</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Add an interest (e.g., music, reading, exercise)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
              />
              <Button variant="contained" onClick={addInterest} disabled={!newInterest.trim()}>
                Add Interest
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {userProfile.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  onDelete={() => removeInterest(interest)}
                  color="primary"
                />
              ))}
            </Box>
            
            <Typography variant="h6">Your Goals</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What are your wellness goals? (e.g., reduce stress, improve sleep)"
              value={userProfile.goals}
              onChange={(e) => setUserProfile(prev => ({ ...prev, goals: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterestDialogOpen(false)}>Cancel</Button>
          <Button onClick={generateRecommendations} variant="contained">
            Save and Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
