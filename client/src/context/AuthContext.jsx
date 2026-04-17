import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

const decodeTokenUser = (token) => {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    if (!payload?.id || !payload?.role) {
      return null;
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return {
      id: String(payload.id),
      role: payload.role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from sessionStorage token
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');

    if (storedToken) {
      const decodedUser = decodeTokenUser(storedToken);
      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
      } else {
        sessionStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const register = async (name, email, password, role = 'user') => {
    try {
      setLoading(true);
      const response = await authService.register(name, email, password, role);

      const nextToken = response?.token;
      const decodedUser = decodeTokenUser(nextToken);
      if (!nextToken || !decodedUser) {
        throw new Error('Invalid authentication token');
      }

      sessionStorage.setItem('token', nextToken);
      setToken(nextToken);
      setUser(decodedUser);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);

      const nextToken = response?.token;
      const decodedUser = decodeTokenUser(nextToken);
      if (!nextToken || !decodedUser) {
        throw new Error('Invalid authentication token');
      }

      sessionStorage.setItem('token', nextToken);
      setToken(nextToken);
      setUser(decodedUser);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
