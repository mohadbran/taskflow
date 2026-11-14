import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../../db/index.js";
import { tasks } from "../../db/schema/tasks.js";
import { AppError } from "../../lib/app-error.js";

import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from "./task.schemas.js";

export async function createTask(
  userId: number,
  input: CreateTaskInput,
) {
  const now = new Date();

  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title: input.title,
      description: input.description ?? null,
      completed: input.completed ?? false,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!task) {
    throw new AppError(
      500,
      "TASK_CREATE_FAILED",
      "The task could not be created.",
    );
  }

  return task;
}

export async function listTasks(
  userId: number,
  query: ListTasksQuery,
) {
  const userCondition = eq(
    tasks.userId,
    userId,
  );

  const whereCondition =
    query.completed === undefined
      ? userCondition
      : and(
          userCondition,
          eq(tasks.completed, query.completed),
        );

  return db
    .select()
    .from(tasks)
    .where(whereCondition)
    .orderBy(desc(tasks.createdAt))
    .limit(query.limit)
    .offset(query.offset);
}

export async function getTask(
  userId: number,
  taskId: number,
) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.userId, userId),
      ),
    )
    .limit(1);

  if (!task) {
    throw new AppError(
      404,
      "TASK_NOT_FOUND",
      "The requested task was not found.",
    );
  }

  return task;
}

export async function updateTask(
  userId: number,
  taskId: number,
  input: UpdateTaskInput,
) {
  const [task] = await db
    .update(tasks)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.userId, userId),
      ),
    )
    .returning();

  if (!task) {
    throw new AppError(
      404,
      "TASK_NOT_FOUND",
      "The requested task was not found.",
    );
  }

  return task;
}

export async function deleteTask(
  userId: number,
  taskId: number,
) {
  const [deletedTask] = await db
    .delete(tasks)
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.userId, userId),
      ),
    )
    .returning({
      id: tasks.id,
    });

  if (!deletedTask) {
    throw new AppError(
      404,
      "TASK_NOT_FOUND",
      "The requested task was not found.",
    );
  }

  return deletedTask;
}