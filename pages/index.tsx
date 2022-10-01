import React from "react";
import { TransactionsTable, Protected } from "../components";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Protected>
      <TransactionsTable call="transactions" />
    </Protected>
  );
};
export default Page;
