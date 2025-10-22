// import api from "@/lib/api";

// export const getTasks = async (page = 1, limit = 10) => {
//   try {
//     const response = await api.get(`/tasks`, {
//       params: { page, limit },
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };

import api from "@/lib/api";
import {
  type CreateTaskRequest,
  type createTaskResponse,
  type UpdateTaskRequest,
  type TaskApiResponse,
  type SingleTaskApiResponse,
} from "@/types/types";

// get all tasks
export const getTasks = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
): Promise<TaskApiResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status && status !== "ALL") query.append("status", status);
  if (search?.trim()) query.append("search", search.trim());

  const response = await api.get(`/tasks/?${query.toString()}`);
  return response.data;
};

// get task by id
export const getTask = async (
  taskId: string
): Promise<SingleTaskApiResponse> => {
  const response = await api.get(`/tasks/${taskId}`);

  return response.data;
};

// create task
export const createTask = async (
  task: CreateTaskRequest
): Promise<createTaskResponse> => {
  const response = await api.post("/tasks", task);
  return response.data;
};

export const updateTask = async (
  taskId: string,
  updatedFields: UpdateTaskRequest
) => {
  const response = await api.patch(`/tasks/${taskId}`, updatedFields);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
