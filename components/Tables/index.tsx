import React from "react";
import { TitleText } from "../../components";
import { Table, Group, Badge } from "@mantine/core";
import { Loan, Transaction, Member, Product, Payment } from "@prisma/client";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";

export function PaymentTable({
  payments,
  call,
}: {
  payments: Payment[];
  call: string;
}) {
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
    </tr>
  );
  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {payments?.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function PaymentRow({ payment, call }: { payment: Payment; call: string }) {
  /* const router = useRouter(); */
  return (
    <>
      {call === "payments" && (
        <tr style={{ cursor: "auto" }}>
          <td>{`${payment.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.outsArrears}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.paidArrears}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.outsPenalty}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.paidPenalty}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.outsInterest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.paidInterest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.outsPrincipal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.paidPrincipal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          <td>{`${payment.outsBalance}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        </tr>
      )}
    </>
  );
}

export function PaymentsTable({
  loans,
  call,
}: {
  loans: Loan[];
  call: string;
}) {
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
            <PaymentsRow key={loan.id} loan={loan} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function PaymentsRow({ loan, call }: { loan: Loan; call: string }) {
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

export function LoansTable({ loans, call }: { loans: Loan[]; call: string }) {
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
            <LoansRow key={loan.id} loan={loan} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function LoansRow({ loan, call }: { loan: Loan; call: string }) {
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
    </>
  );
}

export function MembersTable({
  members,
  call,
}: {
  members: Member[];
  call: string;
}) {
  const Header = () => (
    <tr>
      <th>Code</th>
      <th>Names</th>
      <th>Phone</th>
      <th>ID</th>
      <th>Date</th>
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
          {members?.map((member) => (
            <MemberRow key={member.memberId} member={member} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function MemberRow({ member, call }: { member: Member; call: string }) {
  const router = useRouter();
  return (
    <>
      {call === "all-members" && (
        <tr style={{ cursor: "auto" }}>
          <td>{member.memberId}</td>
          <td>{member.firstName + " " + member.lastName}</td>
          <td>{member.phoneNumber}</td>
          <td>{member.idPass}</td>
          <td>{member.date}</td>
          <td>
            {member.maintained ? (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/members/${member.id}`)}
                variant="gradient"
                gradient={{
                  from: "teal",
                  to: "lime",
                }}
              >
                Active
              </Badge>
            ) : (
              <Badge
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/loans/maintain/${member.id}`)}
                variant="gradient"
                gradient={{
                  from: "indigo",
                  to: "cyan",
                }}
              >
                Maintain
              </Badge>
            )}
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
      {call === "create-loan" && !member.maintained && (
        <tr style={{ cursor: "auto" }}>
          <td>{member.memberId}</td>
          <td>{member.firstName + " " + member.lastName}</td>
          <td>{member.phoneNumber}</td>
          <td>{member.idPass}</td>
          <td>{member.date}</td>
          <td>
            <Badge
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/loans/maintain/${member.id}`)}
              variant="gradient"
              gradient={{
                from: "indigo",
                to: "cyan",
              }}
            >
              Maintain
            </Badge>
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
      {call === "approvals" && member.maintained && (
        <tr style={{ cursor: "auto" }}>
          <td>{member.memberId}</td>
          <td>{member.firstName + " " + member.lastName}</td>
          <td>{member.phoneNumber}</td>
          <td>{member.idPass}</td>
          <td>{member.date}</td>
          <td>
            <Badge
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/approve/${member.id}`)}
              variant="gradient"
              gradient={{
                from: "teal",
                to: "lime",
              }}
            >
              Approve
            </Badge>
          </td>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/members/${member.id}`)}
          >
            <IconEdit size={24} />
          </td>
        </tr>
      )}
    </>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const Header = () => (
    <tr>
      <th>Code</th>
      <th>Name</th>
      <th>Cycle</th>
      <th>Rate</th>
      <th>Status</th>
    </tr>
  );

  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {products?.map((product) => (
            <ProductRow key={product.productId} product={product} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={() => router.push(`/products/details/${product.id}`)}
    >
      <td>{product.productId}</td>
      <td>{product.productName}</td>
      <td>{product.repaymentCycle}</td>
      <td>{product.interestRate} %</td>
      <td>
        {product.approved ? (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/details/${product.id}`)}
            variant="gradient"
            gradient={{
              from: "teal",
              to: "lime",
            }}
          >
            Approved
          </Badge>
        ) : (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/details/${product.id}`)}
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
    </tr>
  );
}
export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const Header = () => (
    <tr>
      <th>ID</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>Type</th>
    </tr>
  );
  return (
    <>
      <Group position="center" m="lg">
        <TitleText title="Todays Transactions" />
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
            <TransactionRow
              key={transaction.transID}
              transaction={transaction}
            />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const router = useRouter();
  const today = new Date();
  const date = today.toLocaleDateString();

  const time_str = date.split("/")[2] + date.split("/")[1] + date.split("/")[0];

  return (
    <>
      {transaction.transTime.startsWith(time_str) && (
        <tr
          style={{
            cursor: transaction.billRefNumber !== "" ? "pointer" : "text",
          }}
          onClick={() => {
            transaction.billRefNumber !== ""
              ? router.push(`/members/paid/${transaction.transID}`)
              : null;
          }}
        >
          <td>{transaction.transID}</td>
          <td>
            {transaction.firstName +
              " " +
              transaction.middleName +
              " " +
              transaction.lastName}
          </td>
          <td>{transaction.transAmount}</td>
          <td>{transaction.msisdn}</td>
          {transaction.billRefNumber === "" ? (
            <td>{transaction.transTime}</td>
          ) : (
            <td>{transaction.billRefNumber}</td>
          )}
        </tr>
      )}
    </>
  );
}
