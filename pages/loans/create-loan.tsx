import React from "react";
import { MembersTable, Protected, TransactionsTable } from "../../components";
import { Divider } from "@mantine/core";

import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Protected>
      <TransactionsTable call="maintain" />
      <Divider variant="dotted" mt="xl" />
      <MembersTable call="create-loan" />
    </Protected>
  );
};
export default Page;
