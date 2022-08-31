import React from "react";
import { PrismaClient } from "@prisma/client";
import { Transactions } from "../types";
import { TransactionsTable } from "../components";
import { GetServerSideProps } from "next";
import { LoadingOverlay } from "@mantine/core";

export default function Home({
  transactions,
}: {
  transactions: Transactions[];
}) {
  return (
    <>
      {(transactions && <TransactionsTable transactions={transactions} />) || (
        <LoadingOverlay visible overlayBlur={2} />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  let data = await prisma.transactions.findMany();

  data = JSON.parse(JSON.stringify(data));

  return { props: { transactions: data } };
};
