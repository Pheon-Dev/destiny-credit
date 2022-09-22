import React, { useState } from "react";
import { TitleText } from "../../components";
import { Table, Group } from "@mantine/core";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from "@mantine/dates";
import dayjs from "dayjs";

export const TransactionsTable = ({
  transactions,
  call,
}: {
  transactions: Transaction[];
  call: string;
}) => {
  /* const [value, setValue] = useState<DateRangePickerValue>([ */
  /* new Date(), */
  /* new Date(), */
  /* ]) */
  const Header = () => (
    <tr>
      <th>ID</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>Type</th>
    </tr>
  );
  const today = new Date();
  const date = today.toLocaleDateString();
  /* const date = value?.toLocaleDateString(); */

  /* console.log(value[0]?.toLocaleDateString()) */
  const [value, setValue] = useState(new Date());

  const new_date = value?.toLocaleDateString();
  console.log(new_date);
  const time_str =
    new_date.split("/")[2] + new_date.split("/")[1] + new_date.split("/")[0];

  return (
    <>
      <Group position="apart" m="md" mt="lg">
        {call === "transactions" && <TitleText title="Recent Transactions" />}
        {call === "register" && <TitleText title="Registration List" />}
        {call === "maintain" && <TitleText title="Maintain a New Loan" />}
        <DatePicker
          value={value}
          firstDayOfWeek="sunday"
          onChange={(e) => {
            e && setValue(new Date(e));
          }}
          maxDate={dayjs(new Date()).toDate()}
        />
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md" mb="xl">
        <thead>
          <Header />
        </thead>
        <tbody>
          {transactions?.map((transaction, index) => (
            <TransactionRow
              key={index}
              transaction={transaction}
              call={call}
              time_str={time_str}
            />
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
  time_str,
}: {
  transaction: Transaction;
  call: string;
  time_str: string;
}) => {
  const router = useRouter();

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
