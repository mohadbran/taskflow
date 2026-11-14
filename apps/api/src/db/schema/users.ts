import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id")
    .primaryKey({ autoIncrement: true }),

  name: text("name")
    .notNull(),

  email: text("email")
    .notNull()
    .unique(),

  passwordHash: text("password_hash")
    .notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp_ms",
  }).notNull(),

  updatedAt: integer("updated_at", {
    mode: "timestamp_ms",
  }).notNull(),
});

export type User = InferSelectModel<typeof users>;

export type NewUser = InferInsertModel<typeof users>;