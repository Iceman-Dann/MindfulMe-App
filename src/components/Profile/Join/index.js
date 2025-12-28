import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@mui/material/styles/styled";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Container as MuiContainer,
  Grid,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  Psychology
} from "@mui/icons-material";
import { motion } from "framer-motion";
import logo from "../../../assets/images/logo.svg";
import { useDispatch } from "react-redux";
import { login } from "../../../store/features/auth/authSlice.js";
import { registerUser } from "../../../utils/auth.js";

const Container = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
    opacity: 0.3,
  }
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "500px",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backdropFilter: "blur(10px)",
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  position: "relative",
  zIndex: 1,
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const Logo = styled("img")(({ theme }) => ({
  width: "80px",
  height: "80px",
  marginBottom: theme.spacing(2),
  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  marginTop: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
  },
  transition: "all 0.3s ease",
}));

const Join = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await registerUser(email, password, username);
      
      if (result.success) {
        dispatch(login(result.user));
        navigate("/", { replace: true });
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FormContainer elevation={24}>
          <LogoContainer>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Logo src={logo} alt="MindfulMe Logo" />
            </motion.div>
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              fontWeight: 700, 
              color: "primary.main",
              textAlign: "center" 
            }}>
              MindfulMe
            </Typography>
            <Typography variant="body2" sx={{ 
              color: "text.secondary", 
              textAlign: "center",
              mb: 2 
            }}>
              Your AI-Powered Mental Health Companion
            </Typography>
          </LogoContainer>

          <Box component="form" onSubmit={handleJoin}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600, 
              mb: 3,
              textAlign: "center",
              color: "text.primary"
            }}>
              Create Your Account
            </Typography>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <StyledTextField
              id="username"
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              id="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              id="password"
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              id="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{" "}
                    <Link href="/terms" sx={{ color: "primary.main" }}>
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" sx={{ color: "primary.main" }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Box>

            <StyledButton 
              type="submit" 
              disabled={isLoading || !agreeToTerms}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </StyledButton>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Already have an account?
              </Typography>
              <Link 
                href="/login" 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Sign In
              </Link>
            </Box>
          </Box>
        </FormContainer>
      </motion.div>
    </Container>
  );
};

export default Join;
