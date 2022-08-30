import React from "react";
import { supabase } from "../lib/supabase";
import { PrismaClient } from "@prisma/client";
import { Transactions, Fields, Data } from "../types";
import { TransactionsTable } from "../components";
import { GetServerSideProps } from "next";

export default function Home({
  transactions,
}: {
  transactions: Transactions[];
}) {
  return (
    <>
      <TransactionsTable transactions={transactions} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  /* const { data } = await supabase.from("transactions").select("*"); */
  let data = await prisma.transactions.findMany()

  data = JSON.parse(JSON.stringify(data))

  return { props: { transactions: data } };
};
