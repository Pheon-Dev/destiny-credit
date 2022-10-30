import {
  ActionIcon, Button, Card, Divider, Grid, Group, LoadingOverlay, Menu, Select, Text
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconCalendar,
  IconCheck,
  IconDots,
  IconEye,
  IconFileZip,
  IconTrash,
  IconX
} from "@tabler/icons";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Protected, TitleText } from "../../../components";
import { trpc } from "../../../utils/trpc";

const schema = z.object({
  disbursementDate: z.date({ required_error: "Select First Installment Date" }),
  creditOfficerId: z.string().min(2, { message: "Officer not Selected" }),
  creditOfficerName: z.string().min(2, { message: "Officer not Selected" }),
});

const Disburse = ({ email }: { email: string; status: string }) => {
  const [disbursedOn, setDisbursedOn] = useState("");
  const router = useRouter();
  const id = router.query.id as string;

  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const u_data = trpc.users.user.useQuery({
    email: `${email}`,
  });

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setUser({
        id: `${u_data?.data?.id}`,
        role: `${u_data?.data?.role}`,
        username: `${u_data?.data?.username}`,
        firstname: `${u_data?.data?.firstName}`,
        lastname: `${u_data?.data?.lastName}`,
        email: `${u_data?.data?.email}`,
        state: `${u_data?.data?.state}`,
      });
    }
    return () => {
      subscribe = false;
    };
  }, [
    u_data?.data?.id,
    u_data?.data?.role,
    u_data?.data?.username,
    u_data?.data?.firstName,
    u_data?.data?.lastName,
    u_data?.data?.email,
    u_data?.data?.state,
  ]);

  const { data: users } = trpc.users.officers.useQuery();
  const users_data = users?.map((p) => p) || [];
  const user_data = users_data?.map((_) => [
    { key: _?.id, value: `${_?.id}`, label: `${_?.username}` },
  ]);
  const { data: loan, status: loan_status } = trpc.loans.loan.useQuery({
    id: id,
  });
  const { data: member } = trpc.members.member.useQuery({
    id: `${loan?.memberId}`,
  });
  const { data: registrar } = trpc.users.user_id.useQuery({
    id: `${member?.registrarId}`,
  });
  const { data: maintainer } = trpc.users.user_id.useQuery({
    id: `${loan?.maintainerId}`,
  });
  const { data: approver } = trpc.users.user_id.useQuery({
    id: `${loan?.approverId}`,
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      disbursementDate: `${disbursedOn}`,
      creditOfficerId: "",
      creditOfficerName: "",
    },
  });

  const disburse = trpc.loans.disburse.useMutation({
    onSuccess: async () => {
      updateNotification({
        id: "submit-status",
        color: "teal",
        title: `Loan Disbursement`,
        message: `Loan Was Successfully Disbursed`,
        icon: <IconCheck size={16} />,
        autoClose: 8000,
      });
      return router.push("/loans/payments");
    },
  });

  const findOfficer = (officer: string) => {
    return users_data?.find((e) => {
      if (officer === e?.username) {
        form.setFieldValue("creditOfficerId", `${e.id}`);
      }
    });
  };

  useEffect(() => {
    let sub = true;
    if (sub) {
      findOfficer(form.values.creditOfficerName);
      const date = new Date();

      const change = !form.values.disbursementDate && date || new Date(form.values.disbursementDate)

      const local_date = change.toLocaleDateString()

      const dash_date =
        local_date.split("/")[0] + "-" +
        local_date.split("/")[1] + "-" +
        local_date.split("/")[2]

      setDisbursedOn(dash_date)
    }
    return () => {
      sub = false;
    };
  }, [form.values.creditOfficerName, disbursedOn, form.values.disbursementDate]);

  const handleSubmit = useCallback(() => {
    try {
      try {
        if (
          form.values.creditOfficerName &&
          form.values.creditOfficerId &&
          user?.id &&
          disbursedOn
        ) {
          disburse.mutate({
            id: id,
            disbursedOn: disbursedOn,
            disbursed: true,
            disburserId: `${user?.id}`,
            updaterId: `${user?.id}`,
            creditOfficerId: form.values.creditOfficerId,
          });
        }
      } catch (error) {
        return updateNotification({
          id: "submit-status",
          color: "red",
          title: `Missing Fields`,
          message: `Please Fill All The Missing Fields Then Try Again.`,
          icon: <IconX size={16} />,
          autoClose: 8000,
        });
      }
    } catch (error) {
      return updateNotification({
        id: "submit-status",
        color: "red",
        title: `Loan Disbursement`,
        message: `Loan Was not Successfully Disbursed. Please Try Again.`,
        icon: <IconX size={16} />,
        autoClose: 8000,
      });
    }
  }, [disburse, id, disbursedOn, form.values, user?.id]);

  return (
    <>
      {loan && (
        <>
          <Card key={loan?.id} shadow="sm" p="lg" radius="md" m="xl" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <TitleText title={`${loan.memberName}`} />
                <Menu withinPortal position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item icon={<IconFileZip size={14} />}>
                      Download zip
                    </Menu.Item>
                    <Menu.Item icon={<IconEye size={14} />}>
                      Preview all
                    </Menu.Item>
                    <Menu.Item icon={<IconTrash size={14} />} color="red">
                      Delete all
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Loan Product</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{loan.productName}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Skipped Sundays</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {loan.sundays} {loan.sundays === "1" ? "Sunday" : "Sundays"}
                  </Text>
                </Grid.Col>
              </Grid>
              {loan.payoff !== "0" && (
                <Grid grow>
                  <Grid.Col mt="xs" span={4}>
                    <Text weight={500}>Payoff Amount</Text>
                  </Grid.Col>
                  <Grid.Col mt="xs" span={4}>
                    <Text>
                      {`KSHs. ${loan.payoff}.00`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </Text>
                  </Grid.Col>
                </Grid>
              )}
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Loan Tenure</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {loan.tenure}{" "}
                    {loan.cycle.toLowerCase() === "daily"
                      ? "Days"
                      : loan.cycle.toLowerCase() === "weeks"
                        ? "Weeks"
                        : "Months"}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Principal Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${loan.principal}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Installment Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${loan.installment}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Interest Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${loan.interest}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Penalty Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${loan.penalty}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Processing Fee</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${loan.processingFee}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              {loan.grace === "1" && (
                <Grid grow>
                  <Grid.Col mt="xs" span={4}>
                    <Text weight={500}>Grace Period</Text>
                  </Grid.Col>
                  <Grid.Col mt="xs" span={4}>
                    <Text>{loan.grace} Day</Text>
                  </Grid.Col>
                </Grid>
              )}
              <Divider variant="dotted" m="md" />
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Registrar</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{registrar?.username}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Maintainer</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{maintainer?.username}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Approver</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{approver?.username}</Text>
                </Grid.Col>
              </Grid>
              <Divider variant="dotted" my="xl" />
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>First Installment Date</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4} offset={4}>
                  <Text>{loan.startDate}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Disbursement Date</Text>
                </Grid.Col>
                {/* <Grid.Col mt="xs" span={4} offset={4}> */}
                {/*   <Text>{disbursedOn}</Text> */}
                {/* </Grid.Col> */}
                <Grid.Col span={4}>
                  <DatePicker
                    placeholder={disbursedOn}
                    defaultValue={disbursedOn}
                    icon={<IconCalendar size={16} />}
                    dropdownType="modal"
                    firstDayOfWeek="sunday"
                    maxDate={dayjs(new Date()).toDate()}
                    inputFormat="DD-MM-YYYY"
                    {...form.getInputProps("disbursementDate")}
                    required
                  />
                </Grid.Col>
              </Grid>
              <Divider variant="dotted" my="xl" />
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Credit Officer</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Select
                    placeholder="Select Officer ..."
                    data={user_data?.map((p) => p[0]?.label)}
                    {...form.getInputProps("creditOfficerName")}
                    disabled={!users}
                    required
                  />
                </Grid.Col>
              </Grid>
              <Group mt="xl" position="center">
                <Button
                  variant="gradient"
                  color="blue"
                  mt="md"
                  radius="md"
                  onClick={() => {
                    showNotification({
                      id: "submit-status",
                      color: "teal",
                      title: `${loan.memberName}`,
                      message: `Disbursing Loan For ${loan.memberName} ...`,
                      loading: true,
                      autoClose: 50000,
                    });
                    handleSubmit();
                  }}
                >
                  Disburse Loan
                </Button>
              </Group>
            </Card.Section>
          </Card>
        </>
      )}
      {!loan && (
        <LoadingOverlay overlayBlur={2} visible={loan_status === "loading"} />
      )}
    </>
  );
};

const Page: NextPage = () => {
  const { status, data } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <Protected>
      {check && <Disburse email={email} status={status} />}
    </Protected>
  );
};

export default Page;
