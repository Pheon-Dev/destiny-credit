import React, { useEffect, useState } from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

const MembersList = () => {
  const [email, setEmail] = useState("");

  const { data } = useSession();

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setEmail(`${data?.user?.email}`);
    }
  }, [data]);

  const { data: user } = trpc.users.user.useQuery({
    email: email,
  });

  const { data: members, fetchStatus } = trpc.members.members.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} />
        {(members?.length === 0 && <EmptyTable call="all-members" />) ||
          (members && (
            <MembersTable
              members={members}
              role={`${user?.role}`}
              call="all-members"
            />
          ))}
      </div>
    </Protected>
  );
};

const Page: NextPage = () => {
  return <MembersList />;
};

export default Page;
