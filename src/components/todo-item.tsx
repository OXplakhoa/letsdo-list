'use client';

import React from 'react';
import type { Todo } from '@/types/todo';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { TodoForm } from '@/components/todo-form';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/priority-badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<{ undo: () => Promise<void> }>;
}

export function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`nb-card group p-4 flex items-start gap-4 ${
        todo.completed ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      {/* Drag handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-black transition-colors"
      >
        <GripVertical size={20} />
      </div>

      <div className="pt-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3
            className={`font-bold text-lg truncate ${
              todo.completed ? 'todo-completed' : ''
            }`}
          >
            {todo.title}
          </h3>
          <PriorityBadge priority={todo.priority} />
        </div>
        
        {todo.description && (
          <p
            className={`mt-1 text-sm ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {todo.description}
          </p>
        )}
        
        <div className="mt-2 text-xs font-bold text-gray-400">
          {format(new Date(todo.createdAt), 'MMM d, yyyy h:mm a')}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <TodoForm
          mode="edit"
          initialData={{
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
          }}
          onSubmit={(data) => onUpdate(todo.id, data as Partial<Todo>)}
          trigger={
            <Button
              variant="outline"
              size="icon-sm"
              className="font-bold text-xl hover:bg-yellow-200"
              style={{ backgroundColor: '#FFF' }}
              title="Edit"
            >
              ✏️
            </Button>
          }
        />
        <Button
          variant="outline"
          size="icon-sm"
          className="font-bold text-xl hover:bg-red-200"
          style={{ backgroundColor: '#FFF' }}
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          🗑️
        </Button>
      </div>
    </div>
  );
}
