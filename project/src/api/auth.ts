import { apiClient } from './client';
import { LoginResponse, RegisterResponse, RegisterData, LoginData } from '../types/api';
import { z } from 'zod';
import { setAuthToken } from '../utils/auth';

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
    // Validate input
    const validatedData = registerSchema.parse(data);
    
    const response = await apiClient.post<RegisterResponse>('/auth/register', validatedData);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    // Validate input
    const validatedData = loginSchema.parse(data);
    
    const response = await apiClient.post<LoginResponse>('/auth/login', validatedData);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always remove the token, even if the API call fails
      setAuthToken('');
    }
  },
};