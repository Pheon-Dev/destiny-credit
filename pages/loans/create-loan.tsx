import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import React from "react";
import { TransactionsTable, Protected, EmptyTable } from "../../components";
import { trpc } from "../../utils/trpc";

const Page: NextPage = () => {
  try {
    const { data: transactions, status } = trpc.useQuery([
      "transactions.transactions",
    ]);

    return (
      <Protected>
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
        {(transactions?.length === 0 && <EmptyTable call="maintain" />) ||
          (transactions && (
            <TransactionsTable transactions={transactions} call="maintain" />
          ))}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="register" />
      </Protected>
    );
  }
};
export default Page;
