import React from "react";
import { trpc } from "../../utils/trpc";
import { PaymentsTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { Loan } from "@prisma/client";

const PaymentsList = () => {
  const loans = trpc.useQuery(["loans"]) || [];
  const data = loans.data?.map((l: Loan) => l);

  return (
    <>
      {data && <PaymentsTable loans={data} call="payments" />}
      {loans.status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={loans.status === "loading"}
        />
      }
      {loans.status === "success" && loans.data.length === 0 && (
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
