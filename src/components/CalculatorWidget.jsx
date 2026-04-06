import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  Tooltip, 
  Zoom,
  Fade
} from '@mui/material';
import { 
  Calculate as CalcIcon, 
  Close as CloseIcon,
  Backspace as BackspaceIcon
} from '@mui/icons-material';

const CalculatorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleNumber = (num) => {
    if (display === '0' || shouldReset) {
      setDisplay(num.toString());
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleEqual = () => {
    try {
      const fullEquation = equation + display;
      const result = new Function('return ' + fullEquation)();
      setDisplay(Number.isInteger(result) ? result.toString() : result.toFixed(2).toString());
      setEquation('');
      setShouldReset(true);
    } catch (error) {
      setDisplay('Error');
      setShouldReset(true);
    }
  };

  const CalcButton = ({ value, onClick, type = 'number', xs = 3 }) => {
    const isOperator = type === 'operator';
    const isAction = type === 'action';
    
    return (
      <Grid item xs={xs}>
        <Button
          variant="contained"
          fullWidth
          onClick={onClick}
          sx={{
            py: 1.8,
            borderRadius: '16px',
            fontSize: '1.25rem',
            fontWeight: 700,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: isOperator 
              ? 'rgba(255, 152, 0, 0.15)' 
              : isAction 
                ? 'rgba(244, 67, 54, 0.15)' 
                : 'rgba(255, 255, 255, 0.05)',
            color: isOperator ? '#ff9800' : isAction ? '#f44336' : 'text.primary',
            border: '1px solid transparent',
            borderColor: isOperator 
              ? 'rgba(255, 152, 0, 0.3)' 
              : isAction 
                ? 'rgba(244, 67, 54, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              bgcolor: isOperator ? '#ff9800' : isAction ? '#f44336' : 'rgba(255, 255, 255, 0.15)',
              color: (isOperator || isAction) ? 'white' : 'text.primary',
              boxShadow: (isOperator || isAction) 
                ? `0 4px 15px ${isOperator ? 'rgba(255,152,0,0.4)' : 'rgba(244,67,54,0.4)'}`
                : '0 4px 12px rgba(0,0,0,0.1)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            }
          }}
        >
          {value}
        </Button>
      </Grid>
    );
  };

  return (
    <>
      <Tooltip title="Financial Calculator" placement="left" TransitionComponent={Zoom}>
        <IconButton
          onClick={handleToggle}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: 'white',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
            zIndex: 1300,
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 15px 45px rgba(99, 102, 241, 0.6)',
            },
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {isOpen ? <CloseIcon /> : <CalcIcon sx={{ fontSize: 32 }} />}
        </IconButton>
      </Tooltip>

      <Fade in={isOpen}>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 110,
            right: 30,
            width: 340,
            p: 3,
            borderRadius: '32px',
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(20, 20, 25, 0.85)' 
              : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1300,
            boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
            userSelect: 'none'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalcIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.8 }}>
                Calculator
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace' }}>
              {equation || 'Ready'}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              mb: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'white',
              borderRadius: '24px',
              textAlign: 'right',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: display.length > 8 ? '2rem' : '2.75rem',
                wordBreak: 'break-all',
                color: 'text.primary',
                letterSpacing: -1
              }}
            >
              {display}
            </Typography>
          </Box>

          <Grid container spacing={1.5}>
            <CalcButton value="C" onClick={handleClear} type="action" />
            <CalcButton value={<BackspaceIcon sx={{ fontSize: 22 }} />} onClick={handleBackspace} type="action" />
            <CalcButton value="÷" onClick={() => handleOperator('/')} type="operator" />
            <CalcButton value="×" onClick={() => handleOperator('*')} type="operator" />

            <CalcButton value="7" onClick={() => handleNumber(7)} />
            <CalcButton value="8" onClick={() => handleNumber(8)} />
            <CalcButton value="9" onClick={() => handleNumber(9)} />
            <CalcButton value="−" onClick={() => handleOperator('-')} type="operator" />

            <CalcButton value="4" onClick={() => handleNumber(4)} />
            <CalcButton value="5" onClick={() => handleNumber(5)} />
            <CalcButton value="6" onClick={() => handleNumber(6)} />
            <CalcButton value="+" onClick={() => handleOperator('+')} type="operator" />

            <CalcButton value="1" onClick={() => handleNumber(1)} />
            <CalcButton value="2" onClick={() => handleNumber(2)} />
            <CalcButton value="3" onClick={() => handleNumber(3)} />
            
            <Grid item xs={3} container>
              <Button
                variant="contained"
                fullWidth
                onClick={handleEqual}
                sx={{
                  height: '100%',
                  borderRadius: '16px',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(99, 102, 241, 0.6)',
                  },
                  '&:active': { transform: 'scale(0.95)' }
                }}
              >
                =
              </Button>
            </Grid>

            <CalcButton value="0" onClick={() => handleNumber(0)} xs={6} />
            <CalcButton value="." onClick={() => handleNumber('.')} />
          </Grid>
        </Paper>
      </Fade>
    </>
  );
};

export default CalculatorWidget;
