import { z } from "zod";

export const taskIdSchema = z.coerce
  .number()
  .int()
  .positive();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),

  description: z
    .string()
    .trim()
    .max(2000)
    .nullable()
    .optional(),

  completed: z.boolean().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000)
      .nullable()
      .optional(),

    completed: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
    },
  );

export const listTasksQuerySchema = z.object({
  completed: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  offset: z.coerce
    .number()
    .int()
    .min(0)
    .default(0),
});

export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>;

export type UpdateTaskInput = z.infer<
  typeof updateTaskSchema
>;

export type ListTasksQuery = z.infer<
  typeof listTasksQuerySchema
>;