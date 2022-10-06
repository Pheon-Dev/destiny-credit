import React from "react";
import { TitleText } from "../../components";
import { Group, Skeleton } from "@mantine/core";

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
            {call === "products" && <TitleText title="No Created Products" />}
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
              <TitleText title="Recent Transactions" />
            )}
            {call === "register" && <TitleText title="Registration List" />}
            {call === "maintain" && <TitleText title="Maintain a New Loan" />}
            {call === "create-loan" && <TitleText title="Registered Members" />}
            {call === "all-members" && <TitleText title="All Members List" />}
            {call === "approvals" && <TitleText title="Approvals List" />}
            {call === "disbursements" && (
              <TitleText title="Disbursements List" />
            )}
            {call === "all-loans" && <TitleText title="All Loans List" />}
            {call === "payments" && <TitleText title="Payments List" />}
            {call === "products" && <TitleText title="Products List" />}
            {call === "payment" && (
              <TitleText title="Loading Payments Made To This Loan" />
            )}
          </Group>
            {call === "register" && (
          <Group position="center" m="lg" style={{ position: "relative" }}>
            <Skeleton height={16} radius="xl" />
            <Row />
            <Row />
            <Row />
            <Skeleton height={16} radius="xl" />
          </Group>
            )}
            {call === "create-loan" && (
          <Group position="center" m="lg" style={{ position: "relative" }}>
            <Skeleton height={16} radius="xl" />
            <Row />
            <Row />
            <Row />
            <Skeleton height={16} radius="xl" />
          </Group>
            )}
            {call !== "create-loan" && call !== "register" && (
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
            )}
        </>
      )}
    </>
  );
};
