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
import { IconSettings, IconCategory2, IconArrowUp } from "@tabler/icons";
import { ColorSchemeToggle } from "../Theme/ColorSchemeToggle";

function StyledTabs(props: TabsProps) {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9],
          border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]}`,
          padding: `${theme.spacing.xs} px ${theme.spacing.md}px`,
          cursor: 'pointer',
          fontSize: theme.fontSizes.sm,
          display: 'flex',
          alignItems: 'center',

          '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed'
            },

          '&:not(:first-of-type)': {
              borderLeft: 0,
            },

          '&:first-of-type': {
              borderTopLeftRadius: theme.radius.md,
              borderBottomLeftRadius: theme.radius.md,
            },

          '&:last-of-type': {
              borderTopRightRadius: theme.radius.md,
              borderBottomRightRadius: theme.radius.md,
            },

          '&[data-active]': {
              backgroundColor: theme.colors.blue[7],
              borderColor: theme.colors.blue[7],
              color: theme.white,
            },
        },

        tabIcon: {
            marginRight: theme.spacing.xs,
            display: 'flex',
            alignItems: 'center'
          },

          tabsList: {
              display: 'flex'
            },
      })}
      {...props}
    />
  );
}

export function Utilities() {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <>
      <Menu shadow="md" width={200} position="left-start" withArrow>
        <Menu.Target>
          {/* <Button variant="light" leftIcon={<IconCategory2 />}> */}
          {/*   Menu */}
          {/* </Button> */}
      <Affix position={{ top: 55, right: 20 }}>
        <StyledTabs defaultValue="menu">
          <Tabs.List>
            {/* <Tabs.Tab value="theme" icon={<ColorSchemeToggle />}>Theme</Tabs.Tab> */}
            <Tabs.Tab value="menu" icon={<IconCategory2 />}>Menu</Tabs.Tab>
            {/* <Tabs.Tab value="settings" icon={<IconSettings />}>Settings</Tabs.Tab> */}
          </Tabs.List>
        </StyledTabs>
      </Affix>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Apps</Menu.Label>
          {/* <Menu.Item><ColorSchemeToggle /></Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
      <Affix position={{ bottom: 20, right: 20 }}>
              <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                  <Button
                  // variant="light"
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
