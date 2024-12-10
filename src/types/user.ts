export interface User {
  id: string | number;  // Changed to allow both string and number
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}
