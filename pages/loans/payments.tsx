import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, PaymentsTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NextPage } from "next";

const PaymentsList = () => {
  const { data } = useSession();

  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const { data: loans, fetchStatus } = trpc.loans.loans.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} />
        {!loans && <EmptyTable call="payments" />}
        {loans && (
          <PaymentsTable role={`${user?.role}`} loans={loans} call="payments" />
        )}
      </div>
    </Protected>
  );
};

const Page: NextPage = () => {
  return <PaymentsList />;
};

export default Page;
