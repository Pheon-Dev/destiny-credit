import React from "react";
import { TransactionsTable, Protected } from "../components";
import { trpc } from "../utils/trpc";
import { Group, LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";

const Page: NextPage = () => {
  const { data: transactions, status } = trpc.useQuery([
    "transactions.transactions",
  ]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {transactions && (
        <TransactionsTable transactions={transactions} call="transactions" />
      )}
      {status === "success" && transactions?.length === 0 && (
        <Group position="center">No New Transactions</Group>
      )}
    </Protected>
  );
}
export default Page;
