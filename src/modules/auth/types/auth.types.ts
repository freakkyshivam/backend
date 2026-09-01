import type { UserRole } from "../../../domain/user/user-role.js";

export type UserPassword = {
  id: string;
  userId: string;
  passwordHash: string;
};

export type tokenPayLoad = {
  userId: string;
  role: UserRole;
};

export type loginResult = {
  accessToken: string;
  refreshToken: string;
  sid : string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
};

export type Session = {
  sid: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent: string | null;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
};

