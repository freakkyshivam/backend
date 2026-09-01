 import type { UserRole } from "../../../domain/user/user-role.js";

export type UserPassword = {
  id: string;
  userId: string;
  passwordHash: string;
};

export type tokenPayLoad = {
  userId: string;
  role: UserRole
};

export type loginResult = {
  accessToken: string;
  refreshToken : string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
};
