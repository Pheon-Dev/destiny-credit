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
  List,
} from "@mantine/core";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { IconCheck, IconChecks } from "@tabler/icons";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

export const TransactionsTable = ({ call }: { call: string }) => {
  const [time, setTime] = useState("");
  const [locale, setLocale] = useState(false);
  const { data, status } = useSession();

  const logs = trpc.logs.logs.useQuery();
  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();

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
      {status === "loading" && (
        <EmptyTable call={call} status={fetchStatus} />
      )}
      {!transactions && (
          <EmptyTable call={call} status={fetchStatus} />
      )}
      {transactions && (
        <>
          <Group position="apart" m="md" mt="lg">
            {call === "transactions" && (
              <TitleText title="Recent Transactions" />
            )}
            {call === "register" && <TitleText title="Registration List" />}
            {call === "maintain" && <TitleText title="Maintain a New Loan" />}
            {fetchStatus === "fetching" && <Loader />}
            {(fetchStatus === "paused" && (
              <Switch
                label={`${locale ? "YYYY/MM/DD" : "YYYY/DD/MM"}`}
                checked={locale}
                onChange={(e) => {
                  setLocale(e.currentTarget.checked);
                }}
                onLabel="YDM"
                offLabel="YMD"
              />
            )) ||
              (fetchStatus === "idle" && (
                <Switch
                  label={`${locale ? "YYYY/MM/DD" : "YYYY/DD/MM"}`}
                  checked={locale}
                  onChange={(e) => {
                    setLocale(e.currentTarget.checked);
                  }}
                  onLabel="YDM"
                  offLabel="YMD"
                />
              ))}
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
      <pre>{JSON.stringify(transactions, undefined, 2)}</pre>
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
  const [payment, setPayment] = useState("loan");
  const [registerMember, setRegisterMember] = useState("membership");
  const [updaterId, setUpdaterId] = useState("");
  const [handlerId, setHandlerId] = useState("");
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
    handler,
    updater,
    handlerId,
    updaterId,
    transaction.id,
  ]);

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setHandlerId(handler);
      setUpdaterId(updater);
    }

    return () => {
      subscribe = false;
    };
  }, [open]);

  return (
    <>
      {call === "transactions" && transaction.transTime.startsWith(time) && (
        <tr
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setOpen(true);
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
          <td>
            <Group position="center">
              {transaction.state === "registered" && (
                <IconChecks color="grey" size={20} />
              )}
              {(transaction.state === "new" && (
                <IconCheck color="grey" size={20} />
              )) ||
                (!transaction.state && <IconCheck color="grey" size={20} />)}
              {transaction.state === "handled" && (
                <IconChecks color="blue" size={20} />
              )}
            </Group>
          </td>
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
        {transaction.billRefNumber !== "" && (
          <>
            {transaction.state !== "registered" && (
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
                      <Radio m="md" value="membership" label="Membership Fee" />
                      <Radio m="md" value="processing" label="Processing Fee" />
                      <Radio m="md" value="crb" label="CRB Fee" />
                      <Radio m="md" value="all" label="all" />
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
            )}
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
              <Radio value="processing" label="Processing Fee" />
              <Radio value="crb" label="CRB Fee" />
              <Radio value="loan" label="Loan" />
              <Radio value="penalty" label="Penalty" />
              <Radio value="pc" label="Processing & CRB" />
              <Radio value="other" label="Others" />
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
