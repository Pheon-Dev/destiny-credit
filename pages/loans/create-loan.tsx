import React from "react";
import { MembersTable, Protected } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const { data: members, status } = trpc.useQuery(["loans.create-loan"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {members && <MembersTable members={members} call="create-loan" />}
      {status === "success" && !members && (
        <Group position="center">
          <Text>No Maintained Loans</Text>
        </Group>
      )}
    </Protected>
  );
};

const Page = () => {
  return <MembersList />;
};

export default Page;
