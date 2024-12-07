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

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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