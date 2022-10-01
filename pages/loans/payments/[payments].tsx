import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Protected, TitleText } from "../../../components";
import { Group, Table } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

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
  const TransactionsHeader = () => (
    <tr>
      <th>ID</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>Date</th>
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
      <Group position="center" m="lg">
        <TitleText title={`${loan?.memberName}`} />
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
            <Header />
        </thead>
        <tbody>
          {transactions?.map((payment) => (
            <tr key={payment?.id} style={{ cursor: "auto" }}>
                  <td>{date(payment?.transTime)}</td>
                  <td>
                    {`${payment.transAmount}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
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
                  <td>{payment.transID}</td>
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
