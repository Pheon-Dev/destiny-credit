import { Loan, Transaction } from "@prisma/client";
import React, { useCallback, useEffect } from "react";
import { trpc } from "../../utils/trpc";

export const LoanPayments = () => {
  const utils = trpc.useContext();

  let payment: any = [];

  /* transactions?.map((transaction) => { */
  /* const transactions = trpc.transactions.member_transactions.useQuery({ */
  /*   firstname: firstName, */
  /*   middlename: middleName, */
  /*   lastname: lastName, */
  /*   phone: msisdn, */
  /* }); */

  const { data: active } = trpc.loans.active_loans.useQuery();
  const { data: transactions } = trpc.transactions.transactions.useQuery();

  if (!active) return console.log("No Active Loans");

  active.map((loan) => {
    const firstname = `${loan.memberName.split(" ")[0]}`;
    const middlename = `${loan.memberName.split(" ")[1]}`;
    const lastname = `${loan.memberName.split(" ")[2]}`;
    const phone = `${loan.phone}`;

    /* console.log(phone) */
    /* if (phone === "") return; */
    /* if (phone === "null") return; */
    /* if (phone === "undefined") return; */
    if (firstname === "") return;
    if (firstname === "null") return;
    if (firstname === "undefined") return;


    /* console.log(firstname) */
    /* console.log(transactions?.length) */

    const name = firstname + " " + middlename + " " + lastname;
    const search = (name: string, phone: string) => {
      return transactions?.find((transaction: Transaction) => {
        const memberName =
          transaction?.firstName +
          " " +
          transaction?.middleName +
          " " +
          transaction?.lastName;

        if (memberName !== name) return;
        if (memberName === name)
          console.log(name)
        return renderPayment(
          +transaction?.transAmount,
          +loan?.principal,
          +loan?.interest,
          +loan?.installment,
          +loan?.penalty,
          +loan?.sundays,
          +loan?.tenure,
          +loan?.cycle,
          +loan.payment[payment.length - 1]?.outsArrears,
          +loan.payment[payment.length - 1]?.paidArrears,
          +loan.payment[payment.length - 1]?.outsPenalty,
          +loan.payment[payment.length - 1]?.paidPenalty,
          +loan.payment[payment.length - 1]?.outsInterest,
          +loan.payment[payment.length - 1]?.paidInterest,
          +loan.payment[payment.length - 1]?.outsPrincipal,
          +loan.payment[payment.length - 1]?.paidPrincipal,
          +loan.payment[payment.length - 1]?.outsBalance,
          loan?.id,
          transaction?.transID
        )
      });
    };

    search(name, phone);
  });
  /* useEffect(() => { */
  /*   let subscribe = true; */
  /*   if (subscribe) { */
  /*     search(name, phone); */
  /*   } */
  /**/
  /*   return () => { */
  /*     subscribe = false; */
  /*   }; */
  /* }, [name, phone]); */
  /* const new_payment = trpc.loans.create_payment.useMutation({ */
  /*   onSuccess: async () => { */
  /*     await utils.loans.payments.invalidate(); */
  /*   }, */
  /* }); */
  /* const addPayment = useCallback(() => { */
  /*   new_payment.mutate({ */
  /*     amount: `${payment?.amount}`, */
  /*     outsArrears: `${payment.outsArrears}`, */
  /*     paidArrears: `${payment.paidArrears}`, */
  /*     outsPenalty: `${payment.outsPenalty}`, */
  /*     paidPenalty: `${payment.paidPenalty}`, */
  /*     outsInterest: `${payment.outsInterest}`, */
  /*     paidInterest: `${payment.paidInterest}`, */
  /*     outsPrincipal: `${payment.outsPrincipal}`, */
  /*     paidPrincipal: `${payment.paidPrincipal}`, */
  /*     outsBalance: `${payment.outsBalance}`, */
  /*     currInstDate: `${payment.currInstDate}`, */
  /*     nextInstDate: `${payment.nextInstDate}`, */
  /*     loanId: `${payment.id}`, */
  /*     mpesa: `${payment.mpesa}`, */
  /*   }); */
  /* }, []); */
  /* return addPayment; */

  return <pre>{JSON.stringify(active, undefined, 2)} </pre>;
};

const renderPayment = (
  amount: number,
  principal: number,
  interest: number,
  installment: number,
  penalty: number,
  sundays: number,
  tenure: number,
  cycle: number,
  prev_outsArrears: number,
  prev_paidArrears: number,
  prev_outsPenalty: number,
  prev_paidPenalty: number,
  prev_outsInterest: number,
  prev_paidInterest: number,
  prev_outsPrincipal: number,
  prev_paidPrincipal: number,
  prev_outsBalance: number,
  id: string,
  transID: string
) => {
  let payment: any = [];

  let os_arrears = prev_outsArrears;
  let pd_arrears = prev_paidArrears;
  let os_penalty = prev_outsPenalty;
  let pd_penalty = prev_paidPenalty;
  let os_interest = prev_outsInterest;
  let pd_interest = prev_paidInterest;
  let os_principal = prev_outsPrincipal;
  let pd_principal = prev_paidPrincipal;
  let os_balance = prev_outsBalance;

  let rem_amount = amount;
  const term_interest = interest / tenure;
  const term_principal = installment - term_interest;

  if (prev_outsBalance > 0) {
    let tos_arrears =
      prev_outsArrears + os_penalty + os_interest + os_principal;

    os_arrears = tos_arrears - amount;

    (os_arrears > 0 && (pd_arrears = prev_paidArrears + amount)) ||
      (pd_arrears = prev_paidArrears + tos_arrears);
    rem_amount = amount - tos_arrears;

    os_penalty = 0;
    pd_penalty = 0;

    let tos_interest = prev_outsInterest + term_interest;

    (rem_amount > 0 &&
      (os_interest = tos_interest - rem_amount) &&
      (rem_amount -= tos_interest)) ||
      ((os_interest = tos_interest));

    (rem_amount > 0 &&
      (pd_interest = prev_paidInterest + rem_amount) &&
      (rem_amount -= tos_interest)) ||
      ((pd_interest = tos_interest));

    let tos_principal = prev_outsPrincipal + term_principal;

    (rem_amount > 0 &&
      (os_principal = tos_principal - rem_amount) &&
      (rem_amount -= tos_principal)) ||
      ((os_principal = tos_principal));

    (rem_amount > 0 &&
      (pd_principal = tos_principal - rem_amount) &&
      (rem_amount -= tos_principal)) ||
      ((pd_principal = tos_principal));

    return os_balance = prev_outsBalance - amount
  }

  payment.push({
    outsArrears: os_arrears,
    paidArrears: pd_arrears,
    outsPenalty: os_penalty,
    paidPenalty: pd_penalty,
    outsInterest: os_interest,
    paidInterest: pd_interest,
    outsPrincipal: os_principal,
    paidPrincipal: pd_principal,
    outsBalance: os_balance,
    currInstDate: pd_penalty,
    nextInstDate: pd_penalty,
    amount: amount,
    id: id,
    mpesa: transID,
  });
  console.table(payment)
  return payment;
};
