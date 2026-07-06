'use client';

import React from 'react';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

const PRIORITY_CONFIG: Record<Priority, { label: string; bgColor: string; textColor: string }> = {
  HIGH: {
    label: 'HIGH',
    bgColor: '#FF69B4',
    textColor: '#000',
  },
  MEDIUM: {
    label: 'MEDIUM',
    bgColor: '#FF6B35',
    textColor: '#000',
  },
  LOW: {
    label: 'LOW',
    bgColor: '#FFD700',
    textColor: '#000',
  },
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider ${sizeClasses}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: '3px solid #000',
        boxShadow: '2px 2px 0px #000',
      }}
    >
      {config.label}
    </span>
  );
}
