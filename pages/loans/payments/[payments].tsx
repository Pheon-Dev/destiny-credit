import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { EmptyTable, PaymentTable } from "../../../components";
import { Group, LoadingOverlay } from "@mantine/core";

const PaymentsList = () => {
  const router = useRouter();
  const id = router.query.payments as string;

  const { data: loan, status } = trpc.useQuery(["loans.payment", { id: id }]);

  return (
    <>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(loan?.length === 0 && status === "success" && (
        <EmptyTable call="payment" />
      )) ||
        (loan && <PaymentTable payments={loan} call="payment" />)}
      {status === "success" && loan?.length === 0 && (
        <>
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
