
import  type { UserRole } from "./user-role.js";
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};