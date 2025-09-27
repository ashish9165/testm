import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/health');
          // If we have a token, try to get user info based on role
          const userRole = localStorage.getItem('userRole');
          if (userRole) {
            setUser({
              id: localStorage.getItem('userId'),
              role: userRole,
              name: localStorage.getItem('userName'),
              email: localStorage.getItem('userEmail')
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (credentials, userType) => {
    try {
      setLoading(true);
      let response;

      switch (userType) {
        case 'patient':
          response = await axios.post('/api/patient/symptom-login', credentials);
          break;
        case 'doctor':
          response = await axios.post('/api/doctor/login', credentials);
          break;
        case 'admin':
          response = await axios.post('/api/admin/login', credentials);
          break;
        default:
          throw new Error('Invalid user type');
      }

      const { token: newToken, [userType]: userData } = response.data;

      if (newToken && userData) {
        setToken(newToken);
        setUser({
          id: userData.id,
          role: userType,
          name: userData.name,
          email: userData.email,
          ...userData
        });

        // Store in localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);

        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        return { success: true, data: response.data };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
