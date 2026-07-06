'use client';

import React, { useState } from 'react';
import { PriorityBadge } from '@/components/priority-badge';
import { TodoForm } from '@/components/todo-form';
import { Button } from '@/components/ui/button';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<{ undo: () => Promise<void> }>;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return; // Prevent double-click
    setIsToggling(true);
    try {
      await onToggle(todo.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (data: { title: string; description?: string; priority?: string }) => {
    await onUpdate(todo.id, {
      title: data.title,
      description: data.description || null,
      priority: data.priority as Todo['priority'],
    });
  };

  const createdDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`nb-card p-4 flex items-start gap-4 transition-all ${
        todo.completed ? 'opacity-60' : ''
      }`}
      style={{
        backgroundColor: todo.completed ? '#F0F0F0' : '#FFFFFF',
      }}
    >
      {/* Checkbox area */}
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className="mt-0.5 flex-shrink-0 w-7 h-7 flex items-center justify-center font-bold text-lg"
        style={{
          backgroundColor: todo.completed ? '#4169E1' : '#FFFFFF',
          color: todo.completed ? '#FFFFFF' : 'transparent',
          border: '3px solid #000',
          boxShadow: '2px 2px 0px #000',
          cursor: isToggling ? 'wait' : 'pointer',
        }}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed ? '✓' : ''}
      </button>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`font-bold text-base ${
              todo.completed ? 'line-through' : ''
            }`}
          >
            {todo.title}
          </h3>
          <PriorityBadge priority={todo.priority as 'LOW' | 'MEDIUM' | 'HIGH'} size="sm" />
        </div>

        {todo.description && (
          <p
            className={`mt-1 text-sm ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-700'
            }`}
          >
            {todo.description}
          </p>
        )}

        <div className="mt-2 text-xs text-gray-500 font-medium">
          {createdDate}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <TodoForm
          mode="edit"
          initialData={{
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
          }}
          onSubmit={handleEdit}
          open={editOpen}
          onOpenChange={setEditOpen}
          trigger={
            <Button
              variant="outline"
              className="px-3 py-1 text-sm font-bold"
              style={{ backgroundColor: '#FFD700' }}
            >
              ✏️
            </Button>
          }
        />
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm font-bold"
          style={{ backgroundColor: '#FF4444', color: '#FFF' }}
        >
          {isDeleting ? '...' : '🗑️'}
        </Button>
      </div>
    </div>
  );
}
