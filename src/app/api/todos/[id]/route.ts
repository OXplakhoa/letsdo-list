import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '@/lib/middleware/api-handler';
import { updateTodoSchema } from '@/lib/validations/todo';
import type { UpdateTodoInput } from '@/lib/validations/todo';
import * as todoService from '@/lib/services/todo.service';

// GET /api/todos/:id — Get single todo
export const GET = apiHandler(
  async (
    _req: NextRequest,
    context: { params: Promise<{ id: string }> } | undefined
  ) => {
    const { id } = await context!.params;
    const todo = await todoService.getTodoById(id);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  }
);

// PATCH /api/todos/:id — Update todo (edit, toggle, change priority, restore)
export const PATCH = apiHandler(
  async (
    _req: NextRequest,
    context: { params: Promise<{ id: string }> } | undefined,
    { body }
  ) => {
    const { id } = await context!.params;
    const validatedBody = body as UpdateTodoInput;

    const todo = await todoService.updateTodo(id, validatedBody);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  },
  { bodySchema: updateTodoSchema }
);

// DELETE /api/todos/:id — Soft delete (set deletedAt)
export const DELETE = apiHandler(
  async (
    _req: NextRequest,
    context: { params: Promise<{ id: string }> } | undefined
  ) => {
    const { id } = await context!.params;
    const todo = await todoService.softDeleteTodo(id);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  }
);
