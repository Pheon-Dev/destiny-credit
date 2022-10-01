import React from "react";
import { NextPage } from "next";
import { TransactionsTable, Protected } from "../../components";

const Page: NextPage = () => {
  return (
    <Protected>
      <TransactionsTable call="register" />
    </Protected>
  );
};
export default Page;
