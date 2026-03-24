import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_LABELS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [userName, setUserName] = useState('suhani');
  const { login } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole, userName || 'suhani');
    navigate('/dashboard');
  };

  const roles = [
    { id: 'admin', label: 'Admin', description: 'Full access' },
    { id: 'manager', label: 'Manager', description: 'View & Edit' },
    { id: 'viewer', label: 'Viewer', description: 'View only' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        // Gradient background with pattern
        background: mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5,
        },
      }}
    >
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Theme Toggle */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          color: 'white',
          bgcolor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          '&:hover': { 
            bgcolor: 'rgba(255,255,255,0.3)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          mx: 2,
          borderRadius: 4,
          boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
          position: 'relative',
          overflow: 'visible',
          animation: 'slideUp 0.5s ease-out',
        }}
      >
        {/* Decorative top bar */}
        <Box
          sx={{
            height: 8,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '4px 4px 0 0',
          }}
        />
        
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '2.5rem',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              }}
            >
              <LockIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access your dashboard
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Name Input */}
            <TextField
              fullWidth
              label="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            {/* Role Select */}
            <TextField
              fullWidth
              select
              label="Select Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              margin="normal"
              variant="outlined"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.875rem',
                        bgcolor: role.id === 'admin' ? 'primary.main' : 
                               role.id === 'manager' ? 'secondary.main' : 'grey.500'
                      }}
                    >
                      {role.label.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="500">{role.label}</Typography>
                    </Box>
                    <Chip label={role.description} size="small" variant="outlined" />
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* Role Preview */}
            <Paper
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your permissions as {ROLE_LABELS[selectedRole]}:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="View" 
                  color="success" 
                  size="small" 
                  icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                />
                {selectedRole !== 'viewer' && (
                  <Chip 
                    label="Edit" 
                    color="success" 
                    size="small" 
                  />
                )}
                {selectedRole === 'admin' && (
                  <Chip 
                    label="Delete" 
                    color="success" 
                    size="small" 
                  />
                )}
                {selectedRole === 'viewer' && (
                  <Chip 
                    label="Edit" 
                    color="error" 
                    size="small" 
                    sx={{ opacity: 0.7 }}
                  />
                )}
                {selectedRole !== 'admin' && (
                  <Chip 
                    label="Delete" 
                    color="error" 
                    size="small" 
                    sx={{ opacity: 0.7 }}
                  />
                )}
              </Box>
            </Paper>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
