import { relations } from "drizzle-orm";

import { users } from "./schema/users.js";
import { sessions } from "./schema/sessions.js";
import { tasks } from "./schema/tasks.js";

export const usersRelations = relations(
  users,
  ({ many }) => ({
    sessions: many(sessions),
    tasks: many(tasks),
  }),
);

export const sessionsRelations = relations(
  sessions,
  ({ one }) => ({
    user: one(users, {
      fields: [sessions.userId],
      references: [users.id],
    }),
  }),
);

export const tasksRelations = relations(
  tasks,
  ({ one }) => ({
    user: one(users, {
      fields: [tasks.userId],
      references: [users.id],
    }),
  }),
);