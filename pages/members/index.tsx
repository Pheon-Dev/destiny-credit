import React from "react";
import { MembersTable, Protected } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const { data: members, status } = trpc.useQuery(["members.members"])

  return (
    <Protected>
    <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {members && <MembersTable members={members} call="all-members" />}
      {status === "success" && members.length === 0 && (
        <Group position="center">
          <Text>No Registered Members</Text>
        </Group>
      )}
    </Protected>
  );
};

const Page: NextPage = () => {
  return <MembersList />;
};

export default Page;
