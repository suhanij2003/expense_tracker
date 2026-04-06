import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
};

const PERMISSIONS = {
  [ROLES.ADMIN]: { view: true, edit: true, delete: true },
  [ROLES.MANAGER]: { view: true, edit: true, delete: false },
  [ROLES.VIEWER]: { view: true, edit: false, delete: false },
};

// Mock users for role-based login
const MOCK_USERS = [
  { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@demo.com', role: ROLES.ADMIN, address: { city: 'New York' }, phone: '123-456-7890', company: { name: 'Demo Corp' } },
  { id: 5, firstName: 'Manager', lastName: 'User', email: 'manager@demo.com', role: ROLES.MANAGER, address: { city: 'Los Angeles' }, phone: '234-567-8901', company: { name: 'Demo Corp' } },
  { id: 10, firstName: 'Viewer', lastName: 'User', email: 'viewer@demo.com', role: ROLES.VIEWER, address: { city: 'Chicago' }, phone: '345-678-9012', company: { name: 'Demo Corp' } },
];

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://dummyjson.com/users?limit=100');
      // Combine mock users with API users
      const usersWithRoles = [
        ...MOCK_USERS,
        ...response.data.users
          .filter(u => !MOCK_USERS.some(m => m.id === u.id))
          .map((user, index) => ({
            ...user,
            role: index < 5 ? ROLES.MANAGER : ROLES.VIEWER,
          })),
      ];
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, selectedRole) => {
    setLoading(true); // Set loading while processing login
    try {
      // If role is selected, use mock user for that role
      let authenticatedUser = null;
      if (selectedRole) {
        authenticatedUser = MOCK_USERS.find(u => u.role === selectedRole);
      }

      // Otherwise try to find user by email
      if (!authenticatedUser && email) {
        const response = await axios.get('https://dummyjson.com/users');
        const foundUser = response.data.users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (foundUser) {
          authenticatedUser = {
            ...foundUser,
            role: foundUser.id === 1 ? ROLES.ADMIN : foundUser.id <= 5 ? ROLES.MANAGER : ROLES.VIEWER,
          };
        }
      }

      if (authenticatedUser) {
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
        setLoading(false);
        return { success: true, user: authenticatedUser };
      }

      setLoading(false);
      return { success: false, message: 'User not found' };
    } catch (error) {
      setLoading(false);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  const hasPermission = (action) => {
    if (!user) return false;
    return PERMISSIONS[user.role]?.[action] || false;
  };

  const updateUser = async (userId, updates) => {
    try {
      const response = await axios.put(`https://dummyjson.com/users/${userId}`, updates);
      setUsers(users.map((u) => (u.id === userId ? { ...u, ...response.data } : u)));
      if (user && user.id === userId) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to update user' };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://dummyjson.com/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to delete user' };
    }
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        logout,
        hasPermission,
        updateUser,
        deleteUser,
        updateUserRole,
        fetchUsers,
        ROLES,
        PERMISSIONS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { ROLES, PERMISSIONS };
export default AuthProvider;
