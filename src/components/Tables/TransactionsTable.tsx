import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Modal,
  Radio,
  Switch,
  Drawer,
  Table,
  Text,
  TextInput,
  Select,
  Divider,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import type { Transaction } from "@prisma/client";
import {
  IconAsterisk,
  IconCheck,
  IconChecks,
  IconClock,
  IconPlus,
} from "@tabler/icons";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { EmptyTable, TitleText } from "../../components";
import { trpc } from "../../utils/trpc";

const schema = z.object({
  id: z.string().min(1, { message: "" }),
  transactionType: z.string().min(1, { message: "" }),
  transID: z.string().min(1, { message: "" }),
  transTime: z.string().min(1, { message: "" }),
  transAmount: z.string().min(1, { message: "" }),
  businessShortCode: z.string().min(1, { message: "" }),
  billRefNumber: z.string(),
  invoiceNumber: z.string(),
  orgAccountBalance: z.string(),
  thirdPartyTransID: z.string(),
  msisdn: z.string().min(1, { message: "" }),
  firstName: z.string().min(1, { message: "" }),
  middleName: z.string().min(1, { message: "" }),
  lastName: z.string(),
});

export const TransactionsTable = ({ call }: { call: string }) => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];
  const [time, setTime] = useState("");
  const [locale, setLocale] = useState(true);
  const [openNew, setOpenNew] = useState(false);

  const router = useRouter();
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

  useEffect(() => {
    let subscribe = true;

    if (subscribe) {
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
  ]);
  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();
  const utils = trpc.useContext()
  const add_transaction =
    trpc.transactions.create.useMutation({
      onSuccess: async () => {
        await utils.transactions.transactions.invalidate();
        updateNotification({
          id: "submit",
          color: "teal",
          title: `${form.values.firstName} ${form.values.lastName}`,
          message: "Transaction Successfully Added",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      }
    });

  /* TODO: Add Formatted Date */
  const trans_time = new Date()

  const handleTransaction = useCallback(() => {
    try {
      if (
        user?.id,
        form.values.transactionType &&
        form.values.transID &&
        form.values.transTime &&
        form.values.transAmount &&
        form.values.businessShortCode &&
        form.values.billRefNumber &&
        form.values.invoiceNumber &&
        form.values.orgAccountBalance &&
        form.values.thirdPartyTransID &&
        form.values.msisdn &&
        form.values.firstName &&
        form.values.middleName &&
        form.values.lastName
      ) {
        add_transaction.mutate({
          state: "new",
          updaterId: `${user?.id}`,
          handlerId: `${user?.id}`,
          payment: "",
          transactionType: form.values.transactionType,
          transID: form.values.transID,
          transTime: `${trans_time.toLocaleDateString()}`,
          transAmount: form.values.transAmount,
          businessShortCode: form.values.businessShortCode,
          billRefNumber: form.values.billRefNumber,
          invoiceNumber: form.values.invoiceNumber,
          orgAccountBalance: form.values.orgAccountBalance,
          thirdPartyTransID: form.values.thirdPartyTransID,
          msisdn: form.values.msisdn,
          firstName: form.values.firstName,
          middleName: form.values.middleName,
          lastName: form.values.lastName,
        })
      }
      updateNotification({
        id: "submit",
        color: "error",
        title: `Error Adding Transaction`,
        message: `Missing Values`,
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });
    } catch (error) {
      updateNotification({
        id: "submit",
        color: "error",
        title: `Error Adding Transaction`,
        message: `${error}`,
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });

    }
  }, [])

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      id: "",
      transactionType: "",
      transID: "",
      transTime: "",
      transAmount: "",
      businessShortCode: "",
      billRefNumber: "",
      invoiceNumber: "",
      orgAccountBalance: "",
      thirdPartyTransID: "",
      msisdn: "",
      firstName: "",
      middleName: "",
      lastName: "",
    },
  });

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

  const new_date: string = value?.toLocaleDateString();

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      /* setInterval(() => { */
      /*   router.replace(router.asPath) */
      /* }, 800000) */
      if (new_date?.split("/")[2]) {
        let d: string | undefined = new_date?.split("/")[0];
        let m: string | undefined = new_date?.split("/")[1];
        let y: string | undefined = new_date?.split("/")[2];

        let dd = !d ? "" : +d < 10 ? `0${+d}` : `${+d}`;
        let mm = !m ? "" : +m < 10 ? `0${+m}` : `${+m}`;
        let yy = !y ? "" : y;

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
    }
    return () => {
      subscribe = false;
    };
  }, [new_date, time, value, locale, logs.data?.message, openNew]);

  let select_member: Array<any> = [];
  transactions?.map(
    (_) =>
      _.billRefNumber !== "" &&
      _.state === "new" && [
        select_member.push({
          key: _.transTime,
          value: `${_.transID}`,
          label: `${_.transID}: ${_.firstName} ${_.middleName} ${_.lastName} ${_.transTime} ${_.billRefNumber}`,
        }),
      ]
  );
  return (
    <>
      {!transactions && <EmptyTable call={call} status={fetchStatus} />}
      {transactions && (
        <>
          <Group position="apart" m="md" mt="lg">
            <DatePicker
              value={value}
              firstDayOfWeek="sunday"
              onChange={(e) => {
                e && setValue(new Date(e));
              }}
              maxDate={dayjs(new Date()).toDate()}
            />
            {(fetchStatus === "fetching" && <Loader />) || (
              <>
                {call === "transactions" && (
                  <TitleText title="Recent Transactions" />
                )}
              </>
            )}
            {call === "register" && <TitleText title="Registration List" />}
            {call === "maintain" && <TitleText title="Maintain a New Loan" />}
            <Button
              variant="light"
              onClick={() => {
                setOpenNew(true);
              }}
            >
              <IconPlus size={16} />
            </Button>
            {/* <Switch */}
            {/*   label={ */}
            {/*     (fetchStatus === "fetching" && <Loader />) || */}
            {/*     (locale && "Y/D/M") || */}
            {/*     "Y/M/D" */}
            {/*   } */}
            {/*   checked={locale} */}
            {/*   onChange={(e) => { */}
            {/*     setLocale(e.currentTarget.checked); */}
            {/*   }} */}
            {/* /> */}
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
      <Grid grow>
        <Grid.Col span={4}>
          <Autocomplete
            mt="md"
            label="Enter Member Names"
            placeholder="Enter Member Names ..."
            limit={8} // Default 5
            data={select_member.map((m) => m.label)}
            {...form.getInputProps("id")}
            required
          />
          <Button
            variant="light"
            m="xl"
            onClick={() => {
              router.push(`/members/register/${form.values.id.split(":")[0]}`);
            }}
          >
            Add
          </Button>
        </Grid.Col>
      </Grid>
      <Drawer
        padding="md"
        size="xl"
        position="right"
        opened={openNew}
        onClose={() => setOpenNew(false)}
        title={`New Transaction`}
      >
        <form>
          <Grid grow>
            <Grid.Col span={4}>
              <Group position="apart" mt="lg">
                <Text>
                  Transaction Type <IconAsterisk color="red" size={8} />
                </Text>
                <Select
                  placeholder="Transaction Type"
                  data={[
                    {
                      value: "CUSTOMER MERCHANT PAYMENT",
                      label: "Buy Goods (Till)",
                    },
                    { value: "PAY BILL", label: "Pay Bill" },
                  ]}
                  {...form.getInputProps("transactionType")}
                  required
                />
              </Group>
              <Group position="apart" mt="lg">
                <Text>
                  Transaction ID <IconAsterisk color="red" size={8} />
                </Text>
                <TextInput
                  placeholder="Transaction ID"
                  {...form.getInputProps("transID")}
                  required
                />
              </Group>
              <Group position="apart" mt="lg">
                <Text>
                  Transaction Time <IconAsterisk color="red" size={8} />
                </Text>
                <TextInput
                  placeholder="Transaction Time"
                  {...form.getInputProps("transTime")}
                  required
                />
              </Group>

              <Group position="apart" mt="lg">
                <Text>
                  Transaction Amount
                  <IconAsterisk color="red" size={8} />
                </Text>
                <TextInput
                  placeholder="Transaction Amount"
                  {...form.getInputProps("transAmount")}
                  required
                />
              </Group>
              {form.values.transactionType === "PAY BILL" && (
                <Group position="apart" mt="lg">
                  <Text>
                    Bill Ref Number
                    <IconAsterisk color="red" size={8} />
                  </Text>
                  <TextInput
                    placeholder="Bill Ref Number"
                    {...form.getInputProps("billRefNumber")}
                    required
                  />
                </Group>
              )}
              <Group position="apart" mt="lg">
                <Text>
                  Phone Number
                  <IconAsterisk color="red" size={8} />
                </Text>
                <TextInput
                  placeholder="Phone Number"
                  {...form.getInputProps("msisdn")}
                  required
                />
              </Group>
              <Group position="apart" mt="lg">
                <Text>
                  First Name
                  <IconAsterisk color="red" size={8} />
                </Text>
                <TextInput
                  placeholder="First Name"
                  {...form.getInputProps("firstName")}
                  required
                />
              </Group>
              <Group position="apart" mt="lg">
                <Text>
                  Last Name
                </Text>
                <TextInput
                  placeholder="Last Name"
                  {...form.getInputProps("lastName")}
                  required
                />
              </Group>
            </Grid.Col>
          </Grid>
        </form>
        <Divider variant="dotted" m="lg" />
        <Group position="center" mt="lg">
          <Button variant="gradient"
            onClick={() => {
              form.validate();
              showNotification({
                id: "submit",
                title: "New Transaction",
                message: "Adding Transaction ...",
                disallowClose: true,
                loading: true,
              });
              handleTransaction()
            }}>Submit</Button>
        </Group>
      </Drawer>
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

  const memb_regexp = /m(e)(mb(er(ship)))/g;
  const proc_regexp = /p(ro)(c(es(s(ing))))/g;
  const loan_regexp = /l(o(an))/g;

  const str = transaction.billRefNumber.toLowerCase();

  const memb_matches = str["match"](memb_regexp) || "";
  const proc_matches = str["match"](proc_regexp) || "";
  const loan_matches = str["match"](loan_regexp) || "";

  const [payment, setPayment] = useState(
    (memb_matches[0] === "membership" && "membership") ||
    (loan_matches[0] === "loan" && "loan") ||
    (proc_matches[0] === "processing" && "processing") ||
    "loan"
  );

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
  }, [transaction.transID, payment]);

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
        /* transaction.transTime.startsWith(time) && */
        transaction.state === "new" &&
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
                            router.push(
                              `/members/register/${transaction.transID}`
                            );
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
                  showNotification({
                    id: "submit",
                    title: "Update Details",
                    message: "Updating Member Details ...",
                    disallowClose: true,
                    loading: true,
                  });
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
