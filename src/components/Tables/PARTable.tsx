import { Badge, Group, Table } from "@mantine/core";
import type { Loan } from "@prisma/client";
import { IconEdit } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EmptyTable } from "../../components";
import { trpc } from "../../utils/trpc";
import { TitleText } from "../Text/TitleText";

export const PARTable = ({
  call,
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
                <PARRow
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

const PARRow = ({
  loan,
  call,
  role,
}: {
  loan: Loan;
  call: string;
  role: string;
}) => {
  const router = useRouter();
  /* const {data: payments} = trpc.payments.payment.useQuery({ id: loan.id }); */
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