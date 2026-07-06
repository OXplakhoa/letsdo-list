'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import type { TodosQuery } from '@/types/todo';

interface SearchFilterBarProps {
  query: TodosQuery;
  onQueryChange: (partial: Partial<TodosQuery>) => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
];

const PRIORITY_FILTER_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'HIGH', label: '🔥 High' },
  { value: 'MEDIUM', label: '⚡ Medium' },
  { value: 'LOW', label: '🌱 Low' },
];

export function SearchFilterBar({ query, onQueryChange }: SearchFilterBarProps) {
  const [searchInput, setSearchInput] = useState(query.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== query.search) {
        onQueryChange({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, query.search, onQueryChange]);

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
          🔍
        </span>
        <Input
          id="search-todos"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search todos by title..."
          className="pl-10 text-base py-3 font-medium"
        />
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onQueryChange({ status: opt.value as TodosQuery['status'] })}
            className="px-4 py-2 font-bold text-sm uppercase tracking-wider transition-all"
            style={{
              backgroundColor:
                query.status === opt.value ? '#4169E1' : '#FFFFFF',
              color: query.status === opt.value ? '#FFFFFF' : '#000000',
              border: '3px solid #000',
              boxShadow:
                query.status === opt.value
                  ? '1px 1px 0px #000'
                  : '3px 3px 0px #000',
              transform:
                query.status === opt.value ? 'translate(2px, 2px)' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}

        {/* Priority filter options - hidden for now, we show grouped sections */}
      </div>
    </div>
  );
}
