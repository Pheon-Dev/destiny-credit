import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Notifications, Payment, Transactions } from "../../../types";
import { prisma } from "../prisma";
import { t } from "../trpc";

export const paymentsRouter = t.router({
  payment: t.procedure
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
        include: {
          payment: {
            where: {},
            orderBy: {
              outsBalance: "desc",
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
          firstName: loan?.member?.firstName,
          middleName: loan?.member?.lastName.split(" ")[0],
          lastName: loan?.member?.lastName.split(" ")[1],
          msisdn: loan?.member?.phoneNumber,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const roundOff = (value: number) => {
        if (value > 0) {
          const v = `${value}`
          const a = v.split(".")[0] ?? "0"
          const b = v.split(".")[1] ?? "0"

          return +b > 0 && +a + 1 || +a
        }
        return 0
      };

      const date = (time: string) => {
        const day = time.slice(6, 8);
        const month = time.slice(4, 6);
        const year = time.slice(0, 4);
        const when = day + "-" + month + "-" + year;
        return when;
      };

      const interest = (+loan?.interest && +loan?.interest) || 0;
      const installment = (+loan?.installment && +loan?.installment) || 0;
      const sundays = (+loan?.sundays && +loan?.sundays) || 0;
      const tenure = (+loan?.tenure && +loan?.tenure) || 0;
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

      let payment: Array<Payment> = [];
      let notification: Array<Notifications> = [];

      let os_arrears = +outsArrears;
      let pd_arrears = +paidArrears;

      let os_penalty = +outsPenalty;
      let pd_penalty = +paidPenalty;

      let os_interest = +outsInterest;
      let pd_interest = +paidInterest;

      let os_principal = +outsPrincipal;
      let pd_principal = +paidPrincipal;

      let os_balance = +outsBalance;

      let total_amount = 0;

      /* TODO: Proper Calculations */
      transactions?.forEach(async (t) => {
        const id = t.id;
        const amount = +t.transAmount;
        const mpesa = t.transID;
        const time = date(t.transTime);
        const type = t.transactionType;
        const state = "handled";
        const payment_state = "loan";

        let start = 0;
        let current = t.transTime;

        if (loan?.startDate) {
          const start_day = loan?.startDate?.split("-")[0];
          const start_month = loan?.startDate?.split("-")[1];
          const start_year = loan?.startDate?.split("-")[2];

          const year = start_year && start_year || ""
          const month = start_month && start_month || ""
          const str = year + month + start_day + "000000";
          start = +str;
        }

        if (loan.cleared === true) {
          return notification.push({
            id: `${t.id}`,
            title: `Transaction ${t.transID}`,
            color: "green",
            disallowClose: true,
            autoClose: false,
            message: `This Loan Was Successfully Cleared!`,
          });
        }

        if (t.state === "handled") {
          return notification.push({
            id: `${t.id}`,
            title: `Transaction ${t.transID}`,
            color: "blue",
            disallowClose: true,
            autoClose: 10000,
            message: `M-PESA Payment of KSHs. ${t.transAmount
              } via ${(t.billRefNumber === "" && "Till") || "Pay Bill"
              } is already paid for ${t?.payment}`,
          });
        }

        if (+current < +start) {
          /* return ( */
          /*   t.state === "new" && */
          /*   notification.push({ */
          /*     id: `${t.id}`, */
          /*     title: `Transaction ${t.transID}`, */
          /*     color: "orange", */
          /*     disallowClose: true, */
          /*     autoClose: 20000, */
          /*     message: `M-PESA Payment of KSHs. ${t.transAmount */
          /*       } via ${(t.billRefNumber === "" && "Till") || "Pay Bill" */
          /*       } is before first installement date of ${loan?.startDate}`, */
          /*   }) */
          /* ); */

          return;
        }

        let rem_amount = amount;

        const curr_interest = interest / tenure;
        const curr_principal = installment - curr_interest;

        const total_os_arrears: number =
          os_arrears + os_penalty + os_interest + os_principal;
        (total_os_arrears > 0 && (os_arrears = total_os_arrears - amount)) ||
          (os_arrears = total_os_arrears);
        (os_arrears > 0 && (pd_arrears += amount)) ||
          (pd_arrears += total_os_arrears);

        (os_arrears < 0 && (os_arrears = 0)) || (os_arrears = os_arrears);
        (pd_arrears < 0 && (pd_arrears = 0)) || (pd_arrears = pd_arrears);

        const total_os_penalties: number = 0;
        (total_os_penalties > 0 &&
          (os_penalty = total_os_penalties - rem_amount)) ||
          (os_penalty = total_os_penalties);
        (os_penalty > 0 && (pd_penalty = total_os_penalties - rem_amount)) ||
          (pd_penalty += total_os_penalties);

        (os_penalty < 0 && (os_penalty = 0)) || (os_penalty = os_penalty);
        (pd_penalty < 0 && (pd_penalty = 0)) || (pd_penalty = pd_penalty);

        (os_penalty > 0 && (rem_amount = 0)) ||
          (rem_amount -= total_os_penalties);

        const total_os_interest: number = os_interest + curr_interest;
        (os_penalty > 0 && (os_interest = total_os_interest)) ||
          (os_interest = total_os_interest - rem_amount);
        (os_interest > 0 && (pd_interest += rem_amount)) ||
          (pd_interest += total_os_interest);

        (os_interest < 0 && (os_interest = 0)) || (os_interest = os_interest);
        (pd_interest < 0 && (pd_interest = 0)) || (pd_interest = pd_interest);

        (os_interest > 0 && (rem_amount = 0)) ||
          (rem_amount -= total_os_interest);

        const total_os_principal: number = os_principal + curr_principal;
        (os_interest > 0 && (os_principal = total_os_principal)) ||
          (os_principal = total_os_principal - rem_amount);
        (os_principal > 0 && (pd_principal += rem_amount)) ||
          (pd_principal += total_os_principal);

        (os_principal < 0 && (os_principal = 0)) ||
          (os_principal = os_principal);
        (pd_principal < 0 && (pd_principal = 0)) ||
          (pd_principal = pd_principal);

        (os_principal > 0 && (rem_amount = 0)) ||
          (rem_amount -= total_os_principal);

        os_balance += curr_interest - amount;

        total_amount += amount;

        /* if (t.payment === "new") { */
        /*   await prisma.transaction.update({ */
        /*     where: { */
        /*       id: t.id, */
        /*     }, */
        /*     data: { */
        /*       state: "new", */
        /*       payment: "", */
        /*     }, */
        /*   }); */
        /*   return await prisma.payment.deleteMany({ */
        /*     where: { */
        /*       loanId: input.id, */
        /*     }, */
        /*   }); */
        /* } */

        if (os_balance === 0) {
          return;
        }

        const add = await prisma.payment.create({
          data: {
            amount: amount,
            total: total_amount,
            outsArrears: roundOff(os_arrears),
            paidArrears: roundOff(pd_arrears),
            outsPenalty: roundOff(os_penalty),
            paidPenalty: roundOff(pd_penalty),
            outsInterest: roundOff(os_interest),
            paidInterest: roundOff(pd_interest),
            outsPrincipal: roundOff(os_principal),
            paidPrincipal: roundOff(pd_principal),
            outsBalance: roundOff(os_balance),
            currInstDate: time,
            mpesa: mpesa,
            type: type,
            loanId: input.id,
          },
        });
        if (add) {
          await prisma.transaction.update({
            where: {
              id: t.id,
            },
            data: {
              state: state,
              payment: payment_state,
            },
          });
        }
        await prisma.loan.update({
          where: {
            id: input.id,
          },
          data: {
            cleared: true,
          },
        });

        payment.push({
          amount: amount,
          total: total_amount,
          outsArrears: roundOff(os_arrears),
          paidArrears: roundOff(pd_arrears),
          outsPenalty: roundOff(os_penalty),
          paidPenalty: roundOff(pd_penalty),
          outsInterest: roundOff(os_interest),
          paidInterest: roundOff(pd_interest),
          outsPrincipal: roundOff(os_principal),
          paidPrincipal: roundOff(pd_principal),
          outsBalance: roundOff(os_balance),
          currInstDate: time,
          id: id,
          mpesa: mpesa,
          type: type,
          state: (t.state === "new" && "new") || "handled",
          payment: payment_state,
        });

        return payment;
      });

      const data = {
        loan: loan,
        payment: payment,
        transactions: transactions,
        notification: notification,
      };

      return data;
    }),
});
