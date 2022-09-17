import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";

const LoansList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {loans && <LoansTable loans={loans} call="all-loans" />}
      {status === "success" && !loans && <EmptyTable call="all-loans" />}
    </Protected>
  );
};

const Page = () => {
  return <LoansList />;
};

export default Page;
