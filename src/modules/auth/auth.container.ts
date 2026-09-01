import { AuthService } from "./services/auth.service.js";

import { DrizzleUserRepository } from "../../database/repository/user/drizzle-user.repository.js";
import { DrizzlePasswordRepository } from "../../database/repository/user/drizzle-password.repository.js";

import { Argon2PasswordHasher } from "./infrastructure/password/argon2-password-hasher.js";
import { JwtTokenService } from "./infrastructure/token/jwt-token-service.js";

const userRepository = new DrizzleUserRepository();
const passwordRepository = new DrizzlePasswordRepository();

const passwordHasher = new Argon2PasswordHasher();
const tokenService = new JwtTokenService();

export const authService = new AuthService(
  userRepository,
  passwordRepository,
  passwordHasher,
  tokenService,
);