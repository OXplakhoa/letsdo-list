import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { apiHandler } from '@/lib/middleware/api-handler';

const reorderSchema = z.array(
  z.object({
    id: z.string(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    position: z.number(),
  })
);

export const PATCH = apiHandler(
  async (req: NextRequest, _context: any, validated: any) => {
    const items = validated.body as z.infer<typeof reorderSchema>;

    // Run in transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.todo.update({
          where: { id: item.id },
          data: {
            priority: item.priority,
            position: item.position,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  },
  { bodySchema: reorderSchema }
);
