import type { NextPage } from 'next';
import { Suspense } from "react";
import { EmptyTable, Protected, TransactionsTable } from "../components";

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
