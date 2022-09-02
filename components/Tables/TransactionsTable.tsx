import React from "react";
import { Table } from "@mantine/core";
import { Transactions } from "../../types";

export function TransactionsTable({
  transactions,
}: {
  transactions: Transactions[];
}) {
  const Header = () => (
          <tr>
            <th>ID</th>
            <th>Names</th>
            <th>Amount</th>
            <th>Phone</th>
            <th>M-PESA</th>
            <th>Type</th>
          </tr>
  );
  return (
    <>
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

function TransactionRow({ transaction }: { transaction: Transactions }) {
  return (
    <tr>
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
      <td>{transaction.transactionType === "Pay Bill" ? "Paybill" : "Till"}</td>
      <td>{transaction.billRefNumber}</td>
    </tr>
  );
}
