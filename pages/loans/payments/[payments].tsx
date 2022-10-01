import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Protected, TitleText } from "../../../components";
import { Button, Group, Table } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

import { TransferList, TransferListData } from "@mantine/core";
import { Transaction } from "@prisma/client";

const PaymentsList = ({ email, status }: { email: string; status: string }) => {
  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const user_data = trpc.users.user.useQuery({
    email: `${email}`,
  });

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }
    return () => {
      subscribe = false;
    };
  }, [
    user_data?.data?.id,
    user_data?.data?.role,
    user_data?.data?.username,
    user_data?.data?.firstName,
    user_data?.data?.lastName,
    user_data?.data?.email,
    user_data?.data?.state,
  ]);

  const router = useRouter();
  const id = router.query.payments as string;
  const Header = () => (
    <tr>
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
      {/* <th>M-PESA</th> */}
    </tr>
  );
  const TransactionsHeader = () => (
    <tr>
      <th>ID</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>Type</th>
    </tr>
  );
  const { data: loan, fetchStatus: loan_status } =
    trpc.loans.loan_payment.useQuery({ id: id });
  const { data: member, fetchStatus: member_status } =
    trpc.members.member.useQuery({ id: `${loan?.memberId}` });
  const { data: payments, fetchStatus: payment_status } =
    trpc.loans.payment.useQuery({ id: id });

  const names = member?.lastName;

  const firstname = member?.firstName;
  const middlename = names?.split(" ")[0];
  const lastname = names?.split(" ")[1];
  const phonenumber = member?.phoneNumber;

  const { data: transactions, fetchStatus: transactions_status } =
    trpc.loans.transactions.useQuery({
      firstName: `${firstname}`,
      middleName: `${middlename}`,
      lastName: `${lastname}`,
      phoneNumber: `${phonenumber}`,
    });

  let handled: any = [];
  let recent: any = [];

  const date = (time: string) => {
    const day = time.slice(6, 8);
    const month = time.slice(4, 6);
    const year = time.slice(0, 4);
    const when = day + "-" + month + "-" + year;
    return when;
  };

  transactions?.map(
    (t: Transaction) =>
      (t.state === "new" &&
        recent.push({
          value: `${t.id}`,
          label: `${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}:
          ${date(`${t.transTime}`)}
          ${`paid ${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        })) ||
      (t.state === "registered" &&
        recent.push({
          value: `${t.id}`,
          label: `${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}:
          ${date(`${t.transTime}`)}
          ${`paid ${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        })) ||
      (t.state === "handled" &&
        handled.push({
          value: `${t.id}`,
          label: `${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}:
          ${date(`${t.transTime}`)}
          ${`paid ${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        })) ||
      (!t.state &&
        recent.push({
          value: `${t.id}`,
          label: `${t.transID.slice(0, 2) + "..." + t.transID.slice(7)}:
          ${date(`${t.transTime}`)}
          ${`paid ${t.transAmount} /=`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          ${t.billRefNumber === "" ? "via Till" : "via Pay Bill"}
          `,
        }))
  );

  const initialValues: TransferListData = [recent, handled];

  const HandlePayments = () => {
    const [data, setData] = useState<TransferListData>(initialValues);

    const utils = trpc.useContext();
    const handle = trpc.transactions.state.useMutation({
      onSuccess: async () => {
        await utils.transactions.transactions.invalidate();
      },
    });

    const handleState = useCallback(() => {
      try {
        if (data[1] && user?.id) {
          data[1].map((d) => {
            handle.mutate({
              id: d.value,
              handlerId: `${user?.id}`,
              updaterId: `${user?.id}`,
              payment: `loan`,
              state: `handled`,
            });
            /* console.log(d) */
          });
        }
      } catch (error) {
        console.log("Error Handling State!");
      }
    }, [data[1], user?.id, handle]);

    /* handleState() */
    /* useEffect(() => { */
    /*     let subscribe = true; */
    /*     if (subscribe) { */
    /*         handleState() */
    /*       } */
    /**/
    /*       return () => { */
    /*           subscribe = false */
    /*         } */
    /*   }, [data[1]]) */

    /* console.log(data[1]) */
    return (
      <>
        <Group position="center" m="lg">
          <TitleText title={`M-PESA Payments`} />
        </Group>
        <Group position="center" m="lg">
          <TransferList
            value={data}
            onChange={setData}
            listHeight={300}
            searchPlaceholder="Search..."
            nothingFound="Nothing here"
            titles={["Recent", "Handled"]}
            breakpoint="sm"
          />
          {data[1].length > 0 && (
            <Button variant="gradient" onClick={handleState}>
              Handle
            </Button>
          )}
        </Group>
        <Table striped highlightOnHover horizontalSpacing="md">
          <thead>
            <TransactionsHeader />
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr
                key={transaction.id}
                /* style={{ */
                /*   cursor: transaction.billRefNumber !== "" ? "pointer" : "text", */
                /* }} */
                /* onClick={() => { */
                /*   transaction.billRefNumber !== "" */
                /*     ? router.push(`/members/register/${transaction.transID}`) */
                /*     : null; */
                /* }} */
              >
                <td>{transaction.transID}</td>
                <td>
                  {transaction.firstName +
                    " " +
                    transaction.middleName +
                    " " +
                    transaction.lastName}
                </td>
                <td>
                  {`${transaction.transAmount}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                </td>
                <td>{transaction.msisdn}</td>
                {transaction.billRefNumber === "" ? (
                  <td>{transaction.transTime}</td>
                ) : (
                  <td>{transaction.billRefNumber}</td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <TransactionsHeader />
          </tfoot>
        </Table>
      </>
    );
  };

  const RecentPayments = () => {
    return (
      <>
        <Group position="center" m="lg">
          <TitleText title={`${loan?.memberName}`} />
        </Group>
        <Table
          striped
          highlightOnHover
          horizontalSpacing="md"
          style={{ position: "relative" }}
        >
          {/* <LoadingOverlay */}
          {/*   overlayBlur={2} */}
          {/*   visible={payment_status === "fetching"} */}
          {/* /> */}
          <thead>
            <Header />
          </thead>
          <tbody>
            {transactions?.map((payment) => (
              <tr key={payment?.id} style={{ cursor: "auto" }}>
                {payment?.state === "handled" && (
                  <>
                    <td>
                      {`${payment.transAmount}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {`${
                        Number(loan?.principal) - +payment?.transAmount
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    {/* <td> */}
                    {/*   {payment.mpesa} */}
                    {/* </td> */}
                  </>
                )}
              </tr>
            ))}
            {payments?.map((payment) => (
              <tr key={payment?.id} style={{ cursor: "auto" }}>
                <td>
                  {`${payment.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                {/* <td> */}
                {/*   {payment.mpesa} */}
                {/* </td> */}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <Header />
          </tfoot>
        </Table>
      </>
    );
  };
  return (
    <Protected>
      <RecentPayments />
      <HandlePayments />
      <pre>{JSON.stringify(transactions, undefined, 2)}</pre>
    </Protected>
  );
};

const Page: NextPage = () => {
  const { status, data } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <Protected>
      {check.length > 0 && <PaymentsList email={email} status={status} />}
    </Protected>
  );
};

export default Page;
