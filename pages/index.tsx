import React from "react";
import { supabase } from "../lib/supabase";
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
  const { data } = await supabase.from("transactions").select("*");

  return { props: { transactions: data } };
};
