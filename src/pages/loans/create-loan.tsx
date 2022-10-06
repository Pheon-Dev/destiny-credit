import React from "react";
import {
  EmptyTable,
  MembersTable,
  Protected,
  TransactionsTable,
} from "../../components";
import { Divider } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "maintain";

  return (
    <Protected>
      {check?.length > 0 && (
        <>
          <TransactionsTable call={call} email={email} status={status} />
          <Divider variant="dotted" mt="xl" />
          <MembersTable call="create-loan" email={email} status={status} />
        </>
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};
export default Page;
