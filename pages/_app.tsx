import { GetServerSidePropsContext } from "next";
import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";

import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  Navbar,
  Group,
  AppShell,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle";
import { MainLinks } from "../components/MainLinks";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const [isSSR, setIsSSR] = useState(true);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <>
    <Head>
      <title>Destiny Credit</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
    </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          <NotificationsProvider>
            <AppShell
              styles={{
                main: {
                  background:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0],
                },
              }}
              navbarOffsetBreakpoint="sm"
              asideOffsetBreakpoint="sm"
              navbar={
                <Navbar
                  p="xs"
                  hiddenBreakpoint="sm"
                  hidden={!opened}
                  // height={500}
                  // width={{ base: 300 }}
                  width={{ lg: 300, sm: 200 }}
                >
                  <Navbar.Section grow mt="xs">
                    <MainLinks />
                  </Navbar.Section>
                </Navbar>
              }
              aside={
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                  <Aside
                    p="md"
                    hiddenBreakpoint="sm"
                    width={{ sm: 200, lg: 300 }}
                  >
                    <Text>App SideBar</Text>
                  </Aside>
                </MediaQuery>
              }
              footer={
                <Footer height={60} p="md">
                  App Footer
                </Footer>
              }
              header={
                <Header height={70}>
                  <Group sx={{ height: "100%" }} px={20} position="apart">
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                      <Burger
                        opened={opened}
                        onClick={() => setOpened((prev) => !prev)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                      />
                    </MediaQuery>
                    <Text style={{ fontWeight: "bold" }}>
                      DESTINY CREDIT LTD
                    </Text>
                    <ColorSchemeToggle />
                  </Group>
                </Header>
              }
            >
              <Component {...pageProps} />
      </AppShell>
      </NotificationsProvider>
      </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorscheme: getCookie("mantine-color-scheme", ctx) || "dark",
});
