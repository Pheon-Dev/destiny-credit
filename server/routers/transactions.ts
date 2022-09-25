import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const transactionsRouter = t.router({
  transaction: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const transaction = await prisma.transaction.findFirst({
        where: {
          transID: input.id,
        },
        orderBy: {
          transTime: "desc",
        },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.transaction not found`,
        });
      }

      return transaction;
    }),
  transactions: t.procedure.query(async () => {
    const transactions = await prisma.transaction.findMany({
      where: {},
      orderBy: {
        transTime: "desc",
      },
    });

    if (!transactions) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `transactions.transactions not found`,
      });
    }

    return transactions;
  }),
});
