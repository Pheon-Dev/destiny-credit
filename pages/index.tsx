import React from "react";
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
      {check?.length > 0 && (
        <TransactionsTable call={call} email={email} status={status} />
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};
export default Page;
