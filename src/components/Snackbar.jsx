import { forwardRef, useState, useEffect } from 'react';
import { Snackbar, Box, Typography, IconButton, Slide } from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const SnackbarComponent = forwardRef(({ open, message, severity = 'success', onClose, autoHideDuration = 3000 }, ref) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setProgress(100);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoHideDuration / 50));
          return newProgress > 0 ? newProgress : 0;
        });
      }, 50);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }, autoHideDuration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [open, autoHideDuration, onClose]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 24, color: '#48bb78' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 24, color: '#f56565' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 24, color: '#ed8936' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 24, color: '#4299e1' }} />;
      default:
        return <CheckCircleIcon sx={{ fontSize: 24, color: '#48bb78' }} />;
    }
  };

  const getProgressColor = () => {
    switch (severity) {
      case 'success':
        return '#48bb78';
      case 'error':
        return '#f56565';
      case 'warning':
        return '#ed8936';
      case 'info':
        return '#4299e1';
      default:
        return '#48bb78';
    }
  };

  return (
    <Snackbar
      ref={ref}
      open={open && isVisible}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiSnackbar-root': {
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'background.paper',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)',
          border: '1px solid',
          borderColor: 'divider',
          p: 2,
          pr: 1,
          minWidth: 320,
          maxWidth: 420,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        {/* Left: Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: severity === 'success' ? 'rgba(72, 187, 120, 0.15)' : 'rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getIcon()}
        </Box>

        {/* Center: Message */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.4,
            }}
          >
            {message}
          </Typography>
        </Box>

        {/* Right: Close Button */}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
              color: 'text.primary',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            backgroundColor: getProgressColor(),
            width: `${progress}%`,
            transition: 'width 0.05s linear',
            borderRadius: '0 0 0 12px',
          }}
        />
      </Box>
    </Snackbar>
  );
});

SnackbarComponent.displayName = 'SnackbarComponent';

export default SnackbarComponent;
