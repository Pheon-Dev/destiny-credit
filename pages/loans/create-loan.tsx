import React from "react";
import { MembersTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { Member } from "@prisma/client";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const members = trpc.useQuery(["members"]) || [];
  const data = members.data?.map((m: Member) => m);

  return (
    <>
      {data && <MembersTable members={data} call="create-loan" />}
      {members.status === "loading" && (
        <LoadingOverlay
          overlayBlur={2}
          visible={members.status === "loading"}
        />
      )}
      {members.status === "success" && members.data.length === 0 && (
        <Group position="center">
          <Text>No Maintained Loans</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
  return <MembersList />;
};

export default Page;
