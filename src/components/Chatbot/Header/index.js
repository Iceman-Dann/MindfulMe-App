import { Box, Typography, Switch, FormControlLabel, Tooltip, Avatar, Chip } from "@mui/material";
import { Psychology, AutoAwesome } from "@mui/icons-material";
import { motion } from "framer-motion";

function Header({ thinkingMode, setThinkingMode }) {
  return (
    <Box 
      height="80px" 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between" 
      px={4}
      sx={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          whileHover={{ scale: 1.1 }}
        >
          <Avatar 
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(45deg, #14b8a6, #10b981)',
              boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)'
            }}
          >
            <Psychology sx={{ color: '#ffffff', fontSize: '24px' }} />
          </Avatar>
        </motion.div>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography 
              variant="h5" 
              sx={{ 
                background: 'linear-gradient(45deg, #14b8a6, #10b981)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '1.5rem',
                lineHeight: 1.2
              }}
            >
              MindfulMe AI
            </Typography>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <AutoAwesome sx={{ color: '#fbbf24', fontSize: '20px' }} />
            </motion.div>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Mental Wellness Companion
            </Typography>
            <Chip 
              icon={<AutoAwesome sx={{ fontSize: '14px !important' }} />}
              label="AI Powered"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #14b8a6, #10b981)',
                color: 'white',
                fontSize: '0.7rem',
                height: '24px',
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Box>
        </Box>
      </Box>
      
      <Tooltip title="Toggle thinking animation mode for better UX" placement="bottom">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Psychology sx={{ 
              color: thinkingMode ? '#14b8a6' : '#94a3b8', 
              fontSize: '20px',
              transition: 'color 0.3s ease'
            }} />
          </motion.div>
          <FormControlLabel
            control={
              <Switch
                checked={thinkingMode}
                onChange={(e) => setThinkingMode(e.target.checked)}
                size="medium"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: '#14b8a6',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#14b8a6',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: '#e2e8f0',
                  },
                  '& .MuiSwitch-track.Mui-checked': {
                    backgroundColor: '#14b8a6',
                  },
                }}
              />
            }
            label={
              <Typography 
                sx={{ 
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  ml: 1
                }}
              >
                Thinking Mode
              </Typography>
            }
            sx={{ 
              ml: 0,
              '& .MuiFormControlLabel-label': {
                color: '#475569'
              }
            }}
          />
        </Box>
      </Tooltip>
    </Box>
  );
}

export default Header;
