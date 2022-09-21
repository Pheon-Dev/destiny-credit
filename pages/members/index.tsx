import React from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

const MembersList = () => {
  const { status, data } = useSession();
  try {
    const { data: user, status: user_status } = trpc.useQuery([
      "users.user",
      {
        email: `${data?.user?.email}`,
      },
    ]);

    const { data: members, status: members_status } = trpc.useQuery([
      "members.members",
    ]);

    return (
      <Protected>
        <LoadingOverlay
          overlayBlur={2}
          visible={members_status === "loading"}
        />
        {(members?.length === 0 && <EmptyTable call="all-members" />) ||
          (members && (
            <MembersTable
              members={members}
              role={`${user?.role}`}
              call="all-members"
            />
          ))}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="all-members" />
      </Protected>
    );
  }
};

const Page: NextPage = () => {
  return <MembersList />;
};

export default Page;
