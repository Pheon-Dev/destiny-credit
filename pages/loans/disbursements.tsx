import React from "react";
import { trpc } from "../../utils/trpc";
import { LoansTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { Loan } from "@prisma/client";

const LoansList = () => {
  const loans = trpc.useQuery(["loans"]) || [];
  const data = loans.data?.map((l: Loan) => l);

  return (
    <>
      {data && <LoansTable loans={data} call="disbursements" />}
      {loans.status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={loans.status === "loading"}
        />
      }
      {loans.status === "success" && loans.data.length === 0 && (
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
