import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import type { AppProps } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";
import { withTRPC } from "@trpc/next";
import { loggerLink } from '@trpc/client/links/loggerLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import type { AppRouter } from "../server/_app";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import superjson from "superjson";

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
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { TitleText, MainLinks, Utilities } from "../components";

const App = (props: AppProps & { colorScheme: ColorScheme }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  /* const [isSSR, setIsSSR] = useState(true); */

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  /* useEffect(() => { */
  /*   setIsSSR(false); */
  /* }, []); */

  /* if (isSSR) return null; */

  const AppContent = () => {
  /* console.log(pageProps.session); */
    const { status, data } = useSession();
    console.log(data)

    return (
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme, loader: "dots" }}
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
                <>
                  {status === "authenticated" && (
                    <Navbar
                      p="xs"
                      hiddenBreakpoint="sm"
                      hidden={!opened}
                      // height={500}
                      /* width={{ base: 200 }} */
                      width={{ lg: 200, sm: 180 }}
                    >
                      <Navbar.Section
                        grow
                        component={ScrollArea}
                        mx="-xs"
                        px="xs"
                        mt="xs"
                      >
                        <MainLinks />
                      </Navbar.Section>
                    </Navbar>
                  )}
                </>
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
                    <Utilities />
                  </Group>
                </Header>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </ColorSchemeProvider>
      </MantineProvider>
    );
  };

  return (
    <>
      <Head>
        <title>Destiny Credit LTD</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <SessionProvider session={pageProps.session}>
        <AppContent />
      </SessionProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorscheme: getCookie("mantine-color-scheme", ctx) || "dark",
});

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
       loggerLink({
           enabled: (opts) => process.env.NODE_ENV === "development" ||
           (opts.direction === "down" && opts.result instanceof Error),
         }),
       httpBatchLink({
           url: `${getBaseUrl()}/api/trpc`
         }),
      ],
      transformer: superjson,
    };
  },
  ssr: true,
  responseMeta({ clientErrors, ctx }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

    return {
      "Cache-Control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
})(App);
