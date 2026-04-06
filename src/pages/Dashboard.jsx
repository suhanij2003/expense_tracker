import { useMemo } from 'react';
import { Box, Typography, Card, Grid, Paper, Chip, Avatar } from '@mui/material';
import {
  AccountBalance as BalanceIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  ShowChart as GrowthIcon,
  Receipt as TransactionIcon,
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { Skeleton } from "@mui/material";

const Dashboard = () => {
  const { transactions, loading, getTotalIncome, getTotalExpense, getBalance } = useTransactions();
  const { user } = useAuth();
  const { mode } = useCustomTheme();

  const stats = useMemo(() => {
    const totalIncome = getTotalIncome();
    const totalExpense = getTotalExpense();
    const balance = getBalance();
    
    // Calculate growth rate (comparing last 30 days to previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const last30Days = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= thirtyDaysAgo && date <= now;
    });
    
    const previous30Days = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });
    
    const last30Income = last30Days.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const previous30Income = previous30Days.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    
    const growthRate = previous30Income > 0 ? ((last30Income - previous30Income) / previous30Income) * 100 : 0;
    
    // Recent transactions
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    // Category breakdown
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    
    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    return {
      totalIncome,
      totalExpense,
      balance,
      growthRate,
      recentTransactions,
      topCategories,
      transactionCount: transactions.length,
    };
  }, [transactions, getTotalIncome, getTotalExpense, getBalance]);

  const kpiCards = [
    {
      title: 'Total Balance',
      value: `$${stats.balance.toFixed(2)}`,
      icon: <BalanceIcon />,
      color: mode === 'dark' ? '#90caf9' : '#1976d2',
      bgColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
    },
    {
      title: 'Total Income',
      value: `$${stats.totalIncome.toFixed(2)}`,
      icon: <IncomeIcon />,
      color: mode === 'dark' ? '#81c784' : '#4caf50',
      bgColor: mode === 'dark' ? 'rgba(129, 199, 132, 0.1)' : 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpense.toFixed(2)}`,
      icon: <ExpenseIcon />,
      color: mode === 'dark' ? '#e57373' : '#f44336',
      bgColor: mode === 'dark' ? 'rgba(229, 115, 115, 0.1)' : 'rgba(244, 67, 54, 0.1)',
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate >= 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%`,
      icon: <GrowthIcon />,
      color: stats.growthRate >= 0 
        ? (mode === 'dark' ? '#81c784' : '#4caf50')
        : (mode === 'dark' ? '#e57373' : '#f44336'),
      bgColor: stats.growthRate >= 0
        ? (mode === 'dark' ? 'rgba(129, 199, 132, 0.1)' : 'rgba(76, 175, 80, 0.1)')
        : (mode === 'dark' ? 'rgba(229, 115, 115, 0.1)' : 'rgba(244, 67, 54, 0.1)'),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your finances today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          // KPI Skeletons
          Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={`kpi-skeleton-${idx}`}>
              <Card sx={{ p: 3, height: '100%', border: '1px solid rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                  <Skeleton variant="text" width="60%" height={32} />
                </Box>
                <Skeleton variant="text" width="80%" height={48} />
              </Card>
            </Grid>
          ))
        ) : (
          kpiCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: card.bgColor,
                  border: `1px solid ${card.color}20`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: card.color,
                    mt: 'auto',
                  }}
                >
                  {card.value}
                </Typography>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Transactions
              </Typography>
              <Chip
                icon={<TransactionIcon />}
                label={`${stats.transactionCount} total`}
                size="small"
                variant="outlined"
              />
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Paper key={`recent-skeleton-${idx}`} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '60%' }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                    <Skeleton variant="text" width="20%" />
                  </Paper>
                ))}
              </Box>
            ) : stats.recentTransactions.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stats.recentTransactions.map((transaction) => (
                  <Paper
                    key={transaction.id}
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: 'background.default',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {transaction.description || transaction.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: transaction.type === 'income' ? 'success.main' : 'error.main',
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No transactions yet
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Top Spending Categories
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Paper key={`cat-skeleton-${idx}`} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="30%" />
                    </Box>
                    <Skeleton variant="rectangular" width={40} height={24} />
                  </Paper>
                ))}
              </Box>
            ) : stats.topCategories.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stats.topCategories.map(([category, amount], index) => (
                  <Paper
                    key={category}
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${amount.toFixed(2)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${((amount / stats.totalExpense) * 100).toFixed(1)}%`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No expenses yet
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
