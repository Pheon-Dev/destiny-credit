import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Protected, TitleText } from "../../../components";
import { Group, Skeleton, Table } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

const PaymentsList = ({ email, status }: { email: string; status: string }) => {
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

  const { data: payment, fetchStatus } =
    trpc.payments.payment.useQuery({ id: id });

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

  return (
    <>
      {payment && (
        <>
          <Group position="center" m="lg">
            <TitleText title={`${payment?.loan.memberName}`} />
          </Group>
          <Table striped highlightOnHover horizontalSpacing="md">
            <thead>
              <Header />
            </thead>
            <tbody>
              {payment?.loan?.payment?.map((payment) => (
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
      {!payment && (
        <>
          <Group position="center" m="lg">
            <TitleText title="Loading payment Payment Statement ..." />
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
      <pre>{JSON.stringify(payment, undefined, 2)}</pre>
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
