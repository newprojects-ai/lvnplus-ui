import { User, Role } from './auth';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  parentId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export type RegisterResponse = AuthResponse;