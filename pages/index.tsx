import React, { useEffect, useState } from "react";
import { TransactionsTable, Protected } from "../components";
import { trpc } from "../utils/trpc";
import { Group, LoadingOverlay } from "@mantine/core";

export default function Home() {
  const [load, setLoad] = useState(true);

  const transactions = trpc.useQuery(["transactions"]) || [];
  const data = transactions.data?.map((t: any) => t)

  return (
    <Protected>
      {(data && <TransactionsTable transactions={data} />)}
      {(transactions.status === "loading" && (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      ))}
      {transactions.status === "success" && transactions.data.length === 0 && (
        <Group position="center">No New Transactions</Group>
      )}
    </Protected>
  );
}
