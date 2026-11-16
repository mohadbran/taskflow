
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../../../api/client";
import { createTask } from "../task.api";
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "../schemas/task.schema";
import type { Task } from "../task.types";

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export function CreateTaskForm({
  onTaskCreated,
}: CreateTaskFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: CreateTaskFormValues) {
    setServerError(null);

    try {
      const task = await createTask({
        title: values.title,
        description: values.description?.trim() || undefined,
      });

      onTaskCreated(task);
      reset();
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Failed to create task. Please try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Create a Task
      </h3>

      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="task-title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="task-title"
          type="text"
          maxLength={200}
          placeholder="What needs to be done?"
          {...register("title")}
          aria-invalid={Boolean(errors.title)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="task-description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description (optional)
        </label>

        <textarea
          id="task-description"
          rows={3}
          maxLength={2000}
          placeholder="Add some details..."
          {...register("description")}
          aria-invalid={Boolean(errors.description)}
          className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
