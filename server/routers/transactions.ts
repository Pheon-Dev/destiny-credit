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
      if (input.id.length !== 10) return;
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
  state: t.procedure
    .input(
      z.object({
        id: z.string(),
        state: z.string(),
        updaterId: z.string(),
        handlerId: z.string(),
        payment: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const transaction = await prisma.transaction.updateMany({
        where: {
          id: input.id,
        },
        data: {
          state: input.state,
          updaterId: input.updaterId,
          handlerId: input.handlerId,
          payment: input.payment,
        },
      });

      if (transaction?.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.state not found`,
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

