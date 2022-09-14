import { LoadingOverlay } from "@mantine/core";
import React from "react";
import { TransactionsTable, Protected } from "../../components";
import { trpc } from "../../utils/trpc";

export default function Home() {
  const { data: transactions, status } = trpc.useQuery([
    "transactions.transactions",
  ]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {transactions && (
        <TransactionsTable transactions={transactions} call="register" />
      )}
    </Protected>
  );
}
