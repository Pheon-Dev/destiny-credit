import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { EmptyTable, MembersTable, Protected } from "../../components";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "all-members";

  return (
    <Protected>
      {check && (
        <MembersTable call={call} email={email} status={status} />
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};

export default Page;
