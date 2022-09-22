import React from "react";
import type { Loan } from "@prisma/client";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";
import { Table, Badge, Group, Tooltip } from "@mantine/core";
import { TitleText } from "../Text/TitleText";

export const LoansTable = ({
  loans,
  call,
  role,
}: {
  loans: Loan[];
  call: string;
  role: string;
}) => {
  const Header = () => (
    <tr>
      <th>Names</th>
      <th>Principal</th>
      <th>Interest</th>
      <th>Installment</th>
      <th>Tenure</th>
      <th>Status</th>
      {role !== "CO" && <th>Action</th>}
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
            <LoansRow key={loan.id} loan={loan} call={call} role={role} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
};

const LoansRow = ({
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
            <>
            {role === "CO" &&
              <Badge
                style={{ cursor: "pointer" }}
                variant="gradient"
                gradient={{
                  from: "indigo",
                  to: "grey",
                }}
              >
                Pending
              </Badge>
            }
            {role !== "CO" &&
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
            }
              </>
            ) : (
            <>
            {role === "CO" &&
            <Tooltip label="Approval" color="gray" withArrow>
              <Badge
                style={{ cursor: "pointer" }}
                variant="gradient"
                gradient={{
                  from: "grey",
                  to: "indigo",
                }}
              >
                Pending
              </Badge>
              </Tooltip>
            }
            {role !== "CO" &&
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
            }
              </>
            )}
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
            <>
            {role === "CO" &&
              <Badge
                style={{ cursor: "pointer" }}
                variant="gradient"
                gradient={{
                  from: "indigo",
                  to: "grey",
                }}
              >
                Pending
              </Badge>
            }
            {role !== "CO" &&
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
            }
              </>
            )}
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
            <>
            {role === "CO" &&
            <Tooltip label="Approval" color="gray" withArrow>
              <Badge
                style={{ cursor: "pointer" }}
                variant="gradient"
                gradient={{
                  from: "grey",
                  to: "indigo",
                }}
              >
                Pending
              </Badge>
              </Tooltip>
            }
            {role !== "CO" &&
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
            }
              </>
            )}
            {!loan.disbursed && loan.approved && (
            <>
            {role === "CO" &&
            <Tooltip label="Disbursement" color="gray" withArrow>
              <Badge
                style={{ cursor: "pointer" }}
                variant="gradient"
                gradient={{
                  from: "grey",
                  to: "green",
                }}
              >
                Pending
              </Badge>
              </Tooltip>
            }
            {role !== "CO" &&
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
            }
              </>
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
