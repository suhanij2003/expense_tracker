import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import {
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { Tooltip } from '@mui/material'; // Added Tooltip import
import ThemeSwitch from './ThemeSwitch';
import LogoutButton from './LogoutButton';
import CalculatorWidget from './CalculatorWidget';
import './CustomSidebar.css';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'users', label: 'Users', icon: '👥', path: '/users' },
  { id: 'products', label: 'Products', icon: '📦', path: '/products' },
  { id: 'orders', label: 'Orders', icon: '🛒', path: '/orders' },
  { id: 'transactions', label: 'Transactions', icon: '💳', path: '/transactions' },
  { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
];

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useCustomTheme();
  const { user, logout } = useAuth();

  // Set active item and page title based on current path
  const pageTitle = menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard';
  useEffect(() => {
    const currentPath = location.pathname;
    const item = menuItems.find(i => i.path === currentPath);
    if (item) {
      setActiveItem(item.id);
    }
  }, [location]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const toggleBtn = document.querySelector('.sidebar-toggle');
        if (toggleBtn && !toggleBtn.contains(event.target)) {
          setMobileOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleOverlayClick = () => {
    setMobileOpen(false);
  };

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
    setMobileOpen(false);
  };

  // Theme mode
  const isDarkMode = mode === 'dark';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Use MUI's theme breakpoints if needed, but for layout simple logic is fine
  const sidebarWidth = collapsed ? 70 : 250;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Toggle Button - Moved into AppBar below */}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <Box
          className="sidebar-overlay"
          onClick={handleOverlayClick}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        ref={sidebarRef}
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        component="nav"
        sx={{
          width: { xs: 250, md: sidebarWidth },
          flexShrink: 0,
          transition: 'width 0.3s ease',
        }}
      >
        {/* Sidebar Header */}
        <Box className="sidebar-header">
          <Box className="sidebar-brand">
            <span className="brand-icon">💹</span>
            <span className="brand-text">ExpenseTrack</span>
          </Box>
          <IconButton
            className="collapse-btn"
            onClick={handleCollapseToggle}
            size="small"
            sx={{ color: 'sidebar.text', display: { xs: 'none', md: 'flex' } }}
          >
            {collapsed ? '→' : '←'}
          </IconButton>

        </Box>

        {/* Navigation Menu */}
        <Box className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Tooltip
                  title={item.label}
                  placement="right"
                  disableHoverListener={!collapsed || isMobile}
                  arrow
                >
                  <button
                    className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </button>
                </Tooltip>
              </li>
            ))}
          </ul>
        </Box>

        {/* Sidebar Footer */}
        <Box className="sidebar-footer">
          {/* User Profile */}
          <Box className="user-profile">
            <Box className="user-avatar">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || 'U'}
            </Box>
            <Box className="user-info" sx={{ display: { xs: 'flex', md: collapsed ? 'none' : 'flex' } }}>
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-email">{user?.email || ''}</span>
            </Box>

          </Box>

          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="right" disableHoverListener={!collapsed || isMobile} arrow>
            <Box sx={{
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'flex-start',
              alignItems: 'center',
              px: collapsed ? 0 : 2,
              py: 1,
              width: '100%'
            }}>
              <ThemeSwitch checked={isDarkMode} onChange={toggleTheme} />
              {!collapsed && !isMobile && (
                <Typography variant="body2" sx={{ ml: 1.5, color: 'sidebar.text', fontWeight: 500 }}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Typography>
              )}
            </Box>
          </Tooltip>

        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${sidebarWidth}px` },
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {/* Persistent Top AppBar */}
        <AppBar
          position="sticky"
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1,
            mt: 0, // Removed top margin
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {pageTitle}
              </Typography>
              {!isMobile && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString()}
                </Typography>
              )}
            </Box>

            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <ThemeSwitch checked={isDarkMode} onChange={toggleTheme} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <LogoutButton onClick={handleLogout} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200, mt: 1 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Global Calculator Widget */}
      <CalculatorWidget />
    </Box>
  );
};

export default DashboardLayout;
