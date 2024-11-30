export type Role = string;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  exp?: number; // JWT expiration timestamp
  iat?: number; // JWT issued at timestamp
}