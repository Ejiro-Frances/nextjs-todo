"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskservices";
import type { Task } from "@/types/types";
import { Button } from "../ui/button";

export const TaskList = () => {
  const useTasks = (page = 1) => {
    return useQuery({
      queryKey: ["tasks", page],
      queryFn: () => getTasks(page),
      //   placeholderData: keepPreviousData,
    });
  };

  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTasks(page);

  if (isLoading) return <p className="text-center">Loading tasks...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error fetching tasks.</p>;

  const tasks = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task: Task) => (
            <li
              key={task.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h2 className="font-semibold text-lg">{task.title}</h2>
              <p className="text-sm text-gray-500">{task.content}</p>
              <p className="text-xs text-gray-400">Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => p - 1)}
          disabled={!meta?.hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={!meta?.hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TaskList;
