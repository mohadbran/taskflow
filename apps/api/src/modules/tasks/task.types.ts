import type { Task } from "../../db/schema/tasks.js";

export type TaskResponse = Pick<
  Task,
  | "id"
  | "title"
  | "description"
  | "completed"
  | "createdAt"
  | "updatedAt"
>;

export function toTaskResponse(
  task: Task,
): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}