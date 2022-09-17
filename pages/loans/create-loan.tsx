import React from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const { data: members, status } = trpc.useQuery(["loans.create-loan"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {members && <MembersTable members={members} call="create-loan" />}
      {!members && status === "success" && <EmptyTable call="create-loan" />}
    </Protected>
  );
};

const Page = () => {
  return <MembersList />;
};

export default Page;
