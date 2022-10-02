import React, { useCallback, useEffect, useState } from "react";
import { TitleText, EmptyTable } from "../../components";
import {
  Table,
  Group,
  Switch,
  Modal,
  Card,
  Grid,
  Text,
  Radio,
  Box,
  Button,
  Loader,
} from "@mantine/core";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";

export const TransactionsTable = ({
  call,
  status,
  email,
}: {
  call: string;
  status: string;
  email: string;
}) => {
  const [time, setTime] = useState("");
  const [locale, setLocale] = useState(false);

  const logs = trpc.logs.logs.useQuery();

  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const user_data = trpc.users.user.useQuery({
    email: `${email}`,
  });

  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();

  const Header = () => (
    <tr>
      <th>M-PESA</th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      {(call === "transactions" && <th>Time</th>) || <th>Description</th>}
      {/* <th>Status</th> */}
    </tr>
  );
  const [value, setValue] = useState(new Date());

  const new_date = value?.toLocaleDateString();

  if (logs?.data?.new > 0) {
    showNotification({
      id: "new-transactions",
      title: "New Transactions",
      message: `${logs?.data?.new} New Transactions`,
      icon: <IconCheck size={16} />,
      color: "teal",
      autoClose: 8000,
    });
  }

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
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }
    return () => {
      subscribe = false;
    };
  }, [
    user_data?.data?.id,
    user_data?.data?.role,
    user_data?.data?.username,
    user_data?.data?.firstName,
    user_data?.data?.lastName,
    user_data?.data?.email,
    user_data?.data?.state,
    new_date,
    time,
    value,
    locale,
    fetchStatus,
  ]);

  return (
    <>
      {status === "loading" && <EmptyTable call={call} status={fetchStatus} />}
      {!transactions && <EmptyTable call={call} status={fetchStatus} />}
      {transactions && (
        <>
          <Group position="apart" m="md" mt="lg">
            {call === "transactions" && (
              <TitleText title="Recent Transactions" />
            )}
            {call === "register" && <TitleText title="Registration List" />}
            {call === "maintain" && <TitleText title="Maintain a New Loan" />}
            <Switch
              label={
                (fetchStatus === "fetching" && <Loader />) ||
                (locale && "Y/D/M") ||
                "Y/M/D"
              }
              checked={locale}
              onChange={(e) => {
                setLocale(e.currentTarget.checked);
              }}
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
                  handler={`${user?.id}`}
                  updater={`${user?.id}`}
                />
              ))}
            </tbody>
            <tfoot>
              <Header />
            </tfoot>
          </Table>
        </>
      )}
      <pre>{JSON.stringify(logs.data?.message, undefined, 2)}</pre>
    </>
  );
};

const TransactionRow = ({
  transaction,
  call,
  time,
  handler,
  updater,
}: {
  transaction: Transaction;
  call: string;
  time: string;
  handler: string;
  updater: string;
}) => {
  const [updaterId, setUpdaterId] = useState("");
  const [handlerId, setHandlerId] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useContext();
  const ref = transaction?.billRefNumber?.split(" ");
  const [registerMember, setRegisterMember] = useState(
    (ref[0]?.startsWith("ME") && "membership") ||
      (ref[1] === "" && "membership") ||
      (ref[0]?.startsWith("M") && "membership") ||
      (ref[1]?.startsWith("F") && "membership") ||
      (+transaction.transAmount > 700 && "mpc") ||
      (+transaction.transAmount > 500 && "pc") ||
      (+transaction.transAmount === 500 && "membership") ||
      "membership"
  );
  const [payment, setPayment] = useState(
    (ref[0]?.startsWith("PR") && "processing") ||
      (ref[1] === "" && "processing") ||
      (ref[0]?.startsWith("P") && "processing") ||
      (ref[1]?.startsWith("F") && "processing") ||
      "loan"
  );

  const handle = trpc.transactions.state.useMutation({
    onSuccess: async () => {
      await utils.transactions.transaction.invalidate({
        id: transaction.id || "",
      });
    },
  });

  const date = (time: string) => {
    const second = time.slice(12);
    const minute = time.slice(10, 12);
    const hour = time.slice(8, 10);
    const day = time.slice(6, 8);
    const month = time.slice(4, 6);
    const year = time.slice(0, 4);
    const when = hour + ":" + minute;
    return when;
  };

  const handleState = useCallback(() => {
    try {
      if (transaction.state === "handled") return;
      let state = "";
      let paymentFor = "";
      if (transaction.state === "registered") {
        state = "handled";
        paymentFor = payment;
      }
      if (transaction.state === "new") {
        state = "registered";
        paymentFor = registerMember;
      }
      if (transaction.id) {
        console.log(state);
        console.log(paymentFor);
        handle.mutate({
          id: transaction.id,
          handlerId: `${handlerId}`,
          updaterId: `${updaterId}`,
          payment: `${paymentFor}`,
          state: `${state}`,
        });
      }
      if (handle.error) {
        throw new Error("Error Handling State");
      }
      return;
    } catch (error) {
      return;
    }
  }, [
    handle,
    transaction.id,
    transaction.state,
    registerMember,
    payment,
    handlerId,
    updaterId,
  ]);

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setHandlerId(handler);
      setUpdaterId(updater);
      if (ref[0]?.startsWith("M")) {
        if (ref[1]?.startsWith("F")) {
          setDescription("membership");
        }
        if (ref[0]?.startsWith("ME")) {
          setDescription("membership");
        }
        if (ref[0]?.startsWith("MEM")) {
          setDescription("membership");
        }
        if (ref[1]?.length === 0) {
          setDescription("membership");
        }
        if (ref[0]?.length === 0) {
          setDescription("");
        }
      }

      if (ref[0]?.startsWith("P")) {
        if (ref[1]?.startsWith("F")) {
          setDescription("processing");
        }
        if (ref[0]?.startsWith("PR")) {
          setDescription("processing");
        }
        if (ref[0]?.startsWith("PRO")) {
          setDescription("processing");
        }
        if (ref[1]?.length === 0) {
          setDescription("processing");
        }
        if (ref[0]?.length === 0) {
          setDescription("");
        }
      }
    }

    return () => {
      subscribe = false;
    };
  }, [open, handler, updater, ref, description, registerMember]);

  return (
    <>
      {call === "transactions" && transaction.transTime.startsWith(time) && (
        <tr
          style={{
            cursor: (transaction.billRefNumber !== "" && "pointer") || "text",
          }}
          onClick={() => {
            transaction.billRefNumber !== "" && setOpen(true);
          }}
        >
          <td>
            {transaction.transID.slice(0, 2) +
              "..." +
              transaction.transID.slice(7)}
          </td>
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
          {(transaction.billRefNumber === "" && (
            <td>{date(transaction.transTime)}</td>
          )) || <td>{transaction.billRefNumber}</td>}
        </tr>
      )}
      {call === "register" &&
        transaction.transTime.startsWith(time) &&
        description === "membership" && (
          <tr
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/members/register/${transaction.transID}`);
            }}
          >
            <td>
              {transaction.transID.slice(0, 2) +
                "..." +
                transaction.transID.slice(7)}
            </td>
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
            {(transaction.billRefNumber === "" && (
              <td>{date(transaction.transTime)}</td>
            )) || <td>{transaction.billRefNumber}</td>}
          </tr>
        )}
      {call === "maintain" &&
        transaction.transTime.startsWith(time) &&
        description === "processing" && (
          <tr
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/loans/maintain/${transaction.transID}`);
            }}
          >
            <td>
              {transaction.transID.slice(0, 2) +
                "..." +
                transaction.transID.slice(7)}
            </td>
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
            {(transaction.billRefNumber === "" && (
              <td>{date(transaction.transTime)}</td>
            )) || <td>{transaction.billRefNumber}</td>}
          </tr>
        )}
      <Modal
        padding="md"
        opened={open}
        onClose={() => setOpen(false)}
        title={`Transaction Info`}
      >
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Group position="center" mt="md" mb="xs">
                <TitleText
                  title={
                    `${transaction.firstName}` +
                    " " +
                    `${transaction.middleName}` +
                    " " +
                    `${transaction.lastName}`
                  }
                />
              </Group>
            </Group>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <Grid grow>
              <Grid.Col mt="xs" span={4}>
                <Text weight={500}>Paid Via</Text>
              </Grid.Col>
              <Grid.Col mt="xs" span={4}>
                {transaction?.transactionType ===
                  "CUSTOMER MERCHANT PAYMENT" && <Text>Till (Buy Goods)</Text>}
                {transaction?.transactionType === "PAY BILL" && (
                  <Text>Pay Bill</Text>
                )}
              </Grid.Col>
            </Grid>
            <Grid grow>
              <Grid.Col mt="xs" span={4}>
                <Text weight={500}>Phone Number</Text>
              </Grid.Col>
              <Grid.Col mt="xs" span={4}>
                <Text>+{transaction.msisdn}</Text>
              </Grid.Col>
            </Grid>
            <Grid grow>
              <Grid.Col mt="xs" span={4}>
                <Text weight={500}>Amount</Text>
              </Grid.Col>
              <Grid.Col mt="xs" span={4}>
                <Text>
                  {`KSHs. ${transaction.transAmount}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                </Text>
              </Grid.Col>
            </Grid>
            {transaction?.billRefNumber !== "" && (
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Description</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{transaction?.billRefNumber}</Text>
                </Grid.Col>
              </Grid>
            )}
          </Card.Section>
        </Card>
        {transaction.state === "new" && (
          <>
            <Box m="md">
              <Group position="center" m="md">
                <TitleText title="New Customer" />
              </Group>
              <Radio.Group
                value={registerMember}
                onChange={setRegisterMember}
                name="registrationFor"
                label="This is a transaction from an unregistered member ..."
                description={`Proceed to Register ${transaction.firstName} ${transaction.middleName} ${transaction.lastName}`}
                withAsterisk
              >
                <Grid grow>
                  <Grid.Col span={4}>
                    <Radio m="md" value="crb" label="CRB Fee" />
                    <Radio m="md" value="membership" label="Membership Fee" />
                    <Radio m="md" value="processing" label="Processing Fee" />
                    <Radio m="md" value="pc" label="Processing | CRB" />
                    <Radio
                      m="md"
                      value="mpc"
                      label="Membership | Processing | CRB"
                    />
                  </Grid.Col>
                </Grid>
              </Radio.Group>
              <Group position="center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    handleState();
                    /* router.push(`/members/register/${transaction.transID}`); */
                  }}
                  m="md"
                >
                  Register
                </Button>
              </Group>
            </Box>
          </>
        )}
        {transaction.state === "registered" && (
          <Box m="md">
            <Group position="center" m="md">
              <TitleText title="Payment" />
            </Group>
            <Radio.Group
              value={payment}
              onChange={setPayment}
              name="paymentFor"
              label="Please select an account to affirm this transaction ..."
              description="NOTE: Don't forget to submit after selection, no changes will be made upon cancellation."
              withAsterisk
            >
              <Grid grow>
                <Grid.Col span={4}>
                  <Radio m="md" value="crb" label="CRB Fee" />
                  <Radio m="md" value="processing" label="Processing Fee" />
                  <Radio m="md" value="pc" label="Processing | CRB" />
                  <Radio m="md" value="loan" label="Loan" />
                  <Radio m="md" value="penalty" label="Penalty" />
                  <Radio m="md" value="other" label="Others" />
                </Grid.Col>
              </Grid>
            </Radio.Group>
            <Group position="center">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  handleState();
                }}
                m="md"
              >
                Submit
              </Button>
            </Group>
          </Box>
        )}
      </Modal>
    </>
  );
};
