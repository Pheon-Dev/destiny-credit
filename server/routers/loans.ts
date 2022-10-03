import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { prisma } from "../prisma";

export const loansRouter = t.router({
  create_loan: t.procedure.query(async () => {
    const members = await prisma.member.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!members) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `loans.create_loan not found`,
      });
    }
    return members;
  }),
  loans: t.procedure.query(async () => {
    const loans = await prisma.loan.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!loans) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `loans.loans not found`,
      });
    }
    return loans;
  }),
  payments: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const member = await prisma.loan.findFirst({
        where: {
          id: input.id,
        },
        include: {
          payment: {
            where: {},
            orderBy: {
              createdAt: "desc",
            },
          },
          member: {
            select: {
              id: true,
              firstName: true,
              phoneNumber: true,
              lastName: true,
              memberId: true,
              membershipAmount: true,
              mpesaCode: true,
            }
          },
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.payments not found`,
        });
      }
      return member;
    }),
  payments_list: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const payments = await prisma.payment.findMany({
        where: {
          loanId: input.id,
        },
      });
      if (!payments) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.payments_list not found`,
        });
      }
      return payments;
    }),
  payment: t.procedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
      })
    )
    .query(async ({ input }) => {
      const loan = await prisma.loan.findFirst({
        where: {
          cleared: false,
          memberName: input.name,
          phone: input.phone,
        },
        /* include: { */
        /*   member: { */
        /*     select: { */
        /*       id: true, */
        /*       firstName: true, */
        /*       phoneNumber: true, */
        /*       lastName: true, */
        /*       memberId: true, */
        /*       activeLoan: true, */
        /*     } */
        /*   }, */
        /*   payment: {}, */
        /* }, */
      });

      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.payment not found`,
        });
      }
      return loan;
    }),
  create_payment: t.procedure
    .input(
      z.object({
        amount: z.string(),
        outsArrears: z.string(),
        paidArrears: z.string(),
        outsPenalty: z.string(),
        paidPenalty: z.string(),
        outsInterest: z.string(),
        paidInterest: z.string(),
        outsPrincipal: z.string(),
        paidPrincipal: z.string(),
        outsBalance: z.string(),
        currInstDate: z.string(),
        nextInstDate: z.string(),
        loanId: z.string(),
        mpesa: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const payment = await prisma.payment.create({
        data: {
          amount: input.amount,
          outsArrears: input.outsArrears,
          paidArrears: input.paidArrears,
          outsPenalty: input.outsPenalty,
          paidPenalty: input.paidPenalty,
          outsInterest: input.outsInterest,
          paidInterest: input.paidInterest,
          outsPrincipal: input.outsPrincipal,
          paidPrincipal: input.paidPrincipal,
          outsBalance: input.outsBalance,
          currInstDate: input.currInstDate,
          nextInstDate: input.nextInstDate,
          loanId: input.loanId,
          mpesa: input.mpesa,
        },
      });
      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `loans.create_payment not found`,
        });
      }
      return payment;
    }),
  loan: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.id) return;
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
      if (!input.id) return;
      const loan = await prisma.loan.findMany({
        where: {
          memberId: input.id,
        },
        orderBy: {
          createdAt: "desc",
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
  delete_loans: t.procedure.query(async () => {
    const loan = await prisma.loan.deleteMany();
    if (loan?.count === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `loans.delete_loans not found`,
      });
    }
    return loan;
  }),
});
