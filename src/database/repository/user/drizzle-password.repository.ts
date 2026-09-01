import { eq } from "drizzle-orm";

import userPassword from "../../schema/user/user_password.schema.js";

import type { PasswordRepository } from "../../../modules/auth/interfaces/password-repository.interface.js";
import type { UserPassword } from "../../../modules/auth/types/auth.types.js";
import db from "../../connection/db.js";

export class DrizzlePasswordRepository implements PasswordRepository {

    // save user password
  async create(userId: string, passwordHash: string): Promise<UserPassword> {
    const result = await db
      .insert(userPassword)
      .values({
        userId,
        passwordHash,
      })
      .returning();

    const password = result[0];

    if (!password) {
      throw new Error("Failed to create password");
    }

    return password;
  }

  // find user hash password
  async findByUserId(userId: string): Promise<UserPassword | null> {
    const result = await db
      .select()
      .from(userPassword)
      .where(eq(userPassword.userId, userId))
      .limit(1);

    return result[0] ?? null;
  }
}
