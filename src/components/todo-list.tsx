'use client';

import React from 'react';
import { TodoItem } from '@/components/todo-item';
import type { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<{ undo: () => Promise<void> }>;
}

const PRIORITY_SECTIONS = [
  {
    key: 'HIGH' as const,
    label: '🔥 High Priority',
    color: '#FF69B4',
    bgColor: '#FFF0F5',
    borderClass: 'priority-section-high',
  },
  {
    key: 'MEDIUM' as const,
    label: '⚡ Medium Priority',
    color: '#FF6B35',
    bgColor: '#FFF5EE',
    borderClass: 'priority-section-medium',
  },
  {
    key: 'LOW' as const,
    label: '🌱 Low Priority',
    color: '#FFD700',
    bgColor: '#FFFFF0',
    borderClass: 'priority-section-low',
  },
];

export function TodoList({
  todos,
  isLoading,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="nb-card nb-loading p-6"
            style={{ backgroundColor: '#F5F0E1', height: '80px' }}
          />
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div
        className="nb-card p-12 text-center"
        style={{ backgroundColor: '#FFF8E7' }}
      >
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-bold mb-2">No todos found</h3>
        <p className="text-gray-600">
          Create your first todo to get started!
        </p>
      </div>
    );
  }

  // Group todos by priority
  const grouped = PRIORITY_SECTIONS.map((section) => ({
    ...section,
    todos: todos.filter((todo) => todo.priority === section.key),
  })).filter((section) => section.todos.length > 0);

  return (
    <div className="space-y-8">
      {grouped.map((section) => (
        <div key={section.key} className={section.borderClass}>
          <div
            className="px-4 py-2 mb-3 inline-block font-bold text-sm uppercase tracking-wider"
            style={{
              backgroundColor: section.color,
              color: '#000',
              border: '3px solid #000',
              boxShadow: '3px 3px 0px #000',
            }}
          >
            {section.label} ({section.todos.length})
          </div>
          <div className="space-y-3 pl-3">
            {section.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
