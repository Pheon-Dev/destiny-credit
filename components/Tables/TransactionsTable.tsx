import React from "react";
import { Group, Table } from "@mantine/core";
import { Transactions } from "../../types";
import { TitleText } from "../../components";
import Router, { useRouter } from "next/router";

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

function TransactionRow({ transaction }: { transaction: Transactions }) {
  const router = useRouter();
  const today = new Date()
  const date = today.toLocaleDateString()

  const time_str = date.split("/")[2] + date.split("/")[1] + date.split("/")[0]

  return (
    <>
      {transaction.transTime.startsWith(time_str) && (
        <tr
        style={{
          cursor: transaction.billRefNumber !== "" ? "pointer" : "text"
          }}
        onClick={() => {
        transaction.billRefNumber !== "" ? router.push(`/members/paid/${transaction.transID}`) :  router.push(`/members/paid/${transaction.transID}`)
          }
          }>
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
          {transaction.billRefNumber === "" ?
          <td>{transaction.transTime}</td>
          :
          <td>{transaction.billRefNumber}</td>
          }
        </tr>
      )}
    </>
  );
}
