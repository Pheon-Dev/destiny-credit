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
            },
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
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const date = (time: string) => {
        const second = time.slice(12);
        const minute = time.slice(10, 12);
        const hour = time.slice(8, 10);
        const day = time.slice(6, 8);
        const month = time.slice(4, 6);
        const year = time.slice(0, 4);
        const when = day + "-" + month + "-" + year;
        return when;
      };

      const principal = (+loan?.principal && +loan?.principal) || 0;
      const interest = (+loan?.interest && +loan?.interest) || 0;
      const installment = (+loan?.installment && +loan?.installment) || 0;
      const penalty = (+loan?.penalty && +loan?.penalty) || 0;
      const sundays = (+loan?.sundays && +loan?.sundays) || 0;
      const tenure = (+loan?.tenure && +loan?.tenure) || 0;
      const cycle = (+loan?.cycle && +loan?.cycle) || "";
      const loanId = (loan?.id && loan?.id) || "";
      const outsArrears =
        (loan?.payment[loan?.payment.length - 1]?.outsArrears &&
          loan?.payment[loan?.payment.length - 1]?.outsArrears) ||
        0;
      const paidArrears =
        (loan?.payment[loan?.payment.length - 1]?.paidArrears &&
          loan?.payment[loan?.payment.length - 1]?.paidArrears) ||
        0;
      const outsPenalty =
        (loan?.payment[loan?.payment.length - 1]?.outsPenalty &&
          loan?.payment[loan?.payment.length - 1]?.outsPenalty) ||
        0;
      const paidPenalty =
        (loan?.payment[loan?.payment.length - 1]?.paidPenalty &&
          loan?.payment[loan?.payment.length - 1]?.paidPenalty) ||
        0;
      const outsInterest =
        (loan?.payment[loan?.payment.length - 1]?.outsInterest &&
          loan?.payment[loan?.payment.length - 1]?.outsInterest) ||
        0;
      const paidInterest =
        (loan?.payment[loan?.payment.length - 1]?.paidInterest &&
          loan?.payment[loan?.payment.length - 1]?.paidInterest) ||
        0;
      const outsPrincipal =
        (loan?.payment[loan?.payment.length - 1]?.outsPrincipal &&
          loan?.payment[loan?.payment.length - 1]?.outsPrincipal) ||
        0;
      const paidPrincipal =
        (loan?.payment[loan?.payment.length - 1]?.paidPrincipal &&
          loan?.payment[loan?.payment.length - 1]?.paidPrincipal) ||
        0;
      const outsBalance =
        (loan?.payment[loan?.payment.length - 1]?.outsBalance &&
          loan?.payment[loan?.payment.length - 1]?.outsBalance) ||
        installment * (tenure - sundays);

      let payment: any = [];
      let os_arrears = outsArrears;
      let pd_arrears = paidArrears;

      let os_penalty = outsPenalty;
      let pd_penalty = paidPenalty;

      let os_interest = outsInterest;
      let pd_interest = paidInterest;

      let os_principal = outsPrincipal;
      let pd_principal = paidPrincipal;

      let os_balance = outsBalance;

      transactions?.forEach(async (t) => {
        const id = t.id;
        const amount = +t.transAmount;
        const mpesa = t.transID;
        const time = date(t.transTime);
        const type = t.transactionType;
        const state = "four";

        /* if (t.payment === "three") return await prisma.payment.deleteMany({ */
        /*   where: { */
        /*     loanId: input.id */
        /*   } */
        /* }) */

        if (loan.cleared) return;
        if (t.payment === "four") return;

        const curr_interest = interest / tenure;
        const curr_principal = installment - curr_interest;

        os_arrears = outsArrears;
        pd_arrears = paidArrears;

        os_penalty = outsPenalty;
        pd_penalty = paidPenalty;

        os_interest = outsInterest;
        pd_interest = paidInterest;

        os_principal = outsPrincipal;
        pd_principal = paidPrincipal;

        os_balance -= amount;

        /* console.table({ status: "writing ..." }) */

        /* const add = await prisma.payment.create({ */
        /*   data: { */
        /*     amount: amount, */
        /*     outsArrears: os_arrears, */
        /*     paidArrears: pd_arrears, */
        /*     outsPenalty: os_penalty, */
        /*     paidPenalty: pd_penalty, */
        /*     outsInterest: os_interest, */
        /*     paidInterest: pd_interest, */
        /*     outsPrincipal: os_principal, */
        /*     paidPrincipal: pd_principal, */
        /*     outsBalance: os_balance, */
        /*     currInstDate: time, */
        /*     mpesa: mpesa, */
        /*     type: type, */
        /*     loanId: input.id, */
        /*   }, */
        /* }); */
        /* if (add) { */
        /*   await prisma.transaction.update({ */
        /*     where: { */
        /*       id: t.id, */
        /*     }, */
        /*     data: { */
        /*       payment: state, */
        /*     }, */
        /*   }); */
        /* }; */

        payment.push({
          amount: amount,
          outsArrears: os_arrears,
          paidArrears: pd_arrears,
          outsPenalty: os_penalty,
          paidPenalty: pd_penalty,
          outsInterest: os_interest,
          paidInterest: pd_interest,
          outsPrincipal: os_principal,
          paidPrincipal: pd_principal,
          outsBalance: os_balance,
          currInstDate: time,
          id: id,
          mpesa: mpesa,
          type: type,
          payment: t.payment,
        });
        /* os_balance === 0 && */
        /*   (await prisma.loan.update({ */
        /*     where: { */
        /*       id: input.id, */
        /*     }, */
        /*     data: { */
        /*       cleared: true, */
        /*     }, */
        /*   })); */
        return payment;
      });

      const data = {
        loan: loan,
        payment: payment,
      };

      return data;
    }),
});
