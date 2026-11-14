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

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id")
      .primaryKey({ autoIncrement: true }),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    title: text("title")
      .notNull(),

    description: text("description"),

    completed: integer("completed", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    createdAt: integer("created_at", {
      mode: "timestamp_ms",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp_ms",
    }).notNull(),
  },
  (table) => [
    index("tasks_user_id_idx")
      .on(table.userId),
  ],
);

export type Task = InferSelectModel<typeof tasks>;

export type NewTask = InferInsertModel<typeof tasks>;