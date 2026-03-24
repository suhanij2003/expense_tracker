import { useState } from 'react';
import { useAuth, ROLE_LABELS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSnackbar } from '../context/SnackbarContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

export default function Settings() {
  const { user, hasPermission } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { showSnackbar } = useSnackbar();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    language: 'en',
    timezone: 'UTC'
  });

  const canEdit = hasPermission('canEdit');
  const canDelete = hasPermission('canDelete');

  const handleToggle = (key) => {
    if (!canEdit) return;
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    showSnackbar('Settings updated successfully ⚙️');
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SecurityIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your application preferences and configurations
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        Email Notifications
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive email updates about your account
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                    disabled={!canEdit}
                    color="primary"
                  />
                </Paper>

                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <NotificationsIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        Email Alerts
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Get notified about important events
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={settings.emailAlerts}
                    onChange={() => handleToggle('emailAlerts')}
                    disabled={!canEdit}
                    color="primary"
                  />
                </Paper>

                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DarkModeIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        Dark Mode
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Switch between light and dark theme
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                    color="primary"
                  />
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Regional Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LanguageIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Regional Settings
                </Typography>
              </Box>
              
              <Stack spacing={3}>
                <Box>
                  <TextField
                    select
                    fullWidth
                    label="Language"
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    disabled={!canEdit}
                    InputProps={{
                      startAdornment: <LanguageIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español (Spanish)</MenuItem>
                    <MenuItem value="fr">Français (French)</MenuItem>
                    <MenuItem value="de">Deutsch (German)</MenuItem>
                    <MenuItem value="pt">Português (Portuguese)</MenuItem>
                  </TextField>
                </Box>

                <Box>
                  <TextField
                    select
                    fullWidth
                    label="Timezone"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    disabled={!canEdit}
                    InputProps={{
                      startAdornment: <ScheduleIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                    }}
                  >
                    <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
                    <MenuItem value="EST">Eastern Time (ET)</MenuItem>
                    <MenuItem value="PST">Pacific Time (PT)</MenuItem>
                    <MenuItem value="IST">India Standard Time (IST)</MenuItem>
                    <MenuItem value="JST">Japan Standard Time (JST)</MenuItem>
                    <MenuItem value="GMT">Greenwich Mean Time (GMT)</MenuItem>
                  </TextField>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LockIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Security Settings
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        Change Password
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Update your account password
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      disabled={!canEdit}
                      sx={{ ml: 2 }}
                    >
                      Update
                    </Button>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add an extra layer of security
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      disabled={!canEdit}
                      sx={{ ml: 2 }}
                    >
                      Enable
                    </Button>
                  </Paper>
                </Grid>

                {canDelete && (
                  <Grid item xs={12}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 3, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        bgcolor: 'error.light',
                        borderColor: 'error.main',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'error.light', opacity: 0.9 },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="500" color="error.dark">
                          Delete Account
                        </Typography>
                        <Typography variant="caption" color="error.dark">
                          Permanently delete your account and all data
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ ml: 2 }}
                      >
                        Delete
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        {canEdit && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd6 0%, #6748a0 100%)',
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
