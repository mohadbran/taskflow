import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { users } from "./users.js";

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id")
      .primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    expiresAt: integer("expires_at", {
      mode: "timestamp_ms",
    }).notNull(),

    createdAt: integer("created_at", {
      mode: "timestamp_ms",
    }).notNull(),
  },
  (table) => [
    index("sessions_user_id_idx")
      .on(table.userId),
  ],
);

export type Session =
  InferSelectModel<typeof sessions>;

export type NewSession =
  InferInsertModel<typeof sessions>;