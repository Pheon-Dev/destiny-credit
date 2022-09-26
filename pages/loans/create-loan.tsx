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
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { data } = useSession();

  const logs = trpc.logs.logs.useQuery();
  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const { data: members, fetchStatus: mems_status } =
    trpc.loans.create_loan.useQuery();

  const { data: transactions, fetchStatus: trans_status } =
    trpc.transactions.transactions.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        {/* <LoadingOverlay overlayBlur={2} visible={mems_status === "fetching"} /> */}
        {!transactions && !logs && <EmptyTable call="maintain" />}
        {transactions && (
          <TransactionsTable transactions={transactions} call="maintain" handler={`${user?.id}`} updater={`${user?.id}`} />
        )}
        <Divider variant="dotted" mt="xl" />
      </div>
      <div style={{ position: "relative" }}>
        {/* <LoadingOverlay overlayBlur={2} visible={trans_status === "fetching"} /> */}
        {!members && <EmptyTable call="create-loan" />}
        {members && (
          <MembersTable
            members={members}
            role={`${user?.role}`}
            call="create-loan"
          />
        )}
      </div>
    </Protected>
  );
};
export default Page;
