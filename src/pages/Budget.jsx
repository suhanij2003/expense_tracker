import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  AlertTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';
import { Skeleton } from '@mui/material';

const Budget = () => {
  const { budgets, categories, loading, setBudget, deleteBudget, getBudgetStatus } = useTransactions();
  // Removed unused Snackbar context
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const budgetList = Object.entries(budgets).map(([category, amount]) => ({
    category,
    amount,
    status: getBudgetStatus(category),
  }));

  const handleOpenDialog = (category = null, amount = null) => {
    if (category) {
      setEditingCategory(category);
      setSelectedCategory(category);
      setBudgetAmount(amount.toString());
    } else {
      setEditingCategory(null);
      setSelectedCategory('');
      setBudgetAmount('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory('');
    setBudgetAmount('');
    setEditingCategory(null);
  };

  const handleSaveBudget = () => {
    if (!selectedCategory || !budgetAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setBudget(selectedCategory, amount);
    toast.success(editingCategory ? 'Budget updated successfully' : 'Budget added successfully');
    handleCloseDialog();
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteBudget(selectedCategory);
    toast.success('Budget deleted successfully');
    setDeleteDialogOpen(false);
    setSelectedCategory('');
  };

  const availableCategories = categories.filter((cat) => !budgets[cat] || budgets[cat] === 0);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={availableCategories.length === 0}
        >
          Set Budget
        </Button>
      </Box>

      {/* Budget Warnings */}
      {budgetList.map((budget) => (
        (budget.status.exceeded || budget.status.warning) && (
          <Alert
            key={budget.category}
            severity={budget.status.exceeded ? 'error' : 'warning'}
            sx={{ mb: 2 }}
            icon={budget.status.exceeded ? <WarningIcon /> : undefined}
          >
            <AlertTitle>
              {budget.status.exceeded ? 'Budget Exceeded!' : 'Budget Warning'}
            </AlertTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ flex: 1 }}>
                {budget.category}: Spent ${budget.status.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {budget.status.percentage.toFixed(0)}%
              </Typography>
            </Box>
          </Alert>
        )
      ))}

      {/* Budget Cards */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={`budget-skeleton-${idx}`}>
              <Card sx={{ p: 3, height: '100%', borderLeft: '4px solid #ddd' }}>
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1 }} />
                </Box>
                <Skeleton variant="text" width="40%" />
              </Card>
            </Grid>
          ))
        ) : (
          budgetList.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget.category}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderLeft: budget.status.exceeded
                    ? '4px solid #f44336'
                    : budget.status.warning
                      ? '4px solid #ff9800'
                      : '4px solid #4caf50',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {budget.category}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(budget.category, budget.amount)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(budget.category)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Spent: ${budget.status.spent.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Budget: ${budget.amount.toFixed(2)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(budget.status.percentage, 100)}
                    color={budget.status.exceeded ? 'error' : budget.status.warning ? 'warning' : 'primary'}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Remaining: ${Math.max(budget.status.remaining, 0).toFixed(2)}
                  </Typography>
                  {budget.status.percentage <= 100 && (
                    <CheckIcon color="success" fontSize="small" />
                  )}
                </Box>
              </Card>
            </Grid>
          ))
        )}

        {!loading && budgetList.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No budgets set yet. Start by adding a budget for a category.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Set Your First Budget
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Budget Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!editingCategory && (
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {availableCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {editingCategory && (
              <Typography variant="h6">{editingCategory}</Typography>
            )}
            <TextField
              label="Budget Amount"
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              fullWidth
              required
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveBudget} variant="contained" color="primary">
            {editingCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the budget for "{selectedCategory}"?
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

export default Budget;
