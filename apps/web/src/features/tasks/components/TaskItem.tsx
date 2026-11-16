
import { useState } from "react";
import type { Task } from "../task.types";
import { EditTaskForm } from "./EditTaskForm";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onUpdated: (task: Task) => void;
}

export function TaskItem({
  task,
  onToggle,
  onUpdated,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditTaskForm
        task={task}
        onUpdated={(updatedTask) => {
          onUpdated(updatedTask);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        className="mt-1 h-4 w-4 cursor-pointer"
        aria-label={`Mark ${task.title} as ${
          task.completed ? "incomplete" : "complete"
        }`}
      />

      <div className="min-w-0 flex-1">
        <h3
          className={`font-medium ${
            task.completed
              ? "text-gray-400 line-through"
              : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
            {task.description}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-400">
          {task.completed ? "Completed" : "Pending"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        aria-label={`Edit ${task.title}`}
      >
        Edit
      </button>
    </article>
  );
}
