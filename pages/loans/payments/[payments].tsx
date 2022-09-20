import React from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { EmptyTable, PaymentTable, Protected } from "../../../components";
import { Group, LoadingOverlay } from "@mantine/core";

const PaymentsList = () => {
  try {
  const router = useRouter();
  const id = router.query.payments as string;

  const { data: loan, status } = trpc.useQuery(["loans.payment", { id: id }]);

  return (
    <>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {(!loan && (
        <EmptyTable call="payment" />
      )) ||
        (loan && <PaymentTable payments={loan} call="payment" />)}
    </>
  );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <EmptyTable call="payment" />
      </Protected>
    );
  }

};

const Page = () => {
  return <PaymentsList />;
};

export default Page;
