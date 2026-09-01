import type { PasswordHasher } from "../interfaces/password-hasher.interface.js";
import type { PasswordRepository } from "../interfaces/password-repository.interface.js";
import type { TokenService } from "../interfaces/token-service.interface.js";
import type { UserRepository } from "../interfaces/user-repository.interface.js";
import type { loginResult } from "../types/auth.types.js";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordRepository: PasswordRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  // register new user service (email + password)
  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = await this.userRepository.createUser(
      name,
      email,
      "normal_user",
    );

    const passwordHash = await this.passwordHasher.hash(password);

    await this.passwordRepository.create(user.id, passwordHash);

    return user;
  }

  // login via password service
  async login(email: string, password: string): Promise<loginResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
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
      userId : user.id,
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
