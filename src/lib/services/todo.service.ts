import { prisma } from '@/lib/db';
import { Prisma } from '@/app/generated/prisma/client';
import type { CreateTodoInput, UpdateTodoInput, GetTodosQuery } from '@/lib/validations/todo';

/**
 * Service layer for Todo CRUD operations.
 * Contains all business logic — no HTTP or framework concerns here.
 */

// Priority ordering for "priority" sort mode
const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export async function listTodos(query: GetTodosQuery) {
  const { search, status, sort, page, limit } = query;
  const skip = (page - 1) * limit;

  // Build the WHERE clause
  const where: Prisma.TodoWhereInput = {
    // Always exclude soft-deleted todos
    deletedAt: null,
  };

  // Search filter — case-insensitive search on title
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Status filter
  if (status === 'active') {
    where.completed = false;
  } else if (status === 'completed') {
    where.completed = true;
  }

  // Build sort order
  let orderBy: Prisma.TodoOrderByWithRelationInput[];
  switch (sort) {
    case 'oldest':
      orderBy = [{ createdAt: 'asc' }];
      break;
    case 'priority':
      // Prisma doesn't natively sort enums by custom order,
      // so we sort by priority field (alphabetical works for enum names: HIGH < LOW < MEDIUM isn't ideal)
      // Instead, we'll use raw ordering. For now use createdAt as secondary.
      orderBy = [{ priority: 'asc' }, { createdAt: 'desc' }];
      break;
    case 'newest':
    default:
      orderBy = [{ createdAt: 'desc' }];
      break;
  }

  const [data, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.todo.count({ where }),
  ]);

  // If sorting by priority, re-sort client-side using our custom order
  if (sort === 'priority') {
    data.sort((a, b) => {
      const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (diff !== 0) return diff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTodoById(id: string) {
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return null;
  }

  return todo;
}

export async function createTodo(input: CreateTodoInput) {
  // Assign position as max(position) + 1 for ordering
  const maxPosition = await prisma.todo.aggregate({
    _max: { position: true },
    where: { deletedAt: null },
  });

  const position = (maxPosition._max.position ?? -1) + 1;

  return prisma.todo.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      priority: input.priority ?? 'MEDIUM',
      position,
    },
  });
}

export async function updateTodo(id: string, input: UpdateTodoInput) {
  // First check if the todo exists
  const existing = await prisma.todo.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.todo.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.completed !== undefined && { completed: input.completed }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.position !== undefined && { position: input.position }),
      ...(input.deletedAt !== undefined && {
        deletedAt: input.deletedAt === null ? null : new Date(input.deletedAt),
      }),
    },
  });
}

export async function toggleTodo(id: string) {
  const existing = await prisma.todo.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.todo.update({
    where: { id },
    data: { completed: !existing.completed },
  });
}

export async function softDeleteTodo(id: string) {
  const existing = await prisma.todo.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.todo.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreTodo(id: string) {
  const existing = await prisma.todo.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.todo.update({
    where: { id },
    data: { deletedAt: null },
  });
}
