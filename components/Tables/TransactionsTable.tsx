import React from "react";
import { Table } from "@mantine/core";
import { Transactions } from "../../types";

export function TransactionsTable({
  transactions,
}: {
  transactions: Transactions[];
}) {
  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAMES</th>
            <th>AMOUNT</th>
            <th>PHONE</th>
            <th>M-PESA</th>
            <th>TYPE</th>
          </tr>
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
          <tr>
            <th>ID</th>
            <th>NAMES</th>
            <th>AMOUNT</th>
            <th>PHONE</th>
            <th>M-PESA</th>
            <th>TYPE</th>
          </tr>
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
