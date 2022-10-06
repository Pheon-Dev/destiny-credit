import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import type { AppProps } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

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
  Text,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { TitleText, MainLinks, Utilities } from "../components";
import { trpc } from "../utils/trpc";
import { unstable_getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]";
import { SpotlightProvider } from '@mantine/spotlight';
import type { SpotlightAction } from '@mantine/spotlight';
import {
  IconHome, IconDashboard, IconFileText, IconSearch,
} from "@tabler/icons";
import { Member } from "@prisma/client";
import { useRouter } from "next/router";


const App = (props: AppProps & { colorScheme: ColorScheme }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const router = useRouter();

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const { data: members } = trpc.members.members.useQuery();

  let actions: SpotlightAction[] = []

  members?.map((m) => (
    actions.push({
      title: `${m.firstName} ${m.lastName}`,
      description: `${m.memberId} Phone: ${m.phoneNumber}; ID: ${m.idPass} `,
      onTrigger: () => router.push(`/members/details/${m.id}`),
      icon: <IconFileText size={18} />,
    })
  ))

  const AppContent = () => {
    const { status, data } = useSession();

    return (
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme, loader: "dots" }}
      >
        <SpotlightProvider
          actions={actions}
          searchIcon={<IconSearch size={18} />}
          searchPlaceholder="Search..."
          shortcut="shift + S"
          nothingFoundMessage="Nothing found..."
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
        </SpotlightProvider>
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
};

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorscheme: getCookie("mantine-color-scheme", ctx) || "dark",
});

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default trpc.withTRPC(App);
