import React from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

const MembersList = () => {
  const { data } = useSession();

  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const { data: members, fetchStatus } = trpc.members.members.useQuery();

  return (
    <Protected>
      {!members && <EmptyTable status={fetchStatus} call="all-members" />}
      {members && (
        <MembersTable
          members={members}
          call="all-members"
          role={`${user?.role}`}
        />
      )}
    </Protected>
  );
};

const Page: NextPage = () => {
  return <MembersList />;
};

export default Page;
