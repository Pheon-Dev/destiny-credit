import React from "react";
import { MembersTable, Protected } from "../../components";
import { Group, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const {data: members, status} = trpc.useQuery(["loans.create-loan"]);

  return (
    <Protected>
      {members && <MembersTable members={members} call="create-loan" />}
      {status === "success" && members.length === 0 && (
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
