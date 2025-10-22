"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskservices";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { paginationConfig } from "@/constants/pagination-config";
import { getTasksFromStorage, saveTasksToStorage } from "@/lib/storage";
import { useNotificationStore } from "@/stores/useNotificationstore";

import Header from "@/components/header";
import TaskList from "@/components/tasks/tasklist";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationControls from "@/components/paginationcontrols";
import TaskFormModal from "@/components/tasks/taskmodal";

const AllTasks = () => {
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "TODO" | "IN_PROGRESS" | "DONE"
  >("ALL");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(
    paginationConfig.DEFAULT_TASKS_PER_PAGE
  );

  const {
    editingTask,
    editForms,
    setEditForms,
    updatingTaskId,
    deletingTaskId,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    createMutation,
    deleteMutation,
    updateMutation,
  } = useTaskOperations({
    page: currentPage,
    limit: tasksPerPage,
    status: activeFilter,
    search: debouncedSearch,
  });

  // ✅ Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ Fetch tasks
  const { data: taskResponse, isLoading } = useQuery({
    queryKey: [
      "tasks",
      currentPage,
      tasksPerPage,
      activeFilter,
      debouncedSearch,
    ],
    queryFn: async () => {
      try {
        const response = await getTasks(
          currentPage,
          tasksPerPage,
          activeFilter,
          debouncedSearch
        );
        await saveTasksToStorage({
          data: response.data,
          meta: response.meta ?? {
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
        return response;
      } catch (error) {
        const cached = await getTasksFromStorage();
        if (cached) {
          addNotification({
            type: "warning",
            message: "You are offline, showing cached tasks",
          });
          return cached;
        }
        throw new Error("Unable to fetch tasks.");
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const tasks = taskResponse?.data ?? [];
  const meta = taskResponse?.meta;

  const paginationData = useMemo(() => {
    return {
      currentTasks: tasks,
      totalPages: meta?.totalPages ?? 1,
      hasNextPage: meta?.hasNextPage ?? false,
      hasPreviousPage: meta?.hasPreviousPage ?? false,
    };
  }, [tasks, meta]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Add Task Button */}
      <div className="flex justify-end m-10">
        <Button onClick={() => setIsModalOpen(true)}>Add Task</Button>
      </div>

      {/* Add Task Modal */}
      <TaskFormModal
        onCreateTask={createMutation.mutateAsync}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />

      <main className="py-10 w-full">
        {/* Loading Skeleton */}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-28 w-full rounded-xl bg-black/10 dark:bg-gray-500 mb-4"
            />
          ))
        ) : paginationData.currentTasks.length > 0 ? (
          <TaskList
            tasks={paginationData.currentTasks}
            editingTaskId={editingTask}
            editForms={editForms}
            onEditChange={(id, field, value) =>
              setEditForms((prev) => ({
                ...prev,
                [id]: { ...prev[id], [field]: value },
              }))
            }
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
            updatingTaskId={updatingTaskId}
            deletingTaskId={deletingTaskId}
          />
        ) : (
          <div className="text-center text-gray-500 py-6">
            {debouncedSearch
              ? `No tasks found matching "${debouncedSearch}".`
              : `No ${activeFilter.toLowerCase()} tasks.`}
          </div>
        )}

        {/* Pagination */}
        {paginationData.totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
};

export default AllTasks;
