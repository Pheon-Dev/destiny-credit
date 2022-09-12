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
  }).query("members", {
    resolve: async () => {
      return await prisma.member.findMany()
    }
  }).query("loans", {
    resolve: async () => {
      return await prisma.loan.findMany()
    }
  }).query("products", {
    resolve: async () => {
      return await prisma.product.findMany()
    }
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
