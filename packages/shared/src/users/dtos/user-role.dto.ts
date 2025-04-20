import { UserRole } from '../schemas';

export interface UserPayload {
  userId: string;
  role: UserRole;
}
