import React from "react";
import { trpc } from "../../utils/trpc";
import { PaymentsTable, Protected } from "../../components";
import { Group, Text } from "@mantine/core";

const PaymentsList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
        {loans && <PaymentsTable loans={loans} call="payments" />}
        {status === "success" && loans.length === 0 && (
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
