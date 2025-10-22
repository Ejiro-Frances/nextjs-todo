"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskservices";
import type { Task } from "@/types/types";
import { Button } from "../ui/button";
import TaskItem from "./taskitem";

type EditableTaskFields = {
  name: string;
  description: string | null;
  priority: Task["priority"];
  status: Task["status"];
  tags: string[] | null;
};

type Props = {
  tasks?: Task[]; // Optional if fetched from API instead of passed down
  editingTaskId: string | null;
  editForms: Record<string, EditableTaskFields>;
  onEditChange: (
    id: string,
    field: keyof EditableTaskFields,
    value: string
  ) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (task: Task) => void;
  updatingTaskId: string | null;
  deletingTaskId: string | null;
};

// Custom hook for fetching tasks
const useTasks = (page = 1) => {
  return useQuery({
    queryKey: ["tasks", page],
    queryFn: () => getTasks(page),
  });
};

export const TaskList: React.FC<Props> = ({
  editingTaskId,
  editForms,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onEdit,
  onDelete,
  onToggle,
  updatingTaskId,
  deletingTaskId,
}) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTasks(page);

  if (isLoading) return <p className="text-center">Loading tasks...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error fetching tasks.</p>;

  const fetchedTasks: Task[] = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {fetchedTasks.length === 0 ? (
        <p className="text-center">No tasks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 md:gap-10 mx-5 md:mx-10">
          {fetchedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isEditing={editingTaskId === task.id}
              editForm={editForms[task.id]}
              onChange={(field, value) => onEditChange(task.id, field, value)}
              onSave={() => onSaveEdit(task.id)}
              onCancel={onCancelEdit}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onToggle={() => onToggle(task)}
              isBusy={updatingTaskId === task.id || deletingTaskId === task.id}
              className={`h-full px-4 py-5 border border-l-8 rounded-xl ${
                task.status === "DONE"
                  ? "border-[#0EA420]"
                  : task.status === "TODO"
                  ? "border-[#F42D2D]"
                  : "border-purple-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
