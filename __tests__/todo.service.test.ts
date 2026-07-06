import { describe, test, expect, beforeEach, vi } from 'vitest';
import * as todoService from '../src/lib/services/todo.service';
import { prisma } from '../src/lib/db';
import type { CreateTodoInput } from '../src/types/todo';

// Mock the prisma client
vi.mock('../src/lib/db', () => ({
  prisma: {
    todo: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

describe('TodoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('createTodo — saves with correct defaults (completed=false, priority=MEDIUM)', async () => {
    const input: CreateTodoInput = {
      title: 'Test Todo',
    };

    const mockMaxPosition = { _max: { position: null } };
    vi.mocked(prisma.todo.aggregate).mockResolvedValue(mockMaxPosition as any);
    
    const mockCreated = {
      id: '1',
      title: 'Test Todo',
      description: null,
      completed: false,
      priority: 'MEDIUM' as const,
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    vi.mocked(prisma.todo.create).mockResolvedValue(mockCreated);

    const result = await todoService.createTodo(input);

    expect(prisma.todo.aggregate).toHaveBeenCalledWith({
      _max: { position: true },
      where: { deletedAt: null },
    });
    
    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Todo',
        description: null,
        priority: 'MEDIUM',
        position: 0,
      },
    });
    
    expect(result).toEqual(mockCreated);
  });

  test('softDeleteTodo — sets deletedAt to current timestamp', async () => {
    const mockExisting = { id: '1', completed: false } as any;
    vi.mocked(prisma.todo.findUnique).mockResolvedValue(mockExisting);
    
    vi.mocked(prisma.todo.update).mockImplementation((args: any) => {
      return Promise.resolve({ ...mockExisting, ...args.data });
    });

    const result = await todoService.softDeleteTodo('1');

    expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { deletedAt: expect.any(Date) },
    });
    expect(result?.deletedAt).toBeInstanceOf(Date);
  });

  test('restoreTodo — clears deletedAt back to null', async () => {
    const mockExisting = { id: '1', deletedAt: new Date() } as any;
    vi.mocked(prisma.todo.findUnique).mockResolvedValue(mockExisting);
    
    vi.mocked(prisma.todo.update).mockImplementation((args: any) => {
      return Promise.resolve({ ...mockExisting, ...args.data });
    });

    const result = await todoService.restoreTodo('1');

    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { deletedAt: null },
    });
    expect(result?.deletedAt).toBeNull();
  });

  test('listTodos — excludes soft-deleted todos', async () => {
    vi.mocked(prisma.todo.findMany).mockResolvedValue([]);
    vi.mocked(prisma.todo.count).mockResolvedValue(0);

    await todoService.listTodos({ page: 1, limit: 10 });

    expect(prisma.todo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });

  test('toggleTodo — flips completed boolean', async () => {
    const mockExisting = { id: '1', completed: false } as any;
    vi.mocked(prisma.todo.findUnique).mockResolvedValue(mockExisting);
    
    vi.mocked(prisma.todo.update).mockImplementation((args: any) => {
      return Promise.resolve({ ...mockExisting, ...args.data });
    });

    const result = await todoService.toggleTodo('1');

    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { completed: true },
    });
    expect(result?.completed).toBe(true);
  });
});
