import localforage from "localforage";
import { toast } from "sonner";
import type { TaskApiResponse } from "@/types/types";

const TASKS_KEY = "cachedTasks";

export const saveTasksToStorage = async (data: TaskApiResponse) => {
  try {
    await localforage.setItem<TaskApiResponse>(TASKS_KEY, data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Error saving tasks: ${message}`);
  }
};

export const getTasksFromStorage =
  async (): Promise<TaskApiResponse | null> => {
    try {
      const cached = await localforage.getItem<TaskApiResponse>(TASKS_KEY);
      return cached ?? null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Error loading tasks: ${message}`);
      return null;
    }
  };

export const clearTasksFromStorage = async () => {
  try {
    await localforage.removeItem(TASKS_KEY);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Error clearing tasks: ${message}`);
  }
};
