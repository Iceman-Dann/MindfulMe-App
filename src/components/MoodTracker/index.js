import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Alert,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Mood as MoodIcon,
  TrendingUp,
  TrendingDown,
  Equalizer,
  CalendarToday,
  Add,
  Close,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  Lightbulb,
  Psychology,
  Timeline
} from "@mui/icons-material";
import { motion } from 'framer-motion';
import cohereAPI from '../../utils/cohereAI.js';
import APIKeySetup from "../APIKeySetup";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNote, setMoodNote] = useState("");
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [insights, setInsights] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const moodOptions = [
    { value: 1, label: "Very Sad", icon: <SentimentVeryDissatisfied />, color: "#f44336" },
    { value: 2, label: "Sad", icon: <SentimentDissatisfied />, color: "#ff9800" },
    { value: 3, label: "Neutral", icon: <SentimentNeutral />, color: "#ffc107" },
    { value: 4, label: "Happy", icon: <SentimentSatisfied />, color: "#4caf50" },
    { value: 5, label: "Very Happy", icon: <SentimentVerySatisfied />, color: "#2196f3" }
  ];

  const influencingFactors = [
    "Sleep", "Exercise", "Work", "Social", "Stress", "Weather", "Food", "Health"
  ];

  useEffect(() => {
    // Load real data from localStorage
    const storedEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    setMoodEntries(storedEntries);
    
    // Generate insights if we have data
    if (storedEntries.length > 0) {
      generateInsights(storedEntries);
    }
  }, []);

  const generateSampleData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString(),
        mood: Math.floor(Math.random() * 5) + 1,
        note: `Mood entry for ${date.toLocaleDateString()}`,
        factors: influencingFactors.slice(0, Math.floor(Math.random() * 4) + 1)
      });
    }
    
    return data;
  };

  const generateInsights = async (data) => {
    setIsGeneratingInsights(true);
    
    try {
      console.log('Generating AI insights for mood data...');
      
      // Prepare mood data for AI analysis
      const moodData = data.slice(-10).map(entry => ({
        date: entry.date,
        mood: entry.mood,
        note: entry.note,
        factors: entry.factors.join(', ')
      }));

      const prompt = `As a mental health AI, analyze this mood tracking data and provide personalized insights:

Recent Mood Data:
${JSON.stringify(moodData, null, 2)}

Please provide 3-4 specific, actionable insights about:
1. Mood patterns and trends
2. Key factors affecting mood
3. Recommended coping strategies
4. Positive reinforcement for progress

Keep insights concise, supportive, and evidence-based. Format as bullet points:

Insights:`;

      // Direct API call like AI Companion
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer A443dmaow1J4IZSxVAsjjJFw8OQv4WwZDOispMeA',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: prompt,
          max_tokens: 300,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const apiData = await response.json();
      console.log('API response data:', apiData);
      
      if (!apiData.generations || apiData.generations.length === 0) {
        throw new Error('No response from API');
      }
      
      const aiInsight = apiData.generations[0].text.trim();
      console.log('AI insight result:', aiInsight);
      
      // Parse AI response into individual insights
      const insightLines = aiInsight.split('\n').filter(line => line.trim());
      setInsights(insightLines);
      console.log('AI insights generated successfully:', insightLines);
      
    } catch (error) {
      console.error('Error generating AI insights:', error);
      // Fallback to basic insights
      const fallbackInsights = generateBasicInsights(data);
      setInsights(fallbackInsights);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateBasicInsights = (data) => {
    const insights = [];
    
    if (data.length > 0) {
      const avgMood = data.reduce((sum, entry) => sum + entry.mood, 0) / data.length;
      const recentMood = data.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / 7;
      
      if (recentMood > avgMood) {
        insights.push("Your mood has been improving lately! Keep up the great work.");
      } else if (recentMood < avgMood) {
        insights.push("Your mood has been a bit lower recently. Consider self-care activities.");
      }
      
      const mostCommonFactors = {};
      data.forEach(entry => {
        entry.factors.forEach(factor => {
          mostCommonFactors[factor] = (mostCommonFactors[factor] || 0) + 1;
        });
      });
      
      const topFactor = Object.keys(mostCommonFactors).reduce((a, b) => 
        mostCommonFactors[a] > mostCommonFactors[b] ? a : b
      );
      
      insights.push(`${topFactor} appears to be the most common factor affecting your mood.`);
    }
    
    return insights;
  };

  const handleAddMoodEntry = async () => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      mood: currentMood,
      note: moodNote,
      factors: selectedFactors
    };
    
    const updatedEntries = [...moodEntries, newEntry];
    setMoodEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    
    await generateInsights(updatedEntries);
    setOpenDialog(false);
    setCurrentMood(5);
    setMoodNote("");
    setSelectedFactors([]);
  };

  const getMoodColor = (mood) => {
    const option = moodOptions.find(opt => opt.value === mood);
    return option ? option.color : "#666";
  };

  const getChartData = () => {
    return moodEntries.map((entry, index) => ({
      name: `Day ${index + 1}`,
      mood: entry.mood,
      date: entry.date
    }));
  };

  const getFactorDistribution = () => {
    const factorCount = {};
    moodEntries.forEach(entry => {
      entry.factors.forEach(factor => {
        factorCount[factor] = (factorCount[factor] || 0) + 1;
      });
    });
    
    return Object.keys(factorCount).map(factor => ({
      name: factor,
      value: factorCount[factor]
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
            Advanced Mood Tracking
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
            Track your emotional patterns and gain insights into your mental wellness
          </Typography>
          
          <Fab
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              background: 'linear-gradient(45deg, #667eea, #764ba2)'
            }}
          >
            <Add />
          </Fab>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea20, #764ba220)' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                {moodEntries.length > 0 ? Math.round(moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length * 20) : 0}%
              </Typography>
              <Typography variant="body2" color="#666">Average Mood</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #43e97b20, #38f9d720)' }}>
              <CalendarToday sx={{ fontSize: 40, color: '#43e97b', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#43e97b' }}>
                {moodEntries.length}
              </Typography>
              <Typography variant="body2" color="#666">Days Tracked</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f093fb20, #f5576c20)' }}>
              <Equalizer sx={{ fontSize: 40, color: '#f093fb', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f093fb' }}>
                {moodEntries.length > 0 ? Math.max(...moodEntries.map(e => e.mood)) : 0}
              </Typography>
              <Typography variant="body2" color="#666">Best Mood</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #4facfe20, #00f2fe20)' }}>
              <Psychology sx={{ fontSize: 40, color: '#4facfe', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4facfe' }}>
                {insights.length}
              </Typography>
              <Typography variant="body2" color="#666">AI Insights</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* AI Insights */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
              <Lightbulb sx={{ mr: 1, color: '#ffc107' }} />
              AI-Powered Insights
            </Typography>
                      </Box>
          
          {isGeneratingInsights && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                Generating AI insights...
              </Typography>
            </Box>
          )}
          
          {insights.length > 0 && !isGeneratingInsights && (
            <Grid container spacing={2}>
              {insights.map((insight, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {insight}
                  </Alert>
                </Grid>
              ))}
            </Grid>
          )}
          
          {!localStorage.getItem('cohere_api_key') && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Set up your Cohere API key to get real AI-powered insights for your mood patterns.
            </Alert>
          )}
        </Box>

        {/* Charts */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                <Timeline sx={{ mr: 1, color: '#667eea' }} />
                Mood Trends Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#667eea"
                    fill="#667eea"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                Influencing Factors
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getFactorDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getFactorDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#667eea', '#764ba2', '#f093fb', '#43e97b', '#4facfe', '#fa709a', '#feca57', '#48dbfb'][index % 8]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Entries */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
            Recent Mood Entries
          </Typography>
          <Grid container spacing={2}>
            {moodEntries.slice(-6).reverse().map((entry, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: getMoodColor(entry.mood), mr: 2 }}>
                      {moodOptions.find(opt => opt.value === entry.mood)?.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {entry.date}
                      </Typography>
                      <Typography variant="caption" color="#666">
                        {moodOptions.find(opt => opt.value === entry.mood)?.label}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                    {entry.note}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {entry.factors.map((factor, idx) => (
                      <Chip key={idx} label={factor} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>

      {/* Add Mood Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Your Mood</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              How are you feeling today?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              {moodOptions.map((option) => (
                <Tooltip key={option.value} title={option.label}>
                  <IconButton
                    onClick={() => setCurrentMood(option.value)}
                    sx={{
                      bgcolor: currentMood === option.value ? option.color : 'transparent',
                      color: currentMood === option.value ? 'white' : option.color,
                      '&:hover': { bgcolor: option.color + '20' }
                    }}
                  >
                    {option.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            <Slider
              value={currentMood}
              onChange={(e, value) => setCurrentMood(value)}
              min={1}
              max={5}
              step={1}
              marks={moodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Add a note (optional)"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
            What factors are influencing your mood?
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {influencingFactors.map((factor) => (
              <Chip
                key={factor}
                label={factor}
                clickable
                color={selectedFactors.includes(factor) ? 'primary' : 'default'}
                onClick={() => {
                  if (selectedFactors.includes(factor)) {
                    setSelectedFactors(selectedFactors.filter(f => f !== factor));
                  } else {
                    setSelectedFactors([...selectedFactors, factor]);
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMoodEntry} variant="contained">
            Save Mood Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MoodTracker;
