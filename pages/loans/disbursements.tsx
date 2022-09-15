import React from "react";
import { trpc } from "../../utils/trpc";
import { LoansTable, Protected } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const LoansList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {loans && <LoansTable loans={loans} call="disbursements" />}
      {status === "success" && !loans && (
        <Group position="center">
          <Text>No Approved loans</Text>
        </Group>
      )}
    </Protected>
  );
};

const Page = () => {
  return <LoansList />;
};

export default Page;
