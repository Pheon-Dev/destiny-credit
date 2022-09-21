import React from "react";
import {
  EmptyTable,
  MembersTable,
  Protected,
  TransactionsTable,
} from "../../components";
import { Divider, LoadingOverlay } from "@mantine/core";
import { trpc } from "../../utils/trpc";

import { NextPage } from "next";

const MembersList = () => {
  try {
    const { data: members, status } = trpc.useQuery(["loans.create-loan"]);
    return (
      <Protected>
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
        {(!members && <EmptyTable call="create-loan" />) ||
          (members && <MembersTable members={members} call="create-loan" />)}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="create-loan" />
      </Protected>
    );
  }
};

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
          <Divider variant="dotted" mt="xl" />
        <MembersList />
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
