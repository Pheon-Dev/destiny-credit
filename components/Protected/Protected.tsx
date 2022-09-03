import React, { FC, useEffect, useState } from "react";
import Router from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Button, Group, LoadingOverlay } from "@mantine/core";

interface Props {
  children: React.ReactNode;
}

export const Protected: FC<Props> = ({ children }): JSX.Element => {
  const [load, setLoad] = useState(true);
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/auth/sign-in");
  }, [status]);

  if (status === "authenticated")
    return (
      <>
        {children}
        <pre>{JSON.stringify(data.user, undefined, 2)}</pre>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </Button>
      </>
    );

  return (
    <>
      <LoadingOverlay
        overlayBlur={2}
        onClick={() => setLoad((prev) => !prev)}
        visible={load}
      />
      {/* <Button onClick={() => { */}
      {/*     signIn(); */}
      {/*   }}>Sign In</Button> */}
    </>
  );
};
