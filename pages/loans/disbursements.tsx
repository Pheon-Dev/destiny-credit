import React from "react";
import { trpc } from "../../utils/trpc";
import { LoansTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const LoansList = () => {
  const { data: loans, status } = trpc.useQuery(["loans.loans"]);

  return (
    <>
      {loans && <LoansTable loans={loans} call="disbursements" />}
      {status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={status === "loading"}
        />
      }
      {status === "success" && loans.length === 0 && (
        <Group position="center">
          <Text>No Approved loans</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
  return <LoansList />;
};

export default Page;
