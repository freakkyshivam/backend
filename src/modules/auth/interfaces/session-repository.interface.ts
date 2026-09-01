import type { Session } from "../types/auth.types.js";

export interface SessionRepository {
    // create sessions
  create(
    sid: string,
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    userAgent?: string,
  ): Promise<void>;

  // find session by id
    findById(sid: string): Promise<Session | null>;

    // revoke session
  revoke(sid: string): Promise<void>;

  // update last used of session
  updateLastUsed(sid: string): Promise<void>;

}
