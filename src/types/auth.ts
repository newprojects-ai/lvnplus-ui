export type Role = 'Student' | 'Parent' | 'Tutor' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  password?: string;
  parentId?: string;
  exp?: number; // JWT expiration timestamp
  iat?: number; // JWT issued at timestamp
}