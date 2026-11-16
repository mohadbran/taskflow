import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ApiError } from "../../../api/client";
import { getTasks, updateTask } from "../task.api";
import type { Task } from "../task.types";
import { TaskList } from "../components/TaskList";
import { CreateTaskForm } from "../components/CreateTaskForm";

export function DashboardPage() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getTasks();
      setTasks(result);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load tasks. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function handleToggleTask(task: Task) {
    setIsUpdating(true);
    setError(null);

    try {
      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to update task. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function handleTaskCreated(task: Task) {
    setTasks((currentTasks) => [task, ...currentTasks]);
}

function handleTaskUpdated(updatedTask: Task) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    ),
  );
}

  async function handleLogout() {
    try {
      await logout();
    } catch {
      setError("Logout failed. Please try again.");
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            TaskFlow
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            My Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <CreateTaskForm onTaskCreated={handleTaskCreated} />

        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            Loading tasks...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onUpdated={handleTaskUpdated}
            isUpdating={isUpdating}
            />
        )}

        {!isLoading && (
          <button
            type="button"
            onClick={() => void loadTasks()}
            className="mt-6 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-white"
          >
            Refresh tasks
          </button>
        )}
      </section>
    </main>
  );
}