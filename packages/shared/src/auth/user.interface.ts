import { UserRole } from './user-role.enum';

export interface UserPayload {
  userId: string;
  role: UserRole;
}

export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  role: UserRole;
}