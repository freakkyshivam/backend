import type { UserPassword } from "../types/auth.types.js";

export interface PasswordRepository {
  create(
    userId: string,
    passwordHash: string
  ): Promise<UserPassword>;

  findByUserId(userId: string): Promise<UserPassword | null>;
}