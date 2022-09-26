import React, { useCallback, useEffect, useState } from "react";
import { TitleText } from "../../components";
import {
  Table,
  Group,
  Switch,
  Modal,
  Card,
  Menu,
  ActionIcon,
  Grid,
  Text,
  Accordion,
} from "@mantine/core";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from "@mantine/dates";
import dayjs from "dayjs";
import {
  IconBrightness,
  IconBrightness2,
  IconBrightnessHalf,
  IconCheck,
  IconChecks,
  IconClock,
  IconDots,
  IconLogout,
} from "@tabler/icons";
import { trpc } from "../../utils/trpc";

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
      <th>Status</th>
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
  const [state, setState] = useState(`${transaction.state}`);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useContext();

  const handle = trpc.transactions.state.useMutation({
    onSuccess: async () => {
      await utils.transactions.transaction.invalidate({
        id: transaction.id || "",
      });
    },
  });

  const handleState = useCallback(() => {
    try {
      setState("clicked");
      if (transaction.state === "clicked") return;
      if (transaction.state === "handled") return;
      if (transaction.id && state !== "new")
        handle.mutate({
          id: transaction.id,
          state: `${state}`,
        });

      if (handle.error) {
        throw new Error("Error Handling State");
      }
    } catch (error) {
      return;
    }
  }, [handle, transaction.id]);

  return (
    <>
      {call === "transactions" && transaction.transTime.startsWith(time) && (
        <tr
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setOpen(true)
            handleState();
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
          {state === "new" && (
            <td>
              <Group position="center">
                <IconCheck color="grey" size={20} />
              </Group>
            </td>
          )}
          {state === "clicked" && (
            <td>
              <Group position="center">
                <IconChecks color="grey" size={20} />
              </Group>
            </td>
          )}
          {state === "handled" && (
            <td>
              <Group position="center">
                <IconChecks color="blue" size={20} />
              </Group>
            </td>
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
            <td>{transaction.state}</td>
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
            <td>{transaction.state}</td>
          </tr>
        )}
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Transaction Info"
      >
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Group position="center" mt="md" mb="xs">
                <TitleText
                  title={`${transaction.firstName}` + " " + `${transaction.middleName}` + " " + `${transaction.lastName}`}
                />
              </Group>
              <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon>
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item icon={<IconLogout size={14} />} color="red">
                    Sign Out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <Grid grow>
              <Grid.Col mt="xs" span={4}>
                <Text weight={500}>Transaction Type</Text>
              </Grid.Col>
              <Grid.Col mt="xs" span={4}>
                <Text>{transaction?.transactionType}</Text>
              </Grid.Col>
            </Grid>
            <Grid grow>
              <Grid.Col mt="xs" span={4}>
                <Text weight={500}>Amount</Text>
              </Grid.Col>
              <Grid.Col mt="xs" span={4}>
                <Text>{`${transaction.transAmount}`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}</Text>
              </Grid.Col>
            </Grid>
            <Grid grow>
              <Grid.Col mt="xs" span={4}>
                <Text weight={500}>Description</Text>
              </Grid.Col>
              <Grid.Col mt="xs" span={4}>
                <Text>{transaction?.billRefNumber}</Text>
              </Grid.Col>
            </Grid>
          </Card.Section>
        </Card>
      </Modal>
    </>
  );
};
