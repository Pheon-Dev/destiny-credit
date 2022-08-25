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
  ScrollArea,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { TitleText, MainLinks, ColorSchemeToggle } from "../components";

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
        <title>Destiny Credit LTD</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme, loader: 'bars' }}
        >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <NotificationsProvider>
            <AppShell
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
                  <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs" mt="xs">
                    <MainLinks />
                  </Navbar.Section>
                </Navbar>
              }
              // aside={
              //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              //     <Aside
              //       p="md"
              //       hiddenBreakpoint="sm"
              //       width={{ sm: 200, lg: 300 }}
              //     >
              //       <Text>App SideBar</Text>
              //     </Aside>
              //   </MediaQuery>
              // }
              // footer={
              //   <Footer height={60} p="md">
              //     App Footer
              //   </Footer>
              // }
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
                    <TitleText title="DESTINY CREDIT LTD" />
                    <ColorSchemeToggle />
                  </Group>
                </Header>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
          </ColorSchemeProvider>
        </MantineProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorscheme: getCookie("mantine-color-scheme", ctx) || "dark",
});
