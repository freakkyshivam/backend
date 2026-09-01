import type { tokenPayLoad } from "../types/auth.types.js";

export interface TokenService {
  generateAccessToken(payload: tokenPayLoad): string;
  generateRefreshToken(payload: tokenPayLoad): string;
}
