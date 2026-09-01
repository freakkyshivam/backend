import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import users from "./user.schema.js";

export const userPassword = pgTable("user_passwords", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
  .references(() => users.id,{
    onDelete : "cascade"
  })
  .notNull()
  .unique(),

  passwordHash: text("password_hash").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export default userPassword;
