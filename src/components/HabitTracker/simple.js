import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  LinearProgress,
  Container,
  Grid,
  Fab
} from '@mui/material';
import {
  Add,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  TrendingUp,
  CalendarToday
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const darkMode = useSelector((state) => state.darkMode?.darkMode) ?? false;

  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
    setHabits(savedHabits);
  }, []);

  const saveHabits = (updatedHabits) => {
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      completions: []
    };
    
    saveHabits([...habits, habit]);
    setNewHabit('');
    setOpenDialog(false);
  };

  const toggleHabit = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toDateString();
        const alreadyCompleted = habit.completions.includes(today);
        
        if (alreadyCompleted) {
          return {
            ...habit,
            completed: false,
            streak: Math.max(0, habit.streak - 1),
            completions: habit.completions.filter(date => date !== today)
          };
        } else {
          return {
            ...habit,
            completed: true,
            streak: habit.streak + 1,
            completions: [...habit.completions, today]
          };
        }
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId) => {
    saveHabits(habits.filter(habit => habit.id !== habitId));
  };

  const getStreakColor = (streak) => {
    if (streak >= 21) return '#4caf50';
    if (streak >= 7) return '#ff9800';
    return '#f44336';
  };

  const completedToday = habits.filter(habit => 
    habit.completions.includes(new Date().toDateString())
  ).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color={darkMode ? '#fff' : '#1a237e'} gutterBottom>
          Habit Tracker
        </Typography>
        <Typography variant="h6" color={darkMode ? '#b0bec5' : '#546e7a'}>
          Build positive habits and track your progress
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: darkMode ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Habits</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">{habits.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: darkMode ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ mr: 1 }} />
                  <Typography variant="h6">Completed Today</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">{completedToday}/{habits.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: darkMode ? 'linear-gradient(135deg, #4facfe, #00f2fe)' : 'linear-gradient(135deg, #4facfe, #00f2fe)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography variant="h6">Best Streak</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {habits.map((habit) => (
          <Grid item xs={12} md={6} key={habit.id}>
            <Card sx={{ 
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'white',
              backdropFilter: 'blur(10px)',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color={darkMode ? '#fff' : '#1a237e'} fontWeight="bold">
                    {habit.name}
                  </Typography>
                  <IconButton onClick={() => deleteHabit(habit.id)} size="small">
                    <Delete />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton 
                    onClick={() => toggleHabit(habit.id)}
                    sx={{ mr: 2 }}
                  >
                    {habit.completed ? (
                      <CheckCircle sx={{ color: '#4caf50' }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: darkMode ? '#fff' : '#666' }} />
                    )}
                  </IconButton>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color={darkMode ? '#b0bec5' : '#666'} gutterBottom>
                      Current Streak: {habit.streak} days
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (habit.streak / 21) * 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStreakColor(habit.streak),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                </Box>
                
                <Chip 
                  label={`${habit.streak} day streak`}
                  sx={{ 
                    backgroundColor: getStreakColor(habit.streak),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #667eea, #764ba2)'
        }}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>

      <Box sx={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: darkMode ? 'rgba(0,0,0,0.9)' : 'white',
        p: 4,
        borderRadius: 2,
        boxShadow: 24,
        display: openDialog ? 'block' : 'none',
        zIndex: 1000,
        minWidth: 300
      }}>
        <Typography variant="h6" gutterBottom>
          Add New Habit
        </Typography>
        <TextField
          fullWidth
          label="Habit Name"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={addHabit}>Add Habit</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HabitTracker;
