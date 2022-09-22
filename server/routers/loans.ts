import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export const loansRouter = t.router({
  create_loan: t.procedure.query(async () => {
    const members = await prisma.member.findMany();
    if (!members) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `loans.create-loan not found`,
      });
    }
    return members;
  }),
  loans: t.procedure.query(async () => {
    const loans = await prisma.loan.findMany();
    if (!loans) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `loans.loans not found`,
      });
    }
    return loans;
  }),
  transactions: t.procedure
    .input(
      z.object({
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
      })
    )
    .query(async ({ input }) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          firstName: input.firstName,
          lastName: input.lastName,
          middleName: input.middleName,
          msisdn: input.phoneNumber,
        },
      });
      if (!transactions) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.transactions not found`,
        });
      }
      return transactions;
    }),
  payment: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const payment = await prisma.payment.findMany({
        where: {
          loanId: input.id,
        },
      });
      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.payment not found`,
        });
      }
      return payment;
    }),
  loan_payment: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const loan = await prisma.loan.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.loan-payment not found`,
        });
      }
      return loan;
    }),
  loan: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const loan = await prisma.loan.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.loan not found`,
        });
      }
      return loan;
    }),
  approve: t.procedure
    .input(
      z.object({
        id: z.string(),
        approverId: z.string(),
        approved: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const loan = await prisma.loan.updateMany({
        where: {
          id: input.id,
        },
        data: {
          approved: input.approved,
          approverId: input.approverId,
        },
      });
      if (loan?.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.approve not found`,
        });
      }
      return loan;
    }),
  disburse: t.procedure
    .input(
      z.object({
        id: z.string(),
        disbursed: z.boolean(),
        disbursedOn: z.string(),
        disburserId: z.string(),
        updaterId: z.string(),
        creditOfficerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const loan = await prisma.loan.updateMany({
        where: {
          id: input.id,
        },
        data: {
          disbursed: input.disbursed,
          disbursedOn: input.disbursedOn,
          disburserId: input.disburserId,
          updaterId: input.updaterId,
          creditOfficerId: input.creditOfficerId,
        },
      });
      if (loan?.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.disburse not found`,
        });
      }
      return loan;
    }),
  member: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const loan = await prisma.loan.findMany({
        where: {
          memberId: input.id,
        },
      });
      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.member not found`,
        });
      }
      return loan;
    }),
  delete_loans: t.procedure.query(async ({ input }) => {
    const loan = await prisma.loan.deleteMany();
    if (loan?.count === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `loans.delete-loans not found`,
      });
    }
    return loan;
  }),
});
