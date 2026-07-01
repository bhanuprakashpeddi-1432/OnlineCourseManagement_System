import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const performLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // Listen for the auth:unauthorized event dispatched by the API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      performLogout();
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate, performLogout]);

  // Restore auth state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    const { token, ...userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    setCurrentUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  };

  const logout = useCallback(() => {
    performLogout();
    navigate('/', { replace: true });
  }, [performLogout, navigate]);

  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (!roles || roles.length === 0) return true;
    return roles.includes(currentUser.role);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

