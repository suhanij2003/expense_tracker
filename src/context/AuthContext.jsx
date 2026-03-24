import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Role permissions configuration
export const ROLE_PERMISSIONS = {
  admin: {
    canView: true,
    canEdit: true,
    canDelete: true,
  },
  manager: {
    canView: true,
    canEdit: true,
    canDelete: true,
  },
  viewer: {
    canView: true,
    canEdit: false,
    canDelete: false,
  },
};

// Role labels for display
export const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  viewer: 'Viewer',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('dashboard_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (role, name = 'User') => {
    const userData = {
      role,
      name,
      loginTime: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem('dashboard_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dashboard_user');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] || false;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    role: user?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;