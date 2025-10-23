import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTask, updateTask, deleteTask } from "@/services/taskservices";
import { saveTasksToStorage } from "@/lib/storage";
import {
  type Task,
  type UpdateTaskRequest,
  type EditTaskFormState,
  type EditableTaskFields,
  type CreateTaskRequest,
  type TaskApiResponse,
} from "@/types/types";
import { useNotificationStore } from "@/stores/useNotificationstore";

export const useTaskOperations = (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const queryKey = ["tasks", params];

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForms, setEditForms] = useState<
    Partial<Record<string, EditableTaskFields>>
  >({});
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // ✅ Type-safe cache + localforage update
  const updateCacheAndStorage = async (
    updater: (old: Task[]) => Task[]
  ): Promise<void> => {
    const oldData = queryClient.getQueryData<TaskApiResponse>(queryKey);

    if (oldData) {
      const newData: TaskApiResponse = {
        data: updater(oldData.data),
        meta: oldData.meta,
      };

      queryClient.setQueryData<TaskApiResponse>(queryKey, newData);
      await saveTasksToStorage(newData);
    }
  };

  // ✅ Create task mutation
  const createMutation = useMutation({
    mutationFn: (newTask: CreateTaskRequest) => createTask(newTask),
    onSuccess: async (created) => {
      const newTask: Task = {
        ...created,
        createdAt: created.createdAt ?? new Date().toISOString(),
        updatedAt: created.updatedAt ?? new Date().toISOString(),
      };

      await updateCacheAndStorage((old) => [newTask, ...old]);
      addNotification({
        type: "success",
        message: `Task "${created.name}" created successfully`,
      });
    },
  });

  // ✅ Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
      updateTask(id, updates),
    onSuccess: async (updated) => {
      await updateCacheAndStorage((old) =>
        old.map((task) => (task.id === updated.id ? updated : task))
      );
      addNotification({
        type: "info",
        message: `Task "${updated.name}" updated successfully`,
      });
    },
  });

  // ✅ Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: async (_, id) => {
      await updateCacheAndStorage((old) => old.filter((t) => t.id !== id));
      addNotification({ type: "error", message: "Task deleted" });
    },
  });

  // ✅ Toggle status (optimistic update)
  const handleToggleTask = async (task: Task) => {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    const newCompletedAt =
      newStatus === "DONE" ? new Date().toISOString() : null;

    await updateCacheAndStorage((old) =>
      old.map((t) =>
        t.id === task.id
          ? { ...t, status: newStatus, completedAt: newCompletedAt }
          : t
      )
    );

    addNotification({
      type: "info",
      message: `Task "${task.name}" marked as ${newStatus}`,
    });

    try {
      await updateMutation.mutateAsync({
        id: task.id,
        updates: { status: newStatus, completedAt: newCompletedAt },
      });
      toast.success("Synced successfully");
    } catch {
      toast.error("Offline update only. Sync will retry later.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      await deleteMutation.mutateAsync(taskId);
      toast.success("Task deleted");
    } finally {
      setDeletingTaskId(null);
    }
  };

  // ✅ Start editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditForms((prev) => ({
      ...prev,
      [task.id]: {
        name: task.name,
        description: task.description || "",
        tags: task.tags || "",
        priority: task.priority,
        status: task.status,
      },
    }));
  };

  // ✅ Save edits
  const handleSaveEdit = async (taskId: string) => {
    const editForm = editForms[taskId];
    if (!editForm) return;

    setUpdatingTaskId(taskId);

    const updates: UpdateTaskRequest = {
      name: editForm.name.trim(),
      description: editForm.description?.trim() || null,
      tags: editForm.tags?.trim() || null, // ✅ backend expects string | null
      priority: editForm.priority,
      status: editForm.status,
    };

    try {
      await updateMutation.mutateAsync({ id: taskId, updates });
      setEditingTask(null);
      setEditForms((prev) => {
        const { [taskId]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      toast.error("Failed to save task changes.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleCancelEdit = () => {
    if (editingTask) {
      setEditForms((prev) => {
        const { [editingTask]: _, ...rest } = prev;
        return rest;
      });
      setEditingTask(null);
    }
  };

  const handleEditChange = (
    id: string,
    field: keyof EditTaskFormState,
    value: string
  ) => {
    setEditForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id]!,
        [field]: value,
      },
    }));
  };

  return {
    editingTask,
    editForms,
    updatingTaskId,
    deletingTaskId,
    setEditForms,

    createMutation,
    updateMutation,
    deleteMutation,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleEditChange,
  };
};

// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { createTask, updateTask, deleteTask } from "@/services/taskservices";
// import { saveTasksToStorage } from "@/lib/storage";
// import {
//   type Task,
//   type UpdateTaskRequest,
//   type EditTaskFormState,
//   type CreateTaskRequest,
//   TaskApiResponse,
// } from "@/types/types";
// import { useNotificationStore } from "@/stores/useNotificationstore";

// type CachedTasksData = {
//   data: Task[];
//   meta: {
//     cached: boolean;
//     [key: string]: unknown;
//   };
// };

// export const useTaskOperations = (params: {
//   page: number;
//   limit: number;
//   status?: string;
//   search?: string;
// }) => {
//   const queryClient = useQueryClient();
//   const { addNotification } = useNotificationStore();
//   const queryKey = ["tasks", params];

//   const [editingTask, setEditingTask] = useState<string | null>(null);
//   // const [editForms, setEditForms] = useState<Record<string, EditTaskFormState>>(
//   // {}
//   // );
//   const [editForms, setEditForms] = useState<
//     Partial<Record<string, EditTaskFormState>>
//   >({});

//   const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
//   const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

//   //  let's add here
//   const updateCacheAndStorage = async (updater: (old: Task[]) => Task[]) => {
//     const oldData = queryClient.getQueryData<TaskApiResponse>(queryKey);

//     if (oldData?.data) {
//       const newData = {
//         data: updater(oldData.data),
//         meta: oldData.meta,
//       };

//       queryClient.setQueryData(queryKey, newData);
//       await saveTasksToStorage(newData);
//     }
//   };

//   // create task
//   const createMutation = useMutation({
//     mutationFn: (newTask: CreateTaskRequest) => createTask(newTask),
//     onSuccess: async (created) => {
//       await updateCacheAndStorage((old) => [
//         created as unknown as Task,
//         ...old,
//       ]);
//       addNotification({
//         type: "success",
//         message: `Task "${created.name}" created successfully`,
//       });
//     },
//   });

//   // --- update task ---
//   const updateMutation = useMutation({
//     mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
//       updateTask(id, updates),
//     onSuccess: async (updated) => {
//       await updateCacheAndStorage((old) =>
//         old.map((task) => (task.id === updated.id ? updated : task))
//       );
//       addNotification({
//         type: "info",
//         message: `Task "${updated.name}" updated successfully`,
//       });
//     },
//   });

//   // --- delete task ---
//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deleteTask(id),
//     onSuccess: async (_, id) => {
//       await updateCacheAndStorage((old) =>
//         old.filter((task) => task.id !== id)
//       );
//       addNotification({ type: "error", message: "Task deleted" });
//     },
//   });

//   // const handleToggleTask = async (task: Task) => {
//   //   const newStatus = task.status === "DONE" ? "TODO" : "DONE";
//   //   const newCompletedAt =
//   //     newStatus === "DONE" ? new Date().toISOString() : null;

//   //   updateTaskLocally(task.id, {
//   //     status: newStatus,
//   //     completedAt: newCompletedAt,
//   //   });

//   //   try {
//   //     await updateMutation.mutateAsync({
//   //       id: task.id,
//   //       updates: {
//   //         status: newStatus,
//   //         completedAt: newCompletedAt,
//   //       },
//   //     });
//   //   } catch {
//   //     updateTaskLocally(task.id, {
//   //       status: task.status,
//   //       completedAt: task.completedAt,
//   //     });
//   //     toast.error("Failed to update task status.");
//   //   }
//   // };

//   const handleToggleTask = async (task: Task) => {
//     const newStatus = task.status === "DONE" ? "TODO" : "DONE";
//     const newCompletedAt =
//       newStatus === "DONE" ? new Date().toISOString() : null;

//     // 1. Update cache + storage instantly (offline-friendly)
//     await updateCacheAndStorage((old) =>
//       old.map((t) =>
//         t.id === task.id
//           ? { ...t, status: newStatus, completedAt: newCompletedAt }
//           : t
//       )
//     );

//     // 2. Notify user immediately
//     addNotification({
//       type: "info",
//       message: `Task "${task.name}" marked as ${newStatus}`,
//     });

//     // 3. Try to sync with backend in background
//     try {
//       await updateMutation.mutateAsync({
//         id: task.id,
//         updates: {
//           status: newStatus,
//           completedAt: newCompletedAt,
//         },
//       });
//       toast.success("successful");
//     } catch (err) {
//       // If sync fails, keep offline change but notify user
//       toast.error("Task status updated offline. Will sync when online.");
//     }
//   };

//   const handleDeleteTask = async (taskId: string) => {
//     setDeletingTaskId(taskId);
//     try {
//       await deleteMutation.mutateAsync(taskId);
//       toast.success("Task deleted");
//     } finally {
//       setDeletingTaskId(null);
//     }
//   };

//   const handleEditTask = (task: Task) => {
//     setEditingTask(task.id);
//     setEditForms((prev) => ({
//       ...prev,
//       [task.id]: {
//         name: task.name,
//         description: task.description || "",
//         tags: task.tags || "",
//         priority: task.priority,
//         status: task.status,
//       },
//     }));
//   };

//   const handleSaveEdit = async (taskId: string) => {
//     const editForm = editForms[taskId];
//     if (!editForm) return;

//     setUpdatingTaskId(taskId);

//     const updates: UpdateTaskRequest = {
//       name: editForm.name.trim(),
//       description: editForm.description.trim() || null,
//       tags: editForm.tags || null,
//       priority: editForm.priority,
//       status: editForm.status,
//     };

//     try {
//       await updateMutation.mutateAsync({ id: taskId, updates });
//       setEditingTask(null);
//       setEditForms((prev) => {
//         const { [taskId]: _, ...rest } = prev;
//         return rest;
//       });
//     } catch {
//       toast.error("Failed to save task changes.");
//     } finally {
//       setUpdatingTaskId(null);
//     }
//   };

//   const handleCancelEdit = () => {
//     if (editingTask) {
//       setEditForms((prev) => {
//         const { [editingTask]: _, ...rest } = prev;
//         return rest;
//       });
//       setEditingTask(null);
//     }
//   };

//   const handleEditChange = (id: string, field: string, value: string) => {
//     setEditForms((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value,
//       },
//     }));
//   };

//   return {
//     // State
//     editingTask,
//     editForms,
//     updatingTaskId,
//     deletingTaskId,
//     setEditForms,

//     // Mutations
//     createMutation,
//     updateMutation,
//     deleteMutation,

//     // Mutation States
//     isCreating: createMutation.isPending,
//     isUpdating: updateMutation.isPending,
//     isDeleting: deleteMutation.isPending,

//     // Handlers
//     handleToggleTask,
//     handleDeleteTask,
//     handleEditTask,
//     handleSaveEdit,
//     handleCancelEdit,
//     handleEditChange,
//   };
// };
