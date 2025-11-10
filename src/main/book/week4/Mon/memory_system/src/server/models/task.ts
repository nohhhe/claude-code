export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  version?: number;
}

export interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

export interface TaskListResponse {
  success: boolean;
  data?: Task[];
  error?: string;
}