import { jwtDecode } from 'jwt-decode';
import { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<User>(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < currentTime) {
      removeAuthToken();
      return null;
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      roles: decoded.roles
    };
  } catch (error) {
    removeAuthToken();
    return null;
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};