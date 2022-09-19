import React from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import { trpc } from "../utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";

const Page: NextPage = () => {
  const { data: transactions, status } = trpc.useQuery([
    "transactions.transactions",
  ]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(!transactions && (
        <EmptyTable call="transactions" />
      )) ||
        (transactions && <TransactionsTable transactions={transactions} call="transactions" />)}
    </Protected>
  );
};
export default Page;
