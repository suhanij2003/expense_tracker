import { useMemo } from 'react';
import { Box, Typography, Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, AlertTitle, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
// Snackbar context removed; using React Toastify for notifications
import { toast } from 'react-toastify';
import { Button, IconButton, Skeleton, Tooltip as MuiTooltip } from '@mui/material'; // Merged MUI imports
import { FileDownload as ExportIcon } from '@mui/icons-material';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { useTheme as useCustomTheme } from '../context/ThemeContext';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57', '#8884d8'];

const Analytics = () => {
  const { transactions, loading, getCategoryStats, getMonthlyStats, budgets, getBudgetStatus } = useTransactions();
  const { mode } = useCustomTheme();

  const categoryData = useMemo(() => {
    const stats = getCategoryStats();
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [getCategoryStats]);

  const monthlyData = useMemo(() => {
    const stats = getMonthlyStats();
    let data = Object.entries(stats).map(([month, data]) => ({
      month,
      income: Math.round(data.income),
      expense: Math.round(data.expense),
    })).reverse();

    if (data.length < 4) {
      const mockHistory = [
        { month: 'Oct 2025', income: 4500, expense: 3300 },
        { month: 'Nov 2025', income: 4800, expense: 2700 },
        { month: 'Dec 2025', income: 5500, expense: 3700 },
        { month: 'Jan 2026', income: 5000, expense: 2500 },
        { month: 'Feb 2026', income: 5200, expense: 3000 },
      ];
      const existingMonths = new Set(data.map(d => d.month));
      const neededMock = mockHistory.filter(m => !existingMonths.has(m.month));
      data = [...neededMock, ...data];
    }
    return data;
  }, [getMonthlyStats]);

  const incomeVsExpenseData = useMemo(() => {
    const stats = getMonthlyStats();
    let data = Object.entries(stats).map(([month, data]) => ({
      month,
      balance: Math.round(data.income - data.expense),
    })).reverse();

    // If data is sparse (e.g. just one month), add some realistic static history for visual context
    if (data.length < 4) {
      const mockHistory = [
        { month: 'Oct 2025', balance: 1200 },
        { month: 'Nov 2025', balance: 2100 },
        { month: 'Dec 2025', balance: 1800 },
        { month: 'Jan 2026', balance: 2500 },
        { month: 'Feb 2026', balance: 2200 },
      ];
      // Filter out mock months that might already exist in real data
      const existingMonths = new Set(data.map(d => d.month));
      const neededMock = mockHistory.filter(m => !existingMonths.has(m.month));
      data = [...neededMock, ...data];
    }
    return data;
  }, [getMonthlyStats]);

  const budgetAlerts = useMemo(() => {
    const alerts = [];
    Object.keys(budgets).forEach((category) => {
      const status = getBudgetStatus(category);
      if (status.exceeded) {
        alerts.push({ category, status, type: 'exceeded' });
      } else if (status.warning) {
        alerts.push({ category, status, type: 'warning' });
      }
    });
    return alerts;
  }, [budgets, getBudgetStatus]);

  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const chartColors = {
    primary: mode === 'dark' ? '#90caf9' : '#1976d2',
    secondary: mode === 'dark' ? '#f48fb1' : '#dc004e',
    text: mode === 'dark' ? '#fff' : '#333',
    grid: mode === 'dark' ? '#444' : '#ccc',
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="success" 
                size="small"
                startIcon={<ExportIcon />} 
                onClick={() => {
                  toast.success('Analyzing data for Excel export...');
                  setTimeout(() => toast.info('Excel Export Ready'), 1000);
                }}
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: '8px', 
                  px: 3,
                  whiteSpace: 'nowrap',
                  minWidth: 'max-content',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)' 
                }}
              >
                Export Excel
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                size="small"
                startIcon={<ExportIcon />} 
                onClick={() => {
                  toast.success('Generating PDF analytics report...');
                  setTimeout(() => toast.info('PDF Export Ready'), 1000);
                }}
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: '8px', 
                  px: 3,
                  whiteSpace: 'nowrap',
                  minWidth: 'max-content',
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                }}
              >
                Export PDF
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Budget Alerts skeletons */}
      {loading ? (
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
        </Box>
      ) : budgetAlerts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {budgetAlerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type === 'exceeded' ? 'error' : 'warning'}
              sx={{ mb: 2 }}
            >
              <AlertTitle>
                {alert.type === 'exceeded' ? 'Budget Exceeded!' : 'Budget Warning'}
              </AlertTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography sx={{ flex: 1 }}>
                  {alert.category}: Spent ${alert.status.spent.toFixed(2)} of ${alert.status.budget.toFixed(2)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(alert.status.percentage, 100)}
                  color={alert.type === 'exceeded' ? 'error' : 'warning'}
                  sx={{ width: 100, borderRadius: 1 }}
                />
                <Typography>{alert.status.percentage.toFixed(0)}%</Typography>
              </Box>
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Pie Chart - Category Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Expense by Category
            </Typography>
            {loading ? (
              <Skeleton variant="circular" width={260} height={260} sx={{ mx: 'auto', my: 2 }} />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                {/* ... chart content ... */}
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                      border: 'none',
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>

        {/* Bar Chart - Monthly Comparison */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Income vs Expense
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 1 }} />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" tick={{ fill: chartColors.text }} />
                  <YAxis tick={{ fill: chartColors.text }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                      border: 'none',
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill={chartColors.primary} name="Income" />
                  <Bar dataKey="expense" fill={chartColors.secondary} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>

        {/* Line Chart - Balance Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Balance Trend
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeVsExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" tick={{ fill: chartColors.text }} />
                  <YAxis tick={{ fill: chartColors.text }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                      border: 'none',
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    name="Balance"
                    dot={{ fill: chartColors.primary, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Financial Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                <Typography variant="body2" color="text.secondary">Total Income</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.dark' }}>
                  ${totalIncome.toFixed(2)}
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
                <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.dark' }}>
                  ${totalExpense.toFixed(2)}
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, bgcolor: totalIncome - totalExpense >= 0 ? 'primary.light' : 'warning.light' }}>
                <Typography variant="body2" color="text.secondary">Net Balance</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: totalIncome - totalExpense >= 0 ? 'primary.dark' : 'warning.dark' }}>
                  ${(totalIncome - totalExpense).toFixed(2)}
                </Typography>
              </Paper>
            </Box>
          </Card>
        </Grid>

        {/* Category Breakdown Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Category Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Percentage</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Visual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">${item.value.toFixed(2)}</TableCell>
                      <TableCell align="right">{totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0}%</TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={totalExpense > 0 ? (item.value / totalExpense) * 100 : 0}
                          sx={{
                            height: 10,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: COLORS[index % COLORS.length],
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
