import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { renderPayment } from "../../../utils/Loan/payments";
import { Protected, TitleText } from "../../../components";
import { Group, Skeleton, Table } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";
import { Transaction } from "@prisma/client";

const PaymentsList = ({ email, status }: { email: string; status: string }) => {
  const [loanPayments, setLoanPayments] = useState([]);
  const router = useRouter();
  const id = router.query.payments as string;

  const Header = () => (
    <tr>
      <th>Payment Date</th>
      <th>Paid Amount</th>
      <th>O|S Arrears</th>
      <th>Paid Arrears</th>
      <th>O|S Penalty</th>
      <th>Paid Penalty</th>
      <th>O|S Interest</th>
      <th>Paid Interest</th>
      <th>O|S Principal</th>
      <th>Paid Principal</th>
      <th>O|S Balance</th>
      <th>M-PESA</th>
    </tr>
  );

  const Row = () => {
    return <Skeleton height={8} radius="xl" />;
  };

  const { data: payments, fetchStatus } =
    trpc.loans.payments.useQuery({ id: id });

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

  /* const { data: active } = trpc.loans.active_loans.useQuery(); */

  /* active?.map((loan) => { */
  const firstname = `${payments?.memberName.split(" ")[0]}`;
  const middlename = `${payments?.memberName.split(" ")[1]}`;
  const lastname = `${payments?.memberName.split(" ")[2]}`;
  /* const phone = `${payments?.phone}`; */

  console.log(
    {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      /* phone: phone, */
    })
  const { data: transactions } = trpc.transactions.payments.useQuery({
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    /* phone: phone, */
  });
  /* console.log(phone) */
  /* if (phone === "") return; */
  /* if (phone === "null") return; */
  /* if (phone === "undefined") return; */
  /* if (firstname === "") return; */
  /* if (firstname === "null") return; */
  /* if (firstname === "undefined") return; */


  /* console.log(firstname) */
  /* console.log(transactions?.length) */

  /* let pay: any = [] */
  /**/
  /* const name = firstname + " " + middlename + " " + lastname; */
  /* const search = (name: string, phone: string) => { */
  /*   return transactions?.find((transaction: Transaction) => { */
  /*     const memberName = */
  /*       transaction?.firstName + */
  /*       " " + */
  /*       transaction?.middleName + */
  /*       " " + */
  /*       transaction?.lastName; */
  /**/
  /*     if (name === memberName) return pay.push({ */
  /*       transaction */
  /*     }) */
  /*   }); */
  /* }; */

  let pay: any = []
  transactions?.map((transaction: Transaction) => {
    pay.push({
      payment:
        renderPayment(
          +transaction?.transAmount,
          `${payments?.principal}`,
          `${payments?.interest}`,
          `${payments?.installment}`,
          `${payments?.penalty}`,
          `${payments?.sundays}`,
          `${payments?.tenure}`,
          `${payments?.cycle}`,
          `${payments?.payment[payments?.payment.length - 1]?.outsArrears}`,
          `${payments?.payment[payments?.payment.length - 1]?.paidArrears}`,
          `${payments?.payment[payments?.payment.length - 1]?.outsPenalty}`,
          `${payments?.payment[payments?.payment.length - 1]?.paidPenalty}`,
          `${payments?.payment[payments?.payment.length - 1]?.outsInterest}`,
          `${payments?.payment[payments?.payment.length - 1]?.paidInterest}`,
          `${payments?.payment[payments?.payment.length - 1]?.outsPrincipal}`,
          `${payments?.payment[payments?.payment.length - 1]?.paidPrincipal}`,
          `${payments?.payment[payments?.payment.length - 1]?.outsBalance}`,
          `${payments?.id}`,
          transaction?.transID
        )
    })
  })

  /* useEffect(() => { */
  /*   let subscribe = true */
  /*   if (subscribe) { */
  /*     search(name, phone) */
  /* setLoanPayments(pay) */
  /*   } */
  /*   return () => { */
  /*     subscribe = false */
  /*   } */
  /* }, [pay, loanPayments, name, phone]) */

  return (
    <>
      {payments && (
        <>
          <Group position="center" m="lg">
            <TitleText title={`${payments?.memberName}`} />
          </Group>
          <Table striped highlightOnHover horizontalSpacing="md">
            <thead>
              <Header />
            </thead>
            <tbody>
              {payments?.payment?.map((payment) => (
                <tr key={payment?.id} style={{ cursor: "auto" }}>
                  <td>{date(payment?.currInstDate)}</td>
                  <td>
                    {`${payment.amount}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.paidPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.outsBalance}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>{payment.mpesa}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <Header />
            </tfoot>
          </Table>
        </>
      )}
      {!payments && (
        <>
          <Group position="center" m="lg">
            <TitleText title="Loading Loan Payment Statement ..." />
          </Group>
          <Group position="center" m="lg" style={{ position: "relative" }}>
            <Skeleton height={16} radius="xl" />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Skeleton height={16} radius="xl" />
          </Group>
        </>
      )}
      <pre>{JSON.stringify(pay, undefined, 2)}</pre>
    </>
  );
};

const Page: NextPage = () => {
  const { status, data } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <Protected>
      {check?.length > 0 && <PaymentsList email={email} status={status} />}
    </Protected>
  );
};

export default Page;
