
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must be at most 200 characters"),

  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;


export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must be at most 200 characters"),

  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters"),
});

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
