import React from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  try {
    const { data: members, status } = trpc.useQuery(["loans.create-loan"]);
    return (
      <Protected>
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
        {(!members && (
          <EmptyTable call="create-loan" />
        )) ||
          (members && <MembersTable members={members} call="create-loan" />)}
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

const Page = () => {
  return <MembersList />;
};

export default Page;
