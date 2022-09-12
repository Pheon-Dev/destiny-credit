import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();

export const appRouter = trpc
  .router()
  .query('transactions', {
    resolve: async () => {
      return await prisma.transaction.findMany()
    }
  }).query("loan", {
    input: z.object({
      id: z.string()
    }), resolve: async ({input}) => {
      return await prisma.loan.findMany({
        where: {
          id: input.id
        }
      })
    }
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
