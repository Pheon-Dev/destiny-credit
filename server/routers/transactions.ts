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
        return;
      }

      return transaction;
    }),
  transactions: t.procedure.query(async () => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {},
        orderBy: {
          transTime: "desc",
        },
      });

      if (!transactions) {
        return;
      }

      return transactions;
    } catch (error) {
      console.log("transactions.transactions: ", error)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `transactions.transactions ${error}`,
      });
    }
  }),
});
