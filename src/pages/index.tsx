import React, { Suspense, useEffect } from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const router = useRouter();
  const call = "transactions";

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setInterval(() => {
        router.replace(router.asPath)
      }, 800000)
    }
    return () => {
      subscribe = false
    }
  }, [router])

  return (
    <Protected>
      <Suspense fallback={
        <EmptyTable call={call} />
      }>
        <TransactionsTable call={call} />
      </Suspense>
    </Protected>
  );
};
export default Page;
