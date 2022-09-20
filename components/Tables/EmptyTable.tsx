import React from "react";
import { TitleText } from "../../components";
import { Group } from "@mantine/core";

export const EmptyTable = ({ call }: { call: string }) => {
  return (
    <>
      <Group position="center" m="xl">
        {call === "transactions" && (
          <TitleText title="No New Transactions Today" />
        )}
        {call === "register" && (
          <TitleText title="No New Members to Register Today" />
        )}
        {call === "all-members" && <TitleText title="No Registered Members" />}
        {call === "create-loan" && (
          <TitleText title="Maintenance List is Currently Empty" />
        )}
        {call === "approvals" && (
          <TitleText title="No Newly Maintained Loans to Approve Available" />
        )}
        {call === "disbursements" && (
          <TitleText title="No Newly Approved Loans to Disburse Available" />
        )}
        {call === "all-loans" && <TitleText title="No Newly Disbursed Loans" />}
        {call === "payments" && <TitleText title="No New Active Loans" />}
        {call === "payment" && (
          <TitleText title="No Payments Made To This Loan Yet" />
        )}
      </Group>
      <Group position="center" m="lg"></Group>
    </>
  );
};
