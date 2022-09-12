import React from "react";
import { MembersTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const { data: members, status } = trpc.useQuery(["members.members"])

  return (
    <>
      {members && <MembersTable members={members} call="all-members" />}
      {status === "loading" && (
        <LoadingOverlay
          overlayBlur={2}
          visible={status === "loading"}
        />
      )}
      {status === "success" && members.length === 0 && (
        <Group position="center">
          <Text>No Registered Members</Text>
        </Group>
      )}
    </>
  );
};

const Page: NextPage = () => {
  return <MembersList />;
};

export default Page;
