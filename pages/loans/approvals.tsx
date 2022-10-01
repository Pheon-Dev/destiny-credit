import React from "react";
import { LoansTable, Protected } from "../../components";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Protected>
      <LoansTable call="approvals" />
    </Protected>
  );
};

export default Page;
