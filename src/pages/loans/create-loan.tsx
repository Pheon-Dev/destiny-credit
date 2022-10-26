import { Divider } from "@mantine/core";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import {
  EmptyTable,
  MembersTable,
  Protected,
  TransactionsTable
} from "../../components";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;

  const call = "maintain";

  return (
    <Protected>
      <Suspense fallback={
        <EmptyTable call={call} />
      }>
        <TransactionsTable call={call} />

      </Suspense>
      <Divider variant="dotted" mt="xl" />
      <Suspense fallback={
        <EmptyTable call="create-loan" />
      }>
        <MembersTable call="create-loan" email={email} status={status} />
      </Suspense>

    </Protected>
  );
};
export default Page;
