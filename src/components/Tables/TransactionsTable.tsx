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
import { IconCheck, IconChecks, IconClock } from "@tabler/icons";

export const TransactionsTable = ({
  call,
}: {
  call: string;
}) => {
  const [time, setTime] = useState("");
  const [locale, setLocale] = useState(false);

  const router = useRouter();
  const logs = trpc.logs.logs.useQuery();

  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();

  const Header = () => (
    <tr>
      <th>
        <Group>
          <IconClock size={16} />
          <>Time</>
        </Group>
      </th>
      <th>Names</th>
      <th>Amount</th>
      <th>Phone</th>
      <th>
        <Group position="center">
          {(call === "transactions" && <>M-PESA</>) || <>Description</>}
        </Group>
      </th>
    </tr>
  );
  const [value, setValue] = useState(new Date());

  const new_date = value?.toLocaleDateString();

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      /* setInterval(() => { */
      /*   router.replace(router.asPath) */
      /* }, 800000) */
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
  }, [
    new_date,
    time,
    value,
    locale,
    logs.data?.message,
  ]);

  return (
    <>
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
}: {
  transaction: Transaction;
  call: string;
  time: string;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const memb_regexp = /m(e)(mb(er(ship)))/g
  const proc_regexp = /p(ro)(c(es(s(ing))))/g
  const loan_regexp = /l(o(an))/g

  const str = transaction.billRefNumber.toLowerCase()

  const memb_matches = str["match"](memb_regexp) || ""
  const proc_matches = str["match"](proc_regexp) || ""
  const loan_matches = str["match"](loan_regexp) || ""

  const [payment, setPayment] = useState(
    memb_matches[0] === "membership" && ("membership") ||
    loan_matches[0] === "loan" && ("loan") ||
    proc_matches[0] === "processing" && ("processing") || "loan"
  )

  const date = (time: string) => {
    const minute = time.slice(10, 12);
    const hour = time.slice(8, 10);
    const when = hour + ":" + minute;
    return when;
  };

  const handleState = useCallback(() => {
    try {
      if (payment === "membership")
        return router.push(`/members/register/${transaction.transID}`);
    } catch (error) {
      return;
    }
  }, [
    transaction.transID,
    payment,
  ]);

  return (
    <>
      {call === "transactions" && transaction.transTime.startsWith(time) && (
        <tr>
          <td>
            {(transaction.billRefNumber !== "" && (
              <Group>
                {(transaction.payment === "" && (
                  <IconCheck color="grey" size={16} />
                )) ||
                  (transaction.payment !== "loan" && (
                    <IconChecks color="blue" size={16} />
                  )) ||
                  (transaction.state === "handled" && (
                    <IconChecks color="blue" size={16} />
                  ))}
                {date(transaction.transTime)}
              </Group>
            )) || (
                <Group>
                  {(transaction.state === "new" && (
                    <IconChecks color="grey" size={16} />
                  )) ||
                    (transaction.state === "handled" && (
                      <IconChecks color="blue" size={16} />
                    ))}
                  {date(transaction.transTime)}
                </Group>
              )}
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
          <td>
            <Group position="center">
              {(transaction.billRefNumber === "" && (
                <>{transaction.transID}</>
              )) || (
                  <Button
                    variant="light"
                    style={{
                      height: "24px",
                    }}
                    onClick={() => {
                      transaction.billRefNumber !== "" && setOpen(true);
                    }}
                  >
                    {transaction.billRefNumber.split(" ")[0]}
                  </Button>
                )}
            </Group>
          </td>
        </tr>
      )}
      {call === "register" &&
        transaction.transTime.startsWith(time) &&
        payment === "membership" && (
          <>
            {transaction.payment !== "" && (
              <tr>
                <td>{date(transaction.transTime)}</td>
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
                <td>
                  <Group position="center">
                    {(transaction.billRefNumber === "" && (
                      <>{transaction.transID}</>
                    )) || (
                        <Button
                          variant="light"
                          style={{
                            height: "24px",
                          }}
                          onClick={() => {
                            router.push(`/members/register/${transaction.transID}`);
                          }}
                        >
                          {transaction.billRefNumber.split(" ")[0]}
                        </Button>
                      )}
                  </Group>
                </td>
              </tr>
            )}
          </>
        )}
      {call === "maintain" &&
        transaction.transTime.startsWith(time) &&
        payment === "processing" && (
          <>
            {transaction.payment === "" && (
              <tr>
                <td>{date(transaction.transTime)}</td>
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
                <td>
                  <Group position="center">
                    {(transaction.billRefNumber === "" && (
                      <>{transaction.transID}</>
                    )) || (
                        <Button
                          variant="light"
                          style={{
                            height: "24px",
                          }}
                          onClick={() => {
                            router.push(`/loans/maintain/${transaction.transID}`);
                          }}
                        >
                          {transaction.billRefNumber.split(" ")[0]}
                        </Button>
                      )}
                  </Group>
                </td>
              </tr>
            )}
          </>
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
              <>
                <Grid grow>
                  <Grid.Col mt="xs" span={4}>
                    <Text weight={500}>Description</Text>
                  </Grid.Col>
                  <Grid.Col mt="xs" span={4}>
                    <Text>{transaction?.billRefNumber}</Text>
                  </Grid.Col>
                </Grid>
                {transaction?.payment !== "" && (
                  <>
                    <Grid grow>
                      <Grid.Col mt="xs" span={4}>
                        <Text weight={500}>Paid for</Text>
                      </Grid.Col>
                      <Grid.Col mt="xs" span={4}>
                        <Text>{transaction?.payment}</Text>
                      </Grid.Col>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Card.Section>
        </Card>
        {transaction?.payment === "" && (
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
                  <Radio m="md" value="membership" label="Membership Fee" />
                  <Radio m="md" value="crb" label="CRB Fee" />
                  <Radio m="md" value="processing" label="Processing Fee" />
                  <Radio m="md" value="pc" label="Processing | CRB" />
                  <Radio
                    m="md"
                    value="mpc"
                    label="Membership | Processing | CRB"
                  />
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
