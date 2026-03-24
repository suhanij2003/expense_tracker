import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_LABELS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import Notification from './Notification';

const DRAWER_WIDTH = 260;

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('lg'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'users', label: 'Users', icon: <PeopleIcon />, path: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
    { id: 'profile', label: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
  ];

  const drawerContent = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minHeight: 64,
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 40,
            height: 40,
          }}
        >
          <DashboardIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: 'action.hover',
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 44,
              height: 44,
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight="bold"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.name}
            </Typography>
            <Typography 
              variant="caption" 
              color="primary"
              fontWeight="500"
            >
              {ROLE_LABELS[user?.role]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Menu Label */}
      <Typography 
        variant="caption" 
        sx={{ 
          px: 3, 
          py: 1.5,
          color: 'text.secondary',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Main Menu
      </Typography>

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                py: 1.25,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'translateX(4px)',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Theme Toggle in Drawer */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={toggleTheme}
          sx={{ 
            borderRadius: 2,
            py: 1.25,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText 
            primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} 
            secondary={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}
          />
        </ListItemButton>
      </Box>

      {/* Version */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: isSidebarOpen ? { lg: `calc(100% - ${DRAWER_WIDTH}px)` } : { lg: '100%' },
          ml: isSidebarOpen ? { lg: `${DRAWER_WIDTH}px` } : { lg: 0 },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.3s ease, margin 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              display: { lg: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Sidebar Toggle - Hamburger Icon */}
          <Tooltip title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <IconButton
              color="inherit"
              onClick={handleSidebarToggle}
              sx={{ 
                mr: 2,
                display: { xs: 'none', lg: 'flex' },
              }}
            >
              {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
          
          {/* Breadcrumb or Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HomeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Dashboard
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton 
                onClick={toggleTheme}
                sx={{
                  '&:hover': { 
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Notifications */}
            <Notification />
            
            {/* User Menu */}
            <Tooltip title="Account">
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main', 
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard/profile'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard/settings'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout} 
              sx={{ 
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light', color: 'white' },
              }}
            >
              <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Only show when open on desktop */}
      <Box
        component="nav"
        sx={{ 
          width: { lg: isSidebarOpen ? DRAWER_WIDTH : 0 }, 
          flexShrink: { lg: 0 },
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { 
              width: DRAWER_WIDTH,
              boxShadow: '0 16px 64px rgba(0,0,0,0.2)',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer - Only rendered when open */}
        {isSidebarOpen && (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', lg: 'block' },
              '& .MuiDrawer-paper': { 
                width: DRAWER_WIDTH, 
                boxSizing: 'border-box',
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content - Takes full width when sidebar is closed */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: isSidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          transition: 'width 0.3s ease, margin 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
