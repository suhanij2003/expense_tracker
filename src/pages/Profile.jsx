import { useState } from 'react';
import { useAuth, ROLE_LABELS } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

export default function Profile() {
  const { user, updateUser, hasPermission } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(true);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+1 234 567 8900',
    department: user?.department || 'General',
    location: user?.location || 'New York, USA'
  });

  const canEdit = hasPermission('canEdit');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser({ ...user, ...formData });
    setIsEditing(false);
    showSnackbar('Profile updated successfully 🎉');
  };

  const permissions = [
    { label: 'View', allowed: true },
    { label: 'Edit', allowed: canEdit },
    { label: 'Delete', allowed: hasPermission('canDelete') },
  ];

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Profile Header Card with Gradient */}
      <Card 
        sx={{ 
          mb: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CardContent sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'rgba(255,255,255,0.3)',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, mb: 1 }}>
              <Typography variant="h4" fontWeight="bold" color="white">
                {user?.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip 
                  label={ROLE_LABELS[user?.role]} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 600 
                  }}
                />
              </Stack>
            </Box>
            {canEdit && (
              <Button
                variant={isEditing ? 'contained' : 'outlined'}
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                sx={{
                  backgroundColor: isEditing ? 'white' : 'rgba(255,255,255,0.2)',
                  color: isEditing ? 'primary.main' : 'white',
                  borderColor: 'transparent',
                  '&:hover': {
                    backgroundColor: isEditing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                    borderColor: 'transparent',
                  },
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Personal Information
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Full Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <Typography variant="body1" fontWeight="500">
                      {user?.name}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Email Address
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1">{formData.email}</Typography>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Phone Number
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1">{formData.phone}</Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Work Information
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Department
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1">{formData.department}</Typography>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Location
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <LocationIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1">{formData.location}</Typography>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Role
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Chip 
                      label={ROLE_LABELS[user?.role]} 
                      color="primary" 
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Permissions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Permissions
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  {permissions.map((perm, index) => (
                    <Box 
                      key={perm.label}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < permissions.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body1" fontWeight="500">
                        {perm.label}
                      </Typography>
                      <Chip
                        icon={perm.allowed ? <CheckIcon /> : <CancelIcon />}
                        label={perm.allowed ? 'Allowed' : 'Denied'}
                        color={perm.allowed ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
