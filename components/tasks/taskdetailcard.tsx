"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import PriorityBadge from "./prioritybadge";
import TaskStatusBadge from "./taskstatusbadge";
import { type Task } from "@/types/types";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { Trash2, Pencil } from "lucide-react";

import { Button } from "../ui/button";
import TaskEditForm from "./taskeditform";
import { toast } from "sonner";

type TaskDetailsCardProps = {
  task: Task;
};

const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({ task }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();

  const {
    editingTask,
    editForms,
    handleEditTask,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteTask: originalHandleDeleteTask,
  } = useTaskOperations();

  const handleDeleteTask = async (taskId: string) => {
    try {
      await originalHandleDeleteTask(taskId);
      toast.success("Task deleted successfully");
      router.push("/all-tasks");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error deleting task: ${error.message || error}`);
      } else {
        toast.error("An unexpected error occurred while deleting the task.");
      }
    }
  };

  return (
    <div className="border border-[#E4E4E7] m-4 p-4 md:p-8 my-28 rounded-md shadow">
      {editingTask === task.id ? (
        <TaskEditForm
          editForm={editForms[task.id]}
          onChange={(field, value) => handleEditChange(task.id, field, value)}
          onSave={() => handleSaveEdit(task.id)}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div>
          <h2 className="text-xl md:text-[2rem] font-medium text-[#2B7FFF] capitalize">
            {task.name}
          </h2>

          {task.description && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {task.description}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <PriorityBadge priority={task.priority} label="Priority" />
            <span className="md:justify-self-end text-xs text-[#888888]">
              Created:{" "}
              {format(new Date(task.createdAt), "MMM d, yyyy • h:mm a")}
            </span>

            <TaskStatusBadge status={task.status} label="Status" />

            {task.tags && (
              <span className="md:justify-self-end w-fit text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-md capitalize">
                Tag: {task.tags}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-8 mt-10">
            <Button variant="outline" onClick={() => handleEditTask(task)}>
              <Pencil size={18} />
              <span>Edit</span>
            </Button>

            <Button variant="destructive" onClick={() => setDeleteModal(true)}>
              <Trash2 size={18} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-md p-5">
            <p>Are you sure you want to delete?</p>

            <div className="flex gap-4 mt-5">
              <Button
                variant="outline"
                onClick={() => setDeleteModal(false)}
                className="text-xs"
              >
                No, cancel
              </Button>

              <Button
                onClick={() => handleDeleteTask(task.id)}
                variant="destructive"
                className="text-xs"
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsCard;
