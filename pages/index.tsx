import React from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import { trpc } from "../utils/trpc";
import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { data } = useSession();

  const logs = trpc.logs.logs.useQuery();
  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        {!transactions && !logs && <EmptyTable call="transactions" status={fetchStatus} />}
        {transactions && (
          <TransactionsTable transactions={transactions} call="transactions" handler={`${user?.id}`} updater={`${user?.id}`} />
        )}
      </div>
    </Protected>
  );
};
export default Page;
