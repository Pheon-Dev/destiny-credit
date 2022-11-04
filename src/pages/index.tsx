import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from "react";
import { Suspense } from "react";
import { EmptyTable, Protected, TransactionsTable } from "../components";
import { useSession } from "next-auth/react";
import { useForm, zodResolver } from "@mantine/form";
import dayjs from "dayjs";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconAsterisk,
  IconCalendar,
  IconCheck,
  IconPlus,
} from "@tabler/icons";
import {
  Button,
  Grid,
  Group,
  Drawer,
  Text,
  TextInput,
  Select,
  Divider,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { z } from "zod";
import { trpc } from "../utils/trpc";

const schema = z.object({
  id: z.string().min(1, { message: "" }),
  transactionType: z.string().min(1, { message: "" }),
  transID: z.string().min(1, { message: "" }),
  transTime: z.date({ required_error: "" }),
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

const Page: NextPage = () => {
  const [transactionTime, setTransactionTime] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const { data, status } = useSession();

  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      id: "",
      transactionType: "",
      transID: "",
      transTime: `${transactionTime}`,
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

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const user_data = trpc.users.user.useQuery({
    email: `${email}`,
  });

  const add_transaction = trpc.transactions.create.useMutation({
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
    },
  });

  const middlename = form.values.lastName.split(" ")[0];
  const lastname = form.values.lastName.split(" ")[1] ?? "";

  const utils = trpc.useContext();
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
      const trans_time = !form.values.transTime && new Date() || new Date(form.values.transTime);
      const local_date = trans_time
        .toLocaleString()
        .split(" ")[0]
        ?.split(",")[0];
      const local_time = trans_time.toLocaleString().split(" ")[1];

      const date_str = `${local_date?.split("/")[2]}${local_date?.split("/")[1]
        }${local_date?.split("/")[0]}`;

      const time_str = `${local_time?.split(":")[0]}${local_time?.split(":")[1]}${local_time?.split(":")[2]}`;

      const t_time = `${date_str}${time_str}`;

      setTransactionTime(t_time);

      form.setFieldValue(
        "businessShortCode",
        `${(form.values.transactionType === "PAY BILL" && "4085055") || "9393773"
        }`
      );
      form.setFieldValue(
        "billRefNumber",
        `${(form.values.transactionType === "PAY BILL" &&
          form.values.billRefNumber) ||
        ""
        }`
      );
      form.setFieldValue("transTime", `${transactionTime}`);
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
    form.values.transactionType,
    form.values.businessShortCode,
    transactionTime,
    middlename,
    lastname,
  ]);

  const handleTransaction = useCallback(() => {
    try {
      console.log(form.values.transTime);
      if (
        (user?.id,
          form.values.transactionType &&
          form.values.transID &&
          transactionTime &&
          form.values.transAmount &&
          form.values.businessShortCode &&
          form.values.msisdn &&
          form.values.firstName)
      ) {
        /* add_transaction.mutate({ */
        console.table({
          state: "new",
          updaterId: `${user?.id}`,
          handlerId: `${user?.id}`,
          payment: "",
          transactionType: form.values.transactionType,
          transID: form.values.transID,
          transTime: transactionTime,
          transAmount: form.values.transAmount,
          businessShortCode:
            (form.values.transactionType === "PAY BILL" && "4085055") ||
            "9393773",
          billRefNumber: form.values.billRefNumber,
          invoiceNumber: "",
          orgAccountBalance: "0",
          thirdPartyTransID: "",
          msisdn: form.values.msisdn,
          firstName: form.values.firstName,
          middleName: middlename,
          lastName: lastname,
        });
      }
      console.table({
        state: "new",
        updaterId: `${user?.id}`,
        handlerId: `${user?.id}`,
        payment: "",
        transactionType: form.values.transactionType,
        transID: form.values.transID,
        transTime: transactionTime,
        transAmount: form.values.transAmount,
        businessShortCode:
          (form.values.transactionType === "PAY BILL" && "4085055") ||
          "9393773",
        billRefNumber: form.values.billRefNumber,
        invoiceNumber: "",
        orgAccountBalance: "0",
        thirdPartyTransID: "",
        msisdn: form.values.msisdn,
        firstName: form.values.firstName,
        middleName: middlename,
        lastName: lastname,
      });
      updateNotification({
        id: "submit",
        color: "orange",
        title: `Error Adding Transaction`,
        message: `Missing Values`,
        icon: <IconAlertCircle size={16} />,
        autoClose: 5000,
      });
    } catch (error) {
      updateNotification({
        id: "submit",
        color: "red",
        title: `Error Adding Transaction`,
        message: `${error}`,
        icon: <IconAlertCircle size={16} />,
        autoClose: 5000,
      });
    }
  }, []);

  const call = "transactions";

  return (
    <Protected>
      <Suspense fallback={
        <EmptyTable call={call} />
      }>
        <Button
          variant="light"
          onClick={() => {
            setOpenNew(true);
          }}
        >
          <IconPlus size={16} />
        </Button>
        <TransactionsTable call={call} />
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
                    Transaction Time <IconAsterisk color="red" size={8} />
                  </Text>
                  <DatePicker
                    placeholder="Transaction Time"
                    defaultValue={transactionTime}
                    icon={<IconCalendar size={16} />}
                    dropdownType="modal"
                    firstDayOfWeek="sunday"
                    /* placeholder={`${dayjs(new Date().)}`} */
                    maxDate={dayjs(new Date()).toDate()}
                    inputFormat="DD-MM-YYYY"
                    {...form.getInputProps("transTime")}
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
                  <Text>Last Name</Text>
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
            <Button
              variant="gradient"
              onClick={() => {
                form.validate();
                showNotification({
                  id: "submit",
                  title: "New Transaction",
                  message: "Adding Transaction ...",
                  disallowClose: true,
                  loading: true,
                });
                handleTransaction();
              }}
            >
              Submit
            </Button>
          </Group>
        </Drawer>
      </Suspense>
    </Protected>
  );
};
export default Page;
