import React from "react";
import { MembersTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";

const MembersList = () => {
  const {data: members, status} = trpc.useQuery(["loans.create-loan"]);

  return (
    <>
      {members && <MembersTable members={members} call="create-loan" />}
      {status === "loading" && (
        <LoadingOverlay
          overlayBlur={2}
          visible={status === "loading"}
        />
      )}
      {status === "success" && members.length === 0 && (
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
