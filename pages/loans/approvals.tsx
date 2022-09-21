import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";

const LoansList = () => {
  try {
    const { status, data } = useSession();
    const { data: user, status: user_status } = trpc.useQuery([
      "users.user",
      {
        email: `${data?.user?.email}`,
      },
    ]);

    const { data: loans, status: loans_status } = trpc.useQuery([
      "loans.loans",
    ]);

    return (
      <Protected>
        <LoadingOverlay overlayBlur={2} visible={loans_status === "loading"} />
        {(loans?.length === 0 && <EmptyTable call="approvals" />) ||
          (loans && (
            <LoansTable loans={loans} call="approvals" role={`${user?.role}`} />
          ))}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="approvals" />
      </Protected>
    );
  }
};

const Page = () => {
  return <LoansList />;
};

export default Page;
