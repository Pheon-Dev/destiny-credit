import React, { useEffect, useState } from "react";
import { TitleText } from "../../components";
import { Table, Group, Switch } from "@mantine/core";
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
  const [time, setTime] = useState("");
  const [locale, setLocale] = useState(false);
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
  const [value, setValue] = useState(new Date());

  const new_date = value?.toLocaleDateString();

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      let yy = new_date?.split("/")[2];
      let mm =
        +new_date?.split("/")[1] < 10
          ? `0${+new_date?.split("/")[1]}`
          : `${new_date?.split("/")[1]}`;
      let dd =
        +new_date?.split("/")[0] < 10
          ? `0${+new_date?.split("/")[0]}`
          : `${new_date?.split("/")[0]}`;

      if (+yy > 31) {
        if (locale) setTime(`${yy}${mm}${dd}`);
        if (!locale) setTime(`${yy}${dd}${mm}`);
      }
      if (+mm > 31) {
        if (locale) setTime(`${mm}${yy}${dd}`);
        if (!locale) setTime(`${mm}${dd}${yy}`);
      }
      if (+dd > 31) {
        if (locale) setTime(`${dd}${mm}${yy}`);
        if (!locale) setTime(`${dd}${yy}${mm}`);
      }
    }
    return () => {
      subscribe = false;
    };
  }, [new_date, time, value, locale]);

  return (
    <>
      <Group position="apart" m="md" mt="lg">
        {call === "transactions" && <TitleText title="Recent Transactions" />}
        {call === "register" && <TitleText title="Registration List" />}
        {call === "maintain" && <TitleText title="Maintain a New Loan" />}
        <Switch
          label={`${locale ? "YYYY/MM/DD" : "YYYY/DD/MM"}`}
          checked={locale}
          onChange={(e) => setLocale(e.currentTarget.checked)}
          onLabel="YDM"
          offLabel="YMD"
        />
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
              time={time}
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
  time,
}: {
  transaction: Transaction;
  call: string;
  time: string;
}) => {
  const router = useRouter();

  return (
    <>
      {call === "transactions" && transaction.transTime.startsWith(time) && (
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
        transaction.transTime.startsWith(time) &&
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
        transaction.transTime.startsWith(time) &&
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
