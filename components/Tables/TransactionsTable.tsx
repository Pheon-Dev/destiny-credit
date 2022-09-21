import React from "react";
import { TitleText } from "../../components";
import { Table, Group } from "@mantine/core";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";

export const TransactionsTable = ({
  transactions,
  call,
}: {
  transactions: Transaction[];
  call: string;
}) => {
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
        {call === "transactions" && <TitleText title="Todays Transactions" />}
        {call === "register" && <TitleText title="Registration List" />}
        {call === "maintain" && <TitleText title="Maintenance List" />}
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {transactions?.map((transaction, index) => (
            <TransactionRow key={index} transaction={transaction} call={call} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
};

const TransactionRow = ({
  transaction,
  call,
}: {
  transaction: Transaction;
  call: string;
}) => {
  const router = useRouter();
  const today = new Date("2022-09-19");
  const date = today.toLocaleDateString();

  const time_str = date.split("/")[2] + date.split("/")[1] + date.split("/")[0];

  return (
    <>
      {call === "transactions" && transaction.transTime.startsWith(time_str) && (
        <tr
          style={{
            cursor: transaction.billRefNumber !== "" ? "pointer" : "text",
          }}
          onClick={() => {
            transaction.billRefNumber !== ""
              ? router.push(`/members/register/${transaction.transID}`)
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
          <td>
            {`${transaction.transAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>{transaction.msisdn}</td>
          {transaction.billRefNumber === "" ? (
            <td>{transaction.transTime}</td>
          ) : (
            <td>{transaction.billRefNumber}</td>
          )}
        </tr>
      )}
      {call === "register" &&
        transaction.transTime.startsWith(time_str) &&
        transaction.billRefNumber.startsWith("M") && (
          <tr
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/members/register/${transaction.transID}`);
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
            <td>
              {`${transaction.transAmount}`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
            </td>
            <td>{transaction.msisdn}</td>
            {transaction.billRefNumber === "" ? (
              <td>{transaction.transTime}</td>
            ) : (
              <td>{transaction.billRefNumber}</td>
            )}
          </tr>
        )}
      {call === "maintain" &&
        transaction.transTime.startsWith(time_str) &&
        transaction.billRefNumber.startsWith("P") && (
          <tr
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/loans/maintain/${transaction.transID}`);
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
            <td>
              {`${transaction.transAmount}`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
            </td>
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
};
