import React from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import { trpc } from "../utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";

const Page: NextPage = () => {
  const { data: transactions, fetchStatus } =
    trpc.transactions.transactions.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} />
        {(transactions?.length === 0 && <EmptyTable call="transactions" />) ||
          (transactions && (
            <TransactionsTable
              transactions={transactions}
              call="transactions"
            />
          ))}
      </div>
    </Protected>
  );
};
export default Page;
