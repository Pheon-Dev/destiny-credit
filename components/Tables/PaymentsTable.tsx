import React from "react";
import { Table, Badge } from "@mantine/core";
import { Loans } from "../../types";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";

export function PaymentsTable({ loans, call }: { loans: Loans[]; call: string }) {
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
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {loans?.map((loan) => (
            <LoanRow key={loan.id} loan={loan} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function LoanRow({ loan, call }: { loan: Loans; call: string }) {
  const router = useRouter();
  return (
    <>
      {call === "payments" && loan.disbursed && (
        <tr style={{ cursor: "auto" }}>
          <td>{loan.memberName}</td>
          <td>{`${loan.principal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${loan.interest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${loan.installment}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{loan.tenure} {loan.cycle.toLowerCase() === "daily" ? "Days" : loan.cycle.toLowerCase() === "weekly" ? "Weeks" : "Months" }</td>
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
}

