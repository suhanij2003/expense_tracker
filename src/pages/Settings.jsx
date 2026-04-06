import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  DeleteSweep as ClearDataIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';

const Settings = () => {
  const { mode, toggleTheme } = useCustomTheme();
  // Removed unused Snackbar context
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    budgetAlerts: true,
    weeklyReports: false,
  });

  const handleNotificationChange = (key) => () => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification settings updated');
  };

  const handleClearData = () => {
    localStorage.removeItem('budgets');
    toast.info('All local data has been cleared');
    setClearDataDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ThemeIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Appearance
              </Typography>
            </Box>
            <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                  />
                }
                label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Switch between light and dark themes. Your preference is saved automatically.
              </Typography>
            </Paper>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon><NotificationsIcon /></ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive updates via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.email}
                    onChange={handleNotificationChange('email')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><NotificationsIcon /></ListItemIcon>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Browser push notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.push}
                    onChange={handleNotificationChange('push')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><SecurityIcon /></ListItemIcon>
                <ListItemText
                  primary="Budget Alerts"
                  secondary="Get notified when approaching budget limits"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.budgetAlerts}
                    onChange={handleNotificationChange('budgetAlerts')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><InfoIcon /></ListItemIcon>
                <ListItemText
                  primary="Weekly Reports"
                  secondary="Receive weekly expense summaries"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.weeklyReports}
                    onChange={handleNotificationChange('weeklyReports')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Data Management
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Clear Local Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Remove all locally stored data including budgets and preferences. This action cannot be undone.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ClearDataIcon />}
                    onClick={() => setClearDataDialogOpen(true)}
                  >
                    Clear Data
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Export All Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Download all your transactions and budget data as a JSON file for backup purposes.
                  </Typography>
                  <Button variant="outlined" onClick={() => toast.info('Feature coming soon!')}>
                    Export Data
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* About */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <InfoIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                About
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Application Version
                </Typography>
                <Typography variant="body1">v1.0.0</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Built With
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label="React" size="small" />
                  <Chip label="Material UI" size="small" />
                  <Chip label="Recharts" size="small" />
                  <Chip label="DummyJSON API" size="small" />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={clearDataDialogOpen} onClose={() => setClearDataDialogOpen(false)}>
        <DialogTitle>Clear Local Data?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Warning</AlertTitle>
            This will permanently delete all your locally stored data including budgets.
          </Alert>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDataDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearData} variant="contained" color="error">
            Clear Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
