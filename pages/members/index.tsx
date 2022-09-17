import React from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const { data: members, status } = trpc.useQuery(["members.members"]);
  /* const m = trpc.useQuery(["members.members"]); */
  /* console.log(m) */

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(members?.length === 0 && status === "success" && (
        <EmptyTable call="all-members" />
      )) ||
        (members && <MembersTable members={members} call="all-members" />)}
    </Protected>
  );
};

const Page: NextPage = () => {
  return <MembersList />;
};

export default Page;
