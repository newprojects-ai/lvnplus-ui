import { User } from '../types/user';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Retrieved token:', token ? 'exists' : 'null');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Auth token set successfully');
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw error;
  }
};

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('Auth tokens removed successfully');
  } catch (error) {
    console.error('Error removing auth tokens:', error);
    throw error;
  }
};

export const getUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    console.log('Retrieved user data:', userJson ? 'exists' : 'null');
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const setUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('User data set successfully');
  } catch (error) {
    console.error('Error setting user data:', error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    console.log('Verifying token...');
    if (!token) {
      console.warn('No token provided for verification');
      return null;
    }

    const jwtDecode = await import('jwt-decode');
    
    const decoded = jwtDecode.default<{
      sub?: string | number;
      userId?: string | number;
      id?: string | number;
      email: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      exp?: number;
    }>(token);
    
    console.log('Token decoded successfully:', {
      ...decoded,
      token: token.substring(0, 10) + '...' // Only log part of the token
    });

    // Check token expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('Token has expired');
      removeAuthToken();
      return null;
    }

    // Get user ID from various possible fields
    const userId = decoded.sub || decoded.userId || decoded.id;
    if (!userId) {
      console.warn('No user ID found in token');
      return null;
    }

    // Construct user object
    const user: User = {
      id: String(userId),
      email: decoded.email,
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      roles: decoded.role ? [decoded.role] : []
    };

    console.log('Verified user:', { ...user, token: undefined });
    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    removeAuthToken();
    return null;
  }
};