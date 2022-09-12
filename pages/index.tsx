import React from "react";
import { TransactionsTable, Protected } from "../components";
import { trpc } from "../utils/trpc";
import { Group, LoadingOverlay } from "@mantine/core";
import { Transaction } from "@prisma/client";

export default function Home() {
  const transactions = trpc.useQuery(["transactions"]) || [];
  const data = transactions.data?.map((t: Transaction) => t);

  return (
    <Protected>
      {data && <TransactionsTable transactions={data} />}
      {transactions.status === "loading" && (
        <LoadingOverlay
          overlayBlur={2}
          visible={transactions.status === "loading"}
        />
      )}
      {transactions.status === "success" && transactions.data.length === 0 && (
        <Group position="center">No New Transactions</Group>
      )}
    </Protected>
  );
}
