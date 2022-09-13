import React from "react";
import { TitleText } from "../../components";
import { Table, Group } from "@mantine/core";
import { Transaction } from "@prisma/client";
import { useRouter } from "next/router";

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
          {transactions?.map((transaction, index) => (
            <TransactionRow
              key={index}
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
