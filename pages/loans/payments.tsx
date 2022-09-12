import React from "react";
import { trpc } from "../../utils/trpc";
import { PaymentsTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const PaymentsList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <>
      {loans && <PaymentsTable loans={loans} call="payments" />}
      {status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={status === "loading"}
        />
      }
      {status === "success" && loans.length === 0 && (
        <Group position="center">
          <Text>No Disbursed loans</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
