import { GetServerSidePropsContext } from "next";
import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { MantineProvider, ColorScheme, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";


export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const [isSSR, setIsSSR] = useState(true);

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
          content="minimum-scale=1, intial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "dark" }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
};

App.getInitialProps = ({ctx}: {ctx: GetServerSidePropsContext}) => ({
    colorscheme: getCookie('mantine-color-scheme', ctx) || 'dark',
  });
