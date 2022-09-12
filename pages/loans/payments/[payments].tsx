import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../../utils/trpc";

const Page = () => {
  const router = useRouter();
  const id = router.query.payments;

  const loan = trpc.useQuery(["loan", { id: `${id}` }])
  console.log("Loan", loan)
  return (
    <>
      <div>{JSON.stringify(loan.data, null, 4)}</div>
    </>
  );
};
export default Page;

