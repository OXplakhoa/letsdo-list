'use client';

import React from 'react';
import { useTodos } from '@/hooks/use-todos';
import { TodoList } from '@/components/todo-list';
import { TodoForm } from '@/components/todo-form';
import { SearchFilterBar } from '@/components/search-filter-bar';
import { SortSelect } from '@/components/sort-select';
import { toast } from 'sonner';

export default function Home() {
  const {
    todos,
    total,
    page,
    totalPages,
    isLoading,
    error,
    query,
    setQuery,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos({ initialQuery: { limit: 50 } });

  const handleCreate = async (data: {
    title: string;
    description?: string;
    priority?: string;
  }) => {
    await createTodo(data);
    toast.success('Todo created!', {
      style: {
        backgroundColor: '#4169E1',
        color: '#FFF',
        border: '3px solid #000',
        boxShadow: '4px 4px 0px #000',
      },
    });
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTodo(id);

    toast('Todo deleted', {
      description: 'Click undo to restore it.',
      action: {
        label: 'Undo',
        onClick: async () => {
          await result.undo();
          toast.success('Todo restored!', {
            style: {
              backgroundColor: '#33CC99',
              color: '#000',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px #000',
            },
          });
        },
      },
      duration: 5000,
      style: {
        backgroundColor: '#FF4444',
        color: '#FFF',
        border: '3px solid #000',
        boxShadow: '4px 4px 0px #000',
      },
    });

    return result;
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#FFF8E7' }}
    >
      {/* Header */}
      <header
        className="border-b-4 border-black"
        style={{ backgroundColor: '#4169E1' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold text-white"
                style={{
                  textShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                ✅ Let&apos;s Do List
              </h1>
              <p className="text-blue-100 font-medium mt-1">
                {total} {total === 1 ? 'task' : 'tasks'} total
              </p>
            </div>
            <TodoForm onSubmit={handleCreate} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Error banner */}
        {error && (
          <div
            className="mb-6 p-4 font-bold"
            style={{
              backgroundColor: '#FF4444',
              color: '#FFF',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px #000',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Search, Filter, Sort bar */}
        <div className="mb-6 space-y-4">
          <SearchFilterBar query={query} onQueryChange={setQuery} />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <SortSelect
              sort={query.sort}
              onSortChange={(sort) => setQuery({ sort })}
            />
            <div className="text-sm font-medium text-gray-600">
              Showing {todos.length} of {total} todos
            </div>
          </div>
        </div>

        {/* Todo list */}
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setQuery({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
              className="nb-page-btn"
              style={{
                backgroundColor: page <= 1 ? '#E0E0E0' : '#FFD700',
                color: '#000',
                border: '3px solid #000',
                boxShadow: '3px 3px 0px #000',
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setQuery({ page: pageNum })}
                  className={`nb-page-btn ${
                    pageNum === page ? 'active' : ''
                  }`}
                  style={{
                    backgroundColor:
                      pageNum === page ? '#4169E1' : '#FFFFFF',
                    color: pageNum === page ? '#FFF' : '#000',
                    border: '3px solid #000',
                    boxShadow:
                      pageNum === page
                        ? '1px 1px 0px #000'
                        : '3px 3px 0px #000',
                    transform:
                      pageNum === page
                        ? 'translate(2px, 2px)'
                        : 'none',
                  }}
                >
                  {pageNum}
                </button>
              )
            )}
            <button
              onClick={() =>
                setQuery({ page: Math.min(totalPages, page + 1) })
              }
              disabled={page >= totalPages}
              className="nb-page-btn"
              style={{
                backgroundColor:
                  page >= totalPages ? '#E0E0E0' : '#FFD700',
                color: '#000',
                border: '3px solid #000',
                boxShadow: '3px 3px 0px #000',
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            >
              →
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-4 border-black py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-bold text-sm text-gray-600">
            Built with 💛 using Next.js, Prisma & PostgreSQL — Neubrutalism
            Style
          </p>
        </div>
      </footer>
    </div>
  );
}
