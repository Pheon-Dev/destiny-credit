import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { Text } from "@mantine/core";
import { Transactions, Fields, Data } from "../types";
import { GetServerSideProps } from "next";

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

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await supabase.from("transactions").select("*");

  return { props: { transactions: data } };
};
