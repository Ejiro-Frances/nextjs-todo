import localforage from "localforage";
import { type Task } from "@/types/types";
import { toast } from "sonner";

const TASKS_KEY = "cachedTasks";

export const saveTasksToStorage = async (data: { data: Task[]; meta: any }) => {
  try {
    await localforage.setItem(TASKS_KEY, data);
  } catch (error) {
    toast.error(`Error saving tasks: ${error}`);
  }
};

export const getTasksFromStorage = async (): Promise<{
  data: Task[];
  meta: any;
} | null> => {
  try {
    const cached = await localforage.getItem(TASKS_KEY);

    return cached as { data: Task[]; meta: any };
  } catch (error) {
    toast.error(`Error loading tasks: ${error}`);
    return null;
  }
};

export const clearTasksFromStorage = async () => {
  try {
    await localforage.removeItem(TASKS_KEY);
  } catch (error) {
    toast.error(`Error clearing tasks: ${error}`);
  }
};
