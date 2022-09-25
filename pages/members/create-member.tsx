import React from "react";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { TransactionsTable, Protected, EmptyTable } from "../../components";
import { trpc } from "../../utils/trpc";

const Page: NextPage = () => {
  trpc.logs.logs.useQuery();
  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} />
        {!transactions && <EmptyTable call="register" />}
        {transactions && (
          <TransactionsTable transactions={transactions} call="register" />
        )}
      </div>
    </Protected>
  );
};
export default Page;
