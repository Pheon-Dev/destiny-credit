import { showNotification, updateNotification } from "@mantine/notifications";
import {
  Tabs,
  TabsProps,
  Text,
  Menu,
  Button,
  Affix,
  Transition,
  Tooltip,
  Drawer,
  Modal,
  Card,
  Group,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import {
  IconSettings,
  IconCategory2,
  IconArrowUp,
  IconMessageCircle,
  IconSearch,
  IconRefresh,
  IconArrowsLeftRight,
  IconUser,
  IconCheck,
  IconLogout,
  IconX,
  IconDots,
  IconFileZip,
  IconEye,
  IconTrash,
} from "@tabler/icons";
import Router, { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import { TitleText } from "../Text/TitleText";

export const Utilities = () => {
  const [scroll, scrollTo] = useWindowScroll();
  const [open, setOpen] = useState(false);
  const { status, data } = useSession();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const router = useRouter();

  const { data: user, status: user_status } = trpc.users.user.useQuery(
    {
      email: `${data?.user?.email}`,
    },
  );
  const logs = trpc.logs.logs.useQuery();
  const forceReload = async () => {
    try {
      if (logs)
        updateNotification({
          id: "transactions-status",
          color: "teal",
          /* title: logs.data?.message, */
          /* message: `Updated Recent Transactions as from ${logs.data?.from} to ${logs.data?.to}`, */
          title: "M-PESA Transactions",
          message: `Updated Recent M-PESA Transactions`,
          icon: <IconCheck size={16} />,
          autoClose: 8000,
        });
      Router.replace(Router.asPath);
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "transactions-status",
          title: "Transaction Fetch Error!",
          message: `${error}. Please Try Again Later`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
    }
  };

  const handleSignOut = () => {
    try {
      /* router.push("/api/auth/signin"); */
      /* router.push("/auth/sign-in"); */
      signOut();
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "sign-out-status",
          title: "Sign Out Error!",
          message: `${error}. Please Try Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
    }
  };

  try {
    return (
      <>
        <Menu
          shadow="md"
          // trigger="hover"
          openDelay={100}
          closeDelay={400}
          width={200}
          position="bottom-end"
          withArrow
        >
          <Affix position={{ top: 55, right: 20 }}>
            <StyledTabs defaultValue="apps">
              <Tabs.List>
                <Menu.Target>
                  <Tooltip label="Utilities" color="blue" withArrow>
                    <Tabs.Tab
                      value="apps"
                      icon={<IconCategory2 style={{ padding: 2 }} />}
                    />
                  </Tooltip>
                </Menu.Target>
                {status === "authenticated" && (
                  <>
                    <Tooltip color="blue" withArrow label="Refresh">
                      <Tabs.Tab
                        onClick={() => {
                          showNotification({
                            id: "transactions-status",
                            color: "teal",
                            title: "Loading Transactions",
                            message: "Fetching Recent M-PESA Transactions ...",
                            loading: true,
                            autoClose: 50000,
                          });
                          forceReload();
                        }}
                        value="refresh"
                        icon={<IconArrowsLeftRight style={{ padding: 2 }} />}
                      />
                    </Tooltip>
                    <Tooltip color="blue" withArrow label="Account">
                      <Tabs.Tab
                        value="account"
                        onClick={() => setOpen(true)}
                        icon={<IconUser style={{ padding: 2 }} />}
                      />
                    </Tooltip>
                  </>
                )}
              </Tabs.List>
            </StyledTabs>
          </Affix>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                toggleColorScheme();
              }}
              icon={
                colorScheme === "dark" ? (
                  <IconSun color="yellow" size={20} stroke={1.5} />
                ) : (
                  <IconMoonStars color="blue" size={20} stroke={1.5} />
                )
              }
            >
              {colorScheme === "dark" ? "Light Theme" : "Dark Theme"}
            </Menu.Item>
            {status === "authenticated" && (
              <>
                <Menu.Divider />
                <Menu.Item icon={<IconSettings size={20} />}>
                  Settings
                </Menu.Item>
                <Menu.Item icon={<IconMessageCircle size={20} />} disabled>
                  Messages
                </Menu.Item>
                {/* Spotlight */}
                <Menu.Item
                  icon={<IconSearch size={20} />}
                  rightSection={
                    <Text size="xs" color="dimmed">
                      CTRL+K
                    </Text>
                  }
                  disabled
                >
                  Search
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item icon={<IconRefresh size={20} />}>
                  Reload Page
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    showNotification({
                      id: "sign-out-status",
                      color: "teal",
                      title: "Sign Out",
                      message: "Signing Out of Destiny Credit LTD ...",
                      loading: true,
                      autoClose: 10000,
                    });
                    handleSignOut();
                  }}
                  icon={<IconLogout size={20} />}
                  color="red"
                >
                  Sign Out
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
        <Modal
          opened={open}
          onClose={() => setOpen(false)}
          title="Account Info"
        >
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                {/* <TitleText title={`${user?.firstName} ${user?.lastName}`} /> */}
                <Group position="center" mt="md" mb="xs">
                  <TitleText
                    title={`${
                      user?.role === "MD"
                        ? "Managing Director"
                        : user?.role === "CO"
                        ? "Credit Officer"
                        : user?.role === "CA"
                        ? "Credit Admin"
                        : "Auditor"
                    }`}
                  />
                </Group>
                <Menu withinPortal position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item onClick={() => handleSignOut()} icon={<IconLogout size={14} />} color="red">
                    Sign Out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Username</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{user?.username}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Email Address</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{user?.email}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>First Name</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{user?.firstName}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Last Name</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{user?.lastName}</Text>
                </Grid.Col>
              </Grid>
            </Card.Section>
          </Card>
        </Modal>
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition="slide-up" mounted={scroll.y > 0}>
            {(transitionStyles) => (
              <Button
                variant="light"
                leftIcon={<IconArrowUp size={16} />}
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                Top
              </Button>
            )}
          </Transition>
        </Affix>
      </>
    );
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const StyledTabs = (props: TabsProps) => {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[9],
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4]
          }`,
          borderColor: theme.colors.blue[9],
          padding: `${theme.spacing.xs} px ${theme.spacing.md} px`,
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          display: "flex",
          alignItems: "center",

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },

          "&:not(:first-of-type)": {
            borderLeft: 0,
          },

          "&:first-of-type": {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          "&:last-of-type": {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },

          "&[data-active]": {
            borderColor: theme.colors.blue[7],
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.blue[1],
            color:
              theme.colorScheme === "dark" ? theme.white : theme.colors.gray[9],
          },
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          marginLeft: theme.spacing.xs,
          display: "flex",
          alignItems: "center",
        },

        tabsList: {
          display: "flex",
        },
      })}
      {...props}
    />
  );
};
