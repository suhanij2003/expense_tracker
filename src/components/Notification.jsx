import { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Static notifications data
const staticNotifications = [
  {
    id: 1,
    icon: <PersonIcon sx={{ fontSize: 20 }} />,
    message: 'User profile updated',
    timestamp: '2 min ago',
    color: '#48bb78',
    bgColor: 'rgba(72, 187, 120, 0.1)',
  },
  {
    id: 2,
    icon: <PersonAddIcon sx={{ fontSize: 20 }} />,
    message: 'New user added',
    timestamp: '15 min ago',
    color: '#4299e1',
    bgColor: 'rgba(66, 153, 225, 0.1)',
  },
  {
    id: 3,
    icon: <SettingsIcon sx={{ fontSize: 20 }} />,
    message: 'Settings changed successfully',
    timestamp: '1 hour ago',
    color: '#ed8936',
    bgColor: 'rgba(237, 137, 54, 0.1)',
  },
];

export default function Notification() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(staticNotifications);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Badge
          badgeContent={notifications.length}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              fontWeight: 'bold',
              minWidth: 18,
              height: 18,
              animation: notifications.length > 0 ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 380,
            maxHeight: 480,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
        slotProps={{
          root: {
            sx: {
              '& .MuiBackdrop-root': {
                backgroundColor: 'transparent',
              },
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            {notifications.length > 0 && (
              <Box
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.25,
                  borderRadius: 10,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {notifications.length} new
              </Box>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Notifications List */}
        <Box
          sx={{
            maxHeight: 340,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: 3,
            },
          }}
        >
          {notifications.length === 0 ? (
            <Box
              sx={{
                py: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.5 }} />
              <Typography variant="body2" fontWeight="500">
                All caught up!
              </Typography>
              <Typography variant="caption" color="text.disabled">
                No new notifications
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notification, index) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: index < notifications.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      '& .mark-read-btn': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 44,
                      mr: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: notification.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: notification.color,
                      }}
                    >
                      {notification.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: 'text.primary',
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.message}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          mt: 0.5,
                          display: 'block',
                        }}
                      >
                        {notification.timestamp}
                      </Typography>
                    }
                  />
                  <Button
                    className="mark-read-btn"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    sx={{
                      minWidth: 'auto',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'text.primary',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              size="small"
              onClick={handleClearAll}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              Clear all notifications
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
}
