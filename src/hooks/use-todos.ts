'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Todo, PaginatedResponse, TodosQuery } from '@/types/todo';

const API_BASE = '/api/todos';

interface UseTodosOptions {
  initialQuery?: TodosQuery;
}

interface UseTodosReturn {
  todos: Todo[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  query: TodosQuery;
  // Actions
  setQuery: (query: Partial<TodosQuery>) => void;
  createTodo: (data: { title: string; description?: string; priority?: string }) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<{ undo: () => Promise<void> }>;
  refreshTodos: () => Promise<void>;
}

export function useTodos(options?: UseTodosOptions): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQueryState] = useState<TodosQuery>({
    search: '',
    status: 'all',
    sort: 'newest',
    page: 1,
    limit: 20,
    ...options?.initialQuery,
  });

  // Track in-flight requests to ignore stale responses
  const requestIdRef = useRef(0);

  const fetchTodos = useCallback(async (currentQuery: TodosQuery) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentQuery.search) params.set('search', currentQuery.search);
      if (currentQuery.status) params.set('status', currentQuery.status);
      if (currentQuery.sort) params.set('sort', currentQuery.sort);
      if (currentQuery.page) params.set('page', String(currentQuery.page));
      if (currentQuery.limit) params.set('limit', String(currentQuery.limit));

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch todos');

      const data: PaginatedResponse<Todo> = await res.json();

      // Ignore stale responses
      if (requestId !== requestIdRef.current) return;

      setTodos(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch todos whenever query changes
  useEffect(() => {
    fetchTodos(query);
  }, [query, fetchTodos]);

  const setQuery = useCallback((partial: Partial<TodosQuery>) => {
    setQueryState((prev) => ({
      ...prev,
      ...partial,
      // Reset to page 1 when filters change (but not when page itself changes)
      page: partial.page ?? 1,
    }));
  }, []);

  const refreshTodos = useCallback(async () => {
    await fetchTodos(query);
  }, [query, fetchTodos]);

  const createTodo = useCallback(
    async (data: { title: string; description?: string; priority?: string }) => {
      try {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create todo');
        }

        // Refresh the list after creation
        await fetchTodos(query);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create todo');
        throw err;
      }
    },
    [query, fetchTodos]
  );

  const updateTodo = useCallback(
    async (id: string, data: Partial<Todo>) => {
      // Optimistic update
      const previousTodos = [...todos];

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo))
      );

      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error('Failed to update todo');
        }

        // Refresh to get server state
        await fetchTodos(query);
      } catch (err) {
        // Rollback on error
        setTodos(previousTodos);
        setError(err instanceof Error ? err.message : 'Failed to update todo');
        throw err;
      }
    },
    [todos, query, fetchTodos]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      // Optimistic update
      const previousTodos = [...todos];
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );

      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !todo.completed }),
        });

        if (!res.ok) {
          throw new Error('Failed to toggle todo');
        }
      } catch (err) {
        // Rollback on error
        setTodos(previousTodos);
        setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      // Optimistic update — remove from the list
      const previousTodos = [...todos];
      const deletedTodo = todos.find((t) => t.id === id);

      setTodos((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => prev - 1);

      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete todo');
        }

        // Return undo function for the toast
        return {
          undo: async () => {
            // Restore the soft-deleted todo
            const restoreRes = await fetch(`${API_BASE}/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deletedAt: null }),
            });

            if (!restoreRes.ok) {
              throw new Error('Failed to undo delete');
            }

            // Refresh the list
            await fetchTodos(query);
          },
        };
      } catch (err) {
        // Rollback on error
        setTodos(previousTodos);
        setTotal((prev) => prev + 1);
        setError(err instanceof Error ? err.message : 'Failed to delete todo');
        return {
          undo: async () => {},
        };
      }
    },
    [todos, query, fetchTodos]
  );

  return {
    todos,
    total,
    page: query.page ?? 1,
    totalPages,
    isLoading,
    error,
    query,
    setQuery,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos,
  };
}
