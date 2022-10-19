import React, { Suspense } from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const call = "transactions";

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
