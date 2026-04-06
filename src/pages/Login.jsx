import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManagerIcon,
  Visibility as ViewerIcon,
} from '@mui/icons-material';
import { useAuth, ROLES } from '../context/AuthContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  // Removed unused Snackbar context
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    setLoading(true);

    try {
      const result = await login(null, null, selectedRole);
      if (result.success) {
        toast.success(result.message || 'Login successful!');
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Position on the right
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/image_login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        p: { xs: 2, md: 10 },
        overflow: 'hidden'
      }}
    >
      <Card
        sx={{
          // maxWidth: 520, // Increased width
          width: '33%',
          p: { xs: 4, md: 6 },
          borderRadius: '48px', // More rounded
          background: 'transparent',
          backdropFilter: 'blur(10px) saturate(160%)',
          WebkitBackdropFilter: 'blur(10px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
          color: 'white', // Ensure text is visible on transparent background
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2,
              bgcolor: 'rgba(55, 54, 54, 0.8)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <DashboardIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textShadow: '0 1px 2px rgba(0,0,0,0.1)', color: 'rgba(55, 54, 54, 0.8)' }}>
            Expense Tracker
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(55, 54, 54, 0.8)', fontWeight: 500 }}>
            Securely access your dashboard
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'left', px: 1, color: 'rgba(55, 54, 54, 0.8)' }}>
            Select Account Type:
          </Typography>

          <ToggleButtonGroup
            value={selectedRole}
            exclusive
            onChange={(e, value) => value && setSelectedRole(value)}
            fullWidth
            sx={{
              mb: 1,
              gap: 1.5,
              '& .MuiToggleButtonGroup-grouped': {
                border: '1px solid rgba(255, 255, 255, 0.2) !important',
                borderRadius: '16px !important',
                background: 'transparent',
                color: 'rgba(55, 54, 54, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-2px)',
                },

                '&.Mui-selected': {
                  background: 'rgb(169, 145, 126)', // ✅ your color
                  color: 'rgba(55, 54, 54, 0.8)', // better contrast (optional)

                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',

                  '&:hover': {
                    background: 'rgb(169, 145, 126)'
                  },

                  '& .MuiTypography-root': {
                    color: '#000',
                  },

                  '& .MuiSvgIcon-root': {
                    color: '#000)',
                  }
                },
              }
            }}
          >
            <ToggleButton
              value={ROLES.ADMIN}
              sx={{ flexDirection: 'column', py: 1.5, flex: 1 }}
            >
              <AdminIcon sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">Admin</Typography>
            </ToggleButton>
            <ToggleButton
              value={ROLES.MANAGER}
              sx={{ flexDirection: 'column', py: 1.5, flex: 1 }}
            >
              <ManagerIcon sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">Manager</Typography>
            </ToggleButton>
            <ToggleButton
              value={ROLES.VIEWER}
              sx={{ flexDirection: 'column', py: 1.5, flex: 1 }}
            >
              <ViewerIcon sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">Viewer</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: '16px',
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              background: 'rgb(169, 145, 126)',
              '&:hover': {
                background: 'rgb(169, 145, 126)', // slightly darker
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="rgba(55, 54, 54, 0.8)" /> : `Enter Dashboard`}
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 2,
            borderRadius: '16px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="caption" color="rgba(55, 54, 54, 0.8)" sx={{ display: 'block', fontStyle: 'italic' }}>
            Choose a role to explore different access levels and features of the expense tracking system.
          </Typography>
        </Paper>
      </Card>
    </Box>
  );
};

export default Login;
