import React from "react";
import { TitleText } from "../../components";
import { Grid, Group, LoadingOverlay, Skeleton } from "@mantine/core";

export const EmptyTable = ({
  call,
  status,
}: {
  status: string;
  call: string;
}) => {
  const Row = () => {
    return <Skeleton height={8} radius="xl" />;
  };
  return (
    <>
      {status === "idle" && (
        <>
          <Group position="center" m="xl">
            {call === "transactions" && (
              <TitleText title="No New Transactions Today" />
            )}
            {call === "register" && (
              <TitleText title="No New Members to Register Today" />
            )}
            {call === "all-members" && (
              <TitleText title="No Registered Members" />
            )}
            {call === "create-loan" && (
              <TitleText title="Maintenance List is Currently Empty" />
            )}
            {call === "approvals" && (
              <TitleText title="No Newly Maintained Loans to Approve Available" />
            )}
            {call === "disbursements" && (
              <TitleText title="No Newly Approved Loans to Disburse Available" />
            )}
            {call === "all-loans" && (
              <TitleText title="No Newly Disbursed Loans" />
            )}
            {call === "payments" && <TitleText title="No New Active Loans" />}
            {call === "payment" && (
              <TitleText title="No Payments Made To This Loan Yet" />
            )}
            {call === "products" && (
            <TitleText title="No Created Products" />
            )}
          </Group>
          <Group position="center" m="lg">
            {/* <LoadingOverlay overlayBlur={2} visible={true} /> */}
          </Group>
        </>
      )}
      {status === "fetching" && (
        <>
          <Group position="center" m="xl">
            {call === "transactions" && (
              <TitleText title="Loading Recent Transactions Made" />
            )}
            {call === "register" && (
              <TitleText title="Loading New Members to Register" />
            )}
            {call === "all-members" && (
              <TitleText title="Loading Registered Members" />
            )}
            {call === "create-loan" && (
              <TitleText title="Loading Maintenance List" />
            )}
            {call === "approvals" && (
              <TitleText title="Loading Maintained Loans Pending Approval" />
            )}
            {call === "disbursements" && (
              <TitleText title="Loading Approved Pending Disbursement" />
            )}
            {call === "all-loans" && (
              <TitleText title="Loading Disbursed Loans" />
            )}
            {call === "payments" && <TitleText title="Loading Active Loans" />}
            {call === "products" && <TitleText title="Loading Available Products" />}
            {call === "payment" && (
              <TitleText title="Loading Payments Made To This Loan" />
            )}
          </Group>
          <Group position="center" m="lg" style={{ position: "relative" }}>
            <Skeleton height={16} radius="xl" />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Skeleton height={16} radius="xl" />
          </Group>
        </>
      )}
    </>
  );
};
