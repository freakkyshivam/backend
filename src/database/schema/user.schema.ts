import { pgTable, varchar, timestamp, pgEnum, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "normal_user",
  "admin",
  "corporate_mgmt",
  "compliance_officer",
  "mine_officer",
  "field_inspector",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  role: roleEnum("role").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export default users