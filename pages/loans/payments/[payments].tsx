import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { PaymentTable } from "../../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { Payment } from "@prisma/client";

const PaymentsList = () => {
  const router = useRouter();
  const id = router.query.payments;

  const loan = trpc.useQuery(["loan", { id: `${id}` }])
  const data = loan.data?.map((p: Payment) => p);

  return (
    <>
      {data && <PaymentTable payments={data} call="payments" />}
      {loan.status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={loan.status === "loading"}
        />
      }
      {loan.status === "success" && loan.data.length === 0 && (
      <>
        <Group position="center">
          <Text>Active Loan</Text>
        </Group>
        <Group position="center">
          <pre>{JSON.stringify(loan.data, null, 4)}</pre>
        </Group>
        </>
      )}
    </>
  );
};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
