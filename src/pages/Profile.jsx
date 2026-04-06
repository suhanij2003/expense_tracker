import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  // Removed unused Snackbar context
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.city || '',
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setEditMode(false);
  };

  const getRoleChipColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'viewer':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user?.email}
            </Typography>
            <Chip
              label={user?.role?.toUpperCase()}
              color={getRoleChipColor(user?.role)}
              sx={{ fontWeight: 600 }}
            />
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                User Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography variant="body2">{user?.phone || '-'}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">City</Typography>
                <Typography variant="body2">{user?.address?.city || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Company</Typography>
                <Typography variant="body2">{user?.company?.name || '-'}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Edit Profile */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Personal Information
              </Typography>
              <Button
                variant={editMode ? 'contained' : 'outlined'}
                onClick={() => editMode ? handleSave() : setEditMode(true)}
              >
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.address}
                  onChange={handleChange('address')}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Theme Settings */}
          <Card sx={{ p: 4, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Appearance
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
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
                Toggle between light and dark theme. Your preference will be saved automatically.
              </Typography>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
