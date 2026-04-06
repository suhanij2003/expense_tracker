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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

const Transactions = () => {
  const { transactions, categories, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(search) ||
          t.category?.toLowerCase().includes(search) ||
          t.id?.toString().includes(search)
      );
    }
    
    if (filterType) {
      result = result.filter((t) => t.type === filterType);
    }
    
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (amountFilter.min !== '' || amountFilter.max !== '') {
      result = result.filter((t) => {
        const amount = Number(t.amount);
        const minOk = amountFilter.min === '' || amount >= Number(amountFilter.min);
        const maxOk = amountFilter.max === '' || amount <= Number(amountFilter.max);
        return minOk && maxOk;
      });
    }
    
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [transactions, searchTerm, filterType, selectedCategory, amountFilter, sortConfig]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredTransactions.slice(start, start + rowsPerPage);
  }, [filteredTransactions, page, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount.toString(),
        description: transaction.description || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setSelectedTransaction(null);
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTransaction(null);
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = () => {
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    };

    if (selectedTransaction) {
      updateTransaction(selectedTransaction.id, transactionData);
      toast.success('Transaction updated successfully');
    } else {
      addTransaction(transactionData);
      toast.success('Transaction added successfully');
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id);
      toast.success('Transaction deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(filteredTransactions, `transactions-${new Date().toISOString().split('T')[0]}`);
    toast.success('Exported to Excel');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions, `transactions-${new Date().toISOString().split('T')[0]}`);
    toast.success('Exported to PDF');
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

  const renderTableSkeleton = () => {
    return [...Array(rowsPerPage)].map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="text" width="80%" /></TableCell>
        <TableCell><Skeleton variant="text" width="90%" /></TableCell>
        <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 4 }} /></TableCell>
        <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} /></TableCell>
        <TableCell><Skeleton variant="text" width={50} /></TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {loading ? (
             <>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
             </>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="success" 
                size="small"
                startIcon={<ExportIcon />} 
                onClick={handleExportExcel}
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  whiteSpace: 'nowrap',
                  minWidth: 'max-content',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                }}
              >
                Export Excel
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                size="small"
                startIcon={<ExportIcon />} 
                onClick={handleExportPDF}
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  whiteSpace: 'nowrap',
                  minWidth: 'max-content',
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                }}
              >
                Export PDF
              </Button>

              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Add Transaction
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width={250} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search transactions..."
              />
              <Filters
                filterType={filterType}
                onFilterChange={setFilterType}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                typeOptions={[
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
              />
              <TextField
                size="small"
                label="Min Amount"
                type="number"
                value={amountFilter.min}
                onChange={(e) => setAmountFilter({ ...amountFilter, min: e.target.value })}
                sx={{ width: 100 }}
              />
              <TextField
                size="small"
                label="Max Amount"
                type="number"
                value={amountFilter.max}
                onChange={(e) => setAmountFilter({ ...amountFilter, max: e.target.value })}
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
                <SortableHeader label="Date" sortKey="date" />
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <SortableHeader label="Type" sortKey="type" />
                <SortableHeader label="Amount" sortKey="amount" />
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                renderTableSkeleton()
              ) : (
                <>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description || '-'}</TableCell>
                      <TableCell>
                        <Chip label={transaction.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={transaction.type === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          label={transaction.type}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: transaction.type === 'income' ? 'success.main' : 'error.main' }}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(transaction)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(transaction)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No transactions found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredTransactions.length / rowsPerPage)}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        />
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ToggleButtonGroup
              value={formData.type}
              exclusive
              onChange={(e, value) => value && setFormData({ ...formData, type: value })}
              fullWidth
            >
              <ToggleButton value="income" color="success">
                <TrendingUpIcon sx={{ mr: 1 }} /> Income
              </ToggleButton>
              <ToggleButton value="expense" color="error">
                <TrendingDownIcon sx={{ mr: 1 }} /> Expense
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
            />

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction? This action cannot be undone.
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

export default Transactions;
