import {
  ActionIcon, Button, Card, Divider, Grid, Group, LoadingOverlay, Menu, Text
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconDots,
  IconEye,
  IconFileZip,
  IconTrash,
  IconX
} from "@tabler/icons";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Protected } from "../../../components";
import { trpc } from "../../../utils/trpc";

const Approve = ({ email }: { email: string; status: string }) => {
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

  const approve = trpc.loans.approve.useMutation({
    onSuccess: async () => {
      updateNotification({
        id: "submit-status",
        color: "teal",
        title: `Loan Approval`,
        message: `Loan Was Successfully Approved`,
        icon: <IconCheck size={16} />,
        autoClose: 8000,
      });
      return router.push("/loans/disbursements");
    },
  });

  const handleSubmit = useCallback(() => {
    try {
      approve.mutate({
        id: id,
        approved: true,
        approverId: `${user?.id}`,
      });
    } catch (error) {
      return updateNotification({
        id: "submit-status",
        color: "red",
        title: `Loan Approval`,
        message: `Loan Was not Successfully Approved. Please Try Again.`,
        icon: <IconX size={16} />,
        autoClose: 8000,
      });
    }
  }, [approve, id, user?.id]);

  return (
    <>
      {loan && (
        <>
          <Card key={loan.id} shadow="sm" p="lg" radius="md" m="xl" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <Text weight={700}>{loan.memberName}</Text>
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
                      message: `Approving Loan For ${loan.memberName} ...`,
                      loading: true,
                      autoClose: 50000,
                    });
                    handleSubmit();
                  }}
                >
                  Approve Loan
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
      {check && <Approve email={email} status={status} />}
    </Protected>
  );
};

export default Page;
