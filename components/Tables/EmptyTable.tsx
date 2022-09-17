import React from "react";
import { TitleText } from "../../components";
import { Table, Group } from "@mantine/core";

export const EmptyTable = ({ call }: { call: string }) => {
  const TransactionsHeader = () => (
    <tr>
      <th>ID</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>Type</th>
    </tr>
  );

  const MembersHeader = () => (
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

  const LoansHeader = () => (
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

  const PaymentsHeader = () => (
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

  const PaymentHeader = () => (
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
      <Group position="center" m="lg">
        {call === "transactions" && <TitleText title="Todays Transactions" />}
        {call === "register" && <TitleText title="Registration List" />}
        {call === "approvals" && <TitleText title="Approvals List" />}
        {call === "create-loan" && <TitleText title="Maintain a New Loan" />}
        {call === "all-members" && <TitleText title="All Members List" />}
        {call === "approvals" && <TitleText title="Approvals List" />}
        {call === "disbursements" && <TitleText title="Disbursements List" />}
        {call === "all-loans" && <TitleText title="All Loans List" />}
        {call === "payments" && <TitleText title="Payments List" />}
        {call === "payment" && <TitleText title="Payments List" />}
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
        <tr>
        <th></th>
        </tr>
          {/* {call === "transactions" || */}
          {/*   (call === "register" && <TransactionsHeader />)} */}
          {/* {call === "all-members" || */}
          {/*   call === "create-loan" || */}
          {/*   (call === "approvals" && <MembersHeader />)} */}
          {/* {call === "all-loans" || */}
          {/*   call === "approvals" || */}
          {/*   (call === "disbursements" && <LoansHeader />)} */}
          {/* {call === "payments" && <PaymentsHeader />} */}
          {/* {call === "payment" && <PaymentHeader />} */}
        </thead>
        <tbody>
          <tr>
            <Group position="center" m="lg">
              {call === "transactions" && (
                <TitleText title="No New Transactions Today" />
              )}
              {call === "register" && (
                <TitleText title="No New Members to Register Today" />
              )}
              {call === "all-members" && (
                <TitleText title="No Registered Members" />
              )}
              {call === "create-loan" && (
                <TitleText title="Maintenance List is Currently Empty" />
              )}
              {call === "approvals" && (
                <TitleText title="No Newly Maintained Loans to Approve Available" />
              )}
              {call === "disbursements" && (
                <TitleText title="No Newly Approved Loans to Disburse Available" />
              )}
              {call === "all-loans" && (
                <TitleText title="No Newly Disbursed Loans" />
              )}
              {call === "payments" && (
                <TitleText title="No New Active Loans" />
              )}
              {call === "payment" && (
                <TitleText title="No Payments Made To This Loan Yet" />
              )}
            </Group>
          </tr>
        </tbody>
      </Table>
      <Group position="center" m="lg"></Group>
    </>
  );
};
