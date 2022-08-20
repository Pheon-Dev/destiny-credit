import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { Text } from "@mantine/core";
import { Data, Transactions } from "../types";

const LOGTAIL_API_TOKEN = process.env.NEXT_PUBLIC_LOGTAIL_API_TOKEN;
const AXIOM_API_TOKEN = process.env.NEXT_PUBLIC_AXIOM_API_TOKEN;

export default function Home({
  data,
  transactions,
}: {
  data: Data[];
  transactions: Transactions[];
}) {
  const [mpesaTransactions, setMpesaTransactions] = useState([]);

  async function fetchTransactions() {
    const res = await fetch("/api/list");

    const result = await res.json();

    setMpesaTransactions(result["transactions"]);
    return result;
  }

  useEffect(() => {
    fetchTransactions();
  }, [data]);

  return (
    <>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
      <Text>
        {transactions.map((transaction) => (
          <TransactionDiv key={transaction.transID} transaction={transaction} />
        ))}
      </Text>
    </>
  );
}

function TransactionDiv({ transaction }: { transaction: Transactions }) {
  return <pre>{JSON.stringify(transaction, undefined, 2)}</pre>;
}

export const getStaticProps = async () => {
  // const { res } = context;
  // res.setHeader("Cache-Control", `s-maxage=60, stale-while-revalidate`);

  // export const getSaticProps = async () => {
  // const query = await fetch("https://logtail.com/api/v1/query", {
  const query = await fetch("https://cloud.axiom.co/api/v1/datasets/vercel/query", {
    method: "GET",
    // headers: { Authorization: `Bearer ${LOGTAIL_API_TOKEN}` },
    headers: { Authorization: `Bearer ${AXIOM_API_TOKEN}` },
  });

  const logs = await query.json();

  const { data } = await supabase.from("transactions").select("*");

  return { props: { data: logs, transactions: data }, revalidate: 1 };
};
