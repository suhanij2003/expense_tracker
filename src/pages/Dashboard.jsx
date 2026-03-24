import { useState, useEffect } from 'react';
import { useAuth, ROLE_LABELS, ROLE_PERMISSIONS } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Stack,
  Skeleton,
  Paper,
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  LocationCity as CityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

export default function Dashboard() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';
  
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        const usersWithDetails = res.data.map((u, index) => ({
          ...u,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
                 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
                 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'][index % 15],
          company: u.company?.name || 'Tech Corp'
        }));
        setUsers(usersWithDetails);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showSnackbar('Failed to load users', 'error');
      });
  }, [showSnackbar]);

  const getFilteredUsers = () => {
    let result = users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
    );
    
    result.sort((a, b) => {
      const aVal = a[sortBy]?.toLowerCase() || '';
      const bVal = b[sortBy]?.toLowerCase() || '';
      return aVal.localeCompare(bVal);
    });
    
    return result;
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    showSnackbar('User updated successfully! ✅');
  };

  const handleDelete = (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== deleteConfirm.id));
    setDeleteConfirm(null);
    showSnackbar('User deleted successfully! 🗑️');
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: <PeopleIcon />, color: '#667eea', bgColor: 'rgba(102, 126, 234, 0.1)' },
    { label: 'Total Orders', value: 347, icon: <OrdersIcon />, color: '#48bb78', bgColor: 'rgba(72, 187, 120, 0.1)' },
    { label: 'Revenue', value: '$54,280', icon: <MoneyIcon />, color: '#ed8936', bgColor: 'rgba(237, 137, 54, 0.1)' },
    { label: 'Growth Rate', value: '+12%', icon: <TrendingIcon />, color: '#e53e3e', bgColor: 'rgba(229, 62, 62, 0.1)' },
  ];

  const rolePermissions = ROLE_PERMISSIONS[user?.role] || {};

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return 'You have full access';
      case 'manager': return 'You have access';
      case 'viewer': return 'You have read-only access';
      default: return '';
    }
  };

  const filteredUsers = getFilteredUsers();
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Welcome Section */}
      <Card 
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <CardContent sx={{ py: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 56, 
                height: 56,
                fontSize: '1.5rem'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" fontWeight="bold">
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {getRoleDescription(user?.role)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Role: ${ROLE_LABELS[user?.role]}`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
              <Chip 
                label={rolePermissions.canView ? '✓ View' : '✗ View'} 
                color={rolePermissions.canView ? 'success' : 'error'} 
                size="small" 
                variant="filled"
              />
              <Chip 
                label={rolePermissions.canEdit ? '✓ Edit' : '✗ Edit'} 
                color={rolePermissions.canEdit ? 'success' : 'error'} 
                size="small" 
                variant="filled"
              />
              <Chip 
                label={rolePermissions.canDelete ? '✓ Delete' : '✗ Delete'} 
                color={rolePermissions.canDelete ? 'success' : 'error'} 
                size="small" 
                variant="filled"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }} alignItems="stretch">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
            <Card 
              sx={{ 
                width: '100%',
                height: '100%',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {loading ? <Skeleton width={60} /> : stat.value}
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: stat.bgColor, 
                      color: stat.color,
                      width: 52,
                      height: 52,
                      flexShrink: 0,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table Section */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            p: 3,
            pb: 0,
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" fontWeight="bold">
              User List ({loading ? '...' : filteredUsers.length})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              />
              
              <TextField
                select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="name">Sort by Name</MenuItem>
                <MenuItem value="email">Sort by Email</MenuItem>
                <MenuItem value="city">Sort by City</MenuItem>
              </TextField>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ mx: 3 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Company</TableCell>
                  {canEdit && <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      {canEdit && <TableCell><Skeleton width={80} /></TableCell>}
                    </TableRow>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <SearchIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography color="text.secondary" variant="h6">
                          No users found
                        </Typography>
                        <Typography color="text.disabled" variant="body2">
                          Try adjusting your search criteria
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((item) => (
                    <TableRow 
                      key={item.id} 
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          bgcolor: 'action.selected',
                          transform: 'scale(1.005)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              bgcolor: 'primary.main', 
                              fontSize: '0.875rem',
                            }}
                          >
                            {item.name?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="500">
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{item.email}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{item.city}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{item.company}</Typography>
                        </Box>
                      </TableCell>
                      {canEdit && (
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(item)}
                                sx={{ 
                                  '&:hover': { 
                                    bgcolor: 'primary.light',
                                    color: 'white',
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {canDelete && (
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDelete(item)}
                                  sx={{ 
                                    '&:hover': { 
                                      bgcolor: 'error.light',
                                      color: 'white',
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && filteredUsers.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[1, 10, 5]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                px: 3,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500,
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog 
        open={Boolean(editingUser)} 
        onClose={() => setEditingUser(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon />
          Edit User
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editingUser && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                margin="normal"
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                margin="normal"
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <TextField
                fullWidth
                label="City"
                value={editingUser.city}
                onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                margin="normal"
                InputProps={{
                  startAdornment: <CityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <TextField
                fullWidth
                label="Company"
                value={editingUser.company}
                onChange={(e) => setEditingUser({ ...editingUser, company: e.target.value })}
                margin="normal"
                InputProps={{
                  startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditingUser(null)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 400 }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}>
            <DeleteIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold">Delete User</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
