 import type { UserRole } from "../../../domain/user/user-role.js";

export interface TokenService {
  generateAccessToken(payload: {
    userId: string;
    role: UserRole;
  }): string;

  generateRefreshToken(payload: {
    userId: string;
  }): string;
}