import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { User } from '../types/user';
import { authApi } from '../api/auth';
import { 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  verifyToken,
  setUser as setStoredUser,
  getUser as getStoredUser
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string; role: Role }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to get user from storage
        const storedUser = getStoredUser();
        if (storedUser) {
          console.log('Found stored user:', storedUser);
          setUser(storedUser);
        }

        // Then verify the token
        const token = getAuthToken();
        console.log('Initial token check:', token ? 'exists' : 'null');
        
        if (token) {
          try {
            const userData = await verifyToken(token);
            console.log('Token verification result:', userData);
            
            if (userData) {
              setUser(userData);
              setStoredUser(userData);
            } else {
              console.log('Token verification returned null user');
              setUser(null);
              removeAuthToken();
            }
          } catch (error) {
            console.error('Token verification error:', error);
            setUser(null);
            removeAuthToken();
            setError('Session expired. Please log in again.');
          }
        } else {
          console.log('No token found during initialization');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string; role: Role }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Login attempt with:', credentials);
      const { user: userData, token } = await authApi.login(credentials);
      console.log('Login successful, user data:', userData);
      console.log('User roles:', userData.roles);
      
      if (token) {
        setAuthToken(token);
      }
      
      setUser(userData);
      setStoredUser(userData);
    } catch (error) {
      console.error('Login error:', { email: credentials.email, error });
      setError('Invalid credentials or server error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('Logging out user');
      setUser(null);
      removeAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout properly.');
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}