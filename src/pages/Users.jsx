import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { useAuth, ROLES } from '../context/AuthContext';
import { useData } from '../context/DataContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { exportUsersToExcel } from '../utils/exportUtils';
import SkeletonLoader from '../components/SkeletonLoader';

const Users = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const { users, deleteUser, loading } = useData();
  // Removed unused Snackbar context
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });

  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          (user.firstName?.toLowerCase() || '').includes(search) ||
          (user.lastName?.toLowerCase() || '').includes(search) ||
          (user.email?.toLowerCase() || '').includes(search) ||
          (user.address?.city?.toLowerCase() || '').includes(search)
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';
      
      if (sortConfig.key === 'name') {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [users, searchTerm, sortConfig, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Export handler
  const handleExport = () => {
    exportUsersToExcel(users);
    toast.success('Users exported to Excel');
  };
  
  const handleEditSave = async () => {
    toast.success('User updated successfully');
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        toast.success('User deleted successfully');
      } else {
        toast.error(result.message);
      }
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };



  const SortableHeader = ({ label, sortKey }) => (
    <TableCell
      onClick={() => handleSort(sortKey)}
      sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { bgcolor: 'action.hover' } }}
    >
      {label}
      {sortConfig.key === sortKey && (
        <span style={{ marginLeft: 4 }}>
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </TableCell>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'nowrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Role"
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
              <MenuItem value={ROLES.MANAGER}>Manager</MenuItem>
              <MenuItem value={ROLES.VIEWER}>Viewer</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ width: { xs: '100%', sm: 250, md: 300 } }}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search users..."
            />
          </Box>
          <Button 
            variant="contained" 
            color="success"
            size="small"
            startIcon={<ExportIcon />} 
            onClick={handleExport}
            sx={{ 
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              py: 0.8,
              whiteSpace: 'nowrap',
              minWidth: 'max-content',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Card>
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell> {/* Avatar column */}
                <SortableHeader label="Name" sortKey="firstName" />
                <SortableHeader label="Email" sortKey="email" />
                <SortableHeader label="Phone" sortKey="phone" />
                <SortableHeader label="Role" sortKey="role" />
                {(hasPermission('edit') || hasPermission('delete')) && (
                  <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Render skeleton rows
                Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell><SkeletonLoader variant="circular" width={40} height={40} /></TableCell>
                    <TableCell><SkeletonLoader variant="text" width="80%" /></TableCell>
                    <TableCell><SkeletonLoader variant="text" width="80%" /></TableCell>
                    <TableCell><SkeletonLoader variant="text" width="60%" /></TableCell>
                    <TableCell><SkeletonLoader variant="text" width="60%" /></TableCell>
                    <TableCell sx={{ textAlign: 'right' }}><SkeletonLoader variant="text" width="40%" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Avatar sx={{ bgcolor: 'primary.main' }} src={user.image}>
                        {user.image ? null : `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    {(hasPermission('edit') || hasPermission('delete')) && (
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          {hasPermission('edit') && user.id !== currentUser?.id && (
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEditClick(user)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('delete') && user.id !== currentUser?.id && (
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(user)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredUsers.length / rowsPerPage)}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        />
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1">
              Edit user: {selectedUser?.firstName} {selectedUser?.lastName}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;

