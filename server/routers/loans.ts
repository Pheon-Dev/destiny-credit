import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();
const defaultLoansSelect = Prisma.validator<Prisma.LoanSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  maintained: true,
  approved: true,
  disbursed: true,
  principal: true,
  interest: true,
  installment: true,
  penalty: true,
  sundays: true,
  payoff: true,
  tenure: true,
  grace: true,
  cycle: true,
  productName: true,
  memberName: true,
  processingFee: true,
  loanRef: true,
  disbursedOn: true,
  startDate: true,
  paymentCounter: true,
  paymentCount: true,
  paymentDay: true,
  paymentStatus: true,
  paymentPenalties: true,
  guarantor: true,
  guarantorId: true,
  product: true,
  productId: true,
  member: true,
  memberId: true,
  payment: true,
  maintainer: true,
  maintainerId: true,
  approver: true,
  approverId: true,
  disburser: true,
  disburserId: true,
  updater: true,
  updaterId: true,
});

export const loansRouter = createRouter()
  .query("create-loan", {
    resolve: async () => {
      try {
        return await prisma.member.findMany();
      } catch (error) {
        console.log("loans.create-loan");
      }
    },
  })
  .query("loans", {
    resolve: async () => {
      try {
        return await prisma.loan.findMany();
      } catch (error) {
        console.log("loans.loans");
      }
    },
  })
  .query("payment", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.payment.findMany({
          where: {
            loanId: input.id,
          },
        });
      } catch (error) {
        console.log("loans.payment");
      }
    },
  })
  .query("loan", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.loan.findMany({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("loans.loan");
      }
    },
  })
  .mutation("approve", {
    input: z.object({
      id: z.string(),
      approved: z.boolean(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.loan.updateMany({
          where: {
            id: input.id,
          },
          data: {
            approved: input.approved,
          },
        });
      } catch (error) {
        console.log("loans.approve");
      }
    },
  })
  .mutation("disburse", {
    input: z.object({
      id: z.string(),
      disbursed: z.boolean(),
      disbursedOn: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.loan.updateMany({
          where: {
            id: input.id,
          },
          data: {
            disbursed: input.disbursed,
            disbursedOn: input.disbursedOn,
          },
        });
      } catch (error) {
        console.log("loans.disburse");
      }
    },
  })
  .query("member", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.loan.findMany({
          where: {
            memberId: input.id,
          },
        });
      } catch (error) {
        console.log("loans.member");
      }
    },
  })
  .query("delete-loans", {
    resolve: async () => {
      try {
        return await prisma.loan.deleteMany();
      } catch (error) {
        console.log("loans.delete-loans");
      }
    },
  });
