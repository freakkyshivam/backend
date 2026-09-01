import type { User, UserRole } from "../types/auth.types.js";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;

  createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole
  ): Promise<User>;
}
