import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { PaymentTable } from "../../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const PaymentsList = () => {
  const router = useRouter();
  const id = router.query.payments as string;

  const { data: loan, status } = trpc.useQuery(["loans.payment", { id: id }]);

  return (
    <>
      {loan && <PaymentTable payments={loan} call="payments" />}
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {status === "success" && loan.length === 0 && (
        <>
          <Group position="center">
            <Text>Active Loan</Text>
          </Group>
          <Group position="center">
            <pre>{JSON.stringify(loan, null, 4)}</pre>
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
