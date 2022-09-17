import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";

const LoansList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(loans?.length === 0 && status === "success" && (
        <EmptyTable call="all-loans" />
      )) ||
        (loans && <LoansTable loans={loans} call="all-loans" />)}
    </Protected>
  );
};

const Page = () => {
  return <LoansList />;
};

export default Page;
