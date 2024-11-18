import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in production, this would come from your backend
const MOCK_USERS = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'student123',
    name: 'John Student',
    role: 'student' as const,
  },
  {
    id: '2',
    email: 'parent@example.com',
    password: 'parent123',
    name: 'Mary Parent',
    role: 'parent' as const,
  },
  {
    id: '3',
    email: 'tutor@example.com',
    password: 'tutor123',
    name: 'David Tutor',
    role: 'tutor' as const,
  },
  {
    id: '4',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Sarah Admin',
    role: 'administrator' as const,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!matchedUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
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