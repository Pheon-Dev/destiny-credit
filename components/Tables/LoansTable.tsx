import React from "react";
import { Table, Badge } from "@mantine/core";
import { Loans } from "../../types";
import { useRouter } from "next/router";
import { IconEdit, IconInfoCircle } from "@tabler/icons";

export function LoansTable({ loans, call }: { loans: Loans[]; call: string }) {
  const Header = () => (
    <tr>
      <th>Names</th>
      <th>Principal</th>
      <th>Interest</th>
      <th>Installment</th>
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
      {call === "approvals" && (
        <tr style={{ cursor: "auto" }}>
          <td>{loan.memberName}</td>
          <td>{`${loan.principal}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${loan.interest}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${loan.installment}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
    </>
  );
}
