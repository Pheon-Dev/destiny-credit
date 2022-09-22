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

const MembersList = () => {
  const { status, data } = useSession();
  try {
    const { data: user, status: user_status } = trpc.users.user.useQuery({
      email: `${data?.user?.email}`,
    });

    const { data: members, status: members_status } =
      trpc.loans.create_loan.useQuery();
    return (
      <Protected>
        <LoadingOverlay
          overlayBlur={2}
          visible={members_status === "loading"}
        />
        {(!members && <EmptyTable call="create-loan" />) ||
          (members && (
            <MembersTable
              members={members}
              role={`${user?.role}`}
              call="create-loan"
            />
          ))}
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
    const { data: transactions, status } =
      trpc.transactions.transactions.useQuery();

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
