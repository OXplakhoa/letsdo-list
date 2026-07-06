import { prisma } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.todo.deleteMany();

  // Create sample todos
  const todos = [
    {
      title: 'Set up project architecture',
      description: 'Configure Next.js with App Router, Prisma, and PostgreSQL',
      priority: 'HIGH' as const,
      completed: true,
      position: 0,
    },
    {
      title: 'Design Neubrutalism theme',
      description: 'Bold borders, chunky shadows, vivid colors — no rounded corners!',
      priority: 'HIGH' as const,
      completed: true,
      position: 1,
    },
    {
      title: 'Implement CRUD API routes',
      description: 'REST endpoints with Zod validation and middleware wrapper',
      priority: 'HIGH' as const,
      completed: false,
      position: 2,
    },
    {
      title: 'Add search and filtering',
      description: 'Search by title, filter by status (all/active/completed)',
      priority: 'MEDIUM' as const,
      completed: false,
      position: 3,
    },
    {
      title: 'Implement soft delete with undo',
      description: 'Delete sets deletedAt timestamp, toast shows undo button for 5 seconds',
      priority: 'MEDIUM' as const,
      completed: false,
      position: 4,
    },
    {
      title: 'Write unit tests',
      description: 'Vitest tests for service layer — createTodo, softDelete, restore, listTodos, toggleTodo',
      priority: 'MEDIUM' as const,
      completed: false,
      position: 5,
    },
    {
      title: 'Write comprehensive README',
      description: 'Architecture diagram, setup instructions, design decisions, known limitations',
      priority: 'LOW' as const,
      completed: false,
      position: 6,
    },
    {
      title: 'Add drag-and-drop reordering',
      description: 'Stretch goal: use dnd-kit to drag todos between priority sections',
      priority: 'LOW' as const,
      completed: false,
      position: 7,
    },
    {
      title: 'Deploy to Vercel',
      description: 'Connect Neon database, set environment variables, deploy',
      priority: 'LOW' as const,
      completed: false,
      position: 8,
    },
  ];

  for (const todo of todos) {
    await prisma.todo.create({ data: todo });
  }

  console.log(`✅ Seeded ${todos.length} todos`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
