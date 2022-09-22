import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();

export const transactionsRouter = createRouter()
  .query("transaction", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      const transaction = await prisma.transaction.findFirst({
        where: {
          transID: input.id,
        },
      });
      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.transaction not found`,
        });
      }
      return transaction;
    },
  })
  .query("transactions", {
    resolve: async () => {
      const transactions = await prisma.transaction.findMany();
      if (!transactions) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.transactions not found`,
        });
      }
      return transactions;
    },
  });
