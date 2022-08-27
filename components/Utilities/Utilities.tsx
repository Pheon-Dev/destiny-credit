import axios from "axios";
import {
  Tabs,
  TabsProps,
  Text,
  Menu,
  Button,
  Affix,
  Transition,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import {
  IconSettings,
  IconCategory2,
  IconArrowUp,
  IconMessageCircle,
  IconSearch,
  IconRefresh,
  IconUser,
} from "@tabler/icons";
import { ColorSchemeToggle } from "../Theme/ColorSchemeToggle";
import Router from "next/router";

function StyledTabs(props: TabsProps) {
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
          padding: `${theme.spacing.xs} px ${theme.spacing.md}px`,
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
}

export const forceReload = async () => {
  const res = await axios.get("/api/mpesa");
  const data = res.data;
  console.table({date: data.date, message: data.message});
  Router.replace(Router.asPath);
};

export function Utilities() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <>
      <Menu
        shadow="md"
        // trigger="hover"
        openDelay={100}
        closeDelay={400}
        width={200}
        position="left-start"
        withArrow
      >
        <Affix position={{ top: 55, right: 20 }}>
          <StyledTabs defaultValue="apps">
            <Tabs.List>
              <Menu.Target>
                <Tabs.Tab value="apps" icon={<IconCategory2 />}>
                  Apps
                </Tabs.Tab>
              </Menu.Target>
              <Tabs.Tab
                onClick={forceReload}
                value="refresh"
                icon={<IconRefresh />}
              >
                Refresh
              </Tabs.Tab>
              <Tabs.Tab value="account" icon={<IconUser />}>
                Account
              </Tabs.Tab>
            </Tabs.List>
          </StyledTabs>
        </Affix>
        <Menu.Dropdown>
          {/* <Menu.Label>Apps</Menu.Label> */}
          <div style={{ display: "inline-flex", padding: 6, paddingLeft: 8 }}>
            <ColorSchemeToggle />
            <Text style={{ paddingLeft: 6 }}>Theme</Text>
          </div>
          <Menu.Item icon={<IconSettings size={20} />}>Settings</Menu.Item>
          <Menu.Item icon={<IconMessageCircle size={20} />} disabled>
            Messages
          </Menu.Item>
          <Menu.Divider />
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
        </Menu.Dropdown>
      </Menu>
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
}
