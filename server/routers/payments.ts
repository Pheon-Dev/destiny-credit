import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { prisma } from "../prisma";

export const paymentsRouter = t.router({
  payment: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const loan = await prisma.loan.findFirst({
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
      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `payments.payment not found`,
        });
      }
      const transactions = await prisma.transaction.findMany({
        where: {
          firstName: loan?.memberName.split(" ")[0],
          middleName: loan?.memberName.split(" ")[1],
          lastName: loan?.memberName.split(" ")[2],
          /* msisdn: loan?.phone */
        }
      })

      const principal = (loan?.principal && loan?.principal || 0)
      const interest = (loan?.interest && loan?.interest || 0)
      const installment = (loan?.installment && loan?.installment || 0)
      const penalty = (loan?.penalty && loan?.penalty || 0)
      const sundays = (loan?.sundays && loan?.sundays || 0)
      const tenure = (loan?.tenure && loan?.tenure || 0)
      const cycle = (loan?.cycle && loan?.cycle || "")
      const loanId = (loan?.id && loan?.id || "")
      const outsArrears = (loan?.payment[loan?.payment.length - 1]?.outsArrears && loan?.payment[loan?.payment.length - 1]?.outsArrears || 0)
      const paidArrears = (loan?.payment[loan?.payment.length - 1]?.paidArrears && loan?.payment[loan?.payment.length - 1]?.paidArrears || 0)
      const outsPenalty = (loan?.payment[loan?.payment.length - 1]?.outsPenalty && loan?.payment[loan?.payment.length - 1]?.outsPenalty || 0)
      const paidPenalty = (loan?.payment[loan?.payment.length - 1]?.paidPenalty && loan?.payment[loan?.payment.length - 1]?.paidPenalty || 0)
      const outsInterest = (loan?.payment[loan?.payment.length - 1]?.outsInterest && loan?.payment[loan?.payment.length - 1]?.outsInterest || 0)
      const paidInterest = (loan?.payment[loan?.payment.length - 1]?.paidInterest && loan?.payment[loan?.payment.length - 1]?.paidInterest || 0)
      const outsPrincipal = (loan?.payment[loan?.payment.length - 1]?.outsPrincipal && loan?.payment[loan?.payment.length - 1]?.outsPrincipal || 0)
      const paidPrincipal = (loan?.payment[loan?.payment.length - 1]?.paidPrincipal && loan?.payment[loan?.payment.length - 1]?.paidPrincipal || 0)
      const outsBalance = (loan?.payment[loan?.payment.length - 1]?.outsBalance && loan?.payment[loan?.payment.length - 1]?.outsBalance || 0)
      const currInstDate = (loan?.payment[loan?.payment.length - 1]?.currInstDate && loan?.payment[loan?.payment.length - 1]?.currInstDate || loan?.startDate)

      /* const payment = await prisma.payment.create({ */
      /*   data: { */
      /*     amount: amount, */
      /*     outsArrears: outsArrears, */
      /*     paidArrears: +paidArrears, */
      /*     outsPenalty: +outsPenalty, */
      /*     paidPenalty: +paidPenalty, */
      /*     outsInterest: +outsInterest, */
      /*     paidInterest: +paidInterest, */
      /*     outsPrincipal: +outsPrincipal, */
      /*     paidPrincipal: +paidPrincipal, */
      /*     outsBalance: +outsBalance, */
      /*     currInstDate: +currInstDate, */
      /*     nextInstDate: +nextInstDate, */
      /*     loanId: +loanId, */
      /*     mpesa: +mpesa, */
      /*   }, */
      /* }); */
      /* if (!payment) { */
      /*   throw new TRPCError({ */
      /*     code: "NOT_FOUND", */
      /*     message: `payments.create_payment not found`, */
      /*   }); */
      /* } */

      let payment: any = []
      transactions.map((t) => {
        payment.push({
          amount: t.transAmount,
          outsArrears: outsArrears,
          paidArrears: +paidArrears,
          outsPenalty: +outsPenalty,
          paidPenalty: +paidPenalty,
          outsInterest: +outsInterest,
          paidInterest: +paidInterest,
          outsPrincipal: +outsPrincipal,
          paidPrincipal: +paidPrincipal,
          outsBalance: +outsBalance,
          currInstDate: currInstDate,
          loanId: +loanId,
          mpesa: t.transID,
        })
      })

      const data = {
        loan: loan,
        payment: payment,
      }

      return data;
    }),
});

