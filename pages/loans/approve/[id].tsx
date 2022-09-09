import React, { useEffect, useState } from "react";
import axios from "axios";
import { NextPage } from "next";
import { Protected } from "../../../components";
import {
  Group,
  Stepper,
  Button,
  Text,
  TextInput,
  Card,
  Box,
  Grid,
  Select,
  Menu,
  ActionIcon,
  Switch,
  Autocomplete,
  Tooltip,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconDots,
  IconEye,
  IconFileZip,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons";
import { Collaterals, Guarantors, Loans, Members, Products } from "../../../types";

const Approve = () => {
  const [loan, setLoan] = useState([]);
  const [load, setLoad] = useState(true);
  const router = useRouter();
  const id = router.query.id as string;

  const fetchLoan = async () => {
    let subscribe = true;
    if (subscribe) {
      const res = await axios.request({
        method: "POST",
        url: `/api/loans/approve`,
        data: {
          id: `${id}`,
        },
      });
      setLoan(res.data);
      loan.length === 0 && setLoad(false);
    }

    return () => {
      subscribe = false;
    };
  };

  useEffect(() => {
    fetchLoan();
  }, [loan]);

  const handleSubmit = () => {
      console.log("Approving")
    }

    return (
      <>
      {(loan.length > 0 && (
    <>
      {loan.map((_: Loans) => (
          <Card shadow="sm" p="lg" radius="md" m="xl" withBorder>
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
              <Card.Section withBorder inheritPadding mt="md" py="xs">
                <Group position="apart">
                  <Text weight={700}>Collaterals</Text>
                </Group>
              </Card.Section>
              <Group mt="xl">
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
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
                  Submit
                </Button>
              </Group>
            </Card.Section>
          </Card>
      ))}
    </>
      ) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      ))}

      </>
    );
  }

const Page: NextPage = () => {
  return (
   <Protected>
  <Approve />
  </Protected>)
};

export default Page;
