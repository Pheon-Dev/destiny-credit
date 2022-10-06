import React, { Suspense } from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "transactions";

  return (
    <Protected>
      <Suspense fallback={<EmptyTable call={call} status={status} />}>
        {check?.length > 0 && (
          <TransactionsTable call={call} email={email} status={status} />
        )}
      </Suspense>
    </Protected>
  );
};
export default Page;
