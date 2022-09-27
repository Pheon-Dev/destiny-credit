import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

const LoansList = () => {
  const { data } = useSession();

  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const { data: loans, fetchStatus } = trpc.loans.loans.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        {!loans && <EmptyTable call="all-loans" status={fetchStatus} />}
        {loans && (
          <LoansTable loans={loans} call="all-loans" role={`${user?.role}`} />
        )}
      </div>
    </Protected>
  );
};

const Page: NextPage = () => {
  return <LoansList />;
};

export default Page;
