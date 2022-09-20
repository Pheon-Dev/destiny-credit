import React from "react";
import { TransactionsTable, Protected, EmptyTable } from "../components";
import { trpc } from "../utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";

const Page: NextPage = () => {
  try {
    const { data: transactions, status } = trpc.useQuery([
      "transactions.transactions",
    ]);
    return (
      <Protected>
        <LoadingOverlay overlayBlur={1} visible={status === "loading"} />
        {(!transactions && <EmptyTable call="transactions" />) ||
          (transactions && (
            <TransactionsTable
              transactions={transactions}
              call="transactions"
            />
          ))}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return <EmptyTable call="transactions" />;
  }
};
export default Page;
