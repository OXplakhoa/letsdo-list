import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '@/lib/middleware/api-handler';
import { createTodoSchema, getTodosQuerySchema } from '@/lib/validations/todo';
import type { GetTodosQuery, CreateTodoInput } from '@/lib/validations/todo';
import * as todoService from '@/lib/services/todo.service';

// GET /api/todos — List todos with search, filter, sort, pagination
export const GET = apiHandler(
  async (_req: NextRequest, _context, { query }) => {
    const validatedQuery = query as GetTodosQuery;
    const result = await todoService.listTodos(validatedQuery);

    return NextResponse.json(result);
  },
  { querySchema: getTodosQuerySchema }
);

// POST /api/todos — Create a new todo
export const POST = apiHandler(
  async (_req: NextRequest, _context, { body }) => {
    const validatedBody = body as CreateTodoInput;
    const todo = await todoService.createTodo(validatedBody);

    return NextResponse.json(todo, { status: 201 });
  },
  { bodySchema: createTodoSchema }
);
