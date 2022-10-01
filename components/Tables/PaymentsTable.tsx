import React, { useState, useEffect } from "react";
import type { Loan } from "@prisma/client";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";
import { Table, Badge, Group } from "@mantine/core";
import { TitleText } from "../Text/TitleText";
import { EmptyTable } from "../../components";
import { trpc } from "../../utils/trpc";

export const PaymentsTable = ({
  call,
  status,
  email,
}: {
  call: string;
  status: string;
  email: string;
}) => {
  const { data: loans, fetchStatus } = trpc.loans.loans.useQuery();

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
    setUser({
      id: `${user_data?.data?.id}`,
      role: `${user_data?.data?.role}`,
      username: `${user_data?.data?.username}`,
      firstname: `${user_data?.data?.firstName}`,
      lastname: `${user_data?.data?.lastName}`,
      email: `${user_data?.data?.email}`,
      state: `${user_data?.data?.state}`,
    });
  }, []);

  const Header = () => (
    <tr>
      <th>Names</th>
      <th>Principal</th>
      <th>Interest</th>
      <th>Installment</th>
      <th>Tenure</th>
      <th>Status</th>
      {user?.role !== "CO" && <th>Action</th>}
    </tr>
  );
  return (
    <>
      {!loans && <EmptyTable call="payments" status={fetchStatus} />}
      {loans && (
        <>
          <Group position="center" m="lg">
            {call === "payments" && <TitleText title="Payments List" />}
          </Group>
          <Table striped highlightOnHover horizontalSpacing="md">
            <thead>
              <Header />
            </thead>
            <tbody>
              {loans?.map((loan) => (
                <PaymentsRow
                  key={loan.id}
                  loan={loan}
                  call={call}
                  role={`${user?.role}`}
                />
              ))}
            </tbody>
            <tfoot>
              <Header />
            </tfoot>
          </Table>
        </>
      )}
    </>
  );
};

const PaymentsRow = ({
  loan,
  call,
  role,
}: {
  loan: Loan;
  call: string;
  role: string;
}) => {
  const router = useRouter();
  return (
    <>
      {call === "payments" && loan.disbursed && (
        <tr style={{ cursor: "auto" }}>
          <td>{loan.memberName}</td>
          <td>{`${loan.principal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${loan.interest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${loan.installment}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>
            {loan.tenure}{" "}
            {loan.cycle.toLowerCase() === "daily"
              ? "Days"
              : loan.cycle.toLowerCase() === "weekly"
              ? "Weeks"
              : "Months"}
          </td>
          <td>
            <Badge
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/loans/payments/${loan.id}`)}
              variant="gradient"
              gradient={{
                from: "teal",
                to: "lime",
              }}
            >
              Payments
            </Badge>
          </td>
          {role !== "CO" && (
            <td
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/loans/${loan.id}`)}
            >
              <IconEdit size={24} />
            </td>
          )}
        </tr>
      )}
    </>
  );
};
