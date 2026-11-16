
import { apiFetch } from "../../api/client";
import type {
  CreateTaskInput,
  Task,
  TaskResponse,
  TasksResponse,
  UpdateTaskInput,
} from "./task.types";

const TASKS_ENDPOINT = "/tasks";

export async function getTasks(): Promise<Task[]> {
  const response = await apiFetch<TasksResponse>(TASKS_ENDPOINT);
  return response.data;
}

export async function getTask(id: string): Promise<Task> {
  const response = await apiFetch<TaskResponse>(
    `${TASKS_ENDPOINT}/${id}`,
  );

  return response.data;
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const response = await apiFetch<TaskResponse>(TASKS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await apiFetch<TaskResponse>(
    `${TASKS_ENDPOINT}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`${TASKS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}
