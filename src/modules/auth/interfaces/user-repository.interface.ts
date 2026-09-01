import type { User } from "../../../domain/user/user.types.js";
import type { UserRole } from "../../../domain/user/user-role.js";
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;

  createUser(
    name: string,
    email: string,
    role: UserRole
  ): Promise<User>;
}
