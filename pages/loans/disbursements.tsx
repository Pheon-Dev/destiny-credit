import React from "react";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "disbursements";

  return (
    <Protected>
      {check.length > 0 && (
        <LoansTable call={call} email={email} status={status} />
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};

export default Page;
