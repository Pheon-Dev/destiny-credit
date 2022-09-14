import React from "react";
import { trpc } from "../../utils/trpc";
import { LoansTable, Protected } from "../../components";
import { Group, Text } from "@mantine/core";

const LoansList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <Protected>
      {loans && <LoansTable loans={loans} call="disbursements" />}
      {status === "success" && loans.length === 0 && (
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
