import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import React from "react";
import { TransactionsTable, Protected, EmptyTable } from "../../components";
import { trpc } from "../../utils/trpc";

const Page: NextPage = () => {
  const { data: transactions, status } = trpc.useQuery([
    "transactions.transactions",
  ]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(!transactions && (
        <EmptyTable call="register" />
      )) ||
        (transactions && <TransactionsTable transactions={transactions} call="register" />)}
    </Protected>
  );
}
export default Page;
