import React from "react";
import { trpc } from "../../utils/trpc";
import { EmptyTable, PaymentsTable, Protected } from "../../components";
import { LoadingOverlay } from "@mantine/core";

const PaymentsList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(loans?.length === 0 && status === "success" && (
        <EmptyTable call="payments" />
      )) ||
        (loans && <PaymentsTable loans={loans} call="payments" />)}
    </Protected>
  );
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
