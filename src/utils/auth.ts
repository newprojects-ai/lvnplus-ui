import { jwtDecode } from 'jwt-decode';
import cookie from 'cookie';
import { User } from '../types/auth';

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<User>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getAuthToken = (): string | null => {
  const cookies = cookie.parse(document.cookie);
  return cookies.token || null;
};

export const setAuthToken = (token: string) => {
  document.cookie = cookie.serialize('token', token, {
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
    secure: true,
    sameSite: 'strict'
  });
};

export const removeAuthToken = () => {
  document.cookie = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/'
  });
};