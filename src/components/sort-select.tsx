'use client';

import React from 'react';
import type { TodosQuery } from '@/types/todo';

interface SortSelectProps {
  sort: TodosQuery['sort'];
  onSortChange: (sort: TodosQuery['sort']) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: '🕐 Newest' },
  { value: 'oldest', label: '📅 Oldest' },
  { value: 'priority', label: '⚡ Priority' },
];

export function SortSelect({ sort, onSortChange }: SortSelectProps) {
  return (
    <div className="flex gap-2 items-center">
      <span className="font-bold text-sm uppercase tracking-wider whitespace-nowrap">
        Sort:
      </span>
      <div className="flex gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value as TodosQuery['sort'])}
            className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider transition-all"
            style={{
              backgroundColor:
                sort === opt.value ? '#FF6B35' : '#FFFFFF',
              color: sort === opt.value ? '#000' : '#000',
              border: '2px solid #000',
              boxShadow:
                sort === opt.value
                  ? '1px 1px 0px #000'
                  : '2px 2px 0px #000',
              transform:
                sort === opt.value ? 'translate(1px, 1px)' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
