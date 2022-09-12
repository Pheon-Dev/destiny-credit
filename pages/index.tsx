import React from "react";
import { TransactionsTable, Protected } from "../components";
import { trpc } from "../utils/trpc";
import { Group, LoadingOverlay } from "@mantine/core";

export default function Home() {
  const { data: transactions, status } = trpc.useQuery([
    "transactions.transactions",
  ]);

  return (
    <Protected>
      {transactions && <TransactionsTable transactions={transactions} />}
      {status === "loading" && (
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      )}
      {status === "success" && transactions?.length === 0 && (
        <Group position="center">No New Transactions</Group>
      )}
    </Protected>
  );
}
