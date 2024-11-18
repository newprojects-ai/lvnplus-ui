import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types/auth';
import { LoginData } from '../types/api';
import { authApi } from '../api/auth';
import { verifyToken } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const userData = verifyToken(token);
      return userData;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      const userData: User = {
        id: response.user_id,
        name: response.name,
        email: response.email,
        role: response.role
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}