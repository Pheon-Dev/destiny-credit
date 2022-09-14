import React, { FC, useEffect } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const Protected: FC<Props> = ({ children }): JSX.Element => {
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/auth/sign-in");
  }, [status]);

  return <>{status === "authenticated" && <>{children}</>}</>;
};
