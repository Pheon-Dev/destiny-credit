import React from "react";
import { trpc } from "../../utils/trpc";
import { PaymentsTable, Protected } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const PaymentsList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {loans && <PaymentsTable loans={loans} call="payments" />}
      {status === "success" && !loans && (
        <Group position="center">
          <Text>No Disbursed loans</Text>
        </Group>
      )}
    </Protected>
  );
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
