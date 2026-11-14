import { db } from "./index.js";
import { users } from "./schema/users.js";
import { tasks } from "./schema/tasks.js";

const now = new Date();

const [user] = await db
  .insert(users)
  .values({
    name: "Demo User",
    email: "demo@example.com",
    passwordHash: "not-a-real-password-hash",
    createdAt: now,
    updatedAt: now,
  })
  .returning();

await db.insert(tasks).values([
  {
    userId: user.id,
    title: "Learn TypeScript",
    description: "Understand TypeScript fundamentals.",
    completed: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: user.id,
    title: "Learn Drizzle",
    description: "Build a CRUD API with Drizzle ORM.",
    completed: false,
    createdAt: now,
    updatedAt: now,
  },
]);

console.log("Database seeded successfully.");