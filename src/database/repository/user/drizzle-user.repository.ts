import { eq } from "drizzle-orm";

import db from "../../connection/db.js";
import users from "../../schema/user/user.schema.js";

import type { User } from "../../../domain/user/user.types.js";

import type { UserRepository } from "../../../modules/auth/interfaces/user-repository.interface.js";
import type { UserRole } from "../../../domain/user/user-role.js";

export class DrizzleUserRepository implements UserRepository {
  // find user details by email from db
  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  //  create new user
  async createUser(name: string, email: string, role: UserRole): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        name,
        email,
        role,
      })
      .returning();

    const user = result[0];

    if (!user) {
      throw new Error("Failed to create user");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      status: user.status,
    };
  }
}
