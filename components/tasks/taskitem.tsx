import React from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";

import TaskStatusBadge from "./taskstatusbadge";
import EditTaskForm from "./edittaskform";
import type { Task, EditableTaskFields } from "@/types/types";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import {
  ChartNoAxesColumn,
  EllipsisVertical,
  PanelLeftOpen,
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  task: Task;
  isEditing: boolean;
  editForm: EditableTaskFields;
  onChange: (field: keyof EditableTaskFields, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isBusy: boolean;
  className?: string;
};

const TaskItem: React.FC<Props> = ({
  task,
  isEditing,
  editForm,
  onChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onToggle,
  isBusy,
  className,
}) => {
  return (
    <div className="relative bg-background rounded-xl mb-4 hover:shadow-2xs">
      {isEditing ? (
        <div className="bg-[rgba(0,0,0,0.6)] fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center">
          <EditTaskForm
            editForm={editForm}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
            className="bg-background rounded-md"
          />
        </div>
      ) : (
        <div className={cn("relative", className)}>
          <div className="pb-4 border-b-2">
            <div className="flex justify-between items-center">
              <h3
                className={`text-xl font-medium capitalize ${
                  task.status === "DONE"
                    ? "line-through text-gray-500 dark:text-gray-100"
                    : ""
                }`}
              >
                {task.name}
              </h3>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Checkbox
                      checked={task.status === "DONE"}
                      onCheckedChange={onToggle}
                      className="shrink-0 rounded-full"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Mark complete</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical size={24} className="p-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <button
                        onClick={onEdit}
                        disabled={isBusy}
                        className="flex items-center gap-2"
                      >
                        <Pencil size={18} />
                        <span>Edit</span>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button
                        onClick={onDelete}
                        disabled={isBusy}
                        className="flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/all-tasks/${task.id}`}
                        className="flex items-center gap-2"
                      >
                        <PanelLeftOpen />
                        <span>View task</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {task.description && (
              <p className="truncate text-sm tracking-normal capitalize text-gray-700 dark:text-gray-300 mt-1  max-w-[450px]">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 justify-center mt-3">
            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center text-xs">
                <ChartNoAxesColumn />
                <span className="capitalize">
                  {task.priority.toLowerCase()}
                </span>
              </div>

              {task.tags && (
                <span className="text-blue-800 dark:text-blue-200 font-semibold capitalize text-xs">
                  {task.tags}
                </span>
              )}
            </div>
            <TaskStatusBadge status={task.status} />
          </div>

          <div className="flex-1 ">
            <div className="flex justify-between">
              <div className="mt-4 flex flex-wrap gap-4 items-center text-xs text-gray-600 dark:text-gray-200">
                <span>
                  {new Date(task.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
