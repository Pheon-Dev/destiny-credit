import React from "react";
import { MembersTable, Protected } from "../../components";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Protected>
      <MembersTable call="all-members" />
    </Protected>
  );
};

export default Page;
