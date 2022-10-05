import React, { useState, useEffect, useCallback, Suspense } from "react";
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
      <th>M-PESA Code</th>
    </tr>
  );

  const Row = () => {
    return <Skeleton height={8} radius="xl" />;
  };

  const { data: payment } =
    trpc.payments.payment.useQuery({ id: id });

  return (
    <Suspense
      fallback={
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
      }
    >
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
                <tr key={payment?.mpesa} style={{ cursor: "auto" }}>
                  <td>{payment?.currInstDate}</td>
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
              {/* {payment?.payment?.map((payment: any) => ( */}
              {/*   <tr key={payment?.mpesa} style={{ cursor: "auto" }}> */}
              {/*     <td>{payment?.currInstDate}</td> */}
              {/*     <td> */}
              {/*       {`${payment.amount}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.outsArrears}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.paidArrears}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.outsPenalty}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.paidPenalty}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.outsInterest}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.paidInterest}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.outsPrincipal}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.paidPrincipal}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td> */}
              {/*       {`${payment.outsBalance}`.replace( */}
              {/*         /\B(?=(\d{3})+(?!\d))/g, */}
              {/*         "," */}
              {/*       )} */}
              {/*     </td> */}
              {/*     <td>{payment.mpesa}</td> */}
              {/*   </tr> */}
              {/* ))} */}
              {payment.loan.payment.length > 0 && (

                <tr style={{ backgroundColor: "grey", color: "white" }}>
                  <td>TOTAL</td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.total}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidArrears}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidPenalty}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidInterest}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.paidPrincipal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>
                    {`${payment.loan.payment[payment.loan.payment.length - 1]?.outsBalance}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>TOTAL</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <Header />
            </tfoot>
          </Table>
        </>
      )}
      <pre>{JSON.stringify(payment, undefined, 2)}</pre>
    </Suspense>
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
