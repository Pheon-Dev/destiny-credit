import React from "react";
import { PaymentsTable, Protected } from "../../components";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Protected>
      <PaymentsTable call="payments" />
    </Protected>
  );
};

export default Page;
