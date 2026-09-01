import type { OtpService } from "../interfaces/otp-service.interface.js";
import type { PasswordHasher } from "../interfaces/password-hasher.interface.js";
import type { PasswordRepository } from "../interfaces/password-repository.interface.js";
import type { PendingSignupRepository } from "../interfaces/pending-signup-repository.interface.js";
import type { SessionRepository } from "../interfaces/session-repository.interface.js";
import type { TokenService } from "../interfaces/token-service.interface.js";
import type { UserRepository } from "../interfaces/user-repository.interface.js";
import type { loginResult } from "../types/auth.types.js";
import crypto from 'node:crypto'

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordRepository: PasswordRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly pendingSignupRepository: PendingSignupRepository,
    private readonly sessionRepository : SessionRepository
  ) {}

  // send otp for verify the email
  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await this.passwordHasher.hash(password);

    await this.pendingSignupRepository.save(email, {
      name,
      email,
      passwordHash,
    });

    const OTP = await this.otpService.generateOtp(email);

    console.log("Email verification otp : ", OTP);
  }

  // verify otp
async verifyEmail(email: string, otp: string) {
  const result = await this.otpService.verifyOtp(email, otp);

  if (!result) {
    throw new Error("Invalid or expired OTP");
  }

  const pendingSignupData =
    await this.pendingSignupRepository.get(email);

  if (!pendingSignupData) {
    throw new Error("Pending registration not found or expired");
  }

  const user = await this.userRepository.createUser(
    pendingSignupData.name,
    pendingSignupData.email,
    "normal_user"
  );

  await this.passwordRepository.create(
    user.id,
    pendingSignupData.passwordHash
  );

  await this.pendingSignupRepository.delete(email);

  return user;
}

  // login via password service
  async login(email: string, password: string, userAgent?: string): Promise<loginResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.status !== "active") {
      throw new Error("User account is not active");
    }

    const passwordH = await this.passwordRepository.findByUserId(user.id);

    if (!passwordH) {
      throw new Error("Invalid credentials");
    }

    const valid = await this.passwordHasher.verify(
      password,
      passwordH.passwordHash,
    );

    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
    });

    const sid = crypto.randomUUID();

     const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await this.sessionRepository.create(
    sid,
    user.id,
    refreshTokenHash,
    expiresAt,
    userAgent
  );

    return {
      accessToken,
      refreshToken,
      sid,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
