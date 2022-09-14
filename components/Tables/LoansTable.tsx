import React from "react";
import { Loan } from "@prisma/client";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";
import { Table, Badge, Group } from "@mantine/core";
import { TitleText } from "../Text/TitleText";

export const LoansTable = ({
  loans,
  call,
}: {
  loans: Loan[];
  call: string;
}) => {
  const Header = () => (
    <tr>
      <th>Names</th>
      <th>Principal</th>
      <th>Interest</th>
      <th>Installment</th>
      <th>Tenure</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  );
  return (
    <>
      <Group position="center" m="lg">
        {call === "approvals" && <TitleText title="Approvals List" />}
        {call === "disbursements" && <TitleText title="Disbursements List" />}
        {call === "all-loans" && <TitleText title="All Loans List" />}
      </Group>
      
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {loans?.map((loan) => (
            <LoansRow key={loan.id} loan={loan} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
};

const LoansRow = ({ loan, call }: { loan: Loan; call: string }) => {
  const router = useRouter();
  return (
    <>
      {call === "approvals" && !loan.disbursed && (
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
            {loan.approved ? (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "teal",
                  to: "lime",
                }}
              >
                Disburse
              </Badge>
            ) : (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/approve/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "indigo",
                  to: "cyan",
                }}
              >
                Approve
              </Badge>
            )}
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/loans/${loan.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
      {call === "disbursements" && loan.approved && (
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
            {loan.disbursed ? (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/payments/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "teal",
                  to: "lime",
                }}
              >
                Disbursed
              </Badge>
            ) : (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "indigo",
                  to: "cyan",
                }}
              >
                Disburse
              </Badge>
            )}
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/loans/${loan.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
      {call === "all-loans" && (
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
            {!loan.disbursed && !loan.approved && loan.maintained && (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/approve/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "indigo",
                  to: "red",
                }}
              >
                Approve
              </Badge>
            )}
            {!loan.disbursed && loan.approved && (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "red",
                  to: "blue",
                }}
              >
                Disburse
              </Badge>
            )}
            {loan.disbursed && (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/payments/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "blue",
                  to: "violet",
                }}
              >
                Active
              </Badge>
            )}
            {loan.cleared && (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "violet",
                  to: "gray",
                }}
              >
                Cleared
              </Badge>
            )}
            {loan.defaulted && (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/disburse/${loan.id}`)}
                variant="gradient"
                gradient={{
                  from: "red",
                  to: "orange",
                }}
              >
                Defaulted
              </Badge>
            )}
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/loans/${loan.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
    </>
  );
};
