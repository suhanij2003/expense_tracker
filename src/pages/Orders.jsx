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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Paper,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useData } from '../context/DataContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import SkeletonLoader from '../components/SkeletonLoader';

const Orders = () => {
  const { carts, users, products, addCart, updateCart, deleteCart, loading } = useData();
  // Removed unused Snackbar context
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' }); // price range filter
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `User #${userId}`;
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title : `Product #${productId}`;
  };

  const filteredCarts = useMemo(() => {
    let result = [...carts];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (cart) => {
          const userName = getUserName(cart.userId).toLowerCase();
          return userName.includes(search) || String(cart.id).includes(search);
        }
      );
    }

    // Apply price range filter if set
    if (priceFilter.min !== '' || priceFilter.max !== '') {
      result = result.filter((cart) => {
        const total = Number(cart.total);
        const minOk = priceFilter.min === '' || total >= Number(priceFilter.min);
        const maxOk = priceFilter.max === '' || total <= Number(priceFilter.max);
        return minOk && maxOk;
      });
    }
    
    return result;
  }, [carts, searchTerm, priceFilter, users]);

  const paginatedCarts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredCarts.slice(start, start + rowsPerPage);
  }, [filteredCarts, page, rowsPerPage]);

  const handleViewClick = (cart) => {
    setSelectedCart(cart);
    setViewDialogOpen(true);
  };

  const handleEditClick = (cart) => {
    setSelectedCart(cart);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (cart) => {
    setSelectedCart(cart);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteCart(selectedCart.id);
    
    if (result.success) {
      toast.success('Order deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedCart(null);
    } else {
      toast.error(result.message);
    }
  };

  const getStatusColor = (total) => {
    if (total > 1000) return 'success';
    if (total > 500) return 'warning';
    return 'default';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Box>


      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {loading ? (
            <>
              <SkeletonLoader variant="rectangular" width={250} height={40} />
              <SkeletonLoader variant="rectangular" width={100} height={40} />
              <SkeletonLoader variant="rectangular" width={100} height={40} />
            </>
          ) : (
            <>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search orders by user..."
              />
              <TextField
                size="small"
                label="Min Price"
                type="number"
                value={priceFilter.min}
                onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                sx={{ width: 100 }}
              />
              <TextField
                size="small"
                label="Max Price"
                type="number"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                sx={{ width: 100 }}
              />
            </>
          )}
        </Box>
      </Card>

      <Card>
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell><SkeletonLoader variant="text" width="60%" /></TableCell>
                    <TableCell><SkeletonLoader variant="text" width="80%" /></TableCell>
                    <TableCell align="right"><SkeletonLoader variant="text" width="40%" /></TableCell>
                    <TableCell align="center"><SkeletonLoader variant="text" width="30%" /></TableCell>
                    <TableCell align="center"><SkeletonLoader variant="text" width="50%" /></TableCell>
                    <TableCell align="right"><SkeletonLoader variant="text" width="40%" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedCarts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCarts.map((cart) => (
                  <TableRow key={cart.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        #{cart.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">
                          {getUserName(cart.userId)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(cart.total)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={cart.products?.length || 0}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={cart.total > 1000 ? 'High Value' : cart.total > 500 ? 'Medium' : 'Standard'}
                        size="small"
                        color={getStatusColor(cart.total)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewClick(cart)}>
                            <CartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(cart)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredCarts.length / rowsPerPage)}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        />
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order #{selectedCart?.id} - {getUserName(selectedCart?.userId)}
        </DialogTitle>
        <DialogContent>
          {selectedCart && (
            <Box>
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency(selectedCart.total)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Items</Typography>
                  <Typography variant="h5">{selectedCart.products?.length || 0}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Discounted Total</Typography>
                  <Typography variant="h5">
                    {formatCurrency(selectedCart.discountedTotal)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Order Items
              </Typography>
              
              {selectedCart.products?.map((item, index) => (
                <Accordion
                  key={index}
                  expanded={expandedAccordion === index}
                  onChange={() => setExpandedAccordion(expandedAccordion === index ? false : index)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                      <Typography>{getProductName(item.id)}</Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {formatCurrency(item.total)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Product ID</Typography>
                        <Typography>{item.id}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Quantity</Typography>
                        <Typography>{item.quantity}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Price</Typography>
                        <Typography>{formatCurrency(item.price)}</Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Order #{selectedCart?.id}? This action cannot be undone.
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

export default Orders;

