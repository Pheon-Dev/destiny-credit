import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { Text } from "@mantine/core";
import { Transactions } from "../types";
import { GetServerSideProps } from "next";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;
const AXIOM_API_TOKEN = process.env.NEXT_PUBLIC_AXIOM_API_TOKEN;

export default function Home({
  transactions,
}: {
  transactions: Transactions[];
}) {
  return (
    <>
      <Text>
        {transactions?.map((transaction) => (
          <TransactionDiv key={transaction.transID} transaction={transaction} />
        ))}
      </Text>
    </>
  );
}

function TransactionDiv({ transaction }: { transaction: Transactions }) {
  return <pre>{JSON.stringify(transaction, undefined, 2)}</pre>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res } = context;
  res.setHeader("Cache-Control", `s-maxage=60, stale-while-revalidate`);

  const { data } = await supabase.from("transactions").select("*");

  return { props: { transactions: data } };
};
