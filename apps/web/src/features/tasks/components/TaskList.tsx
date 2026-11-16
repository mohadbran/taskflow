
import type { Task } from "../task.types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onUpdated: (task: Task) => void;
  isUpdating: boolean;
}

export function TaskList({
  tasks,
  onToggle,
  onUpdated,
  isUpdating,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="font-medium text-gray-700">No tasks yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Create your first task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${isUpdating ? "opacity-70" : ""}`}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  );
}
