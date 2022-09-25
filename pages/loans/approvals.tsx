import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

const LoansList = () => {
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

  const { data: loans, fetchStatus } = trpc.loans.loans.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} />
        {!loans && <EmptyTable call="approvals" />}
        {loans && (
          <LoansTable loans={loans} call="approvals" role={`${user?.role}`} />
        )}
      </div>
    </Protected>
  );
};

const Page: NextPage = () => {
  return <LoansList />;
};

export default Page;
