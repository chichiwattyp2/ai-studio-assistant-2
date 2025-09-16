import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const t = initTRPC.create();

const threadRouter = t.router({
  getMessages: t.procedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          threadId: input.threadId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      return messages;
    }),
  sendMessage: t.procedure
    .input(z.object({
      threadId: z.string(),
      body: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
        // In a real app, this would be pushed to a BullMQ queue
        // to be sent by a worker via the correct channel (WhatsApp, Email)
        const message = await prisma.message.create({
            data: {
                threadId: input.threadId,
                body: input.body,
                direction: 'OUT',
                status: 'QUEUED', // Status indicates it's ready to be sent
            }
        });

        // Also update the thread's last message time
        await prisma.thread.update({
            where: { id: input.threadId },
            data: { lastMessageAt: new Date() }
        });

        return message;
    })
});

export const appRouter = t.router({
  thread: threadRouter,
});

export type AppRouter = typeof appRouter;
