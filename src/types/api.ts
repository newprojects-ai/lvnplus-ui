import { User, Role } from './auth';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: Role;
  parentId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user_id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;