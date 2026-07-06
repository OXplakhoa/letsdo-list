'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TodoFormProps {
  onSubmit: (data: { title: string; description?: string; priority?: string }) => Promise<void>;
  initialData?: {
    title: string;
    description?: string | null;
    priority?: string;
  };
  mode?: 'create' | 'edit';
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PRIORITIES = [
  { value: 'HIGH', label: 'HIGH', color: '#FF69B4' },
  { value: 'MEDIUM', label: 'MEDIUM', color: '#FF6B35' },
  { value: 'LOW', label: 'LOW', color: '#FFD700' },
];

export function TodoForm({
  onSubmit,
  initialData,
  mode = 'create',
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TodoFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [priority, setPriority] = useState(initialData?.priority ?? 'MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });

      if (mode === 'create') {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
      }

      setOpen(false);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description ?? '');
      setPriority(initialData.priority ?? 'MEDIUM');
    }
    setError('');
  };

  const defaultTrigger = (
    <Button
      className="font-bold text-lg px-6 py-3"
      style={{ backgroundColor: '#4169E1', color: '#FFF' }}
    >
      + Add Todo
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={trigger || defaultTrigger}
      />
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {mode === 'create' ? '📝 New Todo' : '✏️ Edit Todo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {error && (
            <div
              className="p-3 font-bold text-sm"
              style={{
                backgroundColor: '#FF4444',
                color: '#FFF',
                border: '3px solid #000',
                boxShadow: '3px 3px 0px #000',
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-bold text-sm uppercase tracking-wider">
              Title *
            </label>
            <Input
              id="todo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="text-base py-3"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm uppercase tracking-wider">
              Description
            </label>
            <Textarea
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details (optional)"
              className="text-base min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm uppercase tracking-wider">
              Priority
            </label>
            <div className="flex gap-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-2 px-3 font-bold text-sm uppercase tracking-wider text-center transition-all"
                  style={{
                    backgroundColor:
                      priority === p.value ? p.color : '#FFFFFF',
                    color: '#000',
                    border: '3px solid #000',
                    boxShadow:
                      priority === p.value
                        ? '1px 1px 0px #000'
                        : '3px 3px 0px #000',
                    transform:
                      priority === p.value
                        ? 'translate(2px, 2px)'
                        : 'none',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 font-bold"
              style={{ backgroundColor: '#FFF' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-bold text-white"
              style={{ backgroundColor: '#4169E1' }}
            >
              {isSubmitting
                ? '...'
                : mode === 'create'
                ? '🚀 Create'
                : '💾 Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
