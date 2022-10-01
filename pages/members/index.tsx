import React from "react";
import { EmptyTable, MembersTable, Protected } from "../../components";
import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "all-members";

  return (
    <Protected>
      {check.length > 0 && (
        <MembersTable call={call} email={email} status={status} />
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};

export default Page;
