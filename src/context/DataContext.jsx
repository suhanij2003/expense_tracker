import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const API_BASE_URL = 'https://dummyjson.com';

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, productsRes, cartsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users?limit=100`),
        axios.get(`${API_BASE_URL}/products?limit=100`),
        axios.get(`${API_BASE_URL}/carts?limit=100`),
      ]);
      
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setCarts(cartsRes.data.carts || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from API');
    } finally {
      setLoading(false);
    }
  };

  // User operations
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users?limit=100`);
      setUsers(response.data.users || []);
      return response.data.users;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/add`, userData);
      setUsers(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding user:', err);
      return { success: false, message: 'Failed to add user' };
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updates);
      setUsers(prev => prev.map(u => u.id === userId ? response.data : u));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating user:', err);
      return { success: false, message: 'Failed to update user' };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, message: 'Failed to delete user' };
    }
  };

  // Product operations
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products?limit=100`);
      setProducts(response.data.products || []);
      return response.data.products;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products/add`, productData);
      setProducts(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding product:', err);
      return { success: false, message: 'Failed to add product' };
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${productId}`, updates);
      setProducts(prev => prev.map(p => p.id === productId ? response.data : p));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating product:', err);
      return { success: false, message: 'Failed to update product' };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting product:', err);
      return { success: false, message: 'Failed to delete product' };
    }
  };

  // Cart/Order operations
  const fetchCarts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/carts?limit=100`);
      setCarts(response.data.carts || []);
      return response.data.carts;
    } catch (err) {
      console.error('Error fetching carts:', err);
      throw err;
    }
  };

  const addCart = async (cartData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/carts/add`, cartData);
      setCarts(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding cart:', err);
      return { success: false, message: 'Failed to add cart' };
    }
  };

  const updateCart = async (cartId, updates) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/carts/${cartId}`, updates);
      setCarts(prev => prev.map(c => c.id === cartId ? response.data : c));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating cart:', err);
      return { success: false, message: 'Failed to update cart' };
    }
  };

  const deleteCart = async (cartId) => {
    try {
      await axios.delete(`${API_BASE_URL}/carts/${cartId}`);
      setCarts(prev => prev.filter(c => c.id !== cartId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting cart:', err);
      return { success: false, message: 'Failed to delete cart' };
    }
  };

  // Stats
  const getStats = () => {
    return {
      totalUsers: users.length,
      totalProducts: products.length,
      totalCarts: carts.length,
      totalRevenue: carts.reduce((sum, cart) => sum + (cart.total || 0), 0),
    };
  };

  const value = {
    // Data
    users,
    products,
    carts,
    loading,
    error,
    
    // User operations
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    
    // Product operations
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Cart operations
    fetchCarts,
    addCart,
    updateCart,
    deleteCart,
    
    // Utilities
    fetchAllData,
    getStats,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
