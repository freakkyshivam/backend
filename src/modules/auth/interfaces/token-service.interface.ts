import type { UserRole } from "../types/auth.types.js";

export interface TokenService {
  generateAccessToken(payload: {
    userId: string;
    role: UserRole;
  }): string;

  generateRefreshToken(payload: {
    userId: string;
    role: UserRole;
  }): string;
}