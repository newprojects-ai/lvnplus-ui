import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    console.group('API Request Interceptor');
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token Added:', token);
    } else {
      console.warn('No authentication token found');
    }
    
    // Log request payload for POST/PUT/PATCH requests
    if (['post', 'put', 'patch'].includes(config.method || '')) {
      console.log('Request Payload:', JSON.stringify(config.data, null, 2));
    }
    
    console.groupEnd();
    
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.group('API Response Interceptor');
    console.log('Response URL:', response.config.url);
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.groupEnd();
    
    return response;
  },
  (error) => {
    console.group('API Response Error Interceptor');
    console.error('Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Log full error object for comprehensive debugging
    console.error('Full Error Object:', error);
    console.groupEnd();
    
    if (axios.isAxiosError(error)) {
      // Handle network errors
      if (!error.response) {
        error.message = 'Network error. Please check your connection.';
        return Promise.reject(error);
      }

      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 401:
          error.message = 'Invalid credentials';
          break;
        case 403:
          error.message = 'Access denied';
          break;
        case 404:
          error.message = 'Resource not found';
          break;
        case 422:
          error.message = 'Validation failed';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        default:
          error.message = error.response.data?.message || 'An unexpected error occurred';
      }
    }
    return Promise.reject(error);
  }
);