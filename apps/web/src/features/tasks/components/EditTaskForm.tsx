
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../../../api/client";
import { updateTask } from "../task.api";
import type { Task } from "../task.types";
import {
  updateTaskSchema,
  type UpdateTaskFormValues,
} from "../schemas/task.schema";

interface EditTaskFormProps {
  task: Task;
  onUpdated: (task: Task) => void;
  onCancel: () => void;
}

export function EditTaskForm({
  task,
  onUpdated,
  onCancel,
}: EditTaskFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
    },
  });

  async function onSubmit(values: UpdateTaskFormValues) {
    setServerError(null);

    try {
      const updatedTask = await updateTask(task.id, {
        title: values.title,
        description: values.description.trim() || null,
      });

      onUpdated(updatedTask);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Failed to update task. Please try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4"
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor={`edit-title-${task.id}`}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id={`edit-title-${task.id}`}
          type="text"
          maxLength={200}
          {...register("title")}
          aria-invalid={Boolean(errors.title)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`edit-description-${task.id}`}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id={`edit-description-${task.id}`}
          rows={3}
          maxLength={2000}
          {...register("description")}
          aria-invalid={Boolean(errors.description)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
