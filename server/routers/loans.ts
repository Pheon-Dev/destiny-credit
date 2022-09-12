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
})

export const loansRouter = createRouter()
  .query("create-loan", {
    resolve: async () => {
      return await prisma.member.findMany();
    },
  })
  .query("loans", {
    resolve: async () => {
      return await prisma.loan.findMany();
    },
  })
  .query("loan", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      return await prisma.payment.findMany({
        where: {
          loanId: input.id,
        },
      });
    },
  })
  .query("member", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      return await prisma.loan.findMany({
        where: {
          memberId: input.id,
        },
      });
    },
  })


