import React, { useCallback } from "react";
import { NextPage } from "next";
import { Protected } from "../../../components";
import {
  Group,
  Button,
  Text,
  Card,
  Grid,
  Menu,
  ActionIcon,
  LoadingOverlay,
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
import type { Loan } from "@prisma/client";

const Approve = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const utils = trpc.useContext();

  const { data: loan, status } = trpc.useQuery(["loans.loan", { id: id }]);
  const approve = trpc.useMutation(["loans.approve"], {
    onSuccess: async () => {
      await utils.invalidateQueries(["loans.loan", { id: id }]);
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
  }, [approve, id]);

  return (
    <>
      {loan && (
        <>
          {loan.map((_: Loan) => (
            <Card key={_.id} shadow="sm" p="lg" radius="md" m="xl" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart">
                  <Text weight={700}>{_.memberName}</Text>
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
                    <Text>{_.productName}</Text>
                  </Grid.Col>
                </Grid>
                <Grid grow>
                  <Grid.Col mt="xs" span={4}>
                    <Text weight={500}>Skipped Sundays</Text>
                  </Grid.Col>
                  <Grid.Col mt="xs" span={4}>
                    <Text>
                      {_.sundays} {_.sundays === "1" ? "Sunday" : "Sundays"}
                    </Text>
                  </Grid.Col>
                </Grid>
                {_.payoff !== "0" && (
                  <Grid grow>
                    <Grid.Col mt="xs" span={4}>
                      <Text weight={500}>Payoff Amount</Text>
                    </Grid.Col>
                    <Grid.Col mt="xs" span={4}>
                      <Text>
                        {`KSHs. ${_.payoff}.00`.replace(
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
                      {_.tenure}{" "}
                      {_.cycle.toLowerCase() === "daily"
                        ? "Days"
                        : _.cycle.toLowerCase() === "weeks"
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
                      {`KSHs. ${_.principal}.00`.replace(
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
                      {`KSHs. ${_.installment}.00`.replace(
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
                      {`KSHs. ${_.interest}.00`.replace(
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
                      {`KSHs. ${_.penalty}.00`.replace(
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
                      {`KSHs. ${_.processingFee}.00`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </Text>
                  </Grid.Col>
                </Grid>
                {_.grace === "1" && (
                  <Grid grow>
                    <Grid.Col mt="xs" span={4}>
                      <Text weight={500}>Grace Period</Text>
                    </Grid.Col>
                    <Grid.Col mt="xs" span={4}>
                      <Text>{_.grace} Day</Text>
                    </Grid.Col>
                  </Grid>
                )}
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
                        title: `${_.memberName}`,
                        message: `Approving Loan For ${_.memberName} ...`,
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
          ))}
        </>
      )}
      {!loan && (
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      )}
    </>
  );
};

const Page: NextPage = () => {
  return (
    <Protected>
      <Approve />
    </Protected>
  );
};

export default Page;
