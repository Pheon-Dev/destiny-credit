import React from "react";
import {
  EmptyTable,
  MembersTable,
  Protected,
  TransactionsTable,
} from "../../components";
import { Divider } from "@mantine/core";
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
        {!transactions && !logs && (
          <EmptyTable call="maintain" status={trans_status} />
        )}
        {transactions && (
          <TransactionsTable
            transactions={transactions}
            call="maintain"
            handler={`${user?.id}`}
            updater={`${user?.id}`}
          />
        )}
        <Divider variant="dotted" mt="xl" />
      </div>
      <div style={{ position: "relative" }}>
        {!members && <EmptyTable call="create-loan" status={mems_status} />}
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
