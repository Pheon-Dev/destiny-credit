import React from "react";
import { MembersTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Member } from "@prisma/client";

const MembersList = () => {
  const members = trpc.useQuery(["members"]) || [];
  const data = members.data?.map((m: Member) => m);

  return (
    <>
      {data && <MembersTable members={data} call="all-members" />}
      {members.status === "loading" && (
        <LoadingOverlay
          overlayBlur={2}
          visible={members.status === "loading"}
        />
      )}
      {members.status === "success" && members.data.length === 0 && (
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
