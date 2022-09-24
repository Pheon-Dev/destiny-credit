import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";

const LoansList = () => {
  const { status, data } = useSession();
  try {
    const { data: user, status: user_status } = trpc.users.user.useQuery({
      email: `${data?.user?.email}` || "",
    });

    const { data: loans, status: loans_status } = trpc.loans.loans.useQuery();

    return (
      <Protected>
        <LoadingOverlay overlayBlur={2} visible={loans_status === "loading"} />
        {(loans?.length === 0 && <EmptyTable call="disbursements" />) ||
          (loans && (
            <LoansTable
              loans={loans}
              call="disbursements"
              role={`${user?.role}`}
            />
          ))}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="disbursements" />
      </Protected>
    );
  }
};

const Page = () => {
  return <LoansList />;
};

export default Page;
