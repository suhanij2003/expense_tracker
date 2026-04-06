import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

const STORAGE_KEY = 'expense_tracker_transactions';
const BUDGETS_KEY = 'expense_tracker_budgets';

export const useTransactions = () => useContext(TransactionContext);

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Food',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

// Initial transactions for first-time users
// Initial transactions for first-time users - covering last 3 months
const getInitialTransactions = () => {
  const now = new Date();
  const getPastDate = (daysAgo) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  
  return [
    // March 2026
    { id: 'income-m1', amount: 5000, type: 'income', category: 'Salary', date: getPastDate(5), description: 'Monthly Salary' },
    { id: 'income-m2', amount: 1200, type: 'income', category: 'Freelance', date: getPastDate(10), description: 'Project Payment' },
    { id: 'exp-m1', amount: 299.99, type: 'expense', category: 'Electronics', date: getPastDate(3), description: 'Wireless Headphones' },
    { id: 'exp-m2', amount: 45.00, type: 'expense', category: 'Food', date: getPastDate(2), description: 'Grocery Shopping' },
    { id: 'exp-m3', amount: 89.99, type: 'expense', category: 'Clothing', date: getPastDate(4), description: 'T-Shirt' },
    
    // February 2026
    { id: 'income-f1', amount: 4800, type: 'income', category: 'Salary', date: getPastDate(35), description: 'Feb Salary' },
    { id: 'exp-f1', amount: 1200.00, type: 'expense', category: 'Home & Garden', date: getPastDate(38), description: 'Rent' },
    { id: 'exp-f2', amount: 350.00, type: 'expense', category: 'Food', date: getPastDate(42), description: 'Groceries' },
    { id: 'exp-f3', amount: 120.00, type: 'expense', category: 'Transportation', date: getPastDate(45), description: 'Fuel' },
    
    // January 2026
    { id: 'income-j1', amount: 4800, type: 'income', category: 'Salary', date: getPastDate(65), description: 'Jan Salary' },
    { id: 'exp-j1', amount: 1200.00, type: 'expense', category: 'Home & Garden', date: getPastDate(68), description: 'Rent' },
    { id: 'exp-j2', amount: 200.00, type: 'expense', category: 'Education', date: getPastDate(72), description: 'Online Course' },
    { id: 'exp-j3', amount: 500.00, type: 'expense', category: 'Investment', date: getPastDate(75), description: 'Stock Purchase' },
    
    // December 2025
    { id: 'income-d1', amount: 5500, type: 'income', category: 'Salary', date: getPastDate(95), description: 'Dec Salary + Bonus' },
    { id: 'exp-d1', amount: 1500.00, type: 'expense', category: 'Entertainment', date: getPastDate(98), description: 'Holiday Trip' },
    { id: 'exp-d2', amount: 300.00, type: 'expense', category: 'Food', date: getPastDate(102), description: 'Holiday Dinner' },
  ];
};

export const TransactionProvider = ({ children }) => {
  // Load from localStorage first
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved transactions:', e);
      }
    }
    return getInitialTransactions();
  });
  
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem(BUDGETS_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Persist transactions to localStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, initialized]);

  // Persist budgets to localStorage
  useEffect(() => {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }, [budgets]);

  // Mark as initialized after first render
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Fetch initial data from API if localStorage is empty
  useEffect(() => {
    const fetchFromAPI = async () => {
      try {
        setLoading(true);
        // Fetch from products API
        const response = await axios.get('https://dummyjson.com/products?limit=30');
        const products = response.data.products;
        
        // Transform products into transactions
        const transactionData = products.slice(0, 15).map((product, index) => ({
          id: `api-${product.id}`,
          amount: product.price,
          type: 'expense',
          category: capitalizeCategory(product.category),
          date: new Date(Date.now() - index * 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: product.title,
        }));
        
        // Only use API data if we don't have any transactions
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved || JSON.parse(saved).length === 0) {
          setTransactions(transactionData);
        }
      } catch (error) {
        console.error('Error fetching from API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFromAPI();
  }, []);

  const capitalizeCategory = (category) => {
    if (!category) return 'Other';
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  };

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: transaction.date || new Date().toISOString(),
    };
    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      return updated;
    });
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => 
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter((t) => t.id !== id));
  }, []);

  const setBudget = useCallback((category, amount) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
  }, []);

  const deleteBudget = useCallback((category) => {
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[category];
      return newBudgets;
    });
  }, []);

  const getBudgetStatus = useCallback((category) => {
    const budgetAmount = budgets[category] || 0;
    const spent = transactions
      .filter((t) => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
    
    return {
      budget: budgetAmount,
      spent,
      remaining: budgetAmount - spent,
      percentage,
      exceeded: spent > budgetAmount && budgetAmount > 0,
      warning: percentage >= 80 && percentage < 100,
    };
  }, [transactions, budgets]);

  const getTotalIncome = useCallback(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getTotalExpense = useCallback(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpense();
  }, [getTotalIncome, getTotalExpense]);

  const getGrowthPercentage = useCallback(() => {
    const totalIncome = getTotalIncome();
    const totalExpense = getTotalExpense();
    if (totalIncome === 0) return 0;
    return ((totalIncome - totalExpense) / totalIncome) * 100;
  }, [getTotalIncome, getTotalExpense]);

  const getCategoryStats = useCallback(() => {
    const stats = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!stats[t.category]) {
          stats[t.category] = 0;
        }
        stats[t.category] += t.amount;
      });
    return stats;
  }, [transactions]);

  const getMonthlyStats = useCallback(() => {
    const stats = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!stats[month]) {
        stats[month] = { income: 0, expense: 0 };
      }
      stats[month][t.type] += t.amount;
    });
    return stats;
  }, [transactions]);

  const value = {
    transactions,
    budgets,
    loading,
    categories: CATEGORIES,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    deleteBudget,
    getBudgetStatus,
    getTotalIncome,
    getTotalExpense,
    getBalance,
    getGrowthPercentage,
    getCategoryStats,
    getMonthlyStats,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export { CATEGORIES };
export default TransactionProvider;
