import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, PaymentsTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";

const PaymentsList = () => {
  try {
    const { data: loans, status } = trpc.useQuery(["loans.loans"]);

    return (
      <Protected>
        <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {loans?.length === 0 && (
        <EmptyTable call="payments" />) ||
          (loans && <PaymentsTable loans={loans} call="payments" />)}
      </Protected>
    );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="payments" />
      </Protected>
    );
  }
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
