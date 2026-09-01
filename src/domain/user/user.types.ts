
import  type { UserRole } from "./user-role.js";
import type { UserStatus } from "./user-status.js";
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status : UserStatus
};