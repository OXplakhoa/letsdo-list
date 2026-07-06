'use client';

import React, { useState, useEffect } from 'react';
import { TodoItem } from '@/components/todo-item';
import type { Todo } from '@/types/todo';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<{ undo: () => Promise<void> }>;
  onReorder: (items: { id: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; position: number }[]) => Promise<void>;
}

const PRIORITY_SECTIONS = [
  {
    key: 'HIGH' as const,
    labelKey: 'highPriority' as const,
    color: '#FF69B4',
    bgColor: '#FFF0F5',
    borderClass: 'priority-section-high',
  },
  {
    key: 'MEDIUM' as const,
    labelKey: 'mediumPriority' as const,
    color: '#FF6B35',
    bgColor: '#FFF5EE',
    borderClass: 'priority-section-medium',
  },
  {
    key: 'LOW' as const,
    labelKey: 'lowPriority' as const,
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
  onReorder,
}: TodoListProps) {
  const { t } = useLanguage();
  const [localTodos, setLocalTodos] = useState<Todo[]>(todos);

  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px drag to start sorting to avoid accidental clicks
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalTodos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Also update priority if it crossed boundaries (simplified: assume we just reorder and keep priority)
        // For full cross-list, we would detect which container it dropped in.
        // But for this simple implementation, we just update the position indices.
        
        const updates = newArray.map((item, index) => ({
          id: item.id,
          priority: item.priority,
          position: index, // Reverse or forward index
        }));

        onReorder(updates);
        return newArray;
      });
    }
  };

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

  if (localTodos.length === 0) {
    return (
      <div
        className="nb-card p-12 text-center"
        style={{ backgroundColor: '#FFF8E7' }}
      >
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-bold mb-2">{t.emptySearch}</h3>
        <p className="text-gray-600">
          {t.emptyList}
        </p>
      </div>
    );
  }

  const grouped = PRIORITY_SECTIONS.map((section) => ({
    ...section,
    todos: localTodos.filter((todo) => todo.priority === section.key),
  })).filter((section) => section.todos.length > 0);

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
              {t[section.labelKey]} ({section.todos.length})
            </div>
            <div className="space-y-3 pl-3">
              <SortableContext 
                items={section.todos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {section.todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
