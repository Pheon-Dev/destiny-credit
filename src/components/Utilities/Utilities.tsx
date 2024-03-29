import { showNotification, updateNotification } from "@mantine/notifications";
import {
  Tabs,
  TabsProps,
  Text,
  Button,
  Affix,
  Transition,
  Tooltip,
  Drawer,
  Card,
  Group,
  Grid,
  List,
  ThemeIcon,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import {
  IconArrowUp,
  IconSearch,
  IconUser,
  IconLogout,
  IconX,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";
import { trpc } from "../../utils/trpc";
import { useCallback, useEffect, useState } from "react";
import { TitleText } from "../Text/TitleText";
import { openSpotlight } from '@mantine/spotlight';

export const Utilities = () => {
  const { status, data } = useSession();
  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <>{check !== "" && <UtilitiesComponent email={email} status={status} />}</>
  );
};

const UtilitiesComponent = ({
  email,
  status,
}: {
  email: string;
  status: string;
}) => {
  const [scroll, scrollTo] = useWindowScroll();
  const [open, setOpen] = useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const router = useRouter();

  const { data: users } = trpc.users.users.useQuery();
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
      if (status === "unauthenticated") {
        if (router.pathname !== "/auth/sign-in") {
          if (router.pathname !== "/auth/sign-up") {
            router.push("/auth/sign-in");
          }
        }
      }
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
    status,
    user_data?.data?.id,
    user_data?.data?.role,
    user_data?.data?.username,
    user_data?.data?.firstName,
    user_data?.data?.lastName,
    user_data?.data?.email,
    user_data?.data?.state,
  ]);

  const utils = trpc.useContext();
  const signout = trpc.users.signout.useMutation({
    onSuccess: async () => {
      await utils.users.users.invalidate();
      signOut();
    },
  });

  const handleSignOut = useCallback(() => {
    try {
      if (user?.id) {
        setOpen(false);
        signout.mutate({
          id: `${user?.id}`,
          state: "offline",
        });
        if (!signout) {
          return updateNotification({
            id: "sign-out-status",
            title: "Sign Out Error!",
            message: `Please Try Again!`,
            icon: <IconX size={16} />,
            color: "red",
            autoClose: 4000,
          });
        }
        if (signout) {
          return updateNotification({
            id: "sign-out-status",
            title: "Sign Out",
            message: `Signing Out ${user?.username} ...`,
            loading: true,
          });
        }
        return updateNotification({
          id: "sign-out-status",
          title: "Sign Out Error!",
          message: `Please Try Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      }
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
  }, [user?.id, router, signout, user?.username]);

  return (
    <>
      <Affix position={{ top: 55, right: 20 }}>
        <Group position="apart">
          <StyledTabs defaultValue="apps">
            <Tabs.List>
              <Tooltip label="Utilities" color="blue" withArrow>
                <Tabs.Tab
                  value="apps"
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
                />
              </Tooltip>
              {status === "authenticated" && (
                <>
                  <Tooltip color="blue" withArrow label="Search">
                    <Tabs.Tab
                      value="search"
                      onClick={() => openSpotlight()}
                      icon={<IconSearch style={{ padding: 2 }} />}
                    />
                  </Tooltip>
                  <Tooltip color="blue" withArrow label="Account">
                    <Tabs.Tab
                      value="account"
                      onClick={() => setOpen(true)}
                      disabled={!user}
                      icon={<IconUser style={{ padding: 2 }} />}
                    />
                  </Tooltip>
                </>
              )}
            </Tabs.List>
          </StyledTabs>
        </Group>
      </Affix>
      {user?.username && (
        <Drawer
          opened={open}
          onClose={() => setOpen(false)}
          title="Account Info"
          padding="xl"
          size="xl"
        >
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <Group position="center" mt="md" mb="xs">
                  <TitleText
                    title={`${user?.role === "MD"
                      ? "Managing Director"
                      : user?.role === "CO"
                        ? "Credit Officer"
                        : user?.role === "CA"
                          ? "Credit Admin"
                          : "Auditor"
                      }`}
                  />
                </Group>
              </Group>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Username</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{user.username}</Text>
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
                  <Text>{user?.firstname}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Last Name</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{user?.lastname}</Text>
                </Grid.Col>
              </Grid>
            </Card.Section>
          </Card>
          <Group position="center" m="md">
            <TitleText title="Online Users" />
          </Group>
          <List
            spacing="md"
            m="xl"
            size="sm"
            center
            icon={
              <ThemeIcon color="grey" size={12} radius="xl">
                <></>
              </ThemeIcon>
            }
          >
            {users &&
              users?.map((_) => (
                <span key={_?.id}>
                  {user?.id !== _?.id && (

                    <List.Item
                      value={_?.id}
                      key={_?.id}
                      icon={
                        _?.state === "online" && (
                          <ThemeIcon color="green" size={12} radius="xl">
                            <></>
                          </ThemeIcon>
                        )
                      }
                    >
                      <Group position="center">
                        <Text>
                          {_?.username} : {_?.firstName} {_?.lastName}
                        </Text>
                      </Group>
                    </List.Item>
                  )}
                </span>
              ))}
          </List>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group
                position="apart"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  showNotification({
                    id: "sign-out-status",
                    title: "Sign Out",
                    message: `Signing Out ${user?.username} ...`,
                    loading: true,
                  });
                  handleSignOut();
                }}
              >
                <Text color="red">Sign Out</Text>
                <IconLogout color="red" size={24} />
              </Group>
            </Card.Section>
          </Card>
        </Drawer>
      )}
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
          border: `1px solid ${theme.colorScheme === "dark"
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
