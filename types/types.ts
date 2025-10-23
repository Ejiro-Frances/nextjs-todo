export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  priority: Priority;
  status: Status;
  archived: boolean;
  parentId: string | null;
  children: string | string[];
  tags: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EditableTaskFields = {
  name: string;
  description: string | null;
  priority: Priority;
  status: Status;
  tags: string | null;
};

export interface CreateTaskRequest {
  name: string;
  description?: string | null;
  tags?: string | null;
  priority?: Priority;
  status?: Status;
  archived?: boolean;
}

export interface createTaskResponse {
  id: string;
  name: string;
  description: null;
  start: null;
  end: null;
  duration: null;
  priority: Priority;
  status: Status;
  archived: boolean;
  isDefault: null;
  parentId: null;
  children: string;
  owner: null;
  tags: string;
  completedAt: null;
  createdAt: null;
  updatedAt: null;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string | null;
  tags?: string | null;
  priority?: Priority;
  status?: Status;
  archived?: boolean;
  completedAt?: string | null;
}

export interface TaskApiResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type SingleTaskApiResponse = {
  data: Task;
};

export interface EditTaskFormState {
  name: string;
  description: string;
  tags: string;
  priority: Priority;
  status: Status;
}
