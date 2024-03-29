import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { prisma } from "../prisma";

export const transactionsRouter = t.router({
  transaction: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.id) return;
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
  payments: t.procedure
    .input(
      z.object({
        firstname: z.string(),
        middlename: z.string(),
        lastname: z.string(),
        phone: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.firstname) return;

      const transaction = await prisma.transaction.findMany({
        where: {
          firstName: input.firstname,
          middleName: input.middlename,
          lastName: input.lastname,
          msisdn: input.phone,
        },
        orderBy: {
          transTime: "desc",
        },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.payments not found`,
        });
      }

      return transaction;
    }),
  member_transactions: t.procedure
    .input(
      z.object({
        firstname: z.string(),
        middlename: z.string(),
        lastname: z.string(),
        phone: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.firstname) return;

      const transaction = await prisma.transaction.findMany({
        where: {
          firstName: input.firstname,
          middleName: input.middlename,
          lastName: input.lastname,
          msisdn: input.phone,
        },
        orderBy: {
          transTime: "desc",
        },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.member_transactions not found`,
        });
      }

      return transaction;
    }),
  search: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.id) return;

      const transaction = await prisma.transaction.findMany({
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
  create: t.procedure
    .input(
      z.object({
        state: z.string(),
        updaterId: z.string(),
        handlerId: z.string(),
        payment: z.string(),
        transactionType: z.string(),
        transID: z.string(),
        transTime: z.string(),
        transAmount: z.string(),
        businessShortCode: z.string(),
        billRefNumber: z.string(),
        invoiceNumber: z.string(),
        orgAccountBalance: z.string(),
        thirdPartyTransID: z.string(),
        msisdn: z.string(),
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const transaction = await prisma.transaction.create({
        data: {
          transactionType: input.transactionType,
          transID: input.transID,
          transTime: input.transTime,
          transAmount: input.transAmount,
          businessShortCode: input.businessShortCode,
          billRefNumber: input.billRefNumber,
          invoiceNumber: input.invoiceNumber,
          orgAccountBalance: input.orgAccountBalance,
          thirdPartyTransID: input.thirdPartyTransID,
          msisdn: input.msisdn,
          firstName: input.firstName,
          middleName: input.middleName,
          lastName: input.lastName,
          state: input.state,
          updaterId: input.updaterId,
          handlerId: input.handlerId,
          payment: input.payment,
        },
      });

      if (transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `transactions.create not found`,
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
      if (!input.id) return;

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

