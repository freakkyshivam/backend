import { eq } from "drizzle-orm";

import db from "../../connection/db.js";
import userSessions from "../../schema/auth/user_sessions.schema.js";

import type { SessionRepository } from "../../../modules/auth/interfaces/session-repository.interface.js";
import type { Session } from "../../../modules/auth/types/auth.types.js";

export class DrizzleSessionRepository implements SessionRepository {

    // create session table
  async create(
    sid: string,
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    userAgent?: string
  ): Promise<void> {
    await db.insert(userSessions).values({
      sid,
      userId,
      userAgent,
      expiresAt,
      refreshTokenHash,
    });
  }

  // find session table by sid
  async findById(sid: string): Promise<Session | null> {
    const result = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sid, sid));

    const session = result[0];

    if (!session) {
      return null;
    }

    return session;
  }

  // revoke session by sid
  async revoke(sid: string): Promise<void> {
    await db
      .update(userSessions)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(userSessions.sid, sid));
  }

  // update last used of session by sid
  async updateLastUsed(sid: string): Promise<void> {
    await db
      .update(userSessions)
      .set({
        lastUsedAt: new Date(),
      })
      .where(eq(userSessions.sid, sid));
  }
}