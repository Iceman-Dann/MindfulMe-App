import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Tooltip,
  Fab,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton,
  Badge
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Psychology, 
  TrendingUp, 
  Spa, 
  Favorite, 
  CloudUpload, 
  EmojiEvents,
  Brightness4,
  Brightness7,
  Notifications,
  AccountCircle,
  Clear,
  Settings
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { login, logout, setLoading } from "./store/features/auth/authSlice";
import { setDarkMode } from "./store/features/darkMode/darkModeSlice";
import AppRoutes from "./utils/AppRoutes";





// Create stunning themes with hackathon-winning design
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#5a67d8',
    },
    secondary: {
      main: '#f093fb',
    },
    success: {
      main: '#48bb78',
    },
    warning: {
      main: '#ed8936',
    },
    error: {
      main: '#f56565',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#5a67d8',
    },
    secondary: {
      main: '#f093fb',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0aec0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.darkMode?.darkMode) ?? JSON.parse(localStorage.getItem('darkMode') || 'false');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const quickFeatures = [
    { icon: <Favorite />, label: "Chatbot", path: "/chatbot" },
    { icon: <CloudUpload />, label: "CBT Tools", path: "/cbt" },
    { icon: <EmojiEvents />, label: "Mindfulness", path: "/guided-meditation" },
    { icon: <Psychology />, label: "Self Assessment", path: "/self-assessment" },
    { icon: <TrendingUp />, label: "Memory Match", path: "/memory-match" },
    { icon: <Spa />, label: "Creative Canvas", path: "/draw" },
    { icon: <AccountCircle />, label: "Profile", path: "/profile" }
  ];

  useEffect(() => {
    // Check for existing user session on app load (but not on landing page)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPath = window.location.pathname;
    
    // Only auto-login if not on landing page
    if (currentUser && currentPath !== '/') {
      dispatch(login(currentUser));
    }
    
    // Load notifications from localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    // Add sample notifications if none exist
    if (storedNotifications.length === 0) {
      const sampleNotifications = [
        {
          id: 1,
          title: 'Welcome to MindfulMe!',
          message: 'Start your wellness journey by tracking your mood or trying AI chat.',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          title: 'Daily Reminder',
          message: 'Don\'t forget to check in with your mood today.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 3,
          title: 'New Feature Available',
          message: 'Try our new AI-powered meditation scripts for personalized guidance.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true
        }
      ];
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
      setNotifications(sampleNotifications);
    } else {
      setNotifications(storedNotifications);
    }
    dispatch(setLoading(false));
  }, [dispatch]);

  const Wrapper = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    backgroundImage: darkMode ? 
      'radial-gradient(circle at 20% 80%, #667eea20 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba220 0%, transparent 50%)' :
      'radial-gradient(circle at 20% 80%, #667eea10 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba210 0%, transparent 50%)',
  }));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleThemeToggle = () => {
    // Toggle theme in both localStorage and Redux state
    const newTheme = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(newTheme));
    sessionStorage.setItem('darkMode', JSON.stringify(newTheme));
    dispatch(setDarkMode(newTheme));
  };

  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
    setNotificationMenuOpen(false);
  };

  const drawerItems = (
    <Box
      sx={{ 
        width: 280,
        background: darkMode ? 'linear-gradient(135deg, #1a1a1a, #2d2d2d)' : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
        height: '100%'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 3, borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          MindfulMe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your Mental Wellness Journey
        </Typography>
      </Box>
      <List sx={{ p: 2 }}>
        {quickFeatures.map((feature, index) => (
          <ListItem 
            button 
            key={index}
            onClick={() => handleNavigation(feature.path)}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              '&:hover': { 
                backgroundColor: darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                transform: 'translateX(4px)'
              },
              transition: 'all 0.2s ease-in-out',
              py: 1.5
            }}
          >
            <Box sx={{ 
              mr: 2, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'
            }}>
              {feature.icon}
            </Box>
            <ListItemText 
              primary={feature.label} 
              primaryTypographyProps={{ 
                fontWeight: 600,
                color: darkMode ? '#ffffff' : '#2d3748'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Wrapper>
        {/* Professional Navigation Bar */}
        <AppBar 
          position="sticky" 
          sx={{ 
            background: darkMode ? 
              'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(45, 45, 45, 0.95))' : 
              'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95))',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar sx={{ minHeight: { xs: '60px', sm: '70px' } }}>
            {/* Hamburger Menu for Mobile */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ 
                mr: 2, 
                display: { xs: 'flex', sm: 'none' },
                color: darkMode ? '#ffffff' : '#2d3748'
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* App Logo and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar 
                sx={{ 
                  mr: 2, 
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                <Psychology />
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  MindfulMe
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  AI-Powered Mental Wellness
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {quickFeatures.slice(0, 4).map((feature, index) => (
                <Button
                  key={index}
                  startIcon={feature.icon}
                  onClick={() => handleNavigation(feature.path)}
                  sx={{
                    color: darkMode ? '#ffffff' : '#2d3748',
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                    }
                  }}
                >
                  {feature.label}
                </Button>
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  sx={{ 
                    color: darkMode ? '#ffffff' : '#2d3748',
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Theme">
                <IconButton 
                  onClick={handleThemeToggle}
                  sx={{ 
                    color: darkMode ? '#ffffff' : '#2d3748',
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <Avatar 
                  onClick={() => handleNavigation('/profile')}
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'secondary.main',
                    cursor: 'pointer',
                    display: { xs: 'none', sm: 'flex' },
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s ease'
                    }
                  }}
                >
                  <AccountCircle />
                </Avatar>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ display: { xs: 'block', sm: 'none' } }}
          PaperProps={{
            sx: {
              width: 280,
              borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            }
          }}
        >
          {drawerItems}
        </Drawer>

        {/* Notification Dropdown */}
        {notificationMenuOpen && (
          <Paper
            sx={{
              position: 'absolute',
              top: 70,
              right: 20,
              width: 320,
              maxHeight: 400,
              overflow: 'auto',
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                <IconButton size="small" onClick={clearAllNotifications}>
                  <Clear />
                </IconButton>
              </Box>
            </Box>
            
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    button
                    onClick={() => markNotificationAsRead(notification.id)}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                      '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' }
                    }}
                  >
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}

        {/* Main Content */}
        <Box sx={{ minHeight: 'calc(100vh - 70px)' }}>
          <AppRoutes />
        </Box>

        {/* Floating Action Button for Mobile */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, position: 'fixed', bottom: 20, right: 20, gap: 1 }}>
          <Tooltip title="Toggle Theme">
            <Fab 
              size="small" 
              onClick={handleThemeToggle}
              sx={{ 
                background: darkMode ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white'
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </Fab>
          </Tooltip>
        </Box>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
