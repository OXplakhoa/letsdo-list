// Shared TypeScript types/interfaces for the Todo app

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  position?: number;
  deletedAt?: string | null;
}

export interface TodosQuery {
  search?: string;
  status?: 'all' | 'active' | 'completed';
  sort?: 'newest' | 'oldest' | 'priority';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  errors?: Array<{ message: string; path: string[] }>;
}
