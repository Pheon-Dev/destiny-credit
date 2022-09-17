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
      {loan && <PaymentTable payments={loan} call="payments" />}
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {!loan && status === "success" && <EmptyTable call="payments" />}
      {status === "success" && !loan && (
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
