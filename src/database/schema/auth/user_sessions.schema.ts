import {
  pgTable,
  text,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import users from "../user/user.schema.js";

export const userSessions = pgTable("user_sessions", {
  sid: text("sid").primaryKey().notNull(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  refreshTokenHash: text("refresh_token_hash").notNull(),

  expiresAt: timestamp("expires_at").notNull(),

  userAgent: text("user_agent"),

  revokedAt: timestamp("revoked_at"),

  lastUsedAt: timestamp("last_used_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export default userSessions;