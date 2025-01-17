import { User } from '../types/user';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) {
    return null;
  }
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    console.log('Verifying Token:', token);
    const jwtDecode = await import('jwt-decode');
    
    const decoded = jwtDecode.default<{
      sub?: string | number;  // Subject (user ID)
      userId?: string | number;  // Alternative user ID field
      id?: string | number;  // Another potential user ID field
      email: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      exp?: number;
    }>(token);
    
    console.log('Decoded Token:', JSON.stringify(decoded, null, 2));
    
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('Token has expired');
      removeAuthToken();
      return null;
    }
    
    const userId = 
      decoded.sub || 
      decoded.userId || 
      decoded.id;
    
    if (!userId) {
      console.error('No user ID found in token');
      return null;
    }
    
    // Convert role to uppercase for consistency
    const role = decoded.role?.toUpperCase() || '';
    
    const userData: User = {
      id: userId,
      email: decoded.email,
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      roles: role ? [role] : []
    };
    
    console.log('Verified User Data:', JSON.stringify(userData, null, 2));
    
    // Store the user data
    setUser(userData);
    
    return userData;
  } catch (error) {
    console.error('Token Verification Error:', error);
    removeAuthToken();
    return null;
  }
};