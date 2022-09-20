import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, LoansTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";

const LoansList = () => {
  try {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(!loans && status === "success" && (
        <EmptyTable call="disbursements" />
      )) ||
        (loans && <LoansTable loans={loans} call="disbursements" />)}
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
