import React from "react";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { TransactionsTable, Protected, EmptyTable } from "../../components";
import { trpc } from "../../utils/trpc";
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
        {/* <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} /> */}
        {!transactions && <EmptyTable call="register" />}
        {transactions && (
          <TransactionsTable transactions={transactions} call="register" handler={`${user?.id}`} updater={`${user?.id}`} />
        )}
      </div>
    </Protected>
  );
};
export default Page;
