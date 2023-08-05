import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { EmptyTable, PARTable, Protected } from "../../components";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "par-report";

  return (
    <Protected>
      {check && (
        <PARTable call={call} email={email} status={status} />
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};

export default Page;
