import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { NextPage } from "next";
import { Protected, TitleText } from "../../../components";
import {
  Group,
  Button,
  Text,
  Card,
  Grid,
  Menu,
  ActionIcon,
  LoadingOverlay,
  Divider,
  Select,
} from "@mantine/core";
import { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconDots,
  IconEye,
  IconFileZip,
  IconTrash,
  IconX,
} from "@tabler/icons";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";

const schema = z.object({
  creditOfficerId: z.string().min(2, { message: "Officer not Selected" }),
  creditOfficerName: z.string().min(2, { message: "Officer not Selected" }),
});

const Disburse = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const utils = trpc.useContext();

  const { status, data } = useSession();

  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  if (data?.user?.email) {
    const user_data = trpc.users.user.useQuery({
      email: `${data?.user?.email}`,
    });

    useEffect(() => {
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }, []);
  }

  const { data: users, status: users_status } = trpc.users.officers.useQuery();
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
    }
    return () => {
      sub = false;
    };
  }, [form.values.creditOfficerName]);

  const date = new Date();
  const disbursedOn =
    date.toLocaleDateString().split("/")[0] +
    "-" +
    date.toLocaleDateString().split("/")[1] +
    "-" +
    date.toLocaleDateString().split("/")[2];

  const handleSubmit = useCallback(() => {
    try {
      try {
        if (
          form.values.creditOfficerName &&
          form.values.creditOfficerId &&
          user &&
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
  }, [disburse, id, disbursedOn, form.values]);

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
                <Grid.Col mt="xs" span={4} offset={4}>
                  <Text>{disbursedOn}</Text>
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
                    data={user_data?.map((p) => p[0].label)}
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
  return (
    <Protected>
      <Disburse />
    </Protected>
  );
};

export default Page;
