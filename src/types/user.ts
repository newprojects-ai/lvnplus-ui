export type Role = 'Student' | 'Parent' | 'Tutor' | 'Admin';

export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  
  // Optional additional user properties
  profilePicture?: string;
  lastLogin?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
}

// Utility type for creating a new user
export type CreateUserData = Omit<User, 'id'> & {
  password: string;
}

// Type for user profile updates
export type UpdateUserData = Partial<Omit<User, 'id' | 'email'>> & {
  currentPassword?: string;
  newPassword?: string;
}
