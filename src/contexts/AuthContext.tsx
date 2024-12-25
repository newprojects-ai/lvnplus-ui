import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { User } from '../types/user';
import { authApi } from '../api/auth';
import { 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  verifyToken 
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string; role: Role }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      console.log('Initial Token Check:', token);
      
      if (token) {
        try {
          const userData = await verifyToken(token);
          console.log('Initial User Data:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Initial Token Verification Error:', error);
          removeAuthToken();
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string; role: Role }) => {
    setIsLoading(true);
    try {
      console.log('Login attempt with role:', credentials.role);
      const response = await authApi.login(credentials);
      console.log('Login response:', response);
      
      // Ensure role is included in user data
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        roles: [credentials.role]
      };
      
      console.log('Setting user data:', userData);
      setAuthToken(response.token);
      setUser(userData);
    } catch (error) {
      console.error('Login Error:', error);
      removeAuthToken();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      removeAuthToken();
      setUser(null);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};