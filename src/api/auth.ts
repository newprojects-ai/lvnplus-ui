import { apiClient } from './client';
import { LoginResponse, RegisterResponse, RegisterData, LoginData } from '../types/api';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['Student', 'Parent', 'Tutor', 'Admin']),
  parentId: z.string().uuid('Invalid parent ID format').optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const authApi = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const validatedData = registerSchema.parse(data);
      const response = await apiClient.post<RegisterResponse>('/auth/register', validatedData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    try {
      const validatedData = loginSchema.parse(data);
      const response = await apiClient.post<LoginResponse>('/auth/login', validatedData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  validateToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      await apiClient.get('/auth/validate');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
};