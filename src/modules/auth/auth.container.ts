import { AuthService } from "./services/auth.service.js";

import { DrizzleUserRepository } from "../../database/repository/user/drizzle-user.repository.js";
import { DrizzlePasswordRepository } from "../../database/repository/user/drizzle-password.repository.js";

import { Argon2PasswordHasher } from "./infrastructure/password/argon2-password-hasher.js";
import { JwtTokenService } from "./infrastructure/token/jwt-token-service.js";
import { RedisService } from "./infrastructure/otp/redis-service.js";
import { RedisPendingSignupRepository } from "./infrastructure/pending-signup/redis-pending-signup.repository.js";
import { DrizzleSessionRepository } from "../../database/repository/auth/drizzle-session.repository.js";

const userRepository = new DrizzleUserRepository();
const passwordRepository = new DrizzlePasswordRepository();

const passwordHasher = new Argon2PasswordHasher();
const tokenService = new JwtTokenService();

const redisService = new RedisService()
const pendingSignupRepository = new RedisPendingSignupRepository();
const sessionRepository = new DrizzleSessionRepository()

export const authService = new AuthService(
  userRepository,
  passwordRepository,
  passwordHasher,
  tokenService,
  redisService,
  pendingSignupRepository,
sessionRepository
);